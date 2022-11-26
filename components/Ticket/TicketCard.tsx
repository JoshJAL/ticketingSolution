import Link from 'next/link';
import Card from '@/components/Card/Card';
import CardBody from '@/components/Card/CardBody';
import CardFooter from '@/components/Card/CardFooter';
import CardHeader from '@/components/Card/CardHeader';

import type { Ticket } from '@/types/ticket';

import styles from './Ticket.module.css';

interface TicketCardProps {
  ticket: Ticket;
}

export default function TicketCard({ ticket }: TicketCardProps) {
  return (
    <Card>
      <CardHeader>
        <Link href={`/ticket/${ticket.id}`}>{ticket.title}</Link>
      </CardHeader>
      <CardBody>
        <div className={styles.ticketCardItem}>
          <div className={styles.ticketCardItemLabel}>Description</div>
          <div className={styles.ticketCardItemValue}>{ticket.description}</div>
        </div>
        <div className={styles.ticketCardItem}>
          <div className={styles.ticketCardItemLabel}>Status</div>
          <div className={styles.ticketCardItemValue}>{ticket.status}</div>
        </div>
        <div className={styles.ticketCardItem}>
          <div className={styles.ticketCardItemLabel}>Type</div>
          <div className={styles.ticketCardItemValue}>{ticket.ticketType.value}</div>
        </div>
      </CardBody>
      <CardFooter>
        <div className={styles.ticketCardFooterItem}>
          <div className={styles.ticketCardFooterItemLabel}>Priority: {ticket.priority_level}</div>
        </div>
      </CardFooter>
    </Card>
  );
}
