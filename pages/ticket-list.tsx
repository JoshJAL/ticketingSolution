import type { NextPage } from 'next'
import Head from 'next/head'
import Header from '../components/Header'
import supabase from '../components/supabase'
import Ticket from '../components/Ticket'

const Home: NextPage = () => {

  return (
    <div style={{ margin: 0, padding: 0 }}>
      <Head>
        <title>Ticketing Solution</title>
        <meta name="ticketing" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ margin: 0, padding: 0 }}>
        <Header />
        <div style={{ display: "flex", justifyContent: "center", margin: "12px 0" }}>
            <Ticket />
        </div>
      </main>
    </div>
  )
}

export default Home
