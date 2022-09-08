import useMediaQueries from 'media-queries-in-react';
import Head from 'next/head';
import React, { useEffect, useState } from 'react'
import HamburgerMenu from '../components/HamburgerMenu';
import Header from '../components/Header';
import Modal from '../components/Modal';
import supabase from '../components/supabase';
import { OnMouseEnter, OnMouseOut } from '../functions/MouseEvents';
import palette from '../styles/palette';

export default function DevTickets() {
  const content = {
    complexityLevelModalTitle: "The complexity level is based on the fibonacci sequence because I felt like being quirky",
    modalList: "1 is the lowest complexity level where 13 is the highest",
    modalList1: "A complexity level of 1 should mean that the ticket can likely be completed in one day by one person",
    modalList2: "A complexity level of 2 should mean that the ticket can likely be completed in two or three days by one person",
    modalList3: "A complexity level of 3 should mean that the ticket can likely be completed in three days plus by one person with some potential need for help",
    modalList4: "A complexity level of 5 should mean that the ticket can likely be completed in a day or two by two or more people",
    modalList5: "A complexity level of 8 should mean that the ticket can likely be completed in a week plus by two or more people",
    modalList6: "A complexity level of 13 should mean that the ticket is likely a full project warranting discussion by the whole team",
  }

  const mediaQueries = useMediaQueries({
    under768: '(max-width: 768px)',
  });

  const [tickets, setTickets] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [complexityLevel, setComplexityLevel] = useState('1');
  const [showJesseTickets, setShowJesseTickets] = useState(false);
  const [showJoshTickets, setShowJoshTickets] = useState(false);
  const [showKenTickets, setShowKenTickets] = useState(false);
  const [showRobertTickets, setShowRobertTickets] = useState(false);
  const [hamburgerClick, setHamburgerClick] = useState(false);

  async function getTickets() {
    let { data: tickets, error } = await supabase
      .from('tickets')
      .select('*')
    setTickets(tickets);
  }

  useEffect(() => {
    getTickets();
    const user = supabase.auth.user()
    if (!user || user.user_metadata.typeOfUser !== "admin") {
      window.location.href = '/'
    }
    setLoading(false);
  }, []);


  function updateComplexityLevel(e: any) {
    setComplexityLevel(e.target.value)
  }

  async function addComplexityLevel(e: any, id: number) {
    e.preventDefault();
    const { data, error } = await supabase
      .from('tickets')
      .update({ complexity_level: complexityLevel })
      .eq('id', id);
    getTickets();
  }

  async function addToCompleted(ticket: any) {
    const { data, error } = await supabase
      .from('completed')
      .insert([
        { title: ticket.title, description: ticket.description, picture: ticket.picture, priority_level: ticket.priority_level, complexity_level: ticket.complexity_level, assigned_to: ticket.assigned_to },
      ])
  }

  async function handleComplete(e: any, ticket: any) {
    e.preventDefault();
    if (confirm(`Are you sure you want to complete this ticket?\n\nThis action cannot be undone.`)) {
      addToCompleted(ticket);
      const { data, error } = await supabase
        .from('tickets')
        .delete()
        .eq('id', ticket.id);
      getTickets();
    } else {
      getTickets();
      return;
    }
  }

  async function handleSendToQA(e: any, ticket: any, setSending: Function, urlText: any, setOpen: Function) {
    e.preventDefault();
    setSending(true);
    const { data, error } = await supabase
      .from('tickets')
      .update({ page_url: urlText, status: 'Testing/QA' })
      .eq('id', ticket.id)
    setSending(false)
    setOpen(false)
    getTickets();
  }

  function onMouseOver(e: any) {
    e.target.style.textDecoration = "underline";
  }

  function onMouseLeave(e: any) {
    e.target.style.textDecoration = "none";
  }

  const listItemMargin = "0 0 20px 0";
  let sorted = [];
  if (tickets) {
    const firstSort = tickets.sort((a: any, b: any) => a.id - b.id).reverse();
    sorted = firstSort.sort((a: any, b: any) => {
      return a.priority_level - b.priority_level;
    })
  }

  function handleHamburgerClick() {
    setHamburgerClick(true);
  }

  setTimeout(() => {
    getTickets()
  }, 720000)

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Head>
        <title>Ticketing Solution</title>
        <meta name="ticketing" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={{ width: "100%", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", position: hamburgerClick ? "fixed" : "absolute" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", width: "100%", zIndex: 3 }}>
          <HamburgerMenu hamburgerClick={hamburgerClick} setHamburgerClick={setHamburgerClick} />
        </div>
        <Header hamburgerClick={hamburgerClick} handleHamburgerClick={handleHamburgerClick} />
        <main style={{ margin: 0, padding: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", height: "100%", width: "100%", overflowY: "auto" }}>
          {loading ?
            <div style={{ width: "100%", height: "100vh" }}>
              <p style={{ fontSize: 48, fontWeight: 700, fontStyle: "oblique", margin: mediaQueries.under768 ? "50% 0 0 0" : "15% 0 0 0", textAlign: "center" }}>Grabbing tickets...</p>
            </div>
            :
            <>
              <p onClick={() => setShowModal(!showModal)} onMouseEnter={(e) => OnMouseEnter(e)} onMouseOut={(e) => OnMouseOut(e)} style={{ fontSize: 24, border: "1px solid black", borderRadius: "50%", padding: "5px 15px", cursor: "pointer", position: "absolute", top: mediaQueries.under768 ? "9%" : "100px", right: "40px" }}>?</p>
              {showModal ?
                <Modal styleOverride={{ maxHeight: "90vh", padding: "5px", overflowY: "auto", backgroundColor: palette.pageBackgroundColor, width: mediaQueries.under768 ? "90%" : "63%", margin: mediaQueries.under768 ? "5% 5%" : "10% 18.5%", height: "fit-content", display: "flex", alignItems: "center", justifyContent: 'center', flexDirection: "column", textAlign: "center", border: "1px solid rgba(0, 0, 0, 0.4)", borderRadius: "10px", color: "black" }}>
                  <div style={{ width: "100%", margin: "2px", fontSize: mediaQueries.under768 ? 15 : 18, display: "flex", flexDirection: "column" }}>
                    <p onClick={() => setShowModal(false)} style={{ margin: 0, marginLeft: "auto", marginRight: "5px", marginTop: "5px", padding: "5px", cursor: "pointer" }}>X</p>
                    <p>{content.complexityLevelModalTitle}</p>
                    <ul style={{ textAlign: "left" }}>
                      <li style={{ margin: listItemMargin }}>{content.modalList}</li>
                      <li style={{ margin: listItemMargin }}>{content.modalList1}</li>
                      <li style={{ margin: listItemMargin }}>{content.modalList2}</li>
                      <li style={{ margin: listItemMargin }}>{content.modalList3}</li>
                      <li style={{ margin: listItemMargin }}>{content.modalList4}</li>
                      <li style={{ margin: listItemMargin }}>{content.modalList5}</li>
                      <li style={{ margin: listItemMargin }}>{content.modalList6}</li>
                    </ul>
                  </div>
                </Modal>
                : null}
              <p onMouseEnter={(e) => onMouseOver(e)} onMouseOut={(e) => onMouseLeave(e)} onClick={() => setShowJesseTickets(!showJesseTickets)} style={{ fontWeight: 700, fontSize: 30, cursor: "pointer" }}>{"Jesse's Tickets"}</p>
              <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", maxWidth: "1500px", width: "100%" }}>
                <AssignedTickets showTickets={showJesseTickets} mediaQueries={mediaQueries} tickets={tickets} complexityLevel={complexityLevel} updateComplexityLevel={updateComplexityLevel} addComplexityLevel={addComplexityLevel} sorted={sorted} handleComplete={handleComplete} name={"Jesse Malmstrom"} handleSendToQA={handleSendToQA} />
              </div>
              <p onMouseEnter={(e) => onMouseOver(e)} onMouseOut={(e) => onMouseLeave(e)} onClick={() => setShowJoshTickets(!showJoshTickets)} style={{ fontWeight: 700, fontSize: 30, cursor: "pointer" }}>{"Josh's Tickets"}</p>
              <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", maxWidth: "1500px", width: "100%" }}>
                <AssignedTickets showTickets={showJoshTickets} mediaQueries={mediaQueries} tickets={tickets} complexityLevel={complexityLevel} updateComplexityLevel={updateComplexityLevel} addComplexityLevel={addComplexityLevel} sorted={sorted} handleComplete={handleComplete} name={"Joshua Levine"} handleSendToQA={handleSendToQA} />
              </div>
              <p onMouseEnter={(e) => onMouseOver(e)} onMouseOut={(e) => onMouseLeave(e)} onClick={() => setShowKenTickets(!showKenTickets)} style={{ fontWeight: 700, fontSize: 30, cursor: "pointer" }}>{"Ken's Tickets"}</p>
              <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", maxWidth: "1500px", width: "100%" }}>
                <AssignedTickets showTickets={showKenTickets} mediaQueries={mediaQueries} tickets={tickets} complexityLevel={complexityLevel} updateComplexityLevel={updateComplexityLevel} addComplexityLevel={addComplexityLevel} sorted={sorted} handleComplete={handleComplete} name={"Ken Parsons"} handleSendToQA={handleSendToQA} />
              </div>
              <p onMouseEnter={(e) => onMouseOver(e)} onMouseOut={(e) => onMouseLeave(e)} onClick={() => setShowRobertTickets(!showRobertTickets)} style={{ fontWeight: 700, fontSize: 30, cursor: "pointer" }}>{"Robert's Tickets"}</p>
              <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", maxWidth: "1500px", width: "100%" }}>
                <AssignedTickets showTickets={showRobertTickets} mediaQueries={mediaQueries} tickets={tickets} complexityLevel={complexityLevel} updateComplexityLevel={updateComplexityLevel} addComplexityLevel={addComplexityLevel} sorted={sorted} handleComplete={handleComplete} name={"Robert Thibault"} handleSendToQA={handleSendToQA} />
              </div>
              <div style={{ margin: mediaQueries.under768 ? "15% 0" : "2% 0" }} />
            </>
          }
        </main>
      </div >
    </div >
  )
}

function AssignedTickets({ tickets, complexityLevel, updateComplexityLevel, addComplexityLevel, mediaQueries, showTickets, sorted, handleComplete, name, handleSendToQA }: { tickets: any, complexityLevel: string, updateComplexityLevel: Function, addComplexityLevel: Function, mediaQueries: any, showTickets: boolean, sorted: any, handleComplete: Function, name: string, handleSendToQA: Function }) {
  let claimedTickets = 0;
  tickets.map((ticket: any) => {
    if (ticket.assigned_to === name) {
      claimedTickets++
    }
  })

  return (
    claimedTickets > 0 ?
      sorted.map((ticket: any) => {
        return (
          ticket.assigned_to === name && showTickets ?
            <div key={ticket.id} style={{ display: "flex", justifyContent: "center", margin: mediaQueries.under768 ? "21px 15px" : "25px 1%", alignItems: "center", width: mediaQueries.under768 ? "75%" : "30%" }}>
              <ActualTicket ticket={ticket} name={name} showTickets={showTickets} handleComplete={handleComplete} mediaQueries={mediaQueries} handleSendToQA={handleSendToQA} complexityLevel={complexityLevel} updateComplexityLevel={updateComplexityLevel} addComplexityLevel={addComplexityLevel} />
            </div>
            : null
        )
      }).reverse()
      : null
  )
}

function ActualTicket({ ticket, name, showTickets, handleComplete, mediaQueries, handleSendToQA, complexityLevel, updateComplexityLevel, addComplexityLevel }: { ticket: any, name: string, showTickets: boolean, handleComplete: Function, mediaQueries: any, handleSendToQA: Function, complexityLevel: string, updateComplexityLevel: Function, addComplexityLevel: Function }) {
  const [open, setOpen] = useState(false);
  const [urlText, setUrlText] = useState("");
  const [sending, setSending] = useState(false);

  return (
    ticket.assigned_to === name && showTickets ?
      <div className="devTicketList-ticket" style={{ border: ticket.priority_level === 3 ? "1px solid #a60505" : "1px solid rgba(255, 255, 255, 0.4)", boxShadow: ticket.priority_level === 3 ? "4px 2px 9px 1px #a60505" : "4px 2px 9px 1px #888888" }}>
        {ticket.assigned_to === name ?
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <button className="dev-ticket-button" onClick={(e) => handleComplete(e, ticket)}>{"Complete?"}</button>
            <button className="dev-ticket-button" onClick={ticket.status !== "Testing/QA" ? (e) => setOpen(!open) : () => { }}>{ticket.status === "Testing/QA" ? "In QA" : "Send to QA?"}</button>
          </div>
          : null}
        {
          open ?
            <div style={{ border: "1px solid black", borderRadius: "10px", padding: "20px", margin: "10px 20px", width: "100%" }}>
              <p>{"Is this ready to be tested?"}</p>
              <p>{"Don't forget to include the page URL below if necessary!"}</p>
              <input type="text" value={urlText} onChange={((e) => setUrlText(e.target.value))} style={{ width: "250px" }} />
              <br />
              <button className="sendToQA-button" onClick={(e) => handleSendToQA(e, ticket, setSending, urlText, setOpen)}>{sending ? "Sending..." : "Send on over"}</button>
            </div>
            : null
        }
        <p style={{ fontWeight: "bold", fontSize: 18, marginBottom: 0 }}>{ticket.title}</p>
        <p style={{ wordBreak: "break-word" }}>{ticket.description}</p>
        {ticket.reviewed_by ? <p><span style={{ fontWeight: "bold", textDecoration: "underline" }}>{"Reviewed By:"}</span>{" "}{ticket.reviewed_by}</p> : null}
        {ticket.notes ? <p style={{ marginTop: 0 }}><span style={{ fontWeight: "bold", textDecoration: "underline" }}>{"Notes:"}</span>{" "}{ticket.notes}</p> : null}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "fit-content", margin: "0" }}>
          <img style={{ maxWidth: "45%" }} alt={ticket.title} src={ticket.picture ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/ticket-images/${ticket.picture}` : "https://bzclbrsgarmfqbtxbzxz.supabase.co/storage/v1/object/public/ticket-images/public/noImage.png"} />
        </div>
        <p>Complexity level: {ticket.complexity_level ? ticket.complexity_level : "Not yet assigned"}</p>
        {
          ticket.assigned_to == name ?
            <>
              <select defaultValue={ticket.complexity_level ? ticket.complexity_level : complexityLevel} onClick={(e) => updateComplexityLevel(e)} style={{ margin: "0 0 12px 0", width: mediaQueries.under768 ? "250px" : "250px" }} >
                <option value={"1"}>1</option>
                <option value={"2"}>2</option>
                <option value={"3"}>3</option>
                <option value={"5"}>5</option>
                <option value={"8"}>8</option>
                <option value={"13"}>13</option>
              </select>
              <button className="dev-ticket-button set" onClick={(e) => addComplexityLevel(e, ticket.id)}>{"Set"}</button>
            </>
            :
            null
        }
      </div >
      : null
  )
}