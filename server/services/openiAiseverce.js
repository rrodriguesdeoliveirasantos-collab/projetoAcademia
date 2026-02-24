import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function gerarTreinoIA(dados) {

  const prompt = `
  Gere um treino estruturado em JSON.

  Regras:
  - Objetivo: ${dados.objetivo}
  - Nível: ${dados.nivel}
  - Dias por semana: ${dados.dias.length}
  - Máximo 15 séries por músculo por semana
  - Não repetir exercícios
  - Retornar apenas JSON válido

  Estrutura:
  {
    "treinos": [
      {
        "dia": "Segunda",
        "exercicios": [
          {
            "nome": "",
            "musculo": "",
            "series": 4,
            "reps": "",
            "descanso": ""
          }
        ]
      }
    ]
  }
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7
  });

  return JSON.parse(response.choices[0].message.content);
}