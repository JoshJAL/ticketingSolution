import React from 'react';
import TicketDetails from '../../components/TicketDetails/TicketDetails';
import { getTickets } from '../../functions/getTIckets';

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

export async function getStaticPaths() {
  const tickets: any = await getTickets();

  const paths = tickets.map((ticket: Ticket) => {
    return {
      params: { id: ticket.id.toString() },
    };
  });

  return {
    paths,
    fallback: false,
  }
};

export async function getStaticProps(context: any) {
  const id = context.params.id;
  const tickets: any = await getTickets();
  const ticket = tickets.find((ticket: Ticket) => ticket.id === parseInt(id));

  return {
      props: {
        ticket,
    }
  }
}

export default function Details({ ticket }: { ticket: Ticket }) {

  const creatorFirstLast = ticket.created_by.split(" ")
  const creatorFirstInitial = creatorFirstLast[0].charAt(0);
  const creatorLastInitial = creatorFirstLast[1].charAt(0);

  return (
    <TicketDetails ticket={ticket} creatorFirstInitial={creatorFirstInitial} creatorLastInitial={creatorLastInitial} />
  )
};
