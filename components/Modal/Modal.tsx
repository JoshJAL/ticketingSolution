import { CSSProperties, PropsWithChildren } from 'react';
import styles from './Modal.module.css';

export default function Modal({ children }: PropsWithChildren<{ style?: CSSProperties }>) {
  return <div className={styles.modalContainer}>{children}</div>;
}
