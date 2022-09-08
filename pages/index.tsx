import type { NextPage } from 'next'
import Head from 'next/head'
import Footer from '../components/Footer'
import Header from '../components/Header'
import TicketForm from '../components/TicketForm'
import useMediaQueries from 'media-queries-in-react'
import supabase from '../components/supabase'
import { useEffect, useState } from 'react'
import HamburgerMenu from '../components/HamburgerMenu'

const Home: NextPage = () => {
  const [hamburgerClick, setHamburgerClick] = useState(false);

  const mediaQueries = useMediaQueries({
    under768: '(max-width: 768px)',
  });

  useEffect(() => {
    const user = supabase.auth.user()
    if (!user) {
      window.location.href = '/login'
    }
  }, [])

  function handleHamburgerClick() {
    setHamburgerClick(true);
  }

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", width: "100%", zIndex: 3 }}>
        <HamburgerMenu hamburgerClick={hamburgerClick} setHamburgerClick={setHamburgerClick} />
      </div>
      <Header hamburgerClick={hamburgerClick} handleHamburgerClick={handleHamburgerClick} />
      <Head>
        <title>Ticketing Solution</title>
        <meta name="ticketing" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={{ width: "100%", alignItems: "center", position: hamburgerClick ? "fixed" : "absolute", overflow: "hidden" }}>
        <main style={{ margin: 0, padding: 0, width: "100%", overflow: mediaQueries.under768 ? "hidden" : "initial" }}>
          <div style={{ margin: mediaQueries.under768 ? "12px 0" : "50px 0", width: "100%", }}>
            <TicketForm />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default Home
