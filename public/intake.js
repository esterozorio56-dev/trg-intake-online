// ===============================
// SUPABASE CLIENT (ÚNICO)
// ===============================
const supabase = window.supabase.createClient(
  window.SUPABASE_URL,
  window.SUPABASE_ANON_KEY
);

// ===============================
// FORM SUBMIT
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("intakeForm");
  const statusMsg = document.getElementById("statusMsg");

  // Atualiza valores das escalas
  document.querySelectorAll('input[type="range"]').forEach(range => {
    const valueSpan = range.parentElement.querySelector(".value");
    if (valueSpan) valueSpan.textContent = range.value;

    range.addEventListener("input", () => {
      if (valueSpan) valueSpan.textContent = range.value;
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusMsg.textContent = "Enviando...";
    statusMsg.style.color = "#333";

    const data = {
      nome: form.nome.value,
      idade: form.idade.value,
      whatsapp: form.whatsapp.value,
      motivo: form.motivo.value,
      intensidade: form.intensidade.value,
      ansiedade: form.ansiedade.value,
      somatico: form.somatico.value,
      inicio: form.inicio.value,
      piora: form.piora.value,
      ajuda: form.ajuda.value,
      chamada: form.chamada.value,
      created_at: new Date()
    };

    const { error } = await supabase
      .from("intake_submissions")
      .insert([{ answers: data, status: "novo" }]);

    if (error) {
      console.error("Erro Supabase:", error);
      statusMsg.textContent = "Erro ao enviar. Verifique e tente novamente.";
      statusMsg.style.color = "red";
      return;
    }

    statusMsg.textContent = "Formulário enviado com sucesso.";
    statusMsg.style.color = "green";
    form.reset();
  });
});
