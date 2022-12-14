import useMediaQueries from 'media-queries-in-react';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import HamburgerMenu from '../components/HamburgerMenu';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import supabase from '../functions/supabase';

export default function Page() {
  const [hamburgerClick, setHamburgerClick] = useState(false);
  const [authedUser, setAuthedUser] = useState<any>(null);

  useEffect(() => {
    const user = supabase.auth.user();
    if (!user) {
      window.location.href = '/login';
    }
    setAuthedUser(user);
  }, []);

  const mediaQueries = useMediaQueries({
    under768: '(max-width: 768px)',
  });

  function handleHamburgerClick() {
    setHamburgerClick(true);
  }

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', zIndex: 3 }}>
        <HamburgerMenu hamburgerClick={hamburgerClick} setHamburgerClick={setHamburgerClick} />
      </div>
      <Header handleHamburgerClick={handleHamburgerClick} />
      <Head>
        <title>Ticketing Solution</title>
        <meta name='Quick Ticketing Solution' />
        <link rel='icon' href='/ticket-favicon.png' />
      </Head>
      <div
        style={{
          width: '100%',
          alignItems: 'center',
          position: hamburgerClick ? 'fixed' : 'absolute',
          overflow: 'hidden',
        }}
      >
        <main style={{ margin: 0, padding: 0, width: '100%', overflow: mediaQueries.under768 ? 'hidden' : 'initial' }}>
          <div
            style={{ margin: mediaQueries.under768 ? '12px 0' : '50px 0 111px 0', width: '100%', minHeight: '100%' }}
          >
            {!authedUser ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '50vh',
                  transform: 'scale(3)',
                }}
              >
                <LoadingSpinner />
              </div>
            ) : (
              <p>Page Content here</p>
            )}
          </div>
        </main>
      </div>
      // Feel free to remove the footer if you don't think the page needs it
    </div>
  );
}
