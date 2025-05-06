<template>
  <div>
    <div class="containerCsv" style="flex-direction: column;">
      <!-- Área de arrastar e soltar -->
      <div
        class="drop-area"
        @dragover.prevent
        @dragenter.prevent
        @drop.prevent="handleDrop"
      >
        <p>Arraste seu arquivo CSV ou Excel aqui ou clique abaixo para selecionar</p>
        <input
          type="file"
          @change="handleFileUpload"
          accept=".csv,.CSV,.xlsx,.XLSX,.xls,.XLS"
        />
      </div>

      <!-- Exibição de erros gerais com scroll -->
      <div v-if="errors.length" class="errors">
        <ul>
          <li v-for="(err, i) in errors" :key="i">
            Linha {{ err.row }} • campo “{{ err.field }}”: {{ err.message }}
          </li>
        </ul>
      </div>

      <!-- Tabela com dados paginados -->
      <div class="tabela" v-if="paginatedData.length">
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
              <td
                v-for="(key, index) in keys"
                :key="index"
                :class="{ 'invalid-cell': getCellError(rowIndex, key) }"
                :title="getCellError(rowIndex, key)"
              >
                <template v-if="getCellError(rowIndex, key)">
                  <input
                    type="text"
                    v-model="row[key]"
                    @blur="onCellBlur"
                    @keyup.enter="onCellBlur"
                    class="edit-cell"
                  />
                </template>
                <template v-else>
                  {{ row[key] }}
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginação -->
      <div class="pagination" v-if="totalPages > 1">
        <button @click="prevPage" :disabled="currentPage === 1">Anterior</button>
        <span>Página {{ currentPage }} de {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">Próxima</button>

        <!-- Botões numéricos -->
        <div class="page-numbers">
          <button
            v-for="page in totalPages"
            :key="page"
            @click="goToPage(page)"
            :class="{ active: currentPage === page }"
          >
            {{ page }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import * as XLSX from 'xlsx'
import { validatePeriodoCsv }    from '@/utils/validators/periodoCsvValidator'
import { validateDisciplinaCsv } from '@/utils/validators/disciplinasCsvValidator'
import { validateTurmaCsv }      from '@/utils/validators/turmasCsvValidator'
import { validateUsuarioCsv }    from '@/utils/validators/usuariosCsvValidator'

// Dados e estado reativos
const data = ref([])
const headers = ref([])
const keys = ref([])
const errors = ref([])
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Validador atual (setado após upload)
let currentValidator = validatePeriodoCsv

// Computed para paginação
const totalPages = computed(() => Math.ceil(data.value.length / itemsPerPage.value))
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return data.value.slice(start, start + itemsPerPage.value)
})

// Funções de navegação de página
function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}
function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}
function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// Normaliza cabeçalhos para chaves
function normalizeHeader(texto) {
  if (typeof texto !== 'string') return ''
  const textoSemAcento = texto.normalize('NFD').replace(/[̀-\u036f]/g, '')
  const textoSemEspacos = textoSemAcento.replace(/[^a-zA-Z0-9]+/g, ' ')
  const palavras = textoSemEspacos.trim().split(' ')
  if (!palavras.length) return ''
  let camelCase = palavras[0].toLowerCase()
  for (let i = 1; i < palavras.length; i++) {
    const p = palavras[i]
    camelCase += p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()
  }
  return camelCase.replace(/ç/g, 'c')
}

// Parsing de CSV para array de objetos
function parseCSV(text) {
  const lines = text.trim().split('\n')
  const raw = lines[0].split(/[,;]/).map(h => h.trim())
  const normalized = raw.map(normalizeHeader)

  headers.value = raw
  keys.value = normalized
  data.value = lines.slice(1).map(line => {
    const values = line.split(/[,;]/).map(v => v.trim())
    const row = {}
    normalized.forEach((key, idx) => {
      row[key] = values[idx] ?? ''
    })
    return row
  })
  currentPage.value = 1
}

// Obtém mensagem de erro para célula
function getCellError(rowIndex, key) {
  const absoluteIndex = (currentPage.value - 1) * itemsPerPage.value + rowIndex
  const err = errors.value.find(e => e.row - 1 === absoluteIndex && e.field === key)
  return err ? err.message : ''
}

// Ao editar e sair do input, revalida todo o dataset
function onCellBlur() {
  const { valid, errors: errs } = currentValidator(data.value)
  errors.value = valid ? [] : errs
}

// Lógica de leitura de arquivo (CSV/XLSX)
function handleFile(file) {
  const nome = file.name.toLowerCase()
  const ext = nome.split('.').pop()
  const reader = new FileReader()

  reader.onload = (e) => {
    let csvText = e.target.result

    if (['xlsx', 'xls'].includes(ext)) {
      const dataArray = new Uint8Array(csvText)
      const workbook = XLSX.read(dataArray, { type: 'array' })
      csvText = XLSX.utils.sheet_to_csv(workbook.Sheets[workbook.SheetNames[0]])
    }

    // Converte para dados
    parseCSV(csvText)

    // Seleciona validador conforme nome do arquivo
    if (nome.includes('usuario')) {
      currentValidator = validateUsuarioCsv
    } else if (nome.includes('disciplina')) {
      currentValidator = validateDisciplinaCsv
    } else if (nome.includes('turma')) {
      currentValidator = validateTurmaCsv
    } else {
      currentValidator = validatePeriodoCsv
    }

    // Executa validação inicial
    const { valid, errors: errs } = currentValidator(data.value)
    errors.value = valid ? [] : errs
  }

  if (ext === 'csv') {
    reader.readAsText(file)
  } else if (['xlsx', 'xls'].includes(ext)) {
    reader.readAsArrayBuffer(file)
  } else {
    errors.value = [{ row: null, field: null, message: 'Formato de arquivo não suportado' }]
  }
}

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (file && /\.(csv|xlsx|xls)$/i.test(file.name)) {
    handleFile(file)
  }
}

function handleDrop(event) {
  const file = event.dataTransfer.files[0]
  if (file && /\.(csv|xlsx|xls)$/i.test(file.name)) {
    handleFile(file)
  }
}
</script>

<style scoped>
.drop-area {
  padding: 1.5em;
  border: 2px dashed #ccc;
  text-align: center;
  cursor: pointer;
}
.errors {
  margin: 1em 0;
  padding: 1em;
  border: 1px solid #e53e3e;
  background: #fff5f5;
  color: #9b2c2c;
  max-height: 200px;
  overflow-y: auto;
}
.tabela {
  margin-top: 1em;
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  padding: 0.5em;
  border: 1px solid #ddd;
}
.invalid-cell {
  background-color: #ffe6e6;
  cursor: help;
}
.edit-cell {
  width: 100%;
  box-sizing: border-box;
  padding: 0.25em;
  border: 1px solid #ccc;
  border-radius: 2px;
}
.invalid-cell .edit-cell {
  background-color: #ffe6e6;
}
.pagination {
  margin-top: 1em;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5em;
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.page-numbers {
  display: flex;
  gap: 0.5em;
}
.page-numbers button.active {
  font-weight: bold;
  text-decoration: underline;
}
</style>