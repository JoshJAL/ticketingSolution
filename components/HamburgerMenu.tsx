import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import supabase from '../functions/supabase';

export default function HamburgerMenu({
  hamburgerClick,
  setHamburgerClick,
  backgroundColor,
  color,
}: {
  hamburgerClick: boolean;
  setHamburgerClick: (value: boolean) => void;
  backgroundColor?: string;
  color?: string;
}) {
  const router = useRouter();
  const [admin, setAdmin] = useState<boolean>(false);
  const [QA, setQA] = useState(false);

  useEffect(() => {
    const user = supabase.auth.user();
    if (user?.user_metadata?.typeOfUser === 'admin') {
      setAdmin(true);
    }
    if (user?.user_metadata?.typeOfUser === 'q&a') {
      setQA(true);
    }
  }, []);

  async function handleLogout(e: any) {
    await supabase.auth.signOut();
    router.push('/login');
  }

  return hamburgerClick ? (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        position: 'fixed',
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        height: '100%',
        width: '100%',
        zIndex: 10,
      }}
    >
      <div
        style={{
          width: '80%',
          backgroundColor: backgroundColor ? backgroundColor : '#c2c2c2',
          height: '100%',
          color: color ? color : 'black',
        }}
      >
        <p
          onClick={() => setHamburgerClick(false)}
          style={{ margin: '3% 0 0 87%', padding: '10px', cursor: 'pointer' }}
        >
          X
        </p>
        <div style={{ margin: '1% 0 0 5%' }}>
          <p style={{ cursor: 'pointer', fontSize: '18px', fontWeight: 700 }} onClick={() => router.push('/')}>
            Ticket Form
          </p>
          <p
            style={{ cursor: 'pointer', fontSize: '18px', fontWeight: 700 }}
            onClick={() => router.push('/ticket-list')}
          >
            All Tickets
          </p>
          {admin ? (
            <p
              style={{ cursor: 'pointer', fontSize: '18px', fontWeight: 700 }}
              onClick={() => router.push('/dev-tickets')}
            >
              Review Claimed Tickets
            </p>
          ) : null}
          {admin ? (
            <p
              style={{ cursor: 'pointer', fontSize: '18px', fontWeight: 700 }}
              onClick={() => router.push('/create-user')}
            >
              Create User
            </p>
          ) : null}
          {admin || QA ? (
            <p onClick={() => router.push('/testing')} style={{ cursor: 'pointer', fontSize: '18px', fontWeight: 700 }}>
              QA Tickets
            </p>
          ) : null}
          <p style={{ cursor: 'pointer', fontSize: '18px', fontWeight: 700 }} onClick={handleLogout}>
            Logout
          </p>
        </div>
      </div>
    </div>
  ) : null;
}
