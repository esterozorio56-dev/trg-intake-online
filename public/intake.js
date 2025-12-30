// ===============================
// SUPABASE CONFIG
// ===============================
const SUPABASE_URL = window.SUPABASE_URL;
const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY;

const supabase = supabasejs.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// ===============================
// ATUALIZAR VALOR DAS ESCALAS
// ===============================
document.querySelectorAll('input[type="range"]').forEach((range) => {
  const valueSpan = range.nextElementSibling;
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

  statusMsg.textContent = "Enviando...";
  statusMsg.style.color = "#555";

  const formData = new FormData(form);

  const payload = {
    nome: formData.get('nome'),
    idade: formData.get('idade'),
    whatsapp: formData.get('whatsapp'),
    motivo: formData.get('motivo'),
    intensidade: formData.get('intensidade'),
    ansiedade: formData.get('ansiedade'),
    somatico: formData.get('somatico'),
    inicio: formData.get('inicio'),
    piora: formData.get('piora'),
    ajuda: formData.get('ajuda'),
    chamada: formData.get('chamada'),
  };

  try {
    const { error } = await supabase
      .from('intake_submissions')
      .insert([
        {
          status: 'novo',
          answers: payload
        }
      ]);

    if (error) {
      throw error;
    }

    statusMsg.textContent = "✔️ Enviado com sucesso. Obrigada.";
    statusMsg.style.color = "green";
    form.reset();

  } catch (err) {
    console.error(err);
    statusMsg.textContent = "❌ Erro ao enviar. Tente novamente.";
    statusMsg.style.color = "red";
  }
});
