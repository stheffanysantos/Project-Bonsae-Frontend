<template>
  <div class="container">
    <h1>Visualizador de Planilha</h1>

    <input type="file" @change="handleFileUpload" accept=".xlsx" />

    <div v-if="paginatedData.length">
      <table>
        <thead>
          <tr>
            <th v-for="(header, index) in headers" :key="index">
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in paginatedData" :key="rowIndex">
            <td v-for="(header, index) in headers" :key="index">
              {{ row[header] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination" v-if="totalPages > 1">
      <button @click="currentPage--" :disabled="currentPage === 1">
        Anterior
      </button>
      <span>Página {{ currentPage }} de {{ totalPages }}</span>
      <button @click="currentPage++" :disabled="currentPage === totalPages">
        Próxima
      </button>
    </div>
  </div>
</template>

<script setup>
import * as XLSX from "xlsx"
import { ref, computed } from "vue"

const data = ref([])
const headers = ref([])
const currentPage = ref(1)
const itemsPerPage = 10

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const dataBinary = new Uint8Array(e.target.result)
    const workbook = XLSX.read(dataBinary, { type: "array" })
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]
    const jsonData = XLSX.utils.sheet_to_json(sheet)

    data.value = jsonData
    headers.value = Object.keys(jsonData[0] || {})
    currentPage.value = 1
  }
  reader.readAsArrayBuffer(file)
}

const totalPages = computed(() =>
  Math.ceil(data.value.length / itemsPerPage)
)

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return data.value.slice(start, start + itemsPerPage)
})
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

input[type="file"] {
  display: block;
  margin: 0 auto 20px auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

thead th {
  background-color: #f2f2f2;
  padding: 10px;
  border: 1px solid #ccc;
}

tbody td {
  padding: 10px;
  border: 1px solid #ccc;
  text-align: left;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

button {
  padding: 6px 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}
</style>
