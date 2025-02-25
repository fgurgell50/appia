"use client";

import { useState, useEffect } from "react";
import { analyzeContent } from "@/services/api";
import styles from "./style.module.scss";
import Header from "@/components/Header";
import Modal from "@/components/Modal"; 

export default function Funcao() {
  //const [inputMode, setInputMode] = useState("upload");
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [inputMode, setInputMode] = useState<string>("upload");

  const [manualText, setManualText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>({ functions: [] });
  const [totalPoints, setTotalPoints] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentPrompt, setCurrentPrompt] = useState<string>("");

  useEffect(() => {
    console.log("Estado atualizado:", inputMode);
  }, [inputMode]);
  

  const generatePrompt = (content: string): string => {
    return `
Você é um especialista em **Análise de Pontos de Função (APF)** conforme o **Manual de Práticas de Contagem de Pontos de Função (CPM - IFPUG)**. Sua tarefa é avaliar o conteúdo abaixo e classificar **cada função identificada**, determinando sua complexidade e calculando o total de Pontos de Função (PF).

### **Regras da Análise**
- A contagem deve ser feita de acordo com os **requisitos funcionais do usuário**.
- Utilize os critérios do CPM para classificar **Entrada Externa (EE), Saída Externa (SE), Consulta Externa (CE), Arquivo Lógico Interno (ALI) e Arquivo de Interface Externa (AIE)**.
- Atribua corretamente a **complexidade (Baixa, Média, Alta)** para cada função, considerando:
  - **EE, SE e CE**: número de Arquivos Referenciados (AR) e Elementos de Dados (DET).
  - **ALI e AIE**: número de Registros Lógicos Internos (RLI) e Elementos de Dados (DET).

### **Conteúdo para Análise**:
"""
${content}
"""

### **Instruções para a Resposta**
1. **Identifique e classifique cada função**, utilizando o seguinte formato:
   - **Entrada Externa (EE)**: [Descrição] - [Complexidade] - [Pontos]
   - **Saída Externa (SE)**: [Descrição] - [Complexidade] - [Pontos]
   - **Consulta Externa (CE)**: [Descrição] - [Complexidade] - [Pontos]
   - **Arquivo Lógico Interno (ALI)**: [Descrição] - [Complexidade] - [Pontos]
   - **Arquivo de Interface Externa (AIE)**: [Descrição] - [Complexidade] - [Pontos]

2. **Cálculo Total**:
   - Some os Pontos de Função identificados e forneça o **Total de Pontos de Função (PF)**.

📢 **Atenção**: Retorne apenas a análise no formato solicitado, sem explicações adicionais.`;
  };

  const parseResult = (resultString: string) => {

    const functionsRegex = /\*\*(.*?)\*\*:\s(.*?)\s-\s(.*?)\s-\s(\d+)\sPF/g;
    const functions = [];
    let match;
    
    while ((match = functionsRegex.exec(resultString)) !== null) {
      functions.push({
        type: match[1].trim(),
        description: match[2].trim(),
        complexity: match[3].trim(),
        points: parseInt(match[4], 10),
      });
    }
  
    //console.log("🔍 Funções Capturadas:", functions); 
    return { functions };
  };


  const handleOpenModal = () => {
    console.log("Prompt gerado:", generatePrompt(manualText));
    setCurrentPrompt(generatePrompt(manualText));  // Passando o prompt gerado atual para o modal
    setIsModalOpen(true);  // Abre o modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);  // Fecha o modal
  };

  const handleSavePrompt = (newPrompt: string) => {
    console.log("🔎 Novo Prompt do Modal (antes de enviar para análise):", newPrompt);
    setCurrentPrompt(newPrompt);  // Atualiza o prompt com o novo valor
    setManualText(newPrompt);  // Atualiza o texto manual com o novo prompt
  };


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };
  
  
  /*const handleAnalyze = async () => {
    if (inputMode === "upload" && !file) {
      return alert("Por favor, selecione um arquivo.");
    }
    if (inputMode === "text" && !manualText.trim()) {
      return alert("Por favor, insira um texto.");
    }

    setLoading(true);
    const formData = new FormData();
    const content = inputMode === "upload" && file ? "" : manualText;

    console.log("🚀 Prompt Enviado para Análise:", prompt);
    
    formData.append("prompt", generatePrompt(content));
    if (inputMode === "upload" && file) formData.append("file", file);
    if (inputMode === "text") formData.append("text", manualText);

    try {
      const data = await analyzeContent(formData);
      setResult(parseResult(data.result));
      setTotalPoints(data.totalPoints);
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao processar a análise.");
    } finally {
      setLoading(false);
    }
  };
*/

const handleAnalyze = async () => {
  if (inputMode === "upload" && !file) {
    return alert("Por favor, selecione um arquivo.");
  }
  if (inputMode === "text" && !manualText.trim()) {
    return alert("Por favor, insira um texto.");
  }

  setLoading(true);
  const formData = new FormData();

  console.log("🚀 Prompt Enviado para Análise:", currentPrompt);
  
  formData.append("prompt", currentPrompt);  // Usar o prompt atualizado
  if (inputMode === "upload" && file) formData.append("file", file);
  if (inputMode === "text") formData.append("text", manualText);

  try {
    const data = await analyzeContent(formData);

    console.log("📌 Resposta da API:", data);
    console.log("📌 Resposta da API:", parseResult(data.result));

    setResult(parseResult(data.result));
    setTotalPoints(data.totalPoints);
    setHasAnalyzed(true);
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao processar a análise.");
  } finally {
    setLoading(false);
  }
};


   return (
    <>
    <Header />  
    <div className={styles.container}>
      <h1 className={styles.labelHeader}>Contagem de Pontos de Função</h1>
      <div className={styles.inputGroup}>
        <label className={styles.label}>Escolha uma Opção de Envio</label>

        {inputMode === "upload" ? (
  <select
    className={styles.select}
    value="upload"
    onChange={(e) => setInputMode(e.target.value)}
  >
    <option value="upload">Upload de Arquivo</option>
    <option value="text">Inserir Texto Manualmente</option>
  </select>
) : (
  <select
    className={styles.select}
    value={inputMode}
    onChange={(e) => setInputMode(e.target.value)}
  >
    <option value="upload">Upload de Arquivo</option>
    <option value="text">Inserir Texto Manual</option>
  </select>
)}
      </div>

      {inputMode === "upload" ? (
      
      <div className={styles.uploadContainer}>
        <input type="file" id="fileInput" className={styles.fileInput} onChange={handleFileChange} />
        <label htmlFor="fileInput" className={styles.uploadButton}>📁 Escolher Arquivo</label>
        {file && <span className={styles.fileName}>{file.name}</span>}
      </div>
        
      ) : (
        <textarea
          className={styles.textarea}
          placeholder="Digite ou cole o texto para análise"
          value={manualText}
          onChange={(e) => setManualText(e.target.value)}
        />
      )}

      <div className={styles.buttonContainer}>

        <button onClick={handleAnalyze} disabled={loading} className={styles.buttonAnalise}>
          {loading ? "Analisando..." : "Enviar para Análise"}
        </button>

        <button onClick={handleOpenModal} className={styles.buttonPrompt}>
            Alterar Prompt
        </button>

      </div>

        <Modal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
          onSave={handleSavePrompt} 
          currentPrompt={currentPrompt} 
        />

      {loading && (
        <div className={styles.fullscreenSpinner}>
          <div className={styles.spinner}></div>
          <p>Analisando...</p>
        </div>
      )}

      {result.functions.length > 0 ? (
        <div className={styles.preformattedText}>
          <h3>Funções Identificadas</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Descrição</th>
                <th>Complexidade</th>
                <th>Pontos</th>
              </tr>
            </thead>
            <tbody>
              {result.functions.map((func: any, index: number) => (
                <tr key={index}>
                  <td>{func.type}</td>
                  <td>{func.description}</td>
                  <td>{func.complexity}</td>
                  <td>{func.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h4 className={styles.totalPoints}>Total de Pontos de Função: {totalPoints} PF</h4>
          </div>
        ) : (
          hasAnalyzed && result.functions.length === 0 && (
            <p className={styles.noResults}>Nenhum resultado encontrado para o prompt enviado.</p>
          )
        )}
      </div>
    </>
  );
}
