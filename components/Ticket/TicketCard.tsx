import Card from '../Card/Card';
import CardBody from '../Card/CardBody';
import CardFooter from '../Card/CardFooter';
import styles from './Ticket.module.css';
import { Ticket } from '../../types/ticket';

import CardHeader from '../Card/CardHeader';
import Link from 'next/link';

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
        <div className={styles.ticketCardFooter}>
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
        </div>
      </CardFooter>
    </Card>
  );
}
