"use client";

import { useState } from "react";
import { analyzeContent } from "@/services/api";
import styles from "./style.module.scss";
import Header from "@/components/Header";
import Modal from "@/components/Modal"; 

export default function Funcao() {
  const [inputMode, setInputMode] = useState("upload");
  const [manualText, setManualText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [totalPoints, setTotalPoints] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentPrompt, setCurrentPrompt] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

/*  
  const handleAnalyze = async () => {
    if (inputMode === "upload" && !file) {
      return alert("Por favor, selecione um arquivo.");
    }
    if (inputMode === "text" && !manualText.trim()) {
      return alert("Por favor, insira um texto.");
    }
  
    setLoading(true);
    const formData = new FormData();
    const content = inputMode === "upload" && file ? "" : manualText;
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
    const content = inputMode === "upload" && file ? "" : manualText;
    formData.append("prompt", generatePrompt(content));
    
    if (inputMode === "upload" && file) {
      if (!file.type.includes("text") && !file.type.includes("pdf")) {
        setLoading(false);
        return alert("Formato de arquivo inválido. Use apenas .txt ou .pdf.");
      }
      formData.append("file", file);
    }
  
    try {
      const response = await analyzeContent(formData);
      if (!response || !response.result) {
        throw new Error("Resposta inválida do servidor.");
      }
      setResult(parseResult(response.result));
      setTotalPoints(response.totalPoints);
    } catch (error: any) {
      console.error("Erro na análise:", error);
      let errorMessage = "Erro ao processar a análise.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      alert(`Erro ao processar a análise: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  const generatePrompt = (content: string): string => {
    return `
Desenvolva um **plano de testes baseado no TDD (Test-Driven Development)** 
para a história de usário que foi encaminhada consiederando as funcionalidades, regras de negócio, 
regras de interfaces, regras de sistemas e critérios de aceite. O plano de testes deve incluir:

### 1. Estrutura do Plano de Testes
- **Cenários de Teste**: Definir os principais cenários com base na funcionalidade descrita.
- **Casos de Teste**: Para cada cenário, incluir:
  - **ID do Caso de Teste**
  - **Descrição do Caso de Teste**
  - **Pré-condições**
  - **Passos**
  - **Resultado Esperado**
- **Mapeamento com Requisitos**: Relacionar regras de negócio e critérios de aceite.
- **Validações de Interface**: Testes para mensagens e botões de navegação.
- **Testes Negativos e de Erro**: Testar entradas inválidas e cenários de erro.
- **Testes de Integração**: Comunicação com **APIs, banco de dados e sistemas externos**.

### 2. Conteúdo para análise
"""
${content}
"""

Retorne o plano de testes estruturado, considerando as melhores práticas do TDD.`;
  };

  const parseResult = (resultString: string) => {
    return { text: resultString };
  };

  /*
  const handleOpenModal = () => {
    console.log("Prompt gerado:", generatePrompt(manualText));
    setCurrentPrompt(generatePrompt(manualText));  // Passando o prompt gerado atual para o modal
    setIsModalOpen(true);  // Abre o modal
  };
  */

  const handleOpenModal = () => {
    const content = inputMode === "upload" && file ? "Arquivo selecionado: " + file.name : manualText;
    const generatedPrompt = generatePrompt(content);
    console.log("Prompt gerado:", generatedPrompt);
    setCurrentPrompt(generatedPrompt);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);  // Fecha o modal
  };

  const handleSavePrompt = (newPrompt: string) => {
    console.log("🔎 Novo Prompt do Modal (antes de enviar para análise):", newPrompt);
    setCurrentPrompt(newPrompt);  // Atualiza o prompt com o novo valor
    setManualText(newPrompt);  // Atualiza o texto manual com o novo prompt
  };


  return (
    <>
    <Header />  
    <div className={styles.container}>
      <h1 className={styles.labelHeader}>Plano de Testes</h1>
      <div className={styles.inputGroup}>
        <label className={styles.label}>Escolha uma Opção de Envio</label>
        <select 
          className={styles.select} 
          value={inputMode} 
          onChange={(e) => setInputMode(e.target.value)}>
          <option value="upload">Upload de Arquivo</option>
          <option value="text">Inserir Texto Manual</option>
        </select>
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

      {result && (
        <div className={styles.result}>
          <h3>Plano de Testes Gerado</h3>
          <pre className={styles.preformattedText}>{result.text}</pre>
        </div>
      )}
    </div>
    </>
  );
}
