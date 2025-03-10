import Link from "next/link";
import Image from "next/image";
import { FiHome, FiCpu, FiClipboard } from "react-icons/fi"; // Ícones do pacote react-icons
import styles from "./style.module.scss";

export default function Header() {
  return (
    <header className={styles.header}>
        <div className={styles.logoContainer}>
        <Image 
          src="/favicon.png" // Caminho dentro da pasta public
          alt="ELLA Logo"
          width={30} // Ajuste conforme necessário
          height={30} // Ajuste conforme necessário
          className={styles.logo}
        />
        <div className={styles.ellaWrapper}>
            <span className={styles.ella}>ELLA</span>
        </div>
        <span className={styles.tagline}>
            A IA a favor do seu futuro
        </span>
        </div>

      <nav className={styles.nav}>
        <Link href="/">
          <FiHome size={20} className={styles.icon} />
          Início
        </Link>
        <Link href="/funcao">
          <FiCpu size={20} className={styles.icon} />
          Contagem de Pontos de Função
        </Link>
        <Link href="/planotestes">
          <FiClipboard size={20} className={styles.icon} />
          Plano de Testes
        </Link>
      </nav>
    </header>
  );
}
