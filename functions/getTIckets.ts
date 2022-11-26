import supabase from "./supabase";

export async function getTickets() {
  let { data: tickets, error } = await supabase
  .from('tickets')
  .select('*')
  return tickets;
}
