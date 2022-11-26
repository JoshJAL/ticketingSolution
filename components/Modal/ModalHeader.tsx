import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Modal.module.css';
interface ModalHeaderProps {
  title: string;
  onClose: () => void;
}

export default function ModalHeader(props: ModalHeaderProps) {
  return (
    <div className={styles.modalHeader}>
      <div className={styles.modalHeaderTitle}>{props.title}</div>
      <div className={styles.modalHeaderCloseButton}>
        <button onClick={props.onClose}>
          <FontAwesomeIcon icon='xmark' />
        </button>
      </div>
    </div>
  );
}
