// ===============================
// SUPABASE CLIENT (APENAS UMA VEZ)
// ===============================
const supabase = window.supabase.createClient(
  window.SUPABASE_URL,
  window.SUPABASE_ANON_KEY
);

// ===============================
// FORM SUBMIT
// ===============================
const form = document.getElementById("intakeForm");
const statusMsg = document.getElementById("statusMsg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  statusMsg.textContent = "Enviando...";
  statusMsg.style.color = "#333";

  const formData = new FormData(form);

  const answers = {
    nome: formData.get("nome"),
    idade: formData.get("idade"),
    whatsapp: formData.get("whatsapp"),
    motivo: formData.get("motivo"),
    intensidade: formData.get("intensidade"),
    ansiedade: formData.get("ansiedade"),
    somatico: formData.get("somatico"),
    inicio: formData.get("inicio"),
    piora: formData.get("piora"),
    ajuda: formData.get("ajuda"),
    chamada: formData.get("chamada")
  };

  const { error } = await supabase
    .from("intake_submissions")
    .insert([{ status: "new", answers }]);

  if (error) {
    console.error("Erro Supabase:", error);
    statusMsg.textContent = "Erro ao enviar. Verifique e tente novamente.";
    statusMsg.style.color = "red";
    return;
  }

  statusMsg.textContent = "Formulário enviado com sucesso!";
  statusMsg.style.color = "green";
  form.reset();
});
