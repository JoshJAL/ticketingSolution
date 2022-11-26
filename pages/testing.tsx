import Head from 'next/head';
import Header from '../components/Header';
import useMediaQueries from 'media-queries-in-react';
import supabase from '../functions/supabase';
import { useEffect, useState } from 'react';
import HamburgerMenu from '../components/HamburgerMenu';
import { OnMouseEnter, OnMouseOut } from '../functions/MouseEvents';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import palette from '../styles/palette';

export default function Testing() {
  const [hamburgerClick, setHamburgerClick] = useState(false);
  const [tickets, setTickets] = useState<any>([]);
  const [authedUser, setAuthedUser] = useState<any>(null);

  const mediaQueries = useMediaQueries({
    under768: '(max-width: 768px)',
  });

  async function getTickets() {
    let { data: tickets, error } = await supabase.from('tickets').select('*');
    setTickets(tickets);
  }

  useEffect(() => {
    const authenticatedUser = supabase.auth.user();
    if (!authenticatedUser) {
      window.location.href = '/login';
    } else if (
      !(authenticatedUser.user_metadata.typeOfUser === 'admin' || authenticatedUser.user_metadata.typeOfUser === 'q&a')
    ) {
      window.location.href = '/login';
    }
    getTickets();
    setAuthedUser(authenticatedUser);
  }, []);

  function handleHamburgerClick() {
    setHamburgerClick(true);
  }

  async function handleSendToDev(e: any, ticket: any, setSending: any, notes: any, setOpen: Function) {
    e.preventDefault();
    setSending(true);
    const { data, error } = await supabase
      .from('tickets')
      .update({ notes: tickets.notes ? ticket.notes + notes : notes, status: 'In Development' })
      .eq('id', ticket.id);
    setSending(false);
    setOpen(false);
    getTickets();
  }

  async function handleReviewClick(e: any, ticket: any, setClaiming: Function) {
    e.preventDefault();
    const { data, error } = await supabase
      .from('tickets')
      .update({ reviewed_by: authedUser.user_metadata.name })
      .eq('id', ticket.id);
    setClaiming(true);
    getTickets();
  }

  let sorted = [];
  if (tickets) {
    const initialSort = tickets.sort((a: any, b: any) => {
      return a.id - b.id;
    });
    sorted = initialSort.sort((a: any, b: any) => {
      return a.priority_level - b.priority_level;
    });
  }

  setTimeout(() => {
    getTickets();
  }, 720000);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', zIndex: 3 }}>
        <HamburgerMenu hamburgerClick={hamburgerClick} setHamburgerClick={setHamburgerClick} />
      </div>
      <Header handleHamburgerClick={handleHamburgerClick} />
      <Head>
        <title>Ticketing Solution</title>
        <meta name='Quick Ticketing Solution' />
        <link rel='icon' href='/ticket-favicon.png' />
      </Head>
      <div
        style={{
          width: '100%',
          minHeight: '100vh',
          alignItems: 'center',
          position: hamburgerClick ? 'fixed' : 'absolute',
          overflow: 'hidden',
        }}
      >
        <main
          style={{
            margin: 0,
            padding: 0,
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          {!authedUser ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '50vh',
                transform: 'scale(3)',
              }}
            >
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <p style={{ fontWeight: 700, fontSize: 30, marginBottom: 0 }}>Unclaimed Tickets</p>
              <div
                style={{
                  margin: mediaQueries.under768 ? '12px 0' : '0',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <NotReviewedTickets
                  mediaQueries={mediaQueries}
                  sorted={sorted}
                  handleSendToDev={handleSendToDev}
                  handleReviewClick={handleReviewClick}
                />
              </div>
              <p style={{ fontWeight: 700, fontSize: 30, marginBottom: 0 }}>Your Tickets</p>
              <div
                style={{
                  margin: mediaQueries.under768 ? '12px 0' : '0',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <YourTickets
                  mediaQueries={mediaQueries}
                  sorted={sorted}
                  handleSendToDev={handleSendToDev}
                  handleReviewClick={handleReviewClick}
                  authedUser={authedUser}
                  getTickets={getTickets}
                />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function NotReviewedTickets({
  mediaQueries,
  sorted,
  handleSendToDev,
  handleReviewClick,
}: {
  mediaQueries: any;
  sorted: any;
  handleSendToDev: Function;
  handleReviewClick: Function;
}) {
  return sorted
    .map((ticket: any) => {
      return !ticket.reviewed_by && ticket.status === 'Testing/QA' ? (
        <div
          key={ticket.id}
          style={{
            width: mediaQueries.under768 ? '75%' : '30%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: mediaQueries.under768 ? '21px 15px' : '25px 1%',
          }}
        >
          <ActualTicket ticket={ticket} handleSendToDev={handleSendToDev} handleReviewClick={handleReviewClick} />
        </div>
      ) : null;
    })
    .reverse();
}

function ActualTicket({
  ticket,
  handleSendToDev,
  handleReviewClick,
}: {
  ticket: any;
  handleSendToDev: Function;
  handleReviewClick: Function;
}) {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [sending, setSending] = useState(false);
  const [claiming, setClaiming] = useState(false);

  return !ticket.reviewed_by && ticket.status === 'Testing/QA' ? (
    <div
      className='testing-ticket'
      key={ticket.id}
      style={{
        border:
          ticket.priority_level === 3 ? `1px solid ${palette.emergencyRed}` : '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow: ticket.priority_level === 3 ? `4px 2px 9px 1px ${palette.emergencyRed}` : '4px 2px 9px 1px #888888',
      }}
    >
      {ticket.reviewed_by && ticket.status === 'Testing/QA' ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <p
            onMouseEnter={(e) => OnMouseEnter(e)}
            onMouseOut={(e) => OnMouseOut(e)}
            onClick={(e) => setOpen(!open)}
            style={{
              marginBottom: 'auto',
              fontSize: 15,
              fontWeight: 700,
              border: '1px solid rgba(255, 255, 255, 0.5)',
              padding: '5px',
              borderRadius: '10px',
              cursor: 'pointer',
            }}
          >{`Send to ${ticket.assigned_to.split(' ')[0]}?`}</p>
        </div>
      ) : null}
      {open ? (
        <div
          style={{
            border: '1px solid rgba(255, 255, 255, 0.5)',
            borderRadius: '10px',
            padding: '20px',
            margin: '10px 20px',
          }}
        >
          <p>{'Any notes?'}</p>
          <p>{'If this is ready to be pushed to production let us know!'}</p>
          <input type='text' value={notes} onChange={(e) => setNotes(e.target.value)} />
          <br />
          <button
            style={{ margin: '20px 0 0 0' }}
            onClick={(e) => handleSendToDev(e, ticket, setSending, notes, setOpen)}
          >
            {sending ? 'Sending...' : 'Send on over'}
          </button>
        </div>
      ) : null}
      <p style={{ fontWeight: 600, fontSize: 24, wordBreak: 'break-all' }}>{ticket.title}</p>
      <p style={{ fontWeight: 500, fontSize: 18, marginTop: 0, wordBreak: 'break-all' }}>{ticket.description}</p>
      {ticket.notes ? (
        <p style={{ marginTop: 0 }}>
          <span style={{ fontWeight: 'bold' }}>{'Notes: '}</span>
          {ticket.notes}
        </p>
      ) : null}
      {ticket.page_url && ticket.page_url.includes('.com') ? (
        <p style={{ marginTop: 0 }}>
          <span style={{ fontWeight: 'bold' }}>{'Page Url(s):'}</span>{' '}
          {ticket.page_url.split(',').map((url: string) => {
            return (
              <>
                <a key={ticket.id} style={{ color: '#2b27ff' }} target='_blank' rel='noreferrer' href={url.trim()}>
                  {url.trim()}
                </a>
                <br />
              </>
            );
          })}
        </p>
      ) : null}
      {ticket.picture.includes('.png') ||
      ticket.picture.includes('.jpg') ||
      ticket.picture.includes('.jpeg') ||
      ticket.picture.includes('.gif') ||
      !ticket.picture ? (
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            maxHeight: 'fit-content',
            margin: '0 0 20px 0',
            overflow: 'hidden',
          }}
        >
          <img
            style={{ maxWidth: '45%' }}
            src={
              ticket.picture
                ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/previews/${ticket.picture}`
                : 'https://bzclbrsgarmfqbtxbzxz.supabase.co/storage/v1/object/public/previews/public/noImage.png'
            }
          />
        </div>
      ) : (
        <button
          className='dev-ticket-button'
          style={{ padding: '9px 18px', fontSize: 18 }}
          onClick={(e) => {
            e.preventDefault();
            window.location.href = `${encodeURI(
              `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/previews/${ticket.picture}`,
            )}`;
          }}
        >
          {'Download associated file'}
        </button>
      )}
      <button
        className='reviewMe-button'
        onClick={!ticket.reviewed_by || !claiming ? (e) => handleReviewClick(e, ticket, setClaiming) : () => {}}
        style={{ cursor: ticket.reviewed_by ? 'auto' : 'pointer' }}
      >
        {ticket.reviewed_by ? `Being reviewed by: ${ticket.reviewed_by}` : claiming ? 'Claimed!' : 'Review me!'}
      </button>
    </div>
  ) : null;
}

function YourTickets({
  mediaQueries,
  sorted,
  handleSendToDev,
  handleReviewClick,
  authedUser,
  getTickets,
}: {
  mediaQueries: any;
  sorted: any;
  handleSendToDev: Function;
  handleReviewClick: Function;
  authedUser: any;
  getTickets: Function;
}) {
  return sorted
    .map((ticket: any) => {
      return ticket.reviewed_by === authedUser.user_metadata.name && ticket.status ? (
        <div
          key={ticket.id}
          style={{
            width: mediaQueries.under768 ? '75%' : '30%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            margin: mediaQueries.under768 ? '21px 15px' : '25px 1%',
          }}
        >
          <YourActualTicket
            ticket={ticket}
            authedUser={authedUser}
            handleSendToDev={handleSendToDev}
            handleReviewClick={handleReviewClick}
            getTickets={getTickets}
          />
        </div>
      ) : null;
    })
    .reverse();
}

function YourActualTicket({
  ticket,
  authedUser,
  handleSendToDev,
  handleReviewClick,
  getTickets,
}: {
  ticket: any;
  authedUser: any;
  handleSendToDev: Function;
  handleReviewClick: Function;
  getTickets: Function;
}) {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [sending, setSending] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [returning, setReturning] = useState(false);

  async function handleReturnToPool(e: any) {
    e.preventDefault();
    setReturning(true);
    const { data, error } = await supabase.from('tickets').update({ reviewed_by: null }).match({ id: ticket.id });
    getTickets();
    setReturning(false);
  }

  return ticket.reviewed_by === authedUser.user_metadata.name && ticket.status ? (
    <div
      className='testing-ticket'
      style={{
        border:
          ticket.priority_level === 3 ? `1px solid ${palette.emergencyRed}` : '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow: ticket.priority_level === 3 ? `4px 2px 9px 1px ${palette.emergencyRed}` : '4px 2px 9px 1px #888888',
      }}
    >
      {ticket.reviewed_by ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <button
            className='dev-ticket-button'
            onClick={(e) => {
              ticket.status === 'Testing/QA' ? setOpen(!open) : {};
            }}
          >
            {ticket.status === 'Testing/QA'
              ? `Send to ${ticket.assigned_to.split(' ')[0]}?`
              : `Being updated by ${ticket.assigned_to.split(' ')[0]}`}
          </button>
        </div>
      ) : null}
      {open ? (
        <div
          style={{
            border: '1px solid black',
            borderRadius: '10px',
            padding: '20px',
            margin: '10px 20px',
            width: '100%',
          }}
        >
          <p>{'Any notes?'}</p>
          <p>{'If this is ready to be pushed to production let us know!'}</p>
          <input type='text' value={notes} onChange={(e) => setNotes(e.target.value)} style={{ width: '250px' }} />
          <br />
          <button
            className='sendToDev-button'
            style={{ margin: '20px 0 0 0' }}
            onClick={(e) => handleSendToDev(e, ticket, setSending, notes, setOpen)}
          >
            {sending ? 'Sending...' : 'Send on over'}
          </button>
        </div>
      ) : null}
      <p style={{ fontWeight: 600, fontSize: 24, wordBreak: 'break-all' }}>{ticket.title}</p>
      <p style={{ fontWeight: 500, fontSize: 18, marginTop: 0, wordBreak: 'break-word' }}>{ticket.description}</p>
      {ticket.notes ? (
        <p style={{ marginTop: 0 }}>
          <span style={{ fontWeight: 'bold' }}>{'Notes: '}</span>
          {ticket.notes}
        </p>
      ) : null}
      {ticket.page_url && ticket.page_url.includes('.com') ? (
        <p style={{ marginTop: 0 }}>
          <span style={{ fontWeight: 'bold' }}>{'Page Url(s):'}</span>{' '}
          {ticket.page_url.split(',').map((url: string) => {
            return (
              <>
                <a key={ticket.id} style={{ color: '#2b27ff' }} target='_blank' rel='noreferrer' href={url.trim()}>
                  {url.trim()}
                </a>
                <br />
              </>
            );
          })}
        </p>
      ) : null}
      {ticket.picture.includes('.png') ||
      ticket.picture.includes('.jpg') ||
      ticket.picture.includes('.jpeg') ||
      ticket.picture.includes('.gif') ||
      !ticket.picture ? (
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            maxHeight: 'fit-content',
            margin: '0 0 20px 0',
            overflow: 'hidden',
          }}
        >
          <img
            style={{ maxWidth: '45%' }}
            src={
              ticket.picture
                ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/previews/${ticket.picture}`
                : 'https://bzclbrsgarmfqbtxbzxz.supabase.co/storage/v1/object/public/previews/public/noImage.png'
            }
          />
        </div>
      ) : (
        <button
          className='dev-ticket-button'
          style={{ padding: '9px 18px', fontSize: 18 }}
          onClick={(e) => {
            e.preventDefault();
            window.location.href = `${encodeURI(
              `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/previews/${ticket.picture}`,
            )}`;
          }}
        >
          {'Download associated file'}
        </button>
      )}
      <p
        onClick={!ticket.reviewed_by || !claiming ? (e) => handleReviewClick(e, ticket, setClaiming) : () => {}}
        onMouseEnter={!ticket.reviewed_by ? (e) => OnMouseEnter(e) : () => {}}
        onMouseOut={!ticket.reviewed_by ? (e) => OnMouseOut(e) : () => {}}
        style={{
          fontSize: 18,
          fontWeight: 600,
          border: ticket.reviewed_by ? 'none' : '1px solid rgba(255, 255, 255,  0.5)',
          padding: '5px 10px',
          borderRadius: '10px',
          cursor: ticket.reviewed_by ? 'auto' : 'pointer',
        }}
      >
        {ticket.reviewed_by ? `Being reviewed by: ${ticket.reviewed_by}` : claiming ? 'Claimed!' : 'Review me!'}
      </p>
      <button className='dev-ticket-button' onClick={(e) => handleReturnToPool(e)}>
        {returning ? 'Unclaiming...' : 'Unclaim Ticket'}
      </button>
    </div>
  ) : null;
}
