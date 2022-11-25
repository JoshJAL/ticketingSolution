import React, { useState } from 'react';
import Modal from './Modal/Modal';
import useMediaQueries from 'media-queries-in-react';
import supabase from '../functions/supabase';
import axios from 'axios';

export default function TicketForm({ user }: { user: any }) {
  const mediaQueries = useMediaQueries({
    under768: '(max-width: 768px)',
  });

  const [showModal, setShowModal] = useState(false);
  const [selection, setSelection] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [file, setFile] = useState<any>('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handlePriorityInfoClick(e: any) {
    e.preventDefault();
    setShowModal(!showModal);
  }

  function handleTitle(e: any) {
    setTitle(e.target.value);
  }

  function handleDescription(e: any) {
    setDescription(e.target.value);
  }

  function handleFileUrl(e: any) {
    setFile(e.target.files[0]);
    setFileUrl(`public/${e.target.files[0].name}`);
  }

  function handleSelectionChange(e: any) {
    setSelection(e.target.value);
  }

  async function fileUpload() {
    if (file) {
      const { data, error } = await supabase.storage.from('ticket-images').upload(fileUrl, file, {
        cacheControl: '3600',
        upsert: false,
      });
    } else {
      return;
    }
  }

  async function sendSlackMessage(webhookUrl: string) {
    const data = {
      username: 'Ticket Bot',
      icon_url:
        'https://camo.githubusercontent.com/6e466156683138348d4283ec8ab1a8a8a959dbb6e2f9c06c1300f06ab01c7504/687474703a2f2f66696c65732d6d6973632e73332e616d617a6f6e6177732e636f6d2f6c756e6368626f742e6a7067',
      text: `A new ticket was submitted by ${
        user.user_metadata.name
      }! \n Title: ${title} \n Description: ${description} \n Priority: ${
        selection == 3
          ? 'EMERGENCY'
          : selection == 2
          ? 'NEED TODAY OR TOMORROW'
          : selection == 1
          ? 'Need by the end of the week'
          : 'No rush'
      }`,
    };
    const res = await axios.post(webhookUrl, JSON.stringify(data), {
      withCredentials: false,
      transformRequest: [
        (data, headers) => {
          //@ts-ignore
          delete headers.post['Content-Type'];
          return data;
        },
      ],
    });
  }

  async function createTicket() {
    const { data, error } = await supabase
      .from('tickets')
      .insert([{ title, description, picture: fileUrl, priority_level: selection, created_by: user.email.trim() }]);
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    await fileUpload();
    await createTicket();
    await sendSlackMessage(`${process.env.NEXT_PUBLIC_SLACK_WEBHOOK_INCOMING_TICKETS}`);
    setSelection(0);
    setTitle('');
    setDescription('');
    setFileUrl('');
    setFile('');
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: mediaQueries.under768 ? 0 : '12px 20px',
        height: '100%',
      }}
    >
      {showModal ? (
        <Modal
          styleOverride={{
            width: mediaQueries.under768 ? '90%' : '60%',
            height: 'fit-content',
            border: '1px solid black',
            top: mediaQueries.under768 ? '15%' : '18%',
            left: 'auto',
            padding: mediaQueries.under768 ? '18px' : '20px',
            borderRadius: '10px',
          }}
        >
          <p
            onClick={(e) => handlePriorityInfoClick(e)}
            style={{
              margin: '12px 12px 0 12px',
              cursor: 'pointer',
              width: 'fit-content',
              marginLeft: 'auto',
              fontWeight: 600,
            }}
          >
            X
          </p>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            <p>How important is this?</p>
            <p>Complete when you can tickets will take lowest priority</p>
            <p>Complete this week tickets will come next in line</p>
            <p>
              Complete by tomorrow tickets should be considered the most important unless something is breaking and
              needs attention now
            </p>
            <p>Emergency tickets will enter a separate queue and will take priority to everything else</p>
          </div>
        </Modal>
      ) : null}

      <form>
        {submitted ? (
          <>
            <p>Thank you for reaching out!</p>
            <p>Your ticket has been submitted!</p>
            <button
              style={{ margin: '0 0 20px 0', fontSize: 18, padding: '5px 10px' }}
              onClick={() => setSubmitted(false)}
            >
              Submit another?
            </button>
          </>
        ) : (
          <>
            <label style={{ margin: '12px 0' }}>Title:</label>
            <input
              value={title}
              type='text'
              onChange={(e) => handleTitle(e)}
              placeholder='Page URL(s)/descriptive title'
            />
            <label style={{ margin: '12px 0' }}>Describe what you need:</label>
            <textarea
              placeholder='A description of what needs to be done, please be as detailed as possible'
              value={description}
              onChange={(e) => handleDescription(e)}
              rows={mediaQueries.under768 ? 5 : 10}
            />
            <label style={{ margin: '12px 0', textAlign: 'center' }}>Picture or document?</label>
            <div style={{ width: mediaQueries.under768 ? '341px' : '47%' }}>
              <input onChange={(e) => handleFileUrl(e)} type='file' style={{ cursor: 'pointer', width: '100%' }} />
            </div>
            <label style={{ margin: '12px 0', display: 'flex', alignItems: 'center' }}>
              Priority Level{' '}
              <span
                onClick={(e) => handlePriorityInfoClick(e)}
                style={{
                  border: '1px solid black',
                  borderRadius: '50%',
                  margin: '0 5px',
                  padding: '2px 4px',
                  fontSize: 9,
                  cursor: 'pointer',
                }}
              >
                i
              </span>
            </label>
            <select value={selection} onChange={(e) => handleSelectionChange(e)}>
              <option value={0}>Complete when you can</option>
              <option value={1}>Complete this week</option>
              <option value={2}>Complete by tomorrow</option>
              <option value={3}>EMERGENCY NEEDS TO BE COMPLETED ASAP</option>
            </select>
            <button onClick={(e) => handleSubmit(e)}>{loading ? 'Submitting...' : 'Submit Ticket'}</button>
          </>
        )}
      </form>
    </div>
  );
}
