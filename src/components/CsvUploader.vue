<template>
  <div>
    <div class="containerCsv" style="flex-direction: column;">
      <!-- Área de arrastar e soltar -->
      <div class="drop-area" @dragover.prevent @dragenter.prevent @drop.prevent="handleDrop">
        <p>Arraste seu arquivo CSV aqui ou clique abaixo para selecionar</p>
        <input type="file" @change="handleFileUpload" accept=".csv" />
      </div>

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
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const data = ref([])
const headers = ref([])
const currentPage = ref(1)
const itemsPerPage = 10

function parseCSV(text) {
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

function handleFile(file) {
  const reader = new FileReader()
  reader.onload = (e) => parseCSV(e.target.result)
  reader.readAsText(file)
}

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (file && file.name.endsWith(".csv")) {
    handleFile(file)
  }
}

function handleDrop(event) {
  const file = event.dataTransfer.files[0]
  if (file && file.name.endsWith(".csv")) {
    handleFile(file)
  }
}

const totalPages = computed(() =>
  Math.ceil(data.value.length / itemsPerPage)
)

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return data.value.slice(start, start + itemsPerPage)
})
</script>
