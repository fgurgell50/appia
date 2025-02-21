import React, { useState, useEffect } from "react";
import styles from "./style.module.scss"; 

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newPrompt: string) => void;
  currentPrompt: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSave, currentPrompt }) => {
  const [newPrompt, setNewPrompt] = useState(currentPrompt);

  // Atualiza o estado sempre que `currentPrompt` mudar o valor
  useEffect(() => {
    if (isOpen) {
      setNewPrompt(currentPrompt);
    }
  }, [isOpen, currentPrompt]);

  const handleSave = () => {
    onSave(newPrompt);
    onClose();
  };

  return isOpen ? (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Alterar Prompt</h2>
        <textarea
          className={styles.textarea}
          value={newPrompt}
          onChange={(e) => setNewPrompt(e.target.value)}
        />
        <div className={styles.modalButtons}>
          <button onClick={onClose} className={styles.cancelButton}>
            Cancelar
          </button>
          <button onClick={handleSave} className={styles.saveButton}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default Modal;
