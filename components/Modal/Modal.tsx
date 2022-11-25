import { CSSProperties } from 'react';
import palette from '../../styles/palette';
import styles from '../../styles/Modal.module.css';

export default function Modal({ children, styleOverride }: { children: any; styleOverride?: CSSProperties }) {
  return (
    <div
      classname={styles.modalContainer}
      style={{
        backgroundColor: palette.pageBackgroundColor,
        // you shouldn't override styles like this
        ...styleOverride,
      }}
    >
      {children}
    </div>
  );
}
