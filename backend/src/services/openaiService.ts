import fs from "fs-extra";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import OpenAI from "openai";

// Verificação segura da chave
const apiKey = process.env.OPENAI_API_KEY || "";
if (!apiKey) {
  throw new Error("❌ OPENAI_API_KEY não foi encontrada. Verifique suas variáveis de ambiente.");
}

const openai = new OpenAI({ apiKey });

export async function processFile(file: Express.Multer.File | null, prompt: string, text: string | null) {
  let content = text || "";

  if (!content && file) {
    const buffer = await fs.readFile(file.path);
    const fileType = file.mimetype || "";

    if (fileType === "application/pdf") {
      const data = await pdfParse(buffer);
      content = data.text;
    } else if (fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const result = await mammoth.extractRawText({ buffer });
      content = result.value;
    } else {
      throw new Error("❌ Formato de arquivo não suportado.");
    }
  }

  if (!content) {
    throw new Error("❌ Nenhum conteúdo encontrado para análise.");
  }

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: `${prompt}\n\n${content}` }],
    temperature: 0,
    max_tokens: 1500,
  });

  // Verificação segura da resposta
  const messageContent = response.choices[0]?.message?.content;

  if (!messageContent) {
    throw new Error("❌ Nenhuma resposta válida foi retornada pela API.");
  }

  const result = messageContent.trim();
 // const totalPointsMatch = result.match(/Total de Pontos de Função:\s*(\d+)/i);
  const totalPointsMatch = result.match(
    /Total de Pontos de Função[^\d]*(\d+)(\s*(PF|Pontos))?/i
  );
  const totalPoints = totalPointsMatch ? parseInt(totalPointsMatch[1], 10) : 0;

  //console.log("📋 Resposta da API:", result);
  //console.log("🔍 Total de Pontos de Função Capturado:", totalPoints);

  return { result, totalPoints };
}
