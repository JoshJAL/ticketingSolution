import useMediaQueries from 'media-queries-in-react'
import Head from 'next/head'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Ticket from '../components/Ticket'

export default function ticketList() {
  const mediaQueries = useMediaQueries({
    under768: '(max-width: 768px)',
  });

  return (
    <div style={{ margin: 0, padding: 0 }}>
      <Head>
        <title>Ticketing Solution</title>
        <meta name="ticketing" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main style={{ margin: 0, padding: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", maxWidth: "1500px", width: "100%", }}>
          <Ticket />
        </div>
        <div style={{ margin: mediaQueries.under768 ? "15% 0" : "2% 0" }} />
        <Footer />
      </main>
    </div>
  )
}