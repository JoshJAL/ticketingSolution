import Head from 'next/head'
import Header from '../components/Header'
import useMediaQueries from 'media-queries-in-react'
import supabase from '../components/supabase'
import { useEffect, useState } from 'react'
import HamburgerMenu from '../components/HamburgerMenu'
import { OnMouseEnter, OnMouseOut } from '../functions/MouseEvents'

export default function Testing() {
  const [hamburgerClick, setHamburgerClick] = useState(false);
  const [tickets, setTickets] = useState<any>([]);
  const [authedUser, setAuthedUser] = useState<any>(null);

  const mediaQueries = useMediaQueries({
    under768: '(max-width: 768px)',
  });

  async function getTickets() {
    let { data: tickets, error } = await supabase
      .from('tickets')
      .select('*')
    setTickets(tickets);
  }

  useEffect(() => {
    const user = supabase.auth.user()
    getTickets();
    if (!user) {
      window.location.href = '/login'
    } else if (user.user_metadata.typeOfUser !== "admin") {
      window.location.href = '/login'
    } else if (user.user_metadata.typeOfUser === "q&a") {
      window.location.href = '/login'
    }
    setAuthedUser(user)
  }, [])

  function handleHamburgerClick() {
    setHamburgerClick(true);
  }

  async function handleSendToDev(e: any, ticket: any, setSending: any, notes: any) {
    e.preventDefault();
    setSending(true);
    const { data, error } = await supabase
      .from('tickets')
      .update({ notes: notes, status: "In Development" })
      .eq('id', ticket.id)
    setSending(false)
  }

  async function handleReviewClick(e: any, ticket: any, setClaiming: Function) {
    e.preventDefault();
    const { data, error } = await supabase
      .from('tickets')
      .update({ reviewed_by: authedUser.user_metadata.name })
      .eq('id', ticket.id)
    setClaiming(true);
  }

  const initialSort = tickets.sort((a: any, b: any) => {
    return a.id - b.id;
  })
  const sorted = initialSort.sort((a: any, b: any) => {
    return a.priority_level - b.priority_level;
  })

  setTimeout(() => {
    getTickets();
  }, 10000)

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", width: "100%", zIndex: 3 }}>
        <HamburgerMenu hamburgerClick={hamburgerClick} setHamburgerClick={setHamburgerClick} />
      </div>
      <Header hamburgerClick={hamburgerClick} handleHamburgerClick={handleHamburgerClick} />
      <Head>
        <title>Ticketing Solution</title>
        <meta name="ticketing" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={{ width: "100%", minHeight: "100vh", alignItems: "center", position: hamburgerClick ? "fixed" : "absolute", overflow: "hidden" }}>

        <main style={{ margin: 0, padding: 0, height: "100%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
          <p style={{ fontWeight: 700, fontSize: 30, marginBottom: 0 }}>Unclaimed Tickets</p>
          <div style={{ margin: mediaQueries.under768 ? "12px 0" : "0", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
            <NotReviewedTickets mediaQueries={mediaQueries} sorted={sorted} handleSendToDev={handleSendToDev} handleReviewClick={handleReviewClick} />
          </div>
          <p style={{ fontWeight: 700, fontSize: 30, marginBottom: 0 }}>Your Tickets</p>
          <div style={{ margin: mediaQueries.under768 ? "12px 0" : "0", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
            <YourTickets mediaQueries={mediaQueries} sorted={sorted} handleSendToDev={handleSendToDev} handleReviewClick={handleReviewClick} authedUser={authedUser} />
          </div>
        </main>
      </div>
    </div>
  )
}

function NotReviewedTickets({ mediaQueries, sorted, handleSendToDev, handleReviewClick }: { mediaQueries: any, sorted: any, handleSendToDev: Function, handleReviewClick: Function }) {

  return (
    sorted.map((ticket: any) => {
      const [open, setOpen] = useState(false);
      const [notes, setNotes] = useState("");
      const [sending, setSending] = useState(false);
      const [claiming, setClaiming] = useState(false);
      if (!ticket.reviewed_by && ticket.status === "Testing/QA") {
        return (
          <div key={ticket.id} style={{ textAlign: "center", border: ticket.priority_level === 3 ? "1px solid #a60505" : "1px solid rgba(255, 255, 255, 0.5)", width: mediaQueries.under768 ? "75%" : "30%", height: "fit-content", display: "flex", alignItems: "center", justifyContent: "center", margin: mediaQueries.under768 ? "21px 15px" : "25px 1%", flexDirection: "column", padding: "12px", color: "white", borderRadius: "15px", boxShadow: ticket.priority_level === 3 ? "4px 2px 9px 1px #a60505" : "4px 2px 9px 1px #888888" }}>

            {ticket.reviewed_by ?
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                <p onMouseEnter={(e) => OnMouseEnter(e)} onMouseOut={(e) => OnMouseOut(e)} onClick={(e) => setOpen(!open)} style={{ marginBottom: "auto", fontSize: 15, fontWeight: 700, border: "1px solid rgba(255, 255, 255, 0.5)", padding: "5px", borderRadius: "10px", cursor: "pointer" }}>{`Send to ${ticket.assigned_to.split(" ")[0]}?`}</p>
              </div>
              : null}

            {open ?
              <div style={{ border: "1px solid rgba(255, 255, 255, 0.5)", borderRadius: "10px", padding: "20px", margin: "10px 20px" }}>
                <p>{"Any notes?"}</p>
                <p>{"If this is ready to be pushed to production let us know!"}</p>
                <input type="text" value={notes} onChange={((e) => setNotes(e.target.value))} />
                <br />
                <button style={{ margin: "20px 0 0 0" }} onClick={(e) => handleSendToDev(e, ticket, setSending, notes)}>{sending ? "Sending..." : "Send on over"}</button>
              </div>
              : null
            }
            <p style={{ fontWeight: 600, fontSize: 24 }} >{ticket.title}</p>
            <p style={{ fontWeight: 500, fontSize: 18, marginTop: 0 }}>{ticket.description}</p>
            <div style={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "fit-content", margin: "0" }}>
              <img style={{ maxWidth: "45%" }} alt={ticket.title} src={ticket.picture ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/ticket-images/${ticket.picture}` : "https://bzclbrsgarmfqbtxbzxz.supabase.co/storage/v1/object/public/ticket-images/public/noImage.jpg"} />
            </div>
            <p onClick={!ticket.reviewed_by || !claiming ? (e) => handleReviewClick(e, ticket, setClaiming) : () => { }} onMouseEnter={!ticket.reviewed_by ? (e) => OnMouseEnter((e)) : () => { }} onMouseOut={!ticket.reviewed_by ? (e) => OnMouseOut(e) : () => { }} style={{ fontSize: 18, fontWeight: 600, border: ticket.reviewed_by ? "none" : "1px solid rgba(255, 255, 255,  0.5)", padding: "5px 10px", borderRadius: "10px", cursor: ticket.reviewed_by ? "auto" : "pointer" }}>{ticket.reviewed_by ? `Being reviewed by: ${ticket.reviewed_by}` : claiming ? "Claimed!" : "Review me!"}</p>
          </div >
        )
      }
    }).reverse()
  )
}

function YourTickets({ mediaQueries, sorted, handleSendToDev, handleReviewClick, authedUser }: { mediaQueries: any, sorted: any, handleSendToDev: Function, handleReviewClick: Function, authedUser: any }) {

  return (
    sorted.map((ticket: any) => {
      const [open, setOpen] = useState(false);
      const [notes, setNotes] = useState("");
      const [sending, setSending] = useState(false);
      const [claiming, setClaiming] = useState(false);
      if (ticket.reviewed_by === authedUser.user_metadata.name && ticket.status === "Testing/QA") {
        return (
          <div key={ticket.id} style={{ textAlign: "center", border: ticket.priority_level === 3 ? "1px solid #a60505" : "1px solid rgba(255, 255, 255, 0.5)", width: mediaQueries.under768 ? "75%" : "30%", height: "fit-content", display: "flex", alignItems: "center", justifyContent: "center", margin: mediaQueries.under768 ? "21px 15px" : "25px 1%", flexDirection: "column", padding: "12px", color: "white", borderRadius: "15px", boxShadow: ticket.priority_level === 3 ? "4px 2px 9px 1px #a60505" : "4px 2px 9px 1px #888888" }}>

            {ticket.reviewed_by ?
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                <p onMouseEnter={(e) => OnMouseEnter(e)} onMouseOut={(e) => OnMouseOut(e)} onClick={(e) => setOpen(!open)} style={{ marginBottom: "auto", fontSize: 15, fontWeight: 700, border: "1px solid rgba(255, 255, 255, 0.5)", padding: "5px", borderRadius: "10px", cursor: "pointer" }}>{`Send to ${ticket.assigned_to.split(" ")[0]}?`}</p>
              </div>
              : null}

            {open ?
              <div style={{ border: "1px solid rgba(255, 255, 255, 0.5)", borderRadius: "10px", padding: "20px", margin: "10px 20px" }}>
                <p>{"Any notes?"}</p>
                <p>{"If this is ready to be pushed to production let us know!"}</p>
                <input type="text" value={notes} onChange={((e) => setNotes(e.target.value))} />
                <br />
                <button style={{ margin: "20px 0 0 0" }} onClick={(e) => handleSendToDev(e, ticket, setSending, notes)}>{sending ? "Sending..." : "Send on over"}</button>
              </div>
              : null
            }
            <p style={{ fontWeight: 600, fontSize: 24 }} >{ticket.title}</p>
            <p style={{ fontWeight: 500, fontSize: 18, marginTop: 0 }}>{ticket.description}</p>
            {ticket.page_url.includes(".com") ?
              <p style={{ marginTop: 0 }}><span style={{ fontWeight: "bold", textDecoration: "underline" }}>{"Page Url:"}</span>{" "}<a href={ticket.page_url}>{ticket.page_url}</a></p>
              :
              null
            }
            <div style={{ width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "fit-content", margin: "0" }}>
              <img style={{ maxWidth: "45%" }} alt={ticket.title} src={ticket.picture ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/ticket-images/${ticket.picture}` : "https://bzclbrsgarmfqbtxbzxz.supabase.co/storage/v1/object/public/ticket-images/public/noImage.jpg"} />
            </div>
            <p onClick={!ticket.reviewed_by || !claiming ? (e) => handleReviewClick(e, ticket, setClaiming) : () => { }} onMouseEnter={!ticket.reviewed_by ? (e) => OnMouseEnter((e)) : () => { }} onMouseOut={!ticket.reviewed_by ? (e) => OnMouseOut(e) : () => { }} style={{ fontSize: 18, fontWeight: 600, border: ticket.reviewed_by ? "none" : "1px solid rgba(255, 255, 255,  0.5)", padding: "5px 10px", borderRadius: "10px", cursor: ticket.reviewed_by ? "auto" : "pointer" }}>{ticket.reviewed_by ? `Being reviewed by: ${ticket.reviewed_by}` : claiming ? "Claimed!" : "Review me!"}</p>
          </div >
        )
      }
    }).reverse()
  )
}
