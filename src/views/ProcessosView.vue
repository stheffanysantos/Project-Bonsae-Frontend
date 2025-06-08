<template>
  <div class="containerUploader">
    <h1>Controle de importacao</h1>
    <!-- Botão que abre a modal -->
    <button class="botaoNewProcessos" @click="mostrarModal = true">+ Novo Processo</button>

    <!-- Modal de nova identificação -->
    <div v-if="mostrarModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Novo Processo</h3>
        <input v-model="novaIdentificacao" placeholder="Digite a identificação (ex: processo-24)"
          class="inputIdentificacao" />
        <div class="modal-actions">
          <button @click="criarProcesso" class="botaoNewProcessos">Criar</button>
          <button @click="mostrarModal = false" class="btnProcessos neutral">Cancelar</button>
        </div>
      </div>
    </div>
    <div class="content">
      <h2>Processos de Importação</h2>
      <div>
        <table>
          <thead>
            <tr>
              <th>ID do Processo</th>
              <th>Período Letivo</th>
              <th>Data de Início</th>
              <th>Data de Término</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="processo in processosPaginados" :key="processo._id">
              <td>{{ processo.identificacao }}</td>
              <td>--</td> <!-- Preencha quando houver campo "periodo" disponível -->
              <td>{{ formatarData(processo.dataInicio) }}</td>
              <td>--</td> <!-- Data de término ainda não fornecida pela API -->
              <td>
                <span :class="['statusProcesso', processo.status === 'CONCLUIDO' ? 'success' : 'info']">
                  {{ formatarStatus(processo.status) }}
                </span>
              </td>
              <td>
                <button v-if="processo.status === 'EM_ANDAMENTO'" class="btnProcessos danger"
                  @click="cancelarProcesso(processo._id)">
                  Cancelar
                </button>
                <button v-if="processo.status === 'EM_ANDAMENTO'" class="btnProcessos primary">Continuar</button>
                <button v-if="processo.status === 'CONCLUIDO'" class="btnProcessos neutral">Visualizar</button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Paginação -->
        <div class="paginacao">
          <button @click="paginaAtual--" :disabled="paginaAtual === 1">Anterior</button>
          <span>Página {{ paginaAtual }} de {{ totalPaginas }}</span>
          <button @click="paginaAtual++" :disabled="paginaAtual === totalPaginas">Próxima</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/api'

export default {
  name: "TabelaImportacoes",
  data() {
    return {
      paginaAtual: 1,
      itensPorPagina: 10,
      processos: [],
      novaIdentificacao: '',
      mostrarModal: false,
    };
  },
  computed: {
    totalPaginas() {
      return Math.ceil(this.processos.length / this.itensPorPagina);
    },
    processosPaginados() {
      const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
      const fim = inicio + this.itensPorPagina;
      return this.processos.slice(inicio, fim);
    }
  },
  methods: {
    async cancelarProcesso(processoId) {
      const confirmacao = confirm('Tem certeza que deseja cancelar este processo?');
      if (!confirmacao) return;

      try {
        await api.post(`/processos/${processoId}/abortar`);
        await this.fetchProcessos();
      } catch (error) {
        console.error('Erro ao cancelar processo:', error);
        alert('Não foi possível cancelar o processo.');
      }
    },
    async criarProcesso() {
      if (!this.novaIdentificacao.trim()) {
        alert('Digite uma identificação.');
        return;
      }

      try {
        const res = await api.post('/processos', {
          identificacao: this.novaIdentificacao.trim()
        });
        const processoId = res.data._id;

        // Reset e fecha modal
        this.novaIdentificacao = '';
        this.mostrarModal = false;

        // TODO arrumar a rota
        await this.fetchProcessos();
        this.$router.push({ name: 'periodo', params: { processoId } });

      } catch (error) {
        console.error('Erro ao criar processo:', error);
        alert('Erro ao iniciar novo processo.');
      }
    },
    async fetchProcessos() {
      try {
        const res = await api.get('/processos');
        this.processos = res.data;
      } catch (error) {
        console.error('Erro ao buscar processos:', error);
        alert('Erro ao carregar processos.');
      }
    },
    formatarData(dataISO) {
      return new Date(dataISO).toLocaleDateString('pt-BR');
    },
    formatarStatus(status) {
      return status === 'CONCLUIDO' ? 'Concluído' : 'Em Andamento';
    }
  },
  mounted() {
    this.fetchProcessos();
  },
};
</script>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
}

thead th {
  padding: 10px;
  color: black;
}

tbody td {
  padding: 10px;
  text-align: center;
}

tbody {
  background-color: var(--grey, #f0f0f0);
}

tbody tr {
  border: 1px solid var(--cor-secundaria, #ccc);
}

.paginacao {
  margin-top: 15px;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  min-width: 300px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
}

.inputIdentificacao {
  width: 100%;
  padding: 8px;
  margin-top: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
</style>
