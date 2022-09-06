import useMediaQueries from 'media-queries-in-react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Footer from '../components/Footer'
import HamburgerMenu from '../components/HamburgerMenu'
import Header from '../components/Header'
import supabase from '../components/supabase'
import Ticket from '../components/Ticket'

export default function ticketList() {
  const [authedUser, setAuthedUser] = useState<any>(null);
  const [hamburgerClick, setHamburgerClick] = useState(false);

  const mediaQueries = useMediaQueries({
    under768: '(max-width: 768px)',
  });

  const router = useRouter();

  useEffect(() => {
    const user = supabase.auth.user()
    if (!user) {
      router.push('/login')
    }
    setAuthedUser(user)
  }, [])

  function handleHamburgerClick() {
    setHamburgerClick(true);
  }

  return (
    <div style={{ margin: 0, padding: 0 }}>
      <Head>
        <title>Ticketing Solution</title>
        <meta name="ticketing" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={{ minWidth: "100%", minHeight: "100vh", alignItems: "center", position: hamburgerClick ? "fixed" : "absolute" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", width: "100%", zIndex: 3 }}>
          <HamburgerMenu hamburgerClick={hamburgerClick} setHamburgerClick={setHamburgerClick} />
        </div>
        <Header hamburgerClick={hamburgerClick} handleHamburgerClick={handleHamburgerClick} />
        <main style={{ margin: 0, padding: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", maxWidth: "1500px", width: "100%", }}>
            <Ticket user={authedUser} />
          </div>
          <div style={{ margin: mediaQueries.under768 ? "15% 0" : "2% 0" }} />
          <Footer />
        </main>
      </div>
    </div>
  )
}