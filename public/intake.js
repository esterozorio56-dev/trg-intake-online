const form = document.getElementById("intakeForm");
const statusMsg = document.getElementById("statusMsg");

const SUPABASE_URL = window.SUPABASE_URL || "";
const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || "";

form.querySelectorAll("input[type=range]").forEach(slider => {
  const valueSpan = slider.nextElementSibling;
  slider.addEventListener("input", () => {
    valueSpan.textContent = slider.value;
  });
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  statusMsg.textContent = "Enviando...";

  const data = Object.fromEntries(new FormData(form));

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/intake_submissions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        status: "novo",
        answers: data
      })
    });

    if (!res.ok) throw new Error("Erro ao enviar");

    statusMsg.textContent = "✔ Enviado com sucesso. Obrigada.";
    statusMsg.style.color = "green";
    form.reset();

  } catch (err) {
    statusMsg.textContent = "Erro ao enviar. Tente novamente.";
    statusMsg.style.color = "red";
  }
});
