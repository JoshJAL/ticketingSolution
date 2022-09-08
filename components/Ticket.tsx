import useMediaQueries from 'media-queries-in-react';
import { useRouter } from 'next/router';
import React, { CSSProperties, useEffect, useState } from 'react'
import { OnMouseEnter, OnMouseOut } from '../functions/MouseEvents';
import supabase from "./supabase";

export default function Ticket() {
  const router = useRouter();
  const mediaQueries = useMediaQueries({
    under768: '(max-width: 768px)',
  });

  const [tickets, setTickets] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  async function getTickets() {
    let { data: updatedTickets, error } = await supabase
      .from('tickets')
      .select('*')
    if (tickets !== updatedTickets) {
      setTickets(updatedTickets);
    }
    setLoading(false)
  }



  useEffect(() => {
    getTickets();
    const authenticatedUser = supabase.auth.user()
    if (!authenticatedUser) {
      window.location.href = '/login';
    }
    setUser(authenticatedUser);
  }, []);

  const priorityLevelTitleStyles: CSSProperties = {
    fontSize: 24,
    fontWeight: 700,
    textDecoration: "underline",
    textAlign: "center",
    marginBottom: "10px"
  }

  let sorted = [];
  if (tickets) {
    const firstSort = tickets.sort((a: any, b: any) => {
      return a.id - b.id
    }).reverse();
    sorted = firstSort.sort((a: any, b: any) => {
      return a.priority_level - b.priority_level;
    })
  }

  async function handleClaimTicket(e: any, ticket: any, setClaiming: Function, setClaimed: Function) {
    e.preventDefault();
    getTickets();
    setClaiming(true)
    if (user.user_metadata.typeOfUser === "admin" && !ticket.assigned_to) {
      const { data, error } = await supabase
        .from('tickets')
        .update({ assigned_to: user.user_metadata.name })
        .eq("id", ticket.id)
    }
    setClaiming(false)
    setClaimed(true);
    getTickets();
  }

  return (
    loading ?
      <div style={{ width: "100%", height: "100%", margin: "20px" }}>
        <p style={{ fontSize: 48, fontWeight: 700, fontStyle: "oblique", textAlign: "center" }}>Grabbing tickets...</p>
      </div>
      :
      sorted.length > 0 ?
        sorted.map((ticket: any) => {
          return (
            <div style={{ width: "100%", display: "flex", flexDirection: "column", margin: "0 0 40px 0" }} key={ticket.id}>
              <EmergencyTicket tickets={tickets} mediaQueries={mediaQueries} priorityLevelTitleStyles={priorityLevelTitleStyles} handleClaimTicket={handleClaimTicket} user={user} />
              <HighTicket tickets={tickets} mediaQueries={mediaQueries} priorityLevelTitleStyles={priorityLevelTitleStyles} handleClaimTicket={handleClaimTicket} user={user} />
              <MediumTicket tickets={tickets} mediaQueries={mediaQueries} priorityLevelTitleStyles={priorityLevelTitleStyles} handleClaimTicket={handleClaimTicket} user={user} />
              <LowTicket tickets={tickets} mediaQueries={mediaQueries} priorityLevelTitleStyles={priorityLevelTitleStyles} handleClaimTicket={handleClaimTicket} user={user} />
            </div>
          )
        }).reverse().slice(0, 1)
        :
        (
          <div style={{ display: "flex", alignItems: "center", flexDirection: "column", margin: "100px 0" }}>
            <p style={{ fontSize: 24, fontWeight: 600 }}>No tickets</p>
            <button className="redirectButton" onClick={() => router.push('/')}>Submit a ticket</button>
          </div >
        )
  )
}

function EmergencyTicket({ tickets, mediaQueries, priorityLevelTitleStyles, handleClaimTicket, user }: { tickets: any, mediaQueries: any, priorityLevelTitleStyles: CSSProperties, handleClaimTicket: Function, user: any }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", alignItems: 'center', justifyContent: 'center' }}>
      <EmergencyTicketTitle tickets={tickets} priorityLevelTitleStyles={priorityLevelTitleStyles} />
      <div style={{ display: "flex", width: "100%", flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
        {tickets.map((ticket: any) => {
          if (ticket.priority_level === 3) {
            return (
              <div key={ticket.id} style={{ margin: mediaQueries.under768 ? "21px 15px" : "25px 1%", width: mediaQueries.under768 ? "75%" : "30%" }}>
                <ActualTicket ticket={ticket} mediaQueries={mediaQueries} user={user} handleClaimTicket={handleClaimTicket} setPriorityLevel={3} />
              </div>
            )
          }
        })
        }
      </div>
    </div>
  )
}

function ActualTicket({ ticket, mediaQueries, user, handleClaimTicket, setPriorityLevel }: { ticket: any, mediaQueries: any, user: any, handleClaimTicket: Function, setPriorityLevel: number }) {
  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);
  return (
    ticket.priority_level === setPriorityLevel ?
      (
        <div className='ticketList-ticket' key={ticket.id} >
          <div style={{ textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", margin: "0 12px" }}>
            {
              user.user_metadata.typeOfUser === "admin" ? <p style={{ marginLeft: 'auto', marginBottom: "auto", marginRight: "6px", border: "1px solid black", padding: "4px 10px", borderRadius: "50%" }}>{ticket.complexity_level ? ticket.complexity_level : "?"}</p>
                :
                null
            }
            <p style={{ fontWeight: 700, fontSize: 24, textAlign: "center" }}>{ticket.title}</p>
            <p style={{ fontWeight: 500, fontSize: 18, textAlign: "center", wordBreak: "break-all" }}>{ticket.description}</p>
            <div style={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", maxHeight: "fit-content", margin: "0 0 20px 0", overflow: "hidden" }}>
              <img style={{ maxWidth: "45%" }} src={ticket.picture ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/ticket-images/${ticket.picture}` : "https://bzclbrsgarmfqbtxbzxz.supabase.co/storage/v1/object/public/ticket-images/public/noImage.png"} />
            </div>
            {
              user.user_metadata.typeOfUser === "admin" && !ticket.assigned_to ?
                <button onClick={(e) => handleClaimTicket(e, ticket, setClaiming, setClaimed)}>{claiming ? "Claiming..." : claimed ? "Claimed!" : "Claim"}</button>
                :
                <p style={{ fontWeight: 500, fontSize: 18, textAlign: "center", margin: "0 0 6px 0" }}>{ticket.assigned_to ? `Assigned to: ${ticket.assigned_to}` : "Not yet assigned"}</p>
            }
          </div>
        </div>
      ) : null
  )
}

function EmergencyTicketTitle({ tickets, priorityLevelTitleStyles }: { tickets: any, priorityLevelTitleStyles: CSSProperties }) {
  let titleIndex: any = []
  return (
    tickets.map((ticket: any, index: number) => {
      if (ticket.priority_level === 3) {
        titleIndex.push(index)
        return (
          <p key={index} style={priorityLevelTitleStyles}><span style={{ color: "#a60505", textDecoration: "underline" }}>EMERGENCY TICKETS</span></p>

        )
      }
    }).slice(0, titleIndex[0] + 1)
  )
}

function HighTicket({ tickets, mediaQueries, priorityLevelTitleStyles, user, handleClaimTicket }: { tickets: any, mediaQueries: any, priorityLevelTitleStyles: CSSProperties, user: any, handleClaimTicket: Function }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", alignItems: 'center', justifyContent: 'center' }}>
      <HighTicketTitle tickets={tickets} priorityLevelTitleStyles={priorityLevelTitleStyles} />
      <div style={{ display: "flex", width: "100%", flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
        {tickets.map((ticket: any, index: number) => {
          if (ticket.priority_level === 2) {
            return (
              <div key={ticket.id} style={{ margin: mediaQueries.under768 ? "21px 15px" : "25px 1%", width: mediaQueries.under768 ? "75%" : "30%" }}>
                <ActualTicket ticket={ticket} mediaQueries={mediaQueries} user={user} handleClaimTicket={handleClaimTicket} setPriorityLevel={2} />
              </div>
            )
          }
        })
        }
      </div>
    </div>
  )
}

function HighTicketTitle({ tickets, priorityLevelTitleStyles }: { tickets: any, priorityLevelTitleStyles: CSSProperties }) {
  let titleIndex: any = []
  return (
    tickets.map((ticket: any, index: number) => {
      if (ticket.priority_level === 2) {
        titleIndex.push(index)
        return (
          <p key={index} style={priorityLevelTitleStyles}>Priority Tickets, need to be completed ASAP</p>
        )
      }
    }).slice(0, titleIndex[0] + 1)
  )
}

function MediumTicket({ tickets, mediaQueries, priorityLevelTitleStyles, user, handleClaimTicket }: { tickets: any, mediaQueries: any, priorityLevelTitleStyles: CSSProperties, user: any, handleClaimTicket: Function }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", alignItems: 'center', justifyContent: 'center' }}>
      <MediumTicketTitle tickets={tickets} priorityLevelTitleStyles={priorityLevelTitleStyles} />
      <div style={{ display: "flex", width: "100%", flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
        {tickets.map((ticket: any, index: number) => {
          if (ticket.priority_level === 1) {
            return (
              <div key={ticket.id} style={{ margin: mediaQueries.under768 ? "21px 15px" : "25px 1%", width: mediaQueries.under768 ? "75%" : "30%" }}>
                <ActualTicket ticket={ticket} mediaQueries={mediaQueries} user={user} handleClaimTicket={handleClaimTicket} setPriorityLevel={1} />
              </div>
            )
          }
        })
        }
      </div>
    </div>
  )
}

function MediumTicketTitle({ tickets, priorityLevelTitleStyles }: { tickets: any, priorityLevelTitleStyles: CSSProperties }) {
  let titleIndex: any = []
  return (
    tickets.map((ticket: any, index: number) => {
      if (ticket.priority_level === 1) {
        titleIndex.push(index)
        return (
          <p key={index} style={priorityLevelTitleStyles}>Need to be completed by the end of the week</p>
        )
      }
    }).slice(0, titleIndex[0] + 1)
  )
}

function LowTicket({ tickets, mediaQueries, priorityLevelTitleStyles, user, handleClaimTicket }: { tickets: any, mediaQueries: any, priorityLevelTitleStyles: CSSProperties, user: any, handleClaimTicket: Function }) {
  const router = useRouter();

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", alignItems: 'center', justifyContent: 'center' }}>
      <LowTicketTitle tickets={tickets} priorityLevelTitleStyles={priorityLevelTitleStyles} />
      <div style={{ display: "flex", width: "100%", flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
        {tickets.map((ticket: any, index: number) => {
          if (ticket.priority_level === 0) {
            return (
              <div key={ticket.id} style={{ margin: mediaQueries.under768 ? "21px 15px" : "25px 1%", width: mediaQueries.under768 ? "75%" : "30%" }}>
                <ActualTicket ticket={ticket} mediaQueries={mediaQueries} user={user} handleClaimTicket={handleClaimTicket} setPriorityLevel={0} />
              </div>
            )
          }
        })
        }
      </div>
    </div>
  )
}

function LowTicketTitle({ tickets, priorityLevelTitleStyles }: { tickets: any, priorityLevelTitleStyles: CSSProperties }) {
  let titleIndex: any = []
  return (
    tickets.map((ticket: any, index: number) => {
      if (ticket.priority_level === 0) {
        titleIndex.push(index)
        return (
          <p key={index} style={priorityLevelTitleStyles}>Low priority tickets</p>
        )
      }
    }).slice(0, titleIndex[0] + 1)
  )
}