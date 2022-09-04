import { faTicket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useMediaQueries from 'media-queries-in-react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { OnMouseEnter, onMouseOut } from '../functions/MouseEvents';
import supabase from "./supabase";

export default function Ticket() {
  const router = useRouter();
  const mediaQueries = useMediaQueries({
    under768: '(max-width: 768px)',
  });

  const [tickets, setTickets] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  async function getTickets() {
    setLoading(true);
    let { data: tickets, error } = await supabase
      .from('tickets')
      .select('*')
    setTickets(tickets);
    setLoading(false);
  }

  useEffect(() => {
    getTickets();
  }, []);

  return (
    loading ?
      <div style={{ width: "100%" }}>
        <p style={{ fontSize: 48, fontWeight: 700, fontStyle: "oblique", margin: "50% 0 0 0" }}>Grabbing tickets...</p>
      </div>
      :
      tickets.length > 0 ?
        tickets.map((ticket: any, index: number) => (
          <div key={ticket.id} style={{ textAlign: "center", border: "1px solid rgba(255, 255, 255, 0.5)", width: mediaQueries.under768 ? "75%" : "30%", height: "fit-content", display: "flex", alignItems: "center", justifyContent: "center", margin: mediaQueries.under768 ? "21px 15px" : "25px 1%", flexDirection: "column", padding: "12px", color: "white", borderRadius: "15px", boxShadow: "4px 2px 9px 1px #888888" }}>
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
          <div style={{ display: "flex", alignItems: "center", flexDirection: "column", margin: "100px 0" }}>
            <p style={{ fontSize: 24, fontWeight: 600 }}>No tickets</p>
            <a onClick={() => router.push('/')} onMouseEnter={(e) => OnMouseEnter(e)} onMouseOut={(e) => onMouseOut(e)} style={{ cursor: "pointer", backgroundColor: "transparent", border: "1px solid rgba(255, 255, 255, 0.5)", padding: "10px", borderRadius: "5px", fontWeight: 700, fontSize: 24 }}>Submit a ticket</a>
          </div>
        )
  )
}