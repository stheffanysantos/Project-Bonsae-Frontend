<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Visualizador de Planilha</h1>

    <input type="file" @change="handleFileUpload" accept=".xlsx" class="mb-4" />

    <div v-if="paginatedData.length" class="overflow-auto max-h-[500px]">
      <table class="table-auto w-full border border-gray-300">
        <thead class="bg-gray-200">
          <tr>
            <th v-for="(header, index) in headers" :key="index" class="border px-4 py-2">
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in paginatedData" :key="rowIndex">
            <td v-for="(header, index) in headers" :key="index" class="border px-4 py-2">
              {{ row[header] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="mt-4 flex gap-2">
      <button @click="currentPage--" :disabled="currentPage === 1"
        class="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50">
        Anterior
      </button>

      <span>Página {{ currentPage }} de {{ totalPages }}</span>

      <button @click="currentPage++" :disabled="currentPage === totalPages"
        class="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50">
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
table {
  border-collapse: collapse;
}
</style>
