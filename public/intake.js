// cria o cliente com OUTRO nome (não supabase)
const db = window.supabase.createClient(
  window.SUPABASE_URL,
  window.SUPABASE_ANON_KEY
);

const form = document.getElementById("intakeForm");
const statusMsg = document.getElementById("statusMsg");

// atualizar valor das escalas visualmente
document.querySelectorAll('input[type="range"]').forEach((range) => {
  const span = range.nextElementSibling;
  span.textContent = range.value;
  range.addEventListener("input", () => {
    span.textContent = range.value;
  });
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  statusMsg.textContent = "Enviando...";
  statusMsg.style.color = "#333";

  const formData = Object.fromEntries(new FormData(form).entries());

  const { error } = await db
    .from("intake_submissions")
    .insert([
      {
        status: "novo",
        answers: formData
      }
    ]);

  if (error) {
    console.error("Erro Supabase:", error);
    statusMsg.textContent = "Erro ao enviar. Verifique e tente novamente.";
    statusMsg.style.color = "red";
  } else {
    statusMsg.textContent = "Formulário enviado com sucesso.";
    statusMsg.style.color = "green";
    form.reset();
  }
});
