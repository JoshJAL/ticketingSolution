import type { NextPage } from 'next'
import Head from 'next/head'
import Footer from '../components/Footer'
import Header from '../components/Header'
import TicketForm from '../components/TicketForm'
import useMediaQueries from 'media-queries-in-react'
import supabase from '../components/supabase'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const Home: NextPage = () => {
  const [authedUser, setAuthedUser] = useState<any>(null)

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
    console.log(user)
  }, [])

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Head>
        <title>Ticketing Solution</title>
        <meta name="ticketing" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main style={{ margin: 0, padding: 0, height: mediaQueries.under768 ? "100%" : "92vh" }}>
        <div style={{ display: "flex", justifyContent: "center", margin: "12px 0" }}>
          <TicketForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Home
