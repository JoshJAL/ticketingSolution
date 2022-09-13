import useMediaQueries from 'media-queries-in-react';
import { useRouter } from 'next/router';
import React, { CSSProperties, useEffect, useState } from 'react'
import LoadingSpinner from './LoadingSpinner/LoadingSpinner';
import supabase from "./supabase";
import { useUser } from '../context/user';

export default function Ticket() {
  const { user } = useUser();
  const router = useRouter();
  const mediaQueries = useMediaQueries({
    under768: '(max-width: 768px)',
  });

  const [tickets, setTickets] = useState<any>([]);
  const [loading, setLoading] = useState(true);

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
    if (!user) {
      window.location.href = '/login';
    }
    getTickets();
  }, []);

  function downloadFile(ticket: any) {
    window.location.href = `${encodeURI(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/ticket-images/${ticket.picture}`)}`
  }

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
    await getTickets();
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

  setTimeout(() => {
    getTickets();
  }, 720000)

  return (
    loading || !user ?
      <div style={{ width: "100%", height: "50vh", margin: "20px", display: "flex", alignItems: "center", justifyContent: "center", transform: "scale(3)" }}>
        <LoadingSpinner />
      </div>
      :
      sorted.length > 0 ?
        sorted.map((ticket: any) => {
          return (
            <div style={{ width: "100%", display: "flex", flexDirection: "column", margin: "0 0 40px 0" }} key={ticket.id}>
              <EmergencyTicket downloadFile={downloadFile} tickets={tickets} mediaQueries={mediaQueries} priorityLevelTitleStyles={priorityLevelTitleStyles} handleClaimTicket={handleClaimTicket} user={user} getTickets={getTickets} />
              <HighTicket downloadFile={downloadFile} tickets={tickets} mediaQueries={mediaQueries} priorityLevelTitleStyles={priorityLevelTitleStyles} handleClaimTicket={handleClaimTicket} user={user} getTickets={getTickets} />
              <MediumTicket downloadFile={downloadFile} tickets={tickets} mediaQueries={mediaQueries} priorityLevelTitleStyles={priorityLevelTitleStyles} handleClaimTicket={handleClaimTicket} user={user} getTickets={getTickets} />
              <LowTicket downloadFile={downloadFile} tickets={tickets} mediaQueries={mediaQueries} priorityLevelTitleStyles={priorityLevelTitleStyles} handleClaimTicket={handleClaimTicket} user={user} getTickets={getTickets} />
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

function EmergencyTicket({ tickets, mediaQueries, priorityLevelTitleStyles, handleClaimTicket, user, downloadFile, getTickets }: { tickets: any, mediaQueries: any, priorityLevelTitleStyles: CSSProperties, handleClaimTicket: Function, user: any, downloadFile: Function, getTickets: Function }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", alignItems: 'center', justifyContent: 'center' }}>
      <EmergencyTicketTitle tickets={tickets} priorityLevelTitleStyles={priorityLevelTitleStyles} />
      <div style={{ display: "flex", width: "100%", flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
        {tickets.map((ticket: any) => {
          if (ticket.priority_level === 3) {
            return (
              <div key={ticket.id} style={{ margin: mediaQueries.under768 ? "21px 15px" : "25px 1%", width: mediaQueries.under768 ? "75%" : "30%" }}>
                <ActualTicket downloadFile={downloadFile} ticket={ticket} user={user} handleClaimTicket={handleClaimTicket} setPriorityLevel={3} getTickets={getTickets} />
              </div>
            )
          }
        })
        }
      </div>
    </div>
  )
}

function ActualTicket({ ticket, user, handleClaimTicket, setPriorityLevel, downloadFile, getTickets }: { ticket: any, user: any, handleClaimTicket: Function, setPriorityLevel: number, downloadFile: Function, getTickets: Function }) {
  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(ticket.title);
  const [newDescription, setNewDescription] = useState(ticket.description);
  const [newFile, setNewFile] = useState("");
  const [newFileUrl, setNewFileUrl] = useState("");
  const [submittingEdits, setSubmittingEdits] = useState(false);

  async function handleEdit() {
    editing ? setEditing(false) : setEditing(true);
  }

  function handleFileUrl(e: any) {
    setNewFile(e.target.files[0]);
    setNewFileUrl(`public/${e.target.files[0].name}`);
  }

  async function handleSubmitNoFileChange() {
    const { data, error } = await supabase
      .from('tickets')
      .update({ title: newTitle, description: newDescription })
      .eq('id', ticket.id)
  }

  async function handleSubmit() {
    setSubmittingEdits(true)
    if (newFile && newFile !== "") {
      const { data, error } = await supabase
        .from('tickets')
        .update({ title: newTitle, description: newDescription, picture: newFileUrl })
        .eq('id', ticket.id)
      fileUpload();
    } else {
      handleSubmitNoFileChange();
    }
    setSubmittingEdits(false);
    getTickets();
    setEditing(false);
  }

  async function fileUpload() {
    if (newFile && newFile !== "") {
      const { data, error } = await supabase.storage
        .from('ticket-images')
        .upload(newFileUrl, newFile, {
          cacheControl: '3600',
          upsert: false,
        });
    } else {
      return
    }
  }

  const mediaQueries = useMediaQueries({
    under768: "(max-width: 768px)",
  })

  return (
    ticket.priority_level === setPriorityLevel ?
      (
        <div className='ticketList-ticket' key={ticket.id} >
          <div style={{ textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", margin: "0 12px", color: "black" }}>
            <div style={{ position: "relative", padding: "20px", width: "100%" }}>
              {
                user.user_metadata.typeOfUser === "admin" ? <p style={{ margin: 0, right: editing && mediaQueries.under768 ? 0 : editing ? 120 : 0, top: 20, position: "absolute", border: "1px solid black", padding: "4px 10px", borderRadius: "50%" }}>{ticket.complexity_level ? ticket.complexity_level : "?"}</p>
                  :
                  null
              }
              {
                user.email === ticket.created_by ? <button onClick={(e) => { e.preventDefault(); handleEdit() }} className='dev-ticket-button' style={{ left: editing && mediaQueries.under768 ? 0 : editing ? 120 : 0, top: 20, position: "absolute", margin: 0, padding: "7px 14px" }}>{editing ? "Cancel" : "Edit"}</button>
                  :
                  null
              }
            </div>

            {editing ?
              <form style={{ border: "none", width: "100%", height: "500px" }}>
                <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} style={{ width: mediaQueries.under768 ? "240px" : "400px", margin: "0 0 20px 0" }} />
                <textarea value={newDescription} onChange={(e) => setNewDescription(e.target.value)} style={{ width: mediaQueries.under768 ? "240px" : "400px", margin: "0 0 20px 0" }} rows={9} />
                <input onChange={(e) => handleFileUrl(e)} type="file" style={{ cursor: "pointer", width: mediaQueries.under768 ? "240px" : "400px" }} />
                <button onClick={(e) => { e.preventDefault(); handleSubmit() }} style={{ margin: "20px 0 0 0" }}>{submittingEdits ? "Submitting..." : "Submit"}</button>
              </form>
              :
              <>
                <p style={{ fontWeight: 700, fontSize: 24, textAlign: "center" }}>{ticket.title}</p>
                <p style={{ fontWeight: 500, fontSize: 18, textAlign: "center", wordBreak: "break-word" }}>{ticket.description}</p>
                {ticket.picture.includes(".png") || ticket.picture.includes(".jpg") || ticket.picture.includes(".jpeg") || !ticket.picture ?
                  <div style={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", maxHeight: "fit-content", margin: "0 0 20px 0", overflow: "hidden" }}>
                    <img style={{ maxWidth: "45%" }} src={ticket.picture ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/ticket-images/${ticket.picture}` : "https://bzclbrsgarmfqbtxbzxz.supabase.co/storage/v1/object/public/ticket-images/public/noImage.png"} />
                  </div>
                  :
                  <button onClick={(e) => {
                    e.preventDefault();
                    downloadFile(ticket);
                  }}>{"Download associated file"}</button>
                }
              </>
            }

            {
              user.user_metadata.typeOfUser === "admin" && !ticket.assigned_to ?
                <button onClick={(e) => handleClaimTicket(e, ticket, setClaiming, setClaimed)}>{claiming ? "Claiming..." : claimed ? "Claimed!" : "Claim"}</button>
                :
                <p style={{ fontWeight: 500, fontSize: 18, textAlign: "center", margin: "0 0 6px 0" }}>{ticket.assigned_to ? `Assigned to: ${ticket.assigned_to}` : "Not yet assigned"}</p>
            }
          </div>
        </div >
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

function HighTicket({ tickets, mediaQueries, priorityLevelTitleStyles, user, handleClaimTicket, downloadFile, getTickets }: { tickets: any, mediaQueries: any, priorityLevelTitleStyles: CSSProperties, user: any, handleClaimTicket: Function, downloadFile: Function, getTickets: Function }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", alignItems: 'center', justifyContent: 'center' }}>
      <HighTicketTitle tickets={tickets} priorityLevelTitleStyles={priorityLevelTitleStyles} />
      <div style={{ display: "flex", width: "100%", flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
        {tickets.map((ticket: any, index: number) => {
          if (ticket.priority_level === 2) {
            return (
              <div key={ticket.id} style={{ margin: mediaQueries.under768 ? "21px 15px" : "25px 1%", width: mediaQueries.under768 ? "75%" : "30%" }}>
                <ActualTicket downloadFile={downloadFile} ticket={ticket} user={user} handleClaimTicket={handleClaimTicket} setPriorityLevel={2} getTickets={getTickets} />
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

function MediumTicket({ tickets, mediaQueries, priorityLevelTitleStyles, user, handleClaimTicket, downloadFile, getTickets }: { tickets: any, mediaQueries: any, priorityLevelTitleStyles: CSSProperties, user: any, handleClaimTicket: Function, downloadFile: Function, getTickets: Function }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", alignItems: 'center', justifyContent: 'center' }}>
      <MediumTicketTitle tickets={tickets} priorityLevelTitleStyles={priorityLevelTitleStyles} />
      <div style={{ display: "flex", width: "100%", flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
        {tickets.map((ticket: any, index: number) => {
          if (ticket.priority_level === 1) {
            return (
              <div key={ticket.id} style={{ margin: mediaQueries.under768 ? "21px 15px" : "25px 1%", width: mediaQueries.under768 ? "75%" : "30%" }}>
                <ActualTicket downloadFile={downloadFile} ticket={ticket} user={user} handleClaimTicket={handleClaimTicket} setPriorityLevel={1} getTickets={getTickets} />
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

function LowTicket({ tickets, mediaQueries, priorityLevelTitleStyles, user, handleClaimTicket, downloadFile, getTickets }: { tickets: any, mediaQueries: any, priorityLevelTitleStyles: CSSProperties, user: any, handleClaimTicket: Function, downloadFile: Function, getTickets: Function }) {
  const router = useRouter();

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", alignItems: 'center', justifyContent: 'center' }}>
      <LowTicketTitle tickets={tickets} priorityLevelTitleStyles={priorityLevelTitleStyles} />
      <div style={{ display: "flex", width: "100%", flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
        {tickets.map((ticket: any, index: number) => {
          if (ticket.priority_level === 0) {
            return (
              <div key={ticket.id} style={{ margin: mediaQueries.under768 ? "21px 15px" : "25px 1%", width: mediaQueries.under768 ? "75%" : "30%" }}>
                <ActualTicket downloadFile={downloadFile} ticket={ticket} user={user} handleClaimTicket={handleClaimTicket} setPriorityLevel={0} getTickets={getTickets} />
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