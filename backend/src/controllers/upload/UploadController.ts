import { Request, Response } from "express";
import { processFile } from "../../services/openaiService";

export const handleUpload = async (req: Request, res: Response) => {
  try {
    const prompt = req.body.prompt;
    const text = req.body.text || null;
    const file = req.file || null;

    //console.log("🚀 Prompt Enviado para Análise:", prompt);
    
    const result = await processFile(file, prompt, text);
   
    res.status(200).json(result);
  } catch (error) {
    console.error("❌ Erro no controlador:", error);
    res.status(500).json({ error: "Erro ao processar a análise." });
  }
};
