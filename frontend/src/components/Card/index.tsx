import { FaCode, FaClipboardList } from "react-icons/fa"; // Ícones do Font Awesome
import styles from "./style.module.scss"; // Arquivo de estilo
import { useRouter } from "next/navigation"; // Hook de navegação do Next.js

// Tipagem do componente Card
type CardProps = {
  title: string;
  description: string;
  icon: React.ReactElement; // Tipo correto para ícones (React element)
  path: string;
};

// Componente funcional Card
const Card = ({ title, description, icon, path }: CardProps) => {
  const router = useRouter(); // Hook para navegação

  // Função para redirecionar para o caminho desejado
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className={styles.card} onClick={() => handleNavigation(path)}>
      <div className={styles.cardContent}>
        <div className={styles.icon}>{icon}</div> {/* Ícone dentro da div */}
        <h2 className={styles.cardTitle}>{title}</h2>
        <p className={styles.cardDescription}>{description}</p>
      </div>
    </div>
  );
};

export default Card;
