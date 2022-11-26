import styles from './Card.module.css';

interface CardFooterProps {
  children: React.ReactNode;
}

export default function CardFooter(props: CardFooterProps) {
  return <div className={styles.cardFooter}>{props.children}</div>;
}
