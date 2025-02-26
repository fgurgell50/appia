import { FaCode, FaClipboardList } from "react-icons/fa"; 
import styles from "./index.module.scss";
import Header from "@/components/Header";
import Card from "@/components/Card"; 

export default function Home() {
  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.cardGrid}>
          <Card
            title="Contagem de Pontos de Função"
            description="Analise o conteúdo e calcule os pontos de função de acordo com as regras."
            icon={<FaCode />}
            path="/funcao"
          />
          <Card
            title="Plano de Testes"
            description="Gere um plano de testes detalhado com base nos requisitos fornecidos."
            icon={<FaClipboardList />}
            path="/planotestes"
          />
        </div>
      </div>
    </>
  );
}
