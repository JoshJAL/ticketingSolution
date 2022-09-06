import type { NextPage } from 'next'
import Head from 'next/head'
import Footer from '../components/Footer'
import Header from '../components/Header'
import TicketForm from '../components/TicketForm'
import useMediaQueries from 'media-queries-in-react'
import supabase from '../components/supabase'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import HamburgerMenu from '../components/HamburgerMenu'

const Home: NextPage = () => {
  const [authedUser, setAuthedUser] = useState<any>(null);
  const [hamburgerClick, setHamburgerClick] = useState(false);

  const mediaQueries = useMediaQueries({
    under768: '(max-width: 768px)',
  });

  useEffect(() => {
    const router = useRouter();
    const user = supabase.auth.user()
    if (!user) {
      router.push('/login')
    }
    setAuthedUser(user)
    console.log(user)
  }, [])

  function handleHamburgerClick() {
    setHamburgerClick(true);
  }

  return (
    <div style={{ width: "100%", height: "100%" }}>
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
        <main style={{ margin: 0, padding: 0, height: mediaQueries.under768 ? "100%" : "92vh" }}>
          <div style={{ margin: mediaQueries.under768 ? "12px 0" : "6% 0", width: "100%" }}>
            <TicketForm />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default Home
