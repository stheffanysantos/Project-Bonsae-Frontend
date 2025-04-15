<template>
  <div>
    <h1>Disciplinas</h1>
    <CsvUploader />
  </div>
</template>

<script>
import CsvUploader from '@/components/CsvUploader.vue';
export default {
  name: 'App',
  components: {
    CsvUploader,
  }
}
</script>

<style></style>
