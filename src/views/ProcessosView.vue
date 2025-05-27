<template>
  <div class="containerUploader">
    <h1>Controle de importacao</h1>
    <button class="botaoNewProcessos" @click="goPeriodo">+ Novo Processo</button>
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
            <tr v-for="processo in processosPaginados" :key="processo.id">
              <td>{{ processo.id }}</td>
              <td>{{ processo.periodo }}</td>
              <td>{{ processo.inicio }}</td>
              <td>{{ processo.fim }}</td>
              <td>
                <span v-if="processo.status === 'Concluído'" class="statusProcesso success">Concluído</span>
                <span v-else class="statusProcesso info">Em Andamento</span>
              </td>
              <td>
                <button v-if="processo.status === 'Em Andamento'" class="btnProcessos danger">Cancelar</button>
                <button v-if="processo.status === 'Em Andamento'" class="btnProcessos primary">Continuar</button>
                <button v-if="processo.status === 'Concluído'" class="btnProcessos neutral">Visualizar</button>
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
export default {
  name: "TabelaImportacoes",
  data() {
    return {
      paginaAtual: 1,
      itensPorPagina: 10,
      processos: Array.from({ length: 30 }, (_, i) => ({
        id: i + 1,
        periodo: `202${Math.floor(i / 10)}.1`,
        inicio: '2025-01-01',
        fim: '2025-06-30',
        status: i % 2 === 0 ? 'Concluído' : 'Em Andamento',
      })),
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
    },
  },
  methods: {
    goPeriodo() {
      this.$router.push('/periodo');
    }
  }
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
</style>
