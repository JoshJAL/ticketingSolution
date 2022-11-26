// card body
import styles from './Card.module.css';

interface CardBodyProps {
  children: React.ReactNode;
}

export default function CardBody(props: CardBodyProps) {
  return <div className={styles.cardBody}>{props.children}</div>;
}
