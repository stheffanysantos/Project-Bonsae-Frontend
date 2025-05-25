const FIELD_RULES = [
    {
        key: 'disciplinaCodigo',
        requiredMsg: 'Informe o codigo da disciplina'
    },
    {
        key: 'codigoDaTurma',
        requiredMsg: 'Informe o codigo da turma'
    },
    {
        key: 'professoresAsResponsavelEisMatriculaOuEMail',
        requiredMsg: 'Informe a Matrícula ou e-mail do professor.'
    }
]

export function validateVinculoCsvProf(records) {
    const errors = [];

    function addError(row, field, message) {
        errors.push({row, field, message})
    }

    records.forEach((row, idx) => {
        const rowNum = idx + 1;

        FIELD_RULES.forEach(rule => {
            const val = row[rule.key];

            if (!val || String(val).trim() === '') {
                addError(rowNum, rule.key, rule.requiredMsg);
                return;
            }
        });
    });

    return {
        valid: errors.length === 0,
        errors
    };
}