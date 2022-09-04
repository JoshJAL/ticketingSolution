import type { NextPage } from 'next'
import Head from 'next/head'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Ticket from '../components/Ticket'

const Home: NextPage = () => {

  return (
    <div style={{ margin: 0, padding: 0 }}>
      <Head>
        <title>Ticketing Solution</title>
        <meta name="ticketing" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main style={{ margin: 0, padding: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", maxWidth: "1500px" }}>
          <Ticket />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Home
