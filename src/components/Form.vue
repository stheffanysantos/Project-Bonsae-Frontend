<template>
  <div class="form-wrapper">
    <transition name="fade">
      <div v-if="showSuccess" class="toast-success">
        Formulário enviado com sucesso!
      </div>
    </transition>


    <form @submit.prevent="handleSubmit" class="form-container">
      <div class="form-group" v-for="(field, key) in fieldRules" :key="key">
        <label :for="field.key">{{ field.label }}:</label>
        <input :id="field.key" v-model.trim="form[field.key]" :type="field.isDate ? 'text' : 'text'"
          :placeholder="field.placeholder" @blur="validateField(field.key)" :class="{ 'input-error': errors[field.key].length }
            " />
        <div v-if="errors[field.key].length" class="error-messages">
          <div v-for="(err, i) in errors[field.key]" :key="i" class="error-text">
            {{ err }}
          </div>
        </div>
      </div>

      <button type="submit" class="submit-button">Enviar</button>
    </form>
  </div>
</template>

<script>
import { criarPeriodo } from '@/services/periodoLetivo'
import { validatePeriodoCsv } from '@/utils/validators/periodoCsvValidator'

function toIsoDate(brDate) {
  const [dia, mes, ano] = brDate.split('/');
  return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
}

export default {
  name: 'FormComponent',
  data() {
    return {
      form: {
        periodoLetivo: '',
        dataInicial: '',
        dataFinal: ''
      },
      errors: {
        periodoLetivo: [],
        dataInicial: [],
        dataFinal: [],
        form: []
      },
      // NOVO estado para o toast
      showSuccess: false,
      fieldRules: {
        periodoLetivo: { key: 'periodoLetivo', label: 'Período Letivo', placeholder: 'Insira o período letivo' },
        dataInicial: { key: 'dataInicial', label: 'Data Inicial', isDate: true, placeholder: 'DD/MM/YYYY' },
        dataFinal: { key: 'dataFinal', label: 'Data Final', isDate: true, placeholder: 'DD/MM/YYYY' }
      }
    }
  },
  methods: {
    validateField(fieldKey) {
      this.errors[fieldKey] = []
      const { errors } = validatePeriodoCsv([this.form])
      errors.forEach(err => {
        if (err.field === fieldKey) {
          this.errors[fieldKey].push(err.message)
        }
      })
    },
    validateAll() {
      Object.keys(this.errors).forEach(key => { this.errors[key] = [] })
      const { valid, errors } = validatePeriodoCsv([this.form])
      errors.forEach(err => {
        if (this.errors[err.field]) {
          this.errors[err.field].push(err.message)
        }
      })
      return valid
    },
    async handleSubmit() {
      if (!this.validateAll()) return;

      try {
        const payload = {
          processoID: this.$route.params.processoId,
          identificacao: this.form.periodoLetivo.trim(), // ou outro campo apropriado
          periodoLetivo: 'SEMESTRE-1', // toString(this.form.periodoLetivo) TODO ver com davi pra consertar essa validacao
          dataInicial: new Date(toIsoDate(this.form.dataInicial) + 'T00:00:00.000Z'),
          dataFim: new Date(toIsoDate(this.form.dataFinal) + 'T23:59:59.999Z'),
        };

        console.log('Payload enviado:', payload); // <-- debug

        const { data } = await criarPeriodo(payload)
        this.$emit('periodo-criado', data);
        this.resetForm();
        this.showSuccess = true;
        setTimeout(() => this.showSuccess = false, 3000);
        this.$router.push({ name: 'disciplinas', params: { processoId: data.processoID, periodoId: data._id } });

      } catch (e) {
        console.error('Erro:', e.response?.data || e);
        this.errors.form = [e.response?.data?.message || 'Erro ao criar período'];

      }
    },
    resetForm() {
      Object.keys(this.form).forEach(k => this.form[k] = '')
      Object.keys(this.errors).forEach(k => this.errors[k] = [])
    }
  },
}
</script>
