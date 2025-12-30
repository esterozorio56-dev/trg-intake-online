import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Health check
app.get("/", (req, res) => {
  res.send("TRG Intake Online está rodando 🚀");
});

// Endpoint para salvar anamnese
app.post("/api/intake", async (req, res) => {
  try {
    const { token, answers } = req.body;

    const { error } = await supabase
      .from("intake_submissions")
      .insert([{ token, answers }]);

    if (error) throw error;

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao salvar anamnese" });
  }
});

// 🚨 ESSA LINHA É O QUE FALTAVA
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
