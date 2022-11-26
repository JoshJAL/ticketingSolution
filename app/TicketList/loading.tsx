import LoadingSpinner from '@/components/LoadingSpinner';
import styles from './ticketlist.module.css';

export default function TicketListLoading() {
  return (
    <div className={styles.loading}>
      <LoadingSpinner />
    </div>
  );
}
