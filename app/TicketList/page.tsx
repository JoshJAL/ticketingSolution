import supabase from '../../utils/supabase';
import TicketCard from '../../components/Ticket/TicketCard';

export const revalidate = 0;

export default async function TicketListPage() {
  // TODO: when auth is added, filter by signed in user
  const { data: tickets } = await supabase.from('tickets').select('*');
  if (!tickets) {
    return <p>No tickets found</p>;
  }

  return tickets.map((ticket) => <TicketCard key={ticket.id} ticket={ticket} />);
}
