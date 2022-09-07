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
  const [authedUser, setAuthedUser] = useState<any>(null);
  const [hamburgerClick, setHamburgerClick] = useState(false);

  const mediaQueries = useMediaQueries({
    under768: '(max-width: 768px)',
  });

  useEffect(() => {
    const user = supabase.auth.user()
    if (!user) {
      window.location.href = '/login'
    }
    setAuthedUser(user)
    console.log(user)
  }, [])

  function handleHamburgerClick() {
    setHamburgerClick(true);
  }

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Header hamburgerClick={hamburgerClick} handleHamburgerClick={handleHamburgerClick} />
      <Head>
        <title>Ticketing Solution</title>
        <meta name="ticketing" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={{ width: "100%", minHeight: "100vh", alignItems: "center", position: hamburgerClick ? "fixed" : "absolute", overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", width: "100%", zIndex: 3 }}>
          <HamburgerMenu hamburgerClick={hamburgerClick} setHamburgerClick={setHamburgerClick} />
        </div>
        <main style={{ margin: 0, padding: 0, height: "100%", width: "100%" }}>
          <div style={{ margin: mediaQueries.under768 ? "12px 0" : "6% 0", width: "100%" }}>
            <TicketForm />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default Home
