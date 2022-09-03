import React, { useEffect, useState } from 'react'
import supabase from "./supabase";

export default function Ticket() {
  const [tickets, setTickets] = useState<any>([]);

  async function getTickets() {
    let { data: tickets, error } = await supabase
      .from('tickets')
      .select('*')
    setTickets(tickets);
    console.log(tickets)
    if (tickets) {
      let something = tickets.map((ticket: any) => {
        console.log(ticket.title)
      })
    }
  }

  useEffect(() => {
    getTickets();
  }, [])

  return (
    tickets ?
      tickets.map((ticket: any) => (
        <div key={ticket.id}>
          <p style={{ color: "white" }}>{ticket.title}</p>
          <p>{ticket.description}</p>
          <p>{ticket.description}</p>
        </div>
      ))
      :
      (
        <p>No Tickets</p>
      )
  )
}