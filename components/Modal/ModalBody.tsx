// modal body component
import React from 'react';
import styles from './Modal.module.css';
interface ModalBodyProps {
  children: React.ReactNode;
}
export default function ModalBody(props: ModalBodyProps) {
  return <div className={styles.modalBody}>{props.children}</div>;
}
