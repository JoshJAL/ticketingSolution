import Head from 'next/head'
import Footer from '../components/Footer'
import Header from '../components/Header'
import TicketForm from '../components/TicketForm'
import useMediaQueries from 'media-queries-in-react'
import supabase from '../functions/supabase'
import { useEffect, useState } from 'react'
import HamburgerMenu from '../components/HamburgerMenu'
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner'

export default function Home() {
  const [hamburgerClick, setHamburgerClick] = useState(false);
  const [authedUser, setAuthedUser] = useState<any>(null);

  const mediaQueries = useMediaQueries({
    under768: '(max-width: 768px)',
  });

  useEffect(() => {
    const user = supabase.auth.user()
    if (!user) {
      window.location.href = '/login'
    }
    setAuthedUser(user);
  }, [])

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
        <link rel="icon" href="/ticket-favicon.png" />
      </Head>
      <div style={{ width: "100%", alignItems: "center", position: hamburgerClick ? "fixed" : "absolute", overflow: "hidden" }}>
        <main style={{ margin: 0, padding: 0, width: "100%", overflow: mediaQueries.under768 ? "hidden" : "initial" }}>
          <div style={{ margin: mediaQueries.under768 ? "12px 0" : "50px 0 111px 0", width: "100%", minHeight: "100%" }}>
            {!authedUser ?
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: "center", height: "50vh", transform: "scale(3)" }}>
                <LoadingSpinner />
              </div>
              :
              <TicketForm user={authedUser} />
            }
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}