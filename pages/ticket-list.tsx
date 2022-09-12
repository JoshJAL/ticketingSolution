import Head from 'next/head';
import React, { useState } from 'react';
import HamburgerMenu from '../components/HamburgerMenu';
import Header from '../components/Header';
import Ticket from '../components/Ticket';

export default function TicketList() {
  const [hamburgerClick, setHamburgerClick] = useState(false);

  function handleHamburgerClick() {
    setHamburgerClick(true);
  }

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", width: "100%", zIndex: 3 }}>
        <HamburgerMenu hamburgerClick={hamburgerClick} setHamburgerClick={setHamburgerClick} />
      </div>
      <Header handleHamburgerClick={handleHamburgerClick} />
      <Head>
        <title>Ticketing Solution</title>
        <meta name="ticketing" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={{ width: '100%', alignItems: "center", position: hamburgerClick ? "fixed" : "absolute", height: "100%" }}>
        <main style={{ margin: 0, padding: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", maxWidth: "1500px", width: "100%", }}>
            <Ticket />
          </div>
        </main>
      </div>
    </div>
  )
}