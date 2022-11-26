import { PropsWithChildren } from 'react';
import styles from './Card.module.css';

type Props = {
  children: React.ReactNode;
};

export default function Card({ children }: PropsWithChildren<Props>) {
  return <div className={styles.card}>{children}</div>;
}
