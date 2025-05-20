<template>
  <div class="containerUploader">
    <h1>Controle de importacao</h1>
    <button class="botaoNewProcessos" @click="goPeriodo">+ Novo Processo</button>
    <div class="content">
      <h2>Processos de Importação</h2>
      <table class="tabelaProcessos">
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
          <tr v-for="processo in processos" :key="processo.id">
            <td>{{ processo.id }}</td>
            <td>{{ processo.periodo }}</td>
            <td>{{ processo.inicio }}</td>
            <td>{{ processo.fim }}</td>
            <td>
              <span v-if="processo.status === 'Concluído'" class="statusProcesso success">Concluído</span>
              <span v-else-if="processo.status === 'Em Andamento'" class="statusProcesso info">Em Andamento</span>
            </td>
            <td>
              <button v-if="processo.status === 'Em Andamento'" class="btnProcessos danger">Cancelar</button>
              <button v-if="processo.status === 'Em Andamento'" class="btnProcessos primary">Continuar</button>
              <button v-if="processo.status === 'Concluído'" class="btnProcessos neutral">Visualizar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "TabelaImportacoes",
  data() {
    return {
      processos: [
        {
          id: "003",
          periodo: "2025/1",
          inicio: "01/02/2025",
          fim: "25/06/2025",
          status: "Em Andamento",
        },
        {
          id: "002",
          periodo: "2024/2",
          inicio: "04/07/2024",
          fim: "19/11/2024",
          status: "Concluído",
        },
        {
          id: "001",
          periodo: "2024/1",
          inicio: "02/02/2024",
          fim: "29/06/2024",
          status: "Concluído",
        },
      ],
    };
  },
  components: {

  },
  methods: {
    goPeriodo() {
      this.$router.push('/periodo');
    }
  }
}
</script>

<style scoped></style>
