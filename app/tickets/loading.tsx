import LoadingSpinner from '@/components/LoadingSpinner';
import styles from './tickets.module.css';

export default function TicketsLoading() {
  return (
    <div className={styles.loading}>
      <LoadingSpinner />
    </div>
  );
}
