const supabase = window.supabase.createClient(
  window.SUPABASE_URL,
  window.SUPABASE_ANON_KEY
);

const form = document.getElementById("intakeForm");
const statusMsg = document.getElementById("statusMsg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  statusMsg.textContent = "Enviando...";
  statusMsg.style.color = "#333";

  const data = Object.fromEntries(new FormData(form).entries());

  const { error } = await supabase.from("intake_submissions").insert([
    {
      status: "novo",
      answers: data
    }
  ]);

  if (error) {
    console.error(error);
    statusMsg.textContent = "Erro ao enviar. Verifique e tente novamente.";
    statusMsg.style.color = "red";
  } else {
    statusMsg.textContent = "Formulário enviado com sucesso.";
    statusMsg.style.color = "green";
    form.reset();
  }
});
