import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 10000;

// Corrige __dirname no ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());

// 🔥 SERVIR ARQUIVOS ESTÁTICOS (ESSENCIAL)
app.use(express.static(path.join(__dirname, "public")));

// Rota principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "intake.html"));
});

// Start
app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
