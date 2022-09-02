import type { NextPage } from 'next'
import Head from 'next/head'
import TicketForm from '../components/TicketForm'

const Home: NextPage = () => {
  return (
    <div style={{ margin: 0, padding: 0 }}>
      <Head>
        <title>Ticketing Solution</title>
        <meta name="ticketing" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ margin: 0, padding: 0 }}>
        <header style={{ backgroundColor: "green", }}>
          <p style={{ margin: 0, padding: 12, textAlign: "center" }}>This is the header</p>
        </header>
        <div style={{ display: "flex", justifyContent: "center", margin: "12px 0" }}>
          <TicketForm />
        </div>

        <footer style={{ backgroundColor: "green", width: "100%" }}>
          <p style={{ margin: 0, padding: 12, textAlign: "center" }}>This is the footer</p>
        </footer>
      </main>
    </div>
  )
}

export default Home
