import React, { useEffect, useState } from 'react'
import Modal from './Modal';
import useMediaQueries from 'media-queries-in-react';

export default function TicketForm() {
  const mediaQueries = useMediaQueries({
    under768: '(max-width: 768px)',
  });

  const [showModal, setShowModal] = useState(false)

  useEffect(() => {

  }, [])

  function handlePriorityInfoClick(e: any) {
    e.preventDefault()
    setShowModal(!showModal)
    console.log(showModal)
  }

  return (
    <div style={{ width: "100%", display: "flex", alignItems: 'center', justifyContent: "center", margin: "12px 20px" }}>
      {
        showModal ?
          <Modal styleOverride={{ backgroundColor: "black", width: mediaQueries.under768 ? "90%" : "60%", height: mediaQueries.under768 ? "60%" : '30%', border: "1px solid rgba(255, 255, 255, 0.5)", top: mediaQueries.under768 ? "15%" : "15%", left: mediaQueries.under768 ? "5%" : "20%", padding: mediaQueries.under768 ? "18px" : "20px" }} >
            <p onClick={(e) => handlePriorityInfoClick(e)} style={{ margin: "12px 12px 0 12px", cursor: "pointer", width: "fit-content" }} >X</p>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <p>How important is this?</p>
              <p>Complete when you can tickets will take lowest priority</p>
              <p>Complete this week tickets will come next in line</p>
              <p>Complete by tomorrow tickets should be considered the most important unless something is breaking and needs attention now</p>
              <p>Emergency tickets will enter a separate queue and will take priority to everything else</p>
            </div>
          </Modal>
          : null
      }
      <form style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: mediaQueries.under768 ? "75%" : "50% ", border: "1px solid rgba(255, 255, 255, 0.5)" }}>
        <label style={{ margin: "12px 0" }}>Title:</label>
        <input type="text" style={{ width: mediaQueries.under768 ? "75%" : "25%" }} />
        <label style={{ margin: "12px 0" }}>Describe what you need:</label>
        <textarea
          rows={10}
          cols={mediaQueries.under768 ? 30 : 75}
        />
        <label style={{ margin: "12px 0" }}>Any pictures?</label>
        <input type="file" style={{ cursor: "pointer" }} />
        <label style={{ margin: "12px 0", display: "flex", alignItems: 'center' }}>Priority Level <span onClick={(e) => handlePriorityInfoClick(e)} style={{ border: "1px solid white", borderRadius: "50%", margin: "0 5px", padding: "2px 4px", fontSize: 9, cursor: "pointer" }}>i</span></label>
        <select style={{ width: mediaQueries.under768 ? "75%" : "25%" }}>
          <option>Complete when you can</option>
          <option>Complete this week</option>
          <option>Complete by tomorrow</option>
          <option>EMERGENCY NEEDS TO BE COMPLETED ASAP</option>
        </select>
        <button style={{ width: mediaQueries.under768 ? "40%" : "18%", margin: "12px 0", cursor: "pointer" }}>Submit Ticket</button>
      </form>
    </div >
  )
}