import { useState, useEffect } from "react";
import { analyzeContent } from "@/services/api";
import styles from "./style.module.scss";
import Header from "@/components/Header";
import Modal from "@/components/Modal";

export default function PlanoDeTestes() {
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [inputMode, setInputMode] = useState<string>("upload");

  const [manualText, setManualText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>({ tests: [] });
  const [totalTests, setTotalTests] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [originalPrompt, setOriginalPrompt] = useState<string>(""); // Estado para o prompt original
  const [alteredPrompt, setAlteredPrompt] = useState<string>(""); // Estado para o prompt alterado

  useEffect(() => {
    // Gera o prompt inicial baseado no texto fornecido
    const generatedPrompt = generateTestPlanPrompt(manualText);
    setOriginalPrompt(generatedPrompt);
    setAlteredPrompt(generatedPrompt); // Inicialmente, o prompt alterado é o mesmo do original
  }, [manualText]);

  const generateTestPlanPrompt = (content: string): string => {
    return `


Desenvolva um **plano de testes baseado no BDD (Behavior-Driven Development)** para 
a história de usuário fornecida, garantindo cobertura para **funcionalidades, 
regras de negócio, regras de interfaces, regras de sistemas e critérios de aceite**.

O plano de testes deve seguir a estrutura do **BDD/Gherkin**, 
facilitando a automação e a comunicação entre equipes.

### 1️⃣ **Definição dos Casos de Teste**
Cada **cenário** deve ser descrito no formato **Gherkin**:

"""
${content}
"""
Retorne o plano de testes estruturado, considerando as melhores práticas do BDD.`;
  };
    
  const parseTestPlanResult = (resultString: string) => {
    return { text: resultString };
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSavePrompt = (newPrompt: string) => {
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

      console.log("📌 Resposta da API PT:", data.result);

      setResult(parseTestPlanResult(data.result)); // Usar a função de análise do plano de testes

      setTotalTests(data.totalTests); // Supondo que a API retorne o total de testes realizados
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
        <input 
          type="file" 
          id="fileInput" 
          className={styles.fileInput} 
          onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
        />
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
          currentPrompt={alteredPrompt} // Passa o prompt alterado para o modal
        />

      {loading && (
        <div className={styles.fullscreenSpinner}>
          <div className={styles.spinner}></div>
        </div>
      )}

     
      {hasAnalyzed && result.text ? (
        <div className={styles.result}>
          <h4>Plano de Testes Gerado</h4>
          <pre className={styles.preformattedText}>{result.text}</pre>
        </div>
      ) : hasAnalyzed ? (
        <p className={styles.noResults}>Nenhum Resultado para essa consulta.</p>
      ) : null}

    </div>
    </>
  );
}

