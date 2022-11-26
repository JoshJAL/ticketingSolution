import styles from './Modal.module.css';

interface ModalFooterProps {
  secondaryText?: string;
  primaryText: string;
  onSecondary?: () => void;
  onPrimary: () => void;
}

export default function ModalFooter(props: ModalFooterProps) {
  return (
    <div className={styles.modalFooter}>
      {props.onSecondary && (
        <button className={styles.modalFooterSecondaryButton} onClick={props.onSecondary}>
          {props.secondaryText}
        </button>
      )}
      {props.onPrimary && (
        <button className={styles.modalFooterPrimaryButton} onClick={props.onPrimary}>
          {props.primaryText}
        </button>
      )}
    </div>
  );
}
