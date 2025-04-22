<template>
  <div>
    <div class="containerCsv" style="flex-direction: column;">
      <!-- Área de arrastar e soltar -->
      <div class="drop-area" @dragover.prevent @dragenter.prevent @drop.prevent="handleDrop">
        <p>Arraste seu arquivo CSV aqui ou clique abaixo para selecionar</p>
        <input type="file" @change="handleFileUpload" accept=".csv,.CSV" />
      </div>

      <!-- Exibição de erros -->
      <div v-if="errors.length" class="errors">
        <ul>
          <li v-for="(err, i) in errors" :key="i">
            Linha {{ err.row }} • campo “{{ err.field }}”: {{ err.message }}
          </li>
        </ul>
      </div>

      <!-- Tabela com dados paginados -->
      <div class="tabela" v-if="!errors.length && paginatedData.length">
        <table>
          <thead>
            <tr>
              <th v-for="(header, index) in headers" :key="index">{{ header }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) in paginatedData" :key="rowIndex">
              <td v-for="(key, index) in keys" :key="index">{{ row[key] }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginação -->
      <div class="pagination" v-if="!errors.length && totalPages > 1">
        <button @click="currentPage--" :disabled="currentPage === 1">Anterior</button>
        <span>Página {{ currentPage }} de {{ totalPages }}</span>
        <button @click="currentPage++" :disabled="currentPage === totalPages">Próxima</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { validatePeriodoCsv } from '@/utils/validators/periodoCsvValidator'

const data = ref([])
const headers = ref([])
const keys = ref([])
const errors = ref([])
const currentPage = ref(1)
const itemsPerPage = 10

// Normaliza o nome das colunas do csv
function normalizeHeader(texto) {
  if (typeof texto !== 'string') {
    return '';
  }

  const textoSemAcento = texto.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Remove acentos
  const textoSemEspacos = textoSemAcento.replace(/[^a-zA-Z0-9]+/g, ' '); // Substitui múltiplos espaços e caracteres especiais por um único espaço
  const palavras = textoSemEspacos.trim().split(' '); // Remove espaços extras e divide em palavras

  if (palavras.length === 0) {
    return '';
  }

  let camelCase = palavras[0].toLowerCase(); // Primeira palavra em minúsculo

  for (let i = 1; i < palavras.length; i++) {
    const palavra = palavras[i];
    camelCase += palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase(); // Capitaliza a primeira letra e o resto em minúsculo
  }

  return camelCase.replace(/ç/g, 'c'); // Substitui 'ç' por 'c'
}

function parseCSV(text) {
  console.log("parseCSV")
  const lines = text.trim().split('\n');

  // Nomes das colunas originais
  const raw = lines[0].split(/[,;]/).map(h => h.trim());

  // Nomes normalizados das colunas (removendo acento e colocando em camelCase)
  const normalized = raw.map(normalizeHeader);

  headers.value = raw
  keys.value = normalized

  data.value = lines.slice(1).map(line => {
    const values = line.split(/[,;]/).map(v => v.trim())
    const row = {}

    // iterando sobre cada coluna (com o nome normalizado)
    normalized.forEach((key, index) => {
      row[key] = values[index] ?? ''
      console.log("Valor inserido em " + key + ": " + values[index])
      // console.log("coluna " + index + ": " + key + "\n")
    })
    console.log("Retornando essa linha: " + row)
    return row
  })
  currentPage.value = 1
}

function handleFile(file) {
  console.log("handleFile")
  const reader = new FileReader()
  reader.onload = (e) => {
    // parseia o CSV
    parseCSV(e.target.result)

    // chamando o validador passando o array de objetos
    const { valid, errors: errs } = validatePeriodoCsv(data.value)
    console.log(errs)
    if (!valid) {
      // adicionando a lista de erros
      errors.value = errs
    } else {
      // limpando a lista de erros
      errors.value = []
    }
  }
  reader.readAsText(file)
}

function handleFileUpload(event) {
  console.log("handleFileUpload")
  const file = event.target.files[0]
  console.log("tentando entrar no if")
  if (file && (file.name.endsWith(".csv") || file.name.endsWith(".CSV"))) {
    console.log("chama o handleFile")
    handleFile(file)
  }
}

function handleDrop(event) {
  const file = event.dataTransfer.files[0]
  if (file && (file.name.endsWith(".csv") || file.name.endsWith(".CSV"))) {
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

<style scoped>
.errors {
  margin: 1em 0;
  padding: 1em;
  border: 1px solid #e53e3e;
  background: #fff5f5;
  color: #9b2c2c;
}
</style>
