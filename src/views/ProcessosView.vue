<template>
  <div class="bodyScreen">
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
        {
          id: "004",
          periodo: "2025/2",
          inicio: "01/08/2025",
          fim: "20/12/2025",
          status: "Em Andamento",
        },
        {
          id: "005",
          periodo: "2025/3",
          inicio: "01/02/2026",
          fim: "30/06/2026",
          status: "Em Andamento",
        },
        {
          id: "006",
          periodo: "2025/4",
          inicio: "01/08/2026",
          fim: "20/12/2026",
          status: "Em Andamento",
        },
        {
          id: "007",
          periodo: "2026/1",
          inicio: "01/02/2027",
          fim: "30/06/2027",
          status: "Em Andamento",
        },
        {
          id: "008",
          periodo: "2026/2",
          inicio: "01/08/2027",
          fim: "20/12/2027",
          status: "Em Andamento",
        },
        {
          id: "009",
          periodo: "2026/3",
          inicio: "01/02/2028",
          fim: "30/06/2028",
          status: "Em Andamento",
        },
        {
          id: "010",
          periodo: "2026/4",
          inicio: "01/08/2028",
          fim: "20/12/2028",
          status: "Em Andamento",
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
