import useMediaQueries from 'media-queries-in-react'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import HamburgerMenu from '../components/HamburgerMenu'
import Header from '../components/Header'
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner'
import supabase from '../components/supabase'
import styles from '../styles/Kanban.module.css'

export default function Kanban() {
  const [hamburgerClick, setHamburgerClick] = useState(false);
  const [authedUser, setAuthedUser] = useState<any>(null);
  const [columns, setColumns] = useState<any>(null);

  useEffect(() => {
    const user = supabase.auth.user()
    if (!user) {
      window.location.href = '/login'
    }
    setAuthedUser(user);
  }, [])

  const mediaQueries = useMediaQueries({
    under768: '(max-width: 768px)',
  });

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
          <div style={{ margin: mediaQueries.under768 ? "12px 0" : "50px 0 111px 0", width: "100%", minHeight: "100%" }}>
            {!authedUser ?
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "50vh", transform: "scale(3)" }}>
                <LoadingSpinner />
              </div>
              :
              <div style={{ display: "flex", justifyContent: "space-evenly", width: "100%" }}>
                <div className={styles.column}>
                  <p style={{ textAlign: "center", fontWeight: 700, fontSize: 18 }}>Backlog</p>
                  <hr style={{ border: "1px solid black", width: "100%", margin: "0 0 10px 0" }} />
                  <div className={styles.items}>
                    <p style={{ margin: "0 5px" }}><span style={{ fontWeight: 700 }}>Title:</span> something</p>
                    <p style={{ margin: "0 5px" }}><span style={{ fontWeight: 700 }}>Title:</span> something</p>
                  </div>
                </div>
                <div className={styles.column}>
                  <p style={{ textAlign: "center", fontWeight: 700, fontSize: 18 }}>In Progress</p>
                  <hr style={{ border: "1px solid black", width: "100%" }} />
                </div>
                <div className={styles.column}>
                  <p style={{ textAlign: "center", fontWeight: 700, fontSize: 18 }}>Code Review</p>
                  <hr style={{ border: "1px solid black", width: "100%" }} />
                </div>
                <div className={styles.column}>
                  <p style={{ textAlign: "center", fontWeight: 700, fontSize: 18 }}>QA Testing</p>
                  <hr style={{ border: "1px solid black", width: "100%" }} />
                </div>
                <div className={styles.column}>
                  <p style={{ textAlign: "center", fontWeight: 700, fontSize: 18 }}>Done</p>
                  <hr style={{ border: "1px solid black", width: "100%" }} />
                </div>
              </div>
            }
          </div>
        </main>
      </div>
    </div>
  )
}