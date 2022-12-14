import useMediaQueries from 'media-queries-in-react';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import HamburgerMenu from '../components/HamburgerMenu';
import Header from '../components/Header';
import Modal from '../components/Modal/Modal';
import supabase from '../functions/supabase';
import { OnMouseEnter, OnMouseOut } from '../functions/MouseEvents';
import palette from '../styles/palette';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import { useRouter } from 'next/router';
import { sendSlackMessageReview } from '../functions/sendSlackMessage';

export default function DevTickets() {
  const content = {
    complexityLevelModalTitle:
      'The complexity level is based on the fibonacci sequence because I felt like being quirky',
    modalList: '1 is the lowest complexity level where 13 is the highest',
    modalList1: 'A complexity level of 1 should mean that the ticket can likely be completed in one day by one person',
    modalList2:
      'A complexity level of 2 should mean that the ticket can likely be completed in two or three days by one person',
    modalList3:
      'A complexity level of 3 should mean that the ticket can likely be completed in three or more days by one person with some potential need for help',
    modalList4:
      'A complexity level of 5 should mean that the ticket can likely be completed in a day or two by two or more people',
    modalList5:
      'A complexity level of 8 should mean that the ticket can likely be completed in a week plus by two or more people',
    modalList6:
      'A complexity level of 13 should mean that the ticket is likely a full project warranting discussion by the whole team',
  };

  const mediaQueries = useMediaQueries({
    under768: '(max-width: 768px)',
  });

  const router = useRouter();

  interface Developer {
    id: number;
    created_at: string;
    name: string;
    email: string;
    user_type: string;
  }

  const [tickets, setTickets] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showJoshTickets, setShowJoshTickets] = useState(false);
  const [hamburgerClick, setHamburgerClick] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [developers, setDevelopers] = useState<Developer[]>([]);

  async function getDevNames() {
    const { data: admins, error } = await supabase.from('admins').select('*');
    let adminsArray: Developer[] = [];
    admins!.map((admin: Developer) => {
      adminsArray.push(admin.name as any);
    });
    setDevelopers(adminsArray);
  }

  async function getTickets() {
    let { data: tickets, error } = await supabase.from('tickets').select('*');
    setTickets(tickets);
  }

  useEffect(() => {
    const authenticatedUser = supabase.auth.user();
    if (!authenticatedUser || authenticatedUser.user_metadata.typeOfUser !== 'admin') {
      window.location.href = '/';
    }
    getTickets();
    getDevNames();
    setUser(authenticatedUser);
    setLoading(false);
  }, []);

  function updateComplexityLevel(e: any, setComplexityLevel: Function) {
    setComplexityLevel(e.target.value);
  }

  async function addComplexityLevel(e: any, ticket: any, complexityLevel: number | string, setSetting: Function) {
    e.preventDefault();
    setSetting(true);
    if (complexityLevel == 13) {
      if (confirm('Would you like to create a Kanban project from this ticket?')) {
        const { data, error } = await supabase.from('kanbanCards').insert([{ project_name: ticket.title }]);
        router.push('/kanban');
      }
    }
    const { data, error } = await supabase
      .from('tickets')
      .update({ complexity_level: complexityLevel })
      .eq('id', ticket.id);
    getTickets();
    setSetting(false);
  }

  async function addToCompleted(ticket: any) {
    const { data, error } = await supabase.from('completed').insert([
      {
        title: ticket.title,
        description: ticket.description,
        picture: ticket.picture,
        priority_level: ticket.priority_level,
        complexity_level: ticket.complexity_level,
        assigned_to: ticket.assigned_to,
      },
    ]);
  }

  async function handleComplete(e: any, ticket: any) {
    e.preventDefault();
    if (confirm(`Are you sure you want to complete this ticket?\n\nThis action cannot be undone.`)) {
      addToCompleted(ticket);
      const { data, error } = await supabase.from('tickets').delete().eq('id', ticket.id);
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
      .update({ page_url: urlText ? urlText : ticket.page_url, status: 'Testing/QA' })
      .eq('id', ticket.id);
    if (!ticket.reviewed_by) {
      sendSlackMessageReview(`${process.env.NEXT_PUBLIC_SLACK_WEBHOOK_TICKETS_TO_REVIEW}`, ticket, urlText, user);
    }
    setSending(false);
    setOpen(false);
    getTickets();
  }

  function onMouseOver(e: any) {
    e.target.style.textDecoration = 'underline';
  }

  function onMouseLeave(e: any) {
    e.target.style.textDecoration = 'none';
  }

  const listItemMargin = '0 0 20px 0';
  let sorted = [];
  if (tickets) {
    const firstSort = tickets.sort((a: any, b: any) => a.id - b.id).reverse();
    sorted = firstSort.sort((a: any, b: any) => {
      return a.priority_level - b.priority_level;
    });
  }

  function handleHamburgerClick() {
    setHamburgerClick(true);
  }

  setTimeout(() => {
    getTickets();
  }, 720000);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Head>
        <title>Ticketing Solution</title>
        <meta name='Quick Ticketing Solution' />
        <link rel='icon' href='/ticket-favicon.png' />
      </Head>
      <div
        style={{
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: hamburgerClick ? 'fixed' : 'absolute',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', zIndex: 3 }}>
          <HamburgerMenu hamburgerClick={hamburgerClick} setHamburgerClick={setHamburgerClick} />
        </div>
        <Header handleHamburgerClick={handleHamburgerClick} />
        <main
          style={{
            margin: 0,
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            height: '100%',
            width: '100%',
            overflowY: 'auto',
          }}
        >
          {loading || !user ? (
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
              <p
                onClick={() => setShowModal(!showModal)}
                onMouseEnter={(e) => OnMouseEnter(e)}
                onMouseOut={(e) => OnMouseOut(e)}
                style={{
                  fontSize: 24,
                  border: '1px solid black',
                  borderRadius: '50%',
                  padding: '5px 15px',
                  cursor: 'pointer',
                  position: 'absolute',
                  top: mediaQueries.under768 ? '9%' : '100px',
                  right: '40px',
                }}
              >
                ?
              </p>
              {showModal ? (
                <Modal
                  styleOverride={{
                    maxHeight: '90vh',
                    padding: '10px',
                    backgroundColor: palette.pageBackgroundColor,
                    width: mediaQueries.under768 ? '90%' : '63%',
                    margin: mediaQueries.under768 ? '5% 5%' : '10% 18.5%',
                    height: 'fit-content',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    textAlign: 'center',
                    border: '1px solid rgba(0, 0, 0, 0.4)',
                    borderRadius: '10px',
                    color: 'black',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      margin: '2px',
                      fontSize: mediaQueries.under768 ? 15 : 18,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <p
                      onClick={() => setShowModal(false)}
                      style={{
                        margin: 0,
                        marginLeft: 'auto',
                        marginRight: '5px',
                        marginTop: '5px',
                        padding: '5px',
                        cursor: 'pointer',
                      }}
                    >
                      X
                    </p>
                    <p>{content.complexityLevelModalTitle}</p>
                    <ul style={{ textAlign: 'left' }}>
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
              ) : null}
              <p
                onMouseEnter={(e) => onMouseOver(e)}
                onMouseOut={(e) => onMouseLeave(e)}
                onClick={() => setShowJoshTickets(!showJoshTickets)}
                style={{ fontWeight: 700, fontSize: 30, cursor: 'pointer' }}
              >
                {"Josh's Tickets"}
              </p>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  maxWidth: '1500px',
                  width: '100%',
                }}
              >
                <AssignedTickets
                  authedUser={user}
                  showTickets={showJoshTickets}
                  mediaQueries={mediaQueries}
                  tickets={tickets}
                  updateComplexityLevel={updateComplexityLevel}
                  addComplexityLevel={addComplexityLevel}
                  sorted={sorted}
                  handleComplete={handleComplete}
                  name={'Joshua Levine'}
                  handleSendToQA={handleSendToQA}
                  developers={developers}
                  getTickets={getTickets}
                />
              </div>
              <div style={{ margin: mediaQueries.under768 ? '15% 0' : '2% 0' }} />
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function AssignedTickets({
  tickets,
  updateComplexityLevel,
  addComplexityLevel,
  mediaQueries,
  showTickets,
  sorted,
  handleComplete,
  name,
  handleSendToQA,
  authedUser,
  developers,
  getTickets,
}: {
  tickets: any;
  updateComplexityLevel: Function;
  addComplexityLevel: Function;
  mediaQueries: any;
  showTickets: boolean;
  sorted: any;
  handleComplete: Function;
  name: string;
  handleSendToQA: Function;
  authedUser: any;
  developers: any;
  getTickets: Function;
}) {
  let claimedTickets = 0;
  tickets.map((ticket: any) => {
    if (ticket.assigned_to === name) {
      claimedTickets++;
    }
  });

  return claimedTickets > 0
    ? sorted
        .map((ticket: any) => {
          return ticket.assigned_to === name && showTickets ? (
            <div
              key={ticket.id}
              style={{
                display: 'flex',
                justifyContent: 'center',
                margin: mediaQueries.under768 ? '21px 15px' : '25px 1%',
                alignItems: 'center',
                width: mediaQueries.under768 ? '75%' : '30%',
              }}
            >
              <ActualTicket
                authedUser={authedUser}
                ticket={ticket}
                name={name}
                showTickets={showTickets}
                handleComplete={handleComplete}
                mediaQueries={mediaQueries}
                handleSendToQA={handleSendToQA}
                updateComplexityLevel={updateComplexityLevel}
                addComplexityLevel={addComplexityLevel}
                developers={developers}
                getTickets={getTickets}
              />
            </div>
          ) : null;
        })
        .reverse()
    : null;
}

function ActualTicket({
  ticket,
  name,
  showTickets,
  handleComplete,
  mediaQueries,
  handleSendToQA,
  updateComplexityLevel,
  addComplexityLevel,
  authedUser,
  developers,
  getTickets,
}: {
  ticket: any;
  name: string;
  showTickets: boolean;
  handleComplete: Function;
  mediaQueries: any;
  handleSendToQA: Function;
  updateComplexityLevel: Function;
  addComplexityLevel: Function;
  authedUser: any;
  developers: any;
  getTickets: Function;
}) {
  const [open, setOpen] = useState(false);
  const [urlText, setUrlText] = useState('');
  const [sending, setSending] = useState(false);
  const [complexityLevel, setComplexityLevel] = useState('1');
  const [setting, setSetting] = useState(false);
  const [developerAssigned, setDeveloperAssigned] = useState('');
  const [sendingOff, setSendingOff] = useState(false);

  async function handlePassOff(e: any, ticket: any) {
    e.preventDefault();
    setSendingOff(true);
    const { data, error } = await supabase
      .from('tickets')
      .update({ assigned_to: developerAssigned })
      .eq('id', ticket.id);
    getTickets();
    setSendingOff(false);
  }

  return ticket.assigned_to === name && showTickets ? (
    <div
      className='devTicketList-ticket'
      style={{
        border:
          ticket.priority_level === 3 ? `1px solid ${palette.emergencyRed}` : '1px solid rgba(255, 255, 255, 0.4)',
        boxShadow: ticket.priority_level === 3 ? `4px 2px 9px 1px ${palette.emergencyRed}` : '4px 2px 9px 1px #888888',
      }}
    >
      {ticket.assigned_to === authedUser.user_metadata.name ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <button className='dev-ticket-button' onClick={(e) => handleComplete(e, ticket)}>
            {'Complete?'}
          </button>
          <button
            className='dev-ticket-button'
            onClick={ticket.status !== 'Testing/QA' ? (e) => setOpen(!open) : () => {}}
          >
            {ticket.status === 'Testing/QA' ? 'In QA' : 'Send to QA?'}
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
          <p>{'Is this ready to be tested?'}</p>
          <p>{"Don't forget to include the page URL(s) below if necessary!"}</p>
          <p>{'If there are multiple URLs, separate with a comma!'}</p>
          <input type='text' value={urlText} onChange={(e) => setUrlText(e.target.value)} style={{ width: '250px' }} />
          <br />
          <button className='sendToQA-button' onClick={(e) => handleSendToQA(e, ticket, setSending, urlText, setOpen)}>
            {sending ? 'Sending...' : 'Send on over'}
          </button>
        </div>
      ) : null}
      <p style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 0, wordBreak: 'break-all' }}>{ticket.title}</p>
      <p style={{ wordBreak: 'break-word' }}>{ticket.description}</p>
      {ticket.reviewed_by ? (
        <p>
          <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>{'Reviewed By:'}</span> {ticket.reviewed_by}
        </p>
      ) : null}
      {ticket.notes ? (
        <p style={{ marginTop: 0 }}>
          <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>{'Notes:'}</span> {ticket.notes}
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
                : process.env.NEXT_PUBLIC_SUPABASE_URL + '/storage/v1/object/public/previews/public/noImage.png'
            }
            alt={ticket.title + " image"}
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
      <p>Complexity level: {ticket.complexity_level ? ticket.complexity_level : 'Not yet assigned'}</p>
      {ticket.assigned_to == authedUser.user_metadata.name ? (
        <>
          <select
            defaultValue={ticket.complexity_level ? ticket.complexity_level : complexityLevel}
            onClick={(e) => updateComplexityLevel(e, setComplexityLevel)}
            style={{ margin: '0 0 12px 0', width: mediaQueries.under768 ? '250px' : '250px' }}
          >
            <option value={'1'}>1</option>
            <option value={'2'}>2</option>
            <option value={'3'}>3</option>
            <option value={'5'}>5</option>
            <option value={'8'}>8</option>
            <option value={'13'}>13</option>
          </select>
          <button
            className='dev-ticket-button set'
            onClick={(e) => addComplexityLevel(e, ticket, complexityLevel, setSetting)}
          >
            {setting ? 'Setting...' : 'Set'}
          </button>
        </>
      ) : null}
      {ticket.assigned_to === authedUser.user_metadata.name ? (
        <>
          <p>Would you like to pass this project off to someone else?</p>
          <select
            defaultValue={''}
            style={{ margin: '0 0 12px 0', width: mediaQueries.under768 ? '250px' : '250px' }}
            onClick={(e: any) => {
              e.preventDefault();
              setDeveloperAssigned(e.target.value);
            }}
          >
            <option value={''}>{'Select a developer'}</option>
            {developers.map((dev: any) => {
              return (
                <option key={dev.id} value={dev.name}>
                  {dev.name}
                </option>
              );
            })}
          </select>
          <button onClick={(e: any) => handlePassOff(e, ticket)} className='dev-ticket-button'>
            {sendingOff ? 'Passing off...' : 'Pass off'}
          </button>
        </>
      ) : null}
    </div>
  ) : null;
}
