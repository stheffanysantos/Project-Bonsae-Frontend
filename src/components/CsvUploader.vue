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
              <th v-for="(header, index) in headers" :key="index">
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, rowIndex) in paginatedData"
              :key="rowIndex"
            >
              <td v-for="(key, index) in keys" :key="index">
                {{ row[key] }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginação -->
      <div
        class="pagination"
        v-if="!errors.length && totalPages > 1"
      >
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
        >
          Anterior
        </button>
        <span>Página {{ currentPage }} de {{ totalPages }}</span>
        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
        >
          Próxima
        </button>
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

const data        = ref([])
const headers     = ref([])
const keys        = ref([])
const errors      = ref([])
const currentPage = ref(1)
const itemsPerPage= 10

function normalizeHeader(texto) {
  if (typeof texto !== 'string') return ''
  const textoSemAcento = texto.normalize('NFD').replace(/[̀-ͯ]/g, '')
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

function parseCSV(text) {
  const lines      = text.trim().split('\n')
  const raw        = lines[0].split(/[,;]/).map(h => h.trim())
  const normalized = raw.map(normalizeHeader)

  headers.value = raw
  keys.value    = normalized

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

function handleFile(file) {
  const nome = file.name.toLowerCase()
  const ext  = nome.split('.').pop()
  const reader = new FileReader()

  reader.onload = (e) => {
    let csvText = e.target.result

    // converter Excel para CSV, se necessário
    if (['xlsx','xls'].includes(ext)) {
      const dataArray = new Uint8Array(csvText)
      const workbook  = XLSX.read(dataArray, { type: 'array' })
      csvText = XLSX.utils.sheet_to_csv(workbook.Sheets[workbook.SheetNames[0]])
    }

    // parse e popula data.value, headers.value e keys.value
    parseCSV(csvText)

    // escolhe o validator com base no nome do arquivo
    let validator
    if (nome.includes('usuario') || nome.includes('usuarios')) {
      validator = validateUsuarioCsv
    } else if (nome.includes('disciplina') || nome.includes('disciplinas')) {
      validator = validateDisciplinaCsv
    } else if (nome.includes('turma') || nome.includes('turmas')) {
      validator = validateTurmaCsv
    } else {
      // se for outro tipo, considera período
      validator = validatePeriodoCsv
    }

    const { valid, errors: errs } = validator(data.value)
    errors.value = valid ? [] : errs
  }

  // lê o arquivo de acordo com a extensão
  if (ext === 'csv') {
    reader.readAsText(file)
  } else if (['xlsx','xls'].includes(ext)) {
    reader.readAsArrayBuffer(file)
  } else {
    errors.value = [{ row: null, field: null, message: 'Formato de arquivo não suportado'}]
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

const totalPages = computed(() =>
  Math.ceil(data.value.length / itemsPerPage)
)

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return data.value.slice(start, start + itemsPerPage)
})
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
.pagination {
  margin-top: 1em;
  display: flex;
  justify-content: center;
  gap: 1em;
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>