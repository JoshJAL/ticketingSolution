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
      <CardBody>{ticket.description}</CardBody>
      <CardFooter>
        <div className={styles.ticketCardFooterItem}>
          <div className={styles.ticketCardFooterItemLabel}>Status</div>
          <div className={styles.ticketCardFooterItemValue}>{ticket.status}</div>
        </div>
        <div className={styles.ticketCardFooterItem}>
          <div className={styles.ticketCardFooterItemLabel}>Priority</div>
          <div className={styles.ticketCardFooterItemValue}>{ticket.priority_level}</div>
        </div>
        <div className={styles.ticketCardFooterItem}>
          <div className={styles.ticketCardFooterItemLabel}>Type</div>
          <div className={styles.ticketCardFooterItemValue}>{ticket.ticketType}</div>
        </div>
      </CardFooter>
    </Card>
  );
}
