import useMediaQueries from 'media-queries-in-react';
import Head from 'next/head';
import React, { useEffect, useState } from 'react'
import Footer from '../components/Footer';
import Header from '../components/Header';
import Modal from '../components/Modal';
import supabase from '../components/supabase';
import { OnMouseEnter, OnMouseOut } from '../functions/MouseEvents';

export default function devTickets() {
  const mediaQueries = useMediaQueries({
    under768: '(max-width: 768px)',
  });

  const [tickets, setTickets] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [complexityLevel, setComplexityLevel] = useState('1');
  const [showJesseTickets, setShowJesseTickets] = useState(false);
  const [showJoshTickets, setShowJoshTickets] = useState(false);
  const [showKenTickets, setShowKenTickets] = useState(false);
  const [showRobertTickets, setShowRobertTickets] = useState(false);

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

  function updateComplexityLevel(e: any) {
    setComplexityLevel(e.target.value)
  }

  async function addComplexityLevel(e: any, id: number) {
    console.log(id)
    e.preventDefault();
    const { data, error } = await supabase
      .from('tickets')
      .update({ complexity_level: complexityLevel })
      .eq('id', id)
  }

  function onMouseOver(e: any) {
    e.target.style.textDecoration = "underline";
  }

  function onMouseLeave(e: any) {
    e.target.style.textDecoration = "none";
  }

  const listItemMargin = "0 0 20px 0"

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Head>
        <title>Ticketing Solution</title>
        <meta name="ticketing" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main style={{ margin: 0, padding: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", height: "100%", width: "100%", overflowY: "auto" }}>
        {loading ?
          <div style={{ width: "100%", height: "100vh" }}>
            <p style={{ fontSize: 48, fontWeight: 700, fontStyle: "oblique", margin: mediaQueries.under768 ? "50% 0 0 0" : "15% 0 0 0", textAlign: "center" }}>Grabbing tickets...</p>
          </div>
          :
          <>
            <p onClick={() => setShowModal(!showModal)} onMouseEnter={(e) => OnMouseEnter(e)} onMouseOut={(e) => OnMouseOut(e)} style={{ fontSize: 24, border: "1px solid rgba(255, 255, 255, 0.5)", borderRadius: "50%", padding: "5px 10px", cursor: "pointer", position: "absolute", top: mediaQueries.under768 ? "9%" : "6%", right: "20px" }}>?</p>
            {showModal ?
              <Modal styleOverride={{ maxHeight: "90vh", overflowY: "auto", backgroundColor: "black", width: mediaQueries.under768 ? "95%" : "50%", margin: mediaQueries.under768 ? "10% 2.5%" : "15% 25%", height: "fit-content", display: "flex", alignItems: "center", justifyContent: 'center', flexDirection: "column", textAlign: "center", border: "1px solid rgba(255, 255, 255, 0.5)", borderRadius: "10px" }}>
                <div style={{ width: "100%", margin: "2px", fontSize: mediaQueries.under768 ? 15 : 18, display: "flex", flexDirection: "column" }}>
                  <p onClick={() => setShowModal(false)} style={{ margin: 0, marginLeft: "auto", marginRight: "5px", marginTop: "5px", padding: "5px", cursor: "pointer" }}>X</p>
                  <p>The complexity level is based on the fibonacci sequence because I felt like being quirky</p>
                  <ul style={{ textAlign: "left" }}>
                    <li style={{ margin: listItemMargin }}>1 is the lowest complexity level where 13 is the highest</li>
                    <li style={{ margin: listItemMargin }}>A complexity level of 1 should mean that the ticket can likely be completed in one day by one person</li>
                    <li style={{ margin: listItemMargin }}>A complexity level of 2 should mean that the ticket can likely be completed in two or three days by one person</li>
                    <li style={{ margin: listItemMargin }}>A complexity level of 3 should mean that the ticket can likely be completed in three days plus by one person with some potential need for help</li>
                    <li style={{ margin: listItemMargin }}>A complexity level of 5 should mean that the ticket can likely be completed in a day or two by two or more people</li>
                    <li style={{ margin: listItemMargin }}>A complexity level of 8 should mean that the ticket can likely be completed in a week plus by two or more people</li>
                    <li style={{ margin: listItemMargin }}>A complexity level of 13 should mean that the ticket is likely a full project warranting discussion by the whole team</li>
                  </ul>
                </div>
              </Modal>
              : null}
            <p onMouseEnter={(e) => onMouseOver(e)} onMouseOut={(e) => onMouseLeave(e)} onClick={() => setShowJesseTickets(!showJesseTickets)} style={{ fontWeight: 700, fontSize: 30, cursor: "pointer" }}>Jesse's Tickets</p>
            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", maxWidth: "1500px", width: "100%" }}>
              <JesseTickets showJesseTickets={showJesseTickets} mediaQueries={mediaQueries} tickets={tickets} complexityLevel={complexityLevel} updateComplexityLevel={updateComplexityLevel} addComplexityLevel={addComplexityLevel} />
            </div>
            <p onMouseEnter={(e) => onMouseOver(e)} onMouseOut={(e) => onMouseLeave(e)} onClick={() => setShowJoshTickets(!showJoshTickets)} style={{ fontWeight: 700, fontSize: 30, cursor: "pointer" }}>Josh's Tickets</p>
            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", maxWidth: "1500px", width: "100%" }}>
              <JoshTickets showJoshTickets={showJoshTickets} mediaQueries={mediaQueries} tickets={tickets} complexityLevel={complexityLevel} updateComplexityLevel={updateComplexityLevel} addComplexityLevel={addComplexityLevel} />
            </div>
            <p onMouseEnter={(e) => onMouseOver(e)} onMouseOut={(e) => onMouseLeave(e)} onClick={() => setShowKenTickets(!showKenTickets)} style={{ fontWeight: 700, fontSize: 30, cursor: "pointer" }}>Ken's Tickets</p>
            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", maxWidth: "1500px", width: "100%" }}>
              <KenTickets showKenTickets={showKenTickets} mediaQueries={mediaQueries} tickets={tickets} complexityLevel={complexityLevel} updateComplexityLevel={updateComplexityLevel} addComplexityLevel={addComplexityLevel} />
            </div>
            <p onMouseEnter={(e) => onMouseOver(e)} onMouseOut={(e) => onMouseLeave(e)} onClick={() => setShowRobertTickets(!showRobertTickets)} style={{ fontWeight: 700, fontSize: 30, cursor: "pointer" }}>Robert's Tickets</p>
            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", maxWidth: "1500px", width: "100%" }}>
              <RobertTickets showRobertTickets={showRobertTickets} mediaQueries={mediaQueries} tickets={tickets} complexityLevel={complexityLevel} updateComplexityLevel={updateComplexityLevel} addComplexityLevel={addComplexityLevel} />
            </div>
            <div style={{ margin: mediaQueries.under768 ? "15% 0" : "2% 0" }} />
          </>
        }
        <Footer />
      </main>
    </div >
  )
}

function JesseTickets({ tickets, complexityLevel, updateComplexityLevel, addComplexityLevel, mediaQueries, showJesseTickets }: { tickets: any, complexityLevel: string, updateComplexityLevel: Function, addComplexityLevel: Function, mediaQueries: any, showJesseTickets: boolean }) {
  let claimedTickets = 0;
  tickets.map((ticket: any) => {
    if (ticket.assigned_to === "Jesse") {
      claimedTickets++
    }
  })

  return (
    claimedTickets > 0 ?
      tickets.map((ticket: any) => {
        if (ticket.assigned_to === "Jesse" && showJesseTickets) {
          return (
            <div key={ticket.id} style={{ textAlign: "center", border: "1px solid rgba(255, 255, 255, 0.5)", width: mediaQueries.under768 ? "75%" : "30%", height: "fit-content", display: "flex", alignItems: "center", justifyContent: "center", margin: mediaQueries.under768 ? "21px 15px" : "25px 1%", flexDirection: "column", padding: "12px", color: "white", borderRadius: "15px", boxShadow: "4px 2px 9px 1px #888888" }}>
              <p>{ticket.title}</p>
              <p>{ticket.description}</p>
              <div style={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "200px", margin: mediaQueries.under768 ? "0" : "30% 0" }}>
                <img style={{ maxWidth: "45%" }} src={ticket.picture ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/ticket-images/${ticket.picture}` : "https://bzclbrsgarmfqbtxbzxz.supabase.co/storage/v1/object/public/ticket-images/public/noImage.jpg"} />
              </div>
              <p>complexity level: {ticket.complexity_level ? ticket.complexity_level : "Not yet assigned"}</p>
              <select defaultValue={ticket.complexity_level ? ticket.complexity_level : complexityLevel} onClick={(e) => updateComplexityLevel(e)} style={{ margin: "0 0 10px 0" }} >
                <option value={"1"}>1</option>
                <option value={"2"}>2</option>
                <option value={"3"}>3</option>
                <option value={"5"}>5</option>
                <option value={"8"}>8</option>
                <option value={"13"}>13</option>
              </select>
              <button onClick={(e) => addComplexityLevel(e, ticket.id)}>Set</button>
            </div>
          )
        }
      })
      : null
  )
}

function JoshTickets({ tickets, complexityLevel, updateComplexityLevel, addComplexityLevel, mediaQueries, showJoshTickets }: { tickets: any, complexityLevel: string, updateComplexityLevel: Function, addComplexityLevel: Function, mediaQueries: any, showJoshTickets: boolean }) {
  let claimedTickets = 0;
  tickets.map((ticket: any) => {
    if (ticket.assigned_to === "Josh") {
      claimedTickets++
    }
  })

  return (
    claimedTickets > 0 ?
      tickets.map((ticket: any) => {
        if (ticket.assigned_to === "Josh" && showJoshTickets) {
          return (
            <div key={ticket.id} style={{ textAlign: "center", border: "1px solid rgba(255, 255, 255, 0.5)", width: mediaQueries.under768 ? "75%" : "30%", height: "fit-content", display: "flex", alignItems: "center", justifyContent: "center", margin: mediaQueries.under768 ? "21px 15px" : "25px 1%", flexDirection: "column", padding: "12px", color: "white", borderRadius: "15px", boxShadow: "4px 2px 9px 1px #888888" }}>
              <p>{ticket.title}</p>
              <p>{ticket.description}</p>
              <div style={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "200px", margin: mediaQueries.under768 ? "0" : "30% 0" }}>
                <img style={{ maxWidth: "45%" }} src={ticket.picture ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/ticket-images/${ticket.picture}` : "https://bzclbrsgarmfqbtxbzxz.supabase.co/storage/v1/object/public/ticket-images/public/noImage.jpg"} />
              </div>
              <p>complexity level: {ticket.complexity_level ? ticket.complexity_level : "Not yet assigned"}</p>
              <select defaultValue={ticket.complexity_level ? ticket.complexity_level : complexityLevel} onClick={(e) => updateComplexityLevel(e)} style={{ margin: "0 0 10px 0" }} >
                <option value={"1"}>1</option>
                <option value={"2"}>2</option>
                <option value={"3"}>3</option>
                <option value={"5"}>5</option>
                <option value={"8"}>8</option>
                <option value={"13"}>13</option>
              </select>
              <button onClick={(e) => addComplexityLevel(e, ticket.id)}>Set</button>
            </div>
          )
        }
      })
      : null
  )
}

function KenTickets({ tickets, complexityLevel, updateComplexityLevel, addComplexityLevel, mediaQueries, showKenTickets }: { tickets: any, complexityLevel: string, updateComplexityLevel: Function, addComplexityLevel: Function, mediaQueries: any, showKenTickets: boolean }) {
  let claimedTickets = 0;
  tickets.map((ticket: any) => {
    if (ticket.assigned_to === "Ken") {
      claimedTickets++
    }
  })

  return (
    claimedTickets > 0 ?
      tickets.map((ticket: any) => {
        if (ticket.assigned_to === "Ken" && showKenTickets) {
          return (
            <div key={ticket.id} style={{ textAlign: "center", border: "1px solid rgba(255, 255, 255, 0.5)", width: mediaQueries.under768 ? "75%" : "30%", height: "fit-content", display: "flex", alignItems: "center", justifyContent: "center", margin: mediaQueries.under768 ? "21px 15px" : "25px 1%", flexDirection: "column", padding: "12px", color: "white", borderRadius: "15px", boxShadow: "4px 2px 9px 1px #888888" }}>
              <p>{ticket.title}</p>
              <p>{ticket.description}</p>
              <div style={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "200px", margin: mediaQueries.under768 ? "0" : "30% 0" }}>
                <img style={{ maxWidth: "45%" }} src={ticket.picture ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/ticket-images/${ticket.picture}` : "https://bzclbrsgarmfqbtxbzxz.supabase.co/storage/v1/object/public/ticket-images/public/noImage.jpg"} />
              </div>
              <p>complexity level: {ticket.complexity_level ? ticket.complexity_level : "Not yet assigned"}</p>
              <select defaultValue={ticket.complexity_level ? ticket.complexity_level : complexityLevel} onClick={(e) => updateComplexityLevel(e)} style={{ margin: "0 0 10px 0" }} >
                <option value={"1"}>1</option>
                <option value={"2"}>2</option>
                <option value={"3"}>3</option>
                <option value={"5"}>5</option>
                <option value={"8"}>8</option>
                <option value={"13"}>13</option>
              </select>
              <button onClick={(e) => addComplexityLevel(e, ticket.id)}>Set</button>
            </div>
          )
        }
      })
      : null
  )
}

function RobertTickets({ tickets, complexityLevel, updateComplexityLevel, addComplexityLevel, mediaQueries, showRobertTickets }: { tickets: any, complexityLevel: string, updateComplexityLevel: Function, addComplexityLevel: Function, mediaQueries: any, showRobertTickets: boolean }) {
  let claimedTickets = 0;
  tickets.map((ticket: any) => {
    if (ticket.assigned_to === "Robert") {
      claimedTickets++
    }
  })

  return (
    claimedTickets > 0 ?
      tickets.map((ticket: any) => {
        if (ticket.assigned_to === "Robert" && showRobertTickets) {
          return (
            <div key={ticket.id} style={{ textAlign: "center", border: "1px solid rgba(255, 255, 255, 0.5)", width: mediaQueries.under768 ? "75%" : "30%", height: "fit-content", display: "flex", alignItems: "center", justifyContent: "center", margin: mediaQueries.under768 ? "21px 15px" : "25px 1%", flexDirection: "column", padding: "12px", color: "white", borderRadius: "15px", boxShadow: "4px 2px 9px 1px #888888" }}>
              <p>{ticket.title}</p>
              <p>{ticket.description}</p>
              <div style={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "200px", margin: mediaQueries.under768 ? "0" : "30% 0" }}>
                <img style={{ maxWidth: "45%" }} src={ticket.picture ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/ticket-images/${ticket.picture}` : "https://bzclbrsgarmfqbtxbzxz.supabase.co/storage/v1/object/public/ticket-images/public/noImage.jpg"} />
              </div>
              <p>complexity level: {ticket.complexity_level ? ticket.complexity_level : "Not yet assigned"}</p>
              <select defaultValue={ticket.complexity_level ? ticket.complexity_level : complexityLevel} onClick={(e) => updateComplexityLevel(e)} style={{ margin: "0 0 10px 0" }} >
                <option value={"1"}>1</option>
                <option value={"2"}>2</option>
                <option value={"3"}>3</option>
                <option value={"5"}>5</option>
                <option value={"8"}>8</option>
                <option value={"13"}>13</option>
              </select>
              <button onClick={(e) => addComplexityLevel(e, ticket.id)}>Set</button>
            </div>
          )
        }
      })
      : null
  )
}