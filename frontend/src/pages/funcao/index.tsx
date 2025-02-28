import { useState, useEffect } from "react";
import { analyzeContent } from "@/services/api";
import styles from "./style.module.scss";
import Header from "@/components/Header";
import Modal from "@/components/Modal";

export default function Funcao() {
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [inputMode, setInputMode] = useState<string>("upload");

  const [manualText, setManualText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>({ functions: [] });
  const [totalPoints, setTotalPoints] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [originalPrompt, setOriginalPrompt] = useState<string>(""); // Estado para o prompt original
  const [alteredPrompt, setAlteredPrompt] = useState<string>(""); // Estado para o prompt alterado

  useEffect(() => {
    // Gera o prompt inicial baseado no texto fornecido
    const generatedPrompt = generatePrompt(manualText);
    setOriginalPrompt(generatedPrompt);
    setAlteredPrompt(generatedPrompt); // Inicialmente, o prompt alterado é o mesmo do original
  }, [manualText]);

  const generatePrompt = (content: string): string => {
    return `

    Você é um especialista em **Análise de Pontos de Função (APF)** conforme o **Manual de Práticas de Contagem de Pontos de Função (CPM - IFPUG)**.  
Sua tarefa é **analisar o conteúdo fornecido**, identificando todas as **funções transacionais e funções de dados**, classificando sua complexidade e calculando o total de **Pontos de Função (PF)**.

## **🔹 Regras da Contagem**
- A contagem deve seguir os **requisitos funcionais do usuário**, considerando:  
  - **Funções Transacionais:**  
    - **Entrada Externa (EE)**  
    - **Saída Externa (SE)**  
    - **Consulta Externa (CE)**  
  - **Funções de Dados:**  
    - **Arquivo Lógico Interno (ALI)**  
    - **Arquivo de Interface Externa (AIE)**  
- Classifique a complexidade de cada função (**Baixa, Média, Alta**) conforme o número de **Elementos de Dados (DET)** e **Arquivos Referenciados (AR) ou Registros Lógicos Internos (RLI)**.  
- Utilize a **tabela de complexidade oficial do CPM - IFPUG** para atribuir a pontuação correta.  

## **🔹 Conteúdo para Análise**
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
   
📢 **Atenção**:  
- Retorne a análise exclusivamente no formato solicitado.  
- Não inclua explicações adicionais.  
- Caso existam funções não identificáveis, liste-as separadamente como "Possíveis Funções Não Classificadas" para revisão.  
    
    `;
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
    // Passa o prompt alterado (que inicialmente é o mesmo do original) para o modal
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSavePrompt = (newPrompt: string) => {
    // Atualiza o estado do prompt alterado
    setAlteredPrompt(newPrompt);
  };

  const handleAnalyze = async () => {
    if (inputMode === "upload" && !file) {
      return alert("Por favor, selecione um arquivo.");
    }
    if (inputMode === "text" && !manualText.trim()) {
      return alert("Por favor, insira um texto.");
    }

    setLoading(true);
    const formData = new FormData();

    // Se o prompt foi alterado, enviaremos o alteredPrompt. Caso contrário, enviaremos o originalPrompt.
    const promptToSend = alteredPrompt === originalPrompt ? originalPrompt : alteredPrompt;

    console.log("🚀 Prompt Enviado para Análise:", promptToSend);

    formData.append("prompt", promptToSend); // Usa o prompt que foi gerado ou alterado
    if (inputMode === "upload" && file) formData.append("file", file);
    if (inputMode === "text") formData.append("text", manualText);

    try {
      const data = await analyzeContent(formData);

      console.log("📌 Resposta da API:", data);
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

          <select
            className={styles.select}
            value={inputMode}
            onChange={(e) => setInputMode(e.target.value)}
          >
            <option value="upload">Upload de Arquivo</option>
            <option value="text">Inserir Texto Manual</option>
          </select>
        </div>

        {inputMode === "upload" ? (
          <div className={styles.uploadContainer}>
            <input
              type="file"
              id="fileInput"
              className={styles.fileInput}
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            />
            <label htmlFor="fileInput" className={styles.uploadButton}>
              📁 Escolher Arquivo
            </label>
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
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className={styles.buttonAnalise}
          >
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
          currentPrompt={alteredPrompt} // Passa o prompt alterado para o modal
        />

        {loading && (
          <div className={styles.fullscreenSpinner}>
            <div className={styles.spinner}></div>
          </div>
        )}

        {result.functions.length > 0 ? (
          <div className={styles.tableContainer}>
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
          hasAnalyzed &&
          result.functions.length === 0 && (
            <p className={styles.noResults}>Nenhum resultado encontrado para o prompt enviado.</p>
          )
        )}
      </div>
    </>
  );
}
