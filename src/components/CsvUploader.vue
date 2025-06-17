<template>
  <div>
    <div class="containerCsv" style="flex-direction: column;">
      <!-- Drop area -->
      <div class="drop-area" @dragover.prevent @dragenter.prevent @drop.prevent="handleDrop">
        <p>Arraste seu arquivo CSV ou Excel aqui ou clique abaixo para selecionar</p>
        <input type="file" @change="handleFileUpload" accept=".csv,.CSV,.xlsx,.XLSX,.xls,.XLS" />
      </div>

      <div v-if="errors.length" class="errors">
        <ul>
          <li v-for="(err, i) in errors" :key="i">
            Linha {{ err.row }} • campo “{{ err.field }}”: {{ err.message }}
          </li>
        </ul>
      </div>

      <!-- Table -->
      <div class="tabela" v-if="paginatedData.length">
        <table>
          <thead>
            <tr>
              <th v-for="(header, index) in headers" :key="index" :title="`Campo normalizado: ${keys[index]}`">
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) in paginatedData" :key="rowIndex">
              <td v-for="(key, index) in keys" :key="index" class="{ 'invalid-cell': getCellError(rowIndex, key) }"
                :title="getCellError(rowIndex, key)">
                <template v-if="getCellError(rowIndex, key)">
                  <input type="text" v-model="row[key]" @blur="onCellBlur" @keyup.enter="onCellBlur"
                    class="edit-cell" />
                </template>
                <template v-else>
                  {{ row[key] }}
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination" v-if="totalPages > 1">
        <button @click="prevPage" :disabled="currentPage === 1">Anterior</button>
        <span>Página {{ currentPage }} de {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">Próxima</button>
        <div class="page-numbers">
          <button v-for="page in totalPages" :key="page" @click="goToPage(page)"
            :class="{ active: currentPage === page }">
            {{ page }}
          </button>
        </div>
      </div>

      <!-- Send Button -->
      <div class="send-button" style="margin-top: 1rem; text-align: right;">
        <button @click="sendData" :disabled="errors.length > 0 || !data.length || loading" class="btn btn-primary">
          <span v-if="loading">Enviando...</span>
          <span v-else>Enviar</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/api'
import * as XLSX from 'xlsx'
import { validatePeriodoCsv } from '@/utils/validators/periodoCsvValidator'
import { validateDisciplinaCsv } from '@/utils/validators/disciplinasCsvValidator'
import { validateTurmaCsv } from '@/utils/validators/turmasCsvValidator'
import { validateUsuarioCsv } from '@/utils/validators/usuariosCsvValidator'
import { validateVinculoCsv } from '@/utils/validators/vinculosCsvValidator'
import { validateVinculoCsvProf } from '@/utils/validators/vinculosCsvValidatorProf'

export default {
  name: 'CsvUploader',
  props: {
    categoria: String,
    processoID: String,
    periodoLetivoID: String,
    disciplinaCodigo: String,
  },
  data() {
    return {
      data: [],
      headers: [],
      keys: [],
      errors: [],
      currentPage: 1,
      itemsPerPage: 10,
      currentType: '',
      currentValidator: () => ({ valid: true, errors: [] }),
      campoEsperado: [],
      loading: false
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.data.length / this.itemsPerPage)
    },
    paginatedData() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      return this.data.slice(start, start + this.itemsPerPage)
    }
  },
  watch: {
    categoria: {
      immediate: true,
      handler() {
        this.validarComCategoria()
      }
    }
  },
  methods: {
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) this.currentPage = page
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++
    },
    normalizeHeader(text) {
      if (typeof text !== 'string') return ''
      return text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9]+/g, ' ')
        .trim()
        .split(' ')
        .map((word, index) =>
          index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join('')
        .replace(/ç/g, 'c')
    },
    toIsoDate(dateBr) {
      if (!dateBr || typeof dateBr !== 'string') return dateBr
      const [d, m, y] = dateBr.split('/')
      return y && m && d ? `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}` : dateBr
    },
    parseCSV(text) {
      const lines = text.trim().split('\n')
      const rawHeaders = lines[0].split(/[,;]/).map(h => h.trim())
      const keys = rawHeaders.map(this.normalizeHeader)

      this.headers = rawHeaders
      this.keys = keys
      this.data = lines.slice(1).map(line => {
        const values = line.split(/[,;]/).map(v => v.trim())
        const obj = {}
        keys.forEach((key, idx) => {
          obj[key] = values[idx] || ''
        })
        return obj
      })
      this.currentPage = 1
      this.validarComCategoria()
    },
    getCellError(rowIndex, key) {
      const absIndex = (this.currentPage - 1) * this.itemsPerPage + rowIndex
      const err = this.errors.find(e => e.row - 1 === absIndex && e.field === key)
      return err ? err.message : ''
    },
    onCellBlur() {
      const { valid, errors } = this.currentValidator(this.data)
      this.errors = valid ? [] : errors
    },
    async sendData() {
      const { valid, errors } = this.currentValidator(this.data);
      if (!valid) {
        this.errors = errors;
        return;
      }

      this.loading = true;

      try {
        this.data.forEach(item => {
          if ('dataInicial' in item) item.dataInicial = this.toIsoDate(item.dataInicial);
          if ('dataFinal' in item) item.dataFinal = this.toIsoDate(item.dataFinal);
        });

        let dataComIDs = [...this.data];
        let dataTurma = [];
        let idprocesso;

        if (this.categoria === 'vinculo_professor_turma' || this.categoria === 'vinculo_aluno_turma') {
          dataTurma = await api.get('/turmas');
          idprocesso = dataTurma.data[0].processoID;
        }

        // Transforma dados conforme categoria
        switch (this.categoria) {
          case 'disciplina':
            dataComIDs = this.data.map(item => {
              const newItem = { ...item };
              delete newItem.periodoLetivoIdentificacao;
              if ('disciplina' in newItem) {
                newItem.nome = newItem.disciplina;
                delete newItem.disciplina;
              }
              if ('codigoDaDisciplina' in newItem) {
                newItem.codigo = newItem.codigoDaDisciplina;
                delete newItem.codigoDaDisciplina;
              }
              if ('dataFinal' in newItem) {
                newItem.dataFim = newItem.dataFinal;
                delete newItem.dataFinal;
              }
              if ('estado' in newItem) delete newItem.estado;
              if ('categoria' in newItem) newItem.categoria = "CURSO";
              return {
                ...newItem,
                processoID: this.processoID,
                periodoLetivoID: this.periodoLetivoID
              };
            });
            break;

          case 'turma':
            dataComIDs = this.data.map(item => {
              const newItem = { ...item };
              if ('codigodaturma' in newItem) {
                newItem.codigo = parseInt(newItem.codigodaturma);
                delete newItem.codigodaturma;
              }
              if ('turno' in newItem) {
                newItem.turno = newItem.turno.toUpperCase().replace('Ã', 'A');
              }
              if ('disciplinacodigo' in newItem) {
                delete newItem.disciplinacodigo;
              }
              return {
                ...newItem,
                disciplinaCodigo: this.disciplinaCodigo,
                processoID: this.processoID,
              };
            });
            break;

          case 'usuario':
            dataComIDs = this.data.map(item => {
              const newItem = { ...item };
              return {
                ...newItem,
                processoID: this.processoID
              };
            });
            break;

          case 'vinculo_professor_turma':
            dataComIDs = this.data.map(item => {
              const newItem = { ...item };
              if ('disciplinacodigo' in newItem) {
                newItem.disciplinaID = dataTurma.data[0].disciplinaCodigo;
                delete newItem.disciplinacodigo;
              }
              if ('codigodaturma' in newItem) {
                newItem.turmaID = dataTurma.data[0]._id;
                delete newItem.codigodaturma;
              }
              if ('professoresasresponsaveleismatriculaouemail' in newItem) {
                newItem.email = newItem.professoresasresponsaveleismatriculaouemail;
                delete newItem.professoresasresponsaveleismatriculaouemail;
              }
              return { ...newItem };
            });
            break;

          case 'vinculo_aluno_turma':
            dataComIDs = this.data.map(item => {
              const newItem = { ...item };
              if ('disciplinacodigo' in newItem) {
                newItem.disciplinaID = dataTurma.data[0].disciplinaCodigo;
                delete newItem.disciplinacodigo;
              }
              if ('codigodaturma' in newItem) {
                newItem.turmaID = dataTurma.data[0]._id;
                delete newItem.codigodaturma;
              }
              if ('matriculaiesouemaildoaluno' in newItem) {
                newItem.email = newItem.matriculaiesouemaildoaluno;
                delete newItem.matriculaiesouemaildoaluno;
              }
              return { ...newItem };
            });
            break;
        }

        const payloads = {
          disciplina: { disciplinas: dataComIDs },
          periodo: { periodos: dataComIDs },
          turma: { turmas: dataComIDs },
          usuario: { usuarios: dataComIDs },
          vinculo_aluno_turma: { processoID: idprocesso, vinculos: dataComIDs },
          vinculo_professor_turma: { processoID: idprocesso, vinculos: dataComIDs }
        };
        const endpoints = {
          usuario: '/usuarios',
          disciplina: '/disciplinas',
          turma: '/turmas',
          periodo: '/periodos',
          vinculo_aluno_turma: '/vinculos',
          vinculo_professor_turma: '/vinculos'
        };
        const proxEtapa = {
          usuario: 'vinculos',
          disciplina: 'turmas',
          turma: 'usuarios'
        };

        const endpoint = endpoints[this.currentType];
        const payload = payloads[this.currentType];
        const proxRota = proxEtapa[this.currentType];

        if (!endpoint || !payload) throw new Error('Categoria de CSV não suportada.');
console.log("Payload enviado para API:", JSON.stringify(payload, null, 2));

        const { data } = await api.post(endpoint, payload);

        alert('Dados enviados com sucesso!');

        const proxProps = {
          disciplina: {
            processoId: this.processoID,
            disciplinaCodigo: data[0]._id,
          },
          turma: {
            processoId: this.processoID,
          },
        };

        if (this.categoria === 'vinculo_aluno_turma' || this.categoria === 'vinculo_professor_turma') {
          alert('Vínculos criados com sucesso!');
        } else {
          this.$router.push({
            name: proxRota,
            params: proxProps[this.currentType]
          });
        }
      } catch (err) {
        console.error('Erro completo:', err);
        if (err.response && err.response.status === 400) {
          const msg = err.response.data?.message || '';

          const match = msg.match(/c[oó]digos? j[aá] existem:?\s*(.*)/i);
          if (match && match[1]) {
            const codigosDuplicados = match[1].split(',').map(c => c.trim());
            this.data = this.data.filter(d => !codigosDuplicados.includes(d.codigo));
            codigosDuplicados.forEach(codigo => {
              this.errors.push({
                row: '-',
                field: 'codigo',
                message: `Código ${codigo} já existe e foi removido.`
              });
            });
            alert(`Alguns códigos já existiam e foram removidos:\n${codigosDuplicados.join(', ')}`);
          } else {
            alert(`Erro ao enviar dados:\n${msg}`);
          }
        } else {
          alert('Erro desconhecido ao enviar dados: ' + err.message);
        }
      } finally {
        this.loading = false;
      }
    },

    handleFile(file) {
      const ext = file.name.toLowerCase().split('.').pop()
      const reader = new FileReader()
      reader.onload = e => {
        let content = e.target.result
        if (['xlsx', 'xls'].includes(ext)) {
          const workbook = XLSX.read(new Uint8Array(content), { type: 'array' })
          content = XLSX.utils.sheet_to_csv(workbook.Sheets[workbook.SheetNames[0]])
        }
        this.parseCSV(content)
      }
      if (ext === 'csv') reader.readAsText(file)
      else if (['xlsx', 'xls'].includes(ext)) reader.readAsArrayBuffer(file)
    },
    handleFileUpload(event) {
      const file = event.target.files[0]
      if (file && /\.(csv|xlsx|xls)$/i.test(file.name)) {
        this.handleFile(file)
      }
    },
    handleDrop(event) {
      const file = event.dataTransfer.files[0]
      if (file && /\.(csv|xlsx|xls)$/i.test(file.name)) {
        this.handleFile(file)
      }
    },
    validarComCategoria() {
      const map = {
        usuario: [validateUsuarioCsv, 'usuario', ['nome', 'email', 'cpf', 'tipo']],
        vinculo_aluno_turma: [validateVinculoCsv, 'vinculo_aluno_turma', ['usuarioID', 'turmaID']],
        vinculo_professor_turma: [validateVinculoCsvProf, 'vinculo_professor_turma', ['usuarioID', 'turmaID']],
        disciplina: [validateDisciplinaCsv, 'disciplina', ['codigo', 'nome']],
        periodo: [validatePeriodoCsv, 'periodo', ['identificacao', 'dataInicial', 'dataFinal']],
        turma: [validateTurmaCsv, 'turma', ['codigo', 'disciplinaID', 'periodoLetivoID']]
      }

      const val = map[this.categoria]
      if (val) {
        this.currentValidator = val[0]
        this.currentType = val[1]
        this.campoEsperado = val[2]
      } else {
        this.currentValidator = () => ({ valid: true, errors: [] })
        this.currentType = ''
        this.campoEsperado = []
      }

      const { valid, errors } = this.currentValidator(this.data)
      this.errors = valid ? [] : errors
    }
  }
}
</script>
<style scoped>
.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.5s;
}

.btn:hover {
  background-color: #0098f0;
}

.btn-primary {
  background-color: #1161d8;
  color: #fff;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Área de drop */
.drop-area {
  padding: 1.5rem;
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.3s, background 0.3s;
}

.drop-area:hover {
  border-color: #0098f0;
  background: #fafafa;
}

/* Erros modernizados */
.errors {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin: 1.25rem 0;
  padding: 1rem;
  background: #fff5f5;
  border-left: 4px solid #e57373;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  color: #b71c1c;
  font-size: 0.95rem;
  line-height: 1.4;
  overflow-y: auto;
  max-height: 200px;
}

/* Ícone de erro */
.errors::before {
  content: "⚠️";
  flex-shrink: 0;
  font-size: 1.25rem;
  line-height: 1;
  margin-top: 0.1rem;
}

/* Lista interna de mensagens */
.errors ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.errors li {
  margin-bottom: 0.5rem;
}

.errors li:last-child {
  margin-bottom: 0;
}

/* Wrapper da tabela */
.tabela {
  margin-top: 1rem;
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

/* Tabela */
table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: #ffffff;
}

/* Cabeçalho */
th {
  position: sticky;
  top: 0;
  background: #fafafa;
  color: #555;
  font-weight: 600;
  padding: 0.75rem;
  text-align: left;
  border-bottom: 2px solid #e0e0e0;
}

/* Células */
td {
  padding: 0.75rem;
  color: #333;
  border-bottom: 1px solid #f0f0f0;
}

/* Zebra stripes sutis */
tr:nth-child(even) td {
  background: #fcfcfc;
}

/* Hover da linha */
tr:hover td {
  background: #f5f5f5;
}

/* Células inválidas */
.invalid-cell {
  background-color: #fff5f5 !important;
  position: relative;
}

.invalid-cell::after {
  content: attr(data-error);
  position: absolute;
  bottom: 100%;
  left: 0;
  padding: 0.25rem 0.5rem;

  color: #fff;
  font-size: 0.75rem;
  border-radius: 4px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
}

.invalid-cell:hover::after {
  opacity: 1;
}

/* Input de edição */
.edit-cell {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.9rem;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.edit-cell:focus {
  outline: none;
  border-color: #0098f0;
}

.invalid-cell .edit-cell {
  border-color: #e57373;
}

/* Paginação */
.pagination {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  font-size: 0.9rem;
}

/* Botões de paginação */
.pagination button {
  background: none;
  border: none;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s;
  background-color: #1161d8;
}

.pagination button:hover:not(:disabled) {
  background: #0098f0;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Números de página */
.page-numbers {
  display: flex;
  gap: 0.5rem;
}

.page-numbers button.active {
  font-weight: 600;
  text-decoration: underline;
}
</style>
