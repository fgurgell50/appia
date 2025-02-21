import dotenv from "dotenv";
dotenv.config();  // Carrega o arquivo .env automaticamente

//console.log("🔑 OPENAI_API_KEY:", process.env.OPENAI_API_KEY); // Verifique se exibe a chave corretamente

import express from "express";
import cors from "cors";
import router from "./src/routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", router);

const PORT = 4000;
app.listen(PORT, () => console.log(`🚀 Backend rodando em http://localhost:${PORT}`));
