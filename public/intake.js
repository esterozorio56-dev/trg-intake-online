const form = document.getElementById("intakeForm");
const statusMsg = document.getElementById("statusMsg");

const supabaseUrl = window.SUPABASE_URL;
const supabaseKey = window.SUPABASE_ANON_KEY;

async function enviarFormulario(dados) {
  const response = await fetch(`${supabaseUrl}/rest/v1/intake_submissions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": supabaseKey,
      "Authorization": `Bearer ${supabaseKey}`,
      "Prefer": "return=minimal"
    },
    body: JSON.stringify({
      status: "novo",
      answers: dados,
      submitted_at: new Date().toISOString()
    })
  });

  if (!response.ok) {
    throw new Error("Falha ao enviar");
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  statusMsg.textContent = "Enviando com calma...";

  const formData = new FormData(form);
  const dados = Object.fromEntries(formData.entries());

  try {
    await enviarFormulario(dados);
    statusMsg.textContent = "✔️ Enviado com sucesso. Obrigada.";
    form.reset();
  } catch (err) {
    console.error(err);
    statusMsg.textContent = "❌ Erro ao enviar. Tente novamente.";
  }
});
