import supabase from '@/utils/supabase';
import TicketCard from '@/components/Ticket/TicketCard';
import { Ticket } from '@/types/ticket';

export const revalidate = 0;

export default async function TicketListPage() {
  // TODO: when auth is added, filter by signed in user
  const { data: tickets }: { data: Ticket[] | null } = await supabase.from('tickets').select(`
    id,
    title,
    description,
    picture,
    priority_level,
    status,
    assigned_to,
    complexity_level,
    reviewed_by,
    notes,
    created_by,
    ticketType ( value )
  `);
  if (!tickets) {
    return <p>No tickets found</p>;
  }

  return tickets.map((ticket) => <TicketCard key={ticket.id} ticket={ticket} />);
}
