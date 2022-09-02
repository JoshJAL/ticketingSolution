import React, { useState } from 'react'
import Modal from './Modal';
import useMediaQueries from 'media-queries-in-react';

export default function TicketForm() {
  const mediaQueries = useMediaQueries({
    under768: '(max-width: 768px)',
  });

  const [showModal, setShowModal] = useState(false)

  function handlePriorityInfoClick() {
    setShowModal(!showModal)
  }

  return (
    <div style={{ width: "100%", display: "flex", alignItems: 'center', justifyContent: "center" }}>
      {
        showModal ?
          <Modal styleOverride={{ backgroundColor: "black", width: "25%", height: '25%', border: "1px solid rgba(255, 255, 255, 0.5)", top: "10%", left: "37%" }} >
            <p onClick={handlePriorityInfoClick} style={{ textAlign: "right", margin: "12px 12px 0 12px", cursor: "pointer" }} >X</p>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <p>On a scale of 1 to 10 how important is this?</p>
              <p>1 being take your time, just needs to get done at some point</p>
              <p>10 being needs to get done immediately/this is an emergency</p>
            </div>
          </Modal>
          : null
      }
      <form style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: mediaQueries.under768 ? "75%" : "50% ", border: "1px solid rgba(255, 255, 255, 0.5)" }}>
        <label style={{ margin: "12px 0" }}>Describe what you need:</label>
        <textarea
          rows={10}
          cols={mediaQueries.under768 ? 30 : 75}
        />
        <label style={{ margin: "12px 0" }}>Any pictures?</label>
        <input type="file" style={{ cursor: "pointer" }} />
        <label style={{ margin: "12px 0", display: "flex", alignItems: 'center' }}>Priority Level <span onClick={handlePriorityInfoClick} style={{ border: "1px solid white", borderRadius: "50%", margin: "0 5px", padding: "2px 4px", fontSize: 9, cursor: "pointer" }}>i</span></label>
        <select>
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
          <option>6</option>
          <option>7</option>
          <option>8</option>
          <option>9</option>
          <option>10</option>
        </select>
        <button style={{ width: mediaQueries.under768 ? "40%" : "18%", margin: "12px 0", cursor: "pointer" }}>Submit Ticket</button>
      </form>
    </div >
  )
}