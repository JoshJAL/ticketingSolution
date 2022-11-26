import { PropsWithChildren } from 'react';
import styles from './Card.module.css';

interface CardHeaderProps {
  subtitle?: string;
}

export default function CardHeader({ children: title, subtitle }: PropsWithChildren<CardHeaderProps>) {
  return (
    <div className={styles.cardHeader}>
      <div className={styles.cardHeaderTitle}>{title}</div>
      {subtitle && <div className={styles.cardHeaderSubtitle}>{subtitle}</div>}
    </div>
  );
}
