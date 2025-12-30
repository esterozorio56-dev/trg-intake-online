// ===============================
// SUPABASE CLIENT
// ===============================
const { createClient } = supabase;

const supabaseClient = createClient(
  window.SUPABASE_URL,
  window.SUPABASE_ANON_KEY
);

// ===============================
// ATUALIZAR VALOR DAS ESCALAS
// ===============================
document.querySelectorAll('.scale input[type="range"]').forEach((range) => {
  const valueSpan = range.parentElement.querySelector('.value');
  valueSpan.textContent = range.value;

  range.addEventListener('input', () => {
    valueSpan.textContent = range.value;
  });
});

// ===============================
// ENVIO DO FORMULÁRIO
// ===============================
const form = document.getElementById('intakeForm');
const statusMsg = document.getElementById('statusMsg');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  statusMsg.textContent = 'Enviando...';

  const formData = new FormData(form);

  const payload = {
    nome: formData.get('nome'),
    idade: formData.get('idade'),
    whatsapp: formData.get('whatsapp'),
    motivo: formData.get('motivo'),

    escalas: {
      intensidade: formData.get('intensidade'),
      ansiedade: formData.get('ansiedade'),
      somatico: formData.get('somatico')
    },

    historico: {
      inicio: formData.get('inicio'),
      piora: formData.get('piora'),
      ajuda: formData.get('ajuda'),
      chamada: formData.get('chamada')
    }
  };

  try {
    const { error } = await supabaseClient
      .from('intake_submissions')
      .insert([
        {
          status: 'novo',
          answers: payload
        }
      ]);

    if (error) {
      console.error(error);
      statusMsg.textContent = 'Erro ao enviar. Verifique e tente novamente.';
      statusMsg.style.color = 'red';
      return;
    }

    statusMsg.textContent = '✔ Enviado com sucesso. Obrigada.';
    statusMsg.style.color = 'green';
    form.reset();

    document.querySelectorAll('.scale .value').forEach(v => v.textContent = '5');

  } catch (err) {
    console.error(err);
    statusMsg.textContent = 'Erro inesperado ao enviar.';
    statusMsg.style.color = 'red';
  }
});
