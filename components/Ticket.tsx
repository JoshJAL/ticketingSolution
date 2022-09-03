import useMediaQueries from 'media-queries-in-react';
import React, { useEffect, useState } from 'react'
import { OnMouseEnter, onMouseOut } from '../functions/MouseEvents';
import supabase from "./supabase";

export default function Ticket() {
  const mediaQueries = useMediaQueries({
    under768: '(max-width: 768px)',
  });

  const [tickets, setTickets] = useState<any>([]);

  async function getTickets() {
    let { data: tickets, error } = await supabase
      .from('tickets')
      .select('*')
    setTickets(tickets);
  }

  useEffect(() => {
    getTickets();
  }, []);

  return (
    tickets ?
      tickets.map((ticket: any, index: number) => (
        <div key={ticket.id} style={{ textAlign: "center", border: "1px solid rgba(255, 255, 255, 0.5)", width: mediaQueries.under768 ? "75%" : "15%", height: "fit-content", display: "flex", alignItems: "center", justifyContent: "center", margin: mediaQueries.under768 ? "21px 15px" : "50px 150px", flexDirection: "column", padding: "12px", color: "white", borderRadius: "15px", boxShadow: "4px 2px 9px 1px #888888" }}>
          <p onMouseOut={(e) => onMouseOut(e)} onMouseEnter={(e) => OnMouseEnter(e)} style={{ marginLeft: 'auto', marginBottom: "auto", marginRight: "6px", border: "1px solid rgba(255, 255, 255, 0.5)", padding: "4px 10px", borderRadius: "50%", cursor: "pointer" }}>{ticket.complexity_level ? ticket.complexity_level : "?"}</p>
          <p style={{ fontWeight: 700, fontSize: 24, textAlign: "center" }}>{ticket.title}</p>
          <p style={{ fontWeight: 500, fontSize: 18 }}>{ticket.description}</p>
          <div style={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "200px", margin: mediaQueries.under768 ? "0" : "30% 0" }}>
            <img style={{ maxWidth: "45%" }} src={ticket.picture ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/ticket-images/${ticket.picture}` : "https://bzclbrsgarmfqbtxbzxz.supabase.co/storage/v1/object/public/ticket-images/public/noImage.jpg"} />
          </div>
          <p style={{ textAlign: "center", fontWeight: 500, fontSize: 18 }}>{ticket.priority_level}</p>
          <button onMouseOut={(e) => onMouseOut(e)} onMouseEnter={(e) => OnMouseEnter(e)} style={{ background: "transparent", border: "1px solid rgba(255, 255, 255, 0.5)", borderRadius: "6px", padding: '5px', cursor: "pointer", fontSize: 18, fontWeight: 500 }}>Claim</button>
        </div>
      ))
      :
      (
        <p>No Tickets</p>
      )
  )
}