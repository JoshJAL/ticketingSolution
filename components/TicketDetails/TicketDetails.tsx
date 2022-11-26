import React from 'react';
import Ticket from '../Ticket';
import styles from './TicketDetails.module.css';

interface Ticket {
  id: number;
  created_at: string;
  title: string | null;
  description: string | null;
  picture: string | null;
  priority_level: number | string;
  complexity_level: number | string | null;
  assigned_to: string | null;
  status: string | null;
  page_url: string | null;
  reviewed_by: string | null;
  notes: string | null;
  created_by: string;
  ticketTypeId: number | null;
}

interface TicketDetailsProps {
  ticket: Ticket
  creatorFirstInitial: string
  creatorLastInitial: string
}

export default function TicketDetails({ ticket, creatorFirstInitial, creatorLastInitial }: TicketDetailsProps) {
  let priorityLevel = '';

  switch (ticket.priority_level) {
    case 0:
      priorityLevel = 'Complete when you can';
      break;
    case 1:
      priorityLevel = 'Complete this week';
      break;
    case 2:
      priorityLevel = 'Complete by tomorrow';
      break;
    case 3:
      priorityLevel = 'EMERGENCY NEEDS TO BE COMPLETED ASAP';
      break;
    default:
      priorityLevel = 'Low';
      break;
  };

  return (
    <div className={styles.ticketDetails}>
      <div className={styles.ticketDetails__header} >
        <h1>{ticket.title}</h1>
        <p>{"Created by: " + creatorFirstInitial + creatorLastInitial}</p>
      </div>
      <p><span>{"Description"}</span>{": " + ticket.description}</p>
      <p><span>{"Priority"}</span>{": " + priorityLevel}</p>
      <div className={styles.ticketDetails__image}>
        <img
        src={
                ticket.picture
                  ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/previews/${ticket.picture}`
                  : process.env.NEXT_PUBLIC_SUPABASE_URL + '/storage/v1/object/public/previews/public/noImage.png'
              }
              alt={ticket.title + " image"}
            />
      </div>
    </div>
  )
}
