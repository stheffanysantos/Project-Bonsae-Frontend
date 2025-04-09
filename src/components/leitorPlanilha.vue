<template>
  <div>
    <div class="container">
      <h1>Visualizador de CSV</h1>

      <input type="file" @change="handleFileUpload" accept=".csv" />

      <div class="tabela" v-if="paginatedData.length">
        <table>
          <thead>
            <tr>
              <th v-for="(header, index) in headers" :key="index">{{ header }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) in paginatedData" :key="rowIndex">
              <td v-for="(header, index) in headers" :key="index">{{ row[header] }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination" v-if="totalPages > 1">
        <button @click="currentPage--" :disabled="currentPage === 1">Anterior</button>
        <span>Página {{ currentPage }} de {{ totalPages }}</span>
        <button @click="currentPage++" :disabled="currentPage === totalPages">Próxima</button>
      </div>

      <div>
        <button>Proxima Etapa</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const data = ref([])
const headers = ref([])
const currentPage = ref(1)
const itemsPerPage = 10

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const text = e.target.result
    const lines = text.trim().split('\n')

    headers.value = lines[0].split(',').map(h => h.trim())
    data.value = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim())
      const row = {}
      headers.value.forEach((header, index) => {
        row[header] = values[index] ?? ''
      })
      return row
    })
    currentPage.value = 1
  }
  reader.readAsText(file)
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
  background-color: #eeeeee;
  margin: 10vh 10vw;
  padding: 20px;
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

input[type="file"] {
  display: block;
  margin: 0 auto 20px auto;
}

.tabela {
  padding: 20px;
  margin: 10vh 10vw;
  width: min-content;
}

table {
  border-collapse: collapse;
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
