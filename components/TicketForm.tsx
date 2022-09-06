import React, { useRef, useState } from 'react';
import Modal from './Modal';
import useMediaQueries from 'media-queries-in-react';
import supabase from './supabase';

export default function TicketForm() {
  const mediaQueries = useMediaQueries({
    under768: '(max-width: 768px)',
  });

  const ref = useRef("");

  const [showModal, setShowModal] = useState(false);
  const [selection, setSelection] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [file, setFile] = useState<any>("");
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
    setSelection(e.target.value)
  }

  async function readFiles() {
    let dataMap: any[] = [];
    const { data, error } = await supabase.storage.from('ticket-images').list('public', {
      limit: 100,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' },
    })
    if (data) {
      dataMap = data.map((file) => {
        file.name
      })
      return dataMap;
    } else {
      return dataMap;
    }
  }

  async function fileUpload() {
    // let fileNames = await readFiles();
    if (file) {
      const { data, error } = await supabase.storage
        .from('ticket-images')
        .upload(fileUrl, file, {
          cacheControl: '3600',
          upsert: false,
        });
    } else {
      return
    }
  }

  async function createTicket() {
    const { data, error } = await supabase
      .from('tickets')
      .insert([
        { title, description, picture: fileUrl, priority_level: selection },
      ]);
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    await fileUpload();
    await createTicket();
    setSelection(0);
    setTitle("");
    setDescription("");
    setFileUrl("");
    setFile("");
    ref.current = "";
    setLoading(false);
    setSubmitted(true)
  }

  return (
    <div style={{ width: "100%", display: "flex", alignItems: 'center', justifyContent: "center", margin: mediaQueries.under768 ? 0 : "12px 20px" }}>
      {
        showModal ?
          <Modal styleOverride={{ backgroundColor: "black", width: mediaQueries.under768 ? "90%" : "60%", height: "fit-content", border: "1px solid rgba(255, 255, 255, 0.5)", top: mediaQueries.under768 ? "15%" : "18%", left: mediaQueries.under768 ? "5%" : "20%", padding: mediaQueries.under768 ? "18px" : "20px" }} >
            <p onClick={(e) => handlePriorityInfoClick(e)} style={{ margin: "12px 12px 0 12px", cursor: "pointer", width: "fit-content", marginLeft: "auto" }} >X</p>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: 'center', fontSize: 18 }}>
              <p>How important is this?</p>
              <p>Complete when you can tickets will take lowest priority</p>
              <p>Complete this week tickets will come next in line</p>
              <p>Complete by tomorrow tickets should be considered the most important unless something is breaking and needs attention now</p>
              <p>Emergency tickets will enter a separate queue and will take priority to everything else</p>
            </div>
          </Modal>
          : null
      }

      <form style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: mediaQueries.under768 ? "80%" : "50% ", border: mediaQueries.under768 ? "none" : "1px solid rgba(255, 255, 255, 0.5)", borderRadius: "10px", fontSize: 21 }}>
        {submitted ?
          <>
            <p>Thank you for reaching out!</p>
            <p>Your ticket has been submitted!</p>
            <button style={{ margin: "0 0 20px 0", fontSize: 18, padding: "5px 10px" }} onClick={() => setSubmitted(false)} >Submit another?</button>
          </>
          :
          <>
            <label style={{ margin: "12px 0" }}>Title:</label>
            <input value={title} type="text" style={{ width: mediaQueries.under768 ? "60%" : "25%" }} onChange={(e) => handleTitle(e)} />
            <label style={{ margin: "12px 0" }}>Describe what you need:</label>
            <textarea
              value={description}
              onChange={(e) => handleDescription(e)}
              rows={10}
              cols={mediaQueries.under768 ? 40 : 75}
            />
            <label style={{ margin: "12px 0" }}>Any pictures?</label>
            <input onChange={(e) => handleFileUrl(e)} type="file" style={{ cursor: "pointer" }} />
            <label style={{ margin: "12px 0", display: "flex", alignItems: 'center' }}>Priority Level <span onClick={(e) => handlePriorityInfoClick(e)} style={{ border: "1px solid white", borderRadius: "50%", margin: "0 5px", padding: "2px 4px", fontSize: 9, cursor: "pointer" }}>i</span></label>
            <select style={{ width: mediaQueries.under768 ? "60%" : "fit-content", fontSize: 18 }} onClick={(e) => handleSelectionChange(e)}>
              <option value={0}>Complete when you can</option>
              <option value={1}>Complete this week</option>
              <option value={2}>Complete by tomorrow</option>
              <option value={3}>EMERGENCY NEEDS TO BE COMPLETED ASAP</option>
            </select>
            <button onClick={(e) => handleSubmit(e)} style={{ width: mediaQueries.under768 ? "40%" : "18%", margin: "12px 0", cursor: "pointer" }}>{loading ? "Submitting..." : "Submit Ticket"}</button>
          </>
        }
      </form>
    </div >
  )
}