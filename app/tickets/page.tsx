import supabase from '@/utils/supabase';
import TicketCard from '@/components/Ticket/TicketCard';
import { Ticket } from '@/types/ticket';
import { PostgrestResponse } from '@supabase/supabase-js';

export const revalidate = 0;

export default async function TicketsPage() {
  // TODO: add filter by assigned_to
  const supRes: PostgrestResponse<Ticket> = await supabase.from('tickets').select(`
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
    ticketType: ticketTypeId ( value )
  `);
  const { data: tickets }: { data: Ticket[] | null } & PostgrestResponse<Ticket> = supRes;

  if (!tickets || !tickets.length) {
    return <p>No tickets found</p>;
  }

  return tickets.map((ticket) => <TicketCard key={ticket.id} ticket={ticket} />);
}
