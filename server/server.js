import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { gerarTreinoIA } from "./services/openaiService.js";
import { validarTreino } from "./validators/treinoValidator.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/gerar-treino", async (req, res) => {
  try {

    const plano = await gerarTreinoIA(req.body);

    console.log("RETORNO DA IA:", plano); // 👈 adiciona isso

    validarTreino(plano);

    res.json(plano);

  } catch (err) {
    console.error("ERRO:", err); // 👈 adiciona isso também

    res.status(400).json({
      erro: "Treino inválido",
      detalhe: err.message
    });
  }
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});