import { FaCode, FaClipboardList } from "react-icons/fa"; // Ícones do Font Awesome
import { useRouter } from "next/navigation";
import styles from "./index.module.scss";
import Header from "@/components/Header";

export default function Home() {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <>
    <Header />
    <div className={styles.container}>
      <div className={styles.cardGrid}>
        <div className={styles.card} onClick={() => handleNavigation("/funcao")}>
          <div className={styles.cardContent}>
            <FaCode className={styles.icon} />
            <h2 className={styles.cardTitle}>Contagem de Pontos de Função</h2>
            <p className={styles.cardDescription}>
              Analise o conteúdo e calcule os pontos de função de acordo com as regras.
            </p>
          </div>
        </div>

        <div className={styles.card} onClick={() => handleNavigation("/planotestes")}>
          <div className={styles.cardContent}>
            <FaClipboardList className={styles.icon} />
            <h2 className={styles.cardTitle}>Plano de Testes</h2>
            <p className={styles.cardDescription}>
              Gere um plano de testes detalhado com base nos requisitos fornecidos.
            </p>
          </div>
        </div>
      </div>
    </div>
    </>

  );
}
