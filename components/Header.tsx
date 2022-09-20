import { faBars, faTicket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useMediaQueries from 'media-queries-in-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import supabase from '../functions/supabase';

export default function Header({ handleHamburgerClick }: { handleHamburgerClick: () => void }) {
  const [admin, setAdmin] = useState(false);
  const [QA, setQA] = useState(false);

  const mediaQueries = useMediaQueries({
    under768: '(max-width: 768px)',
  });

  const router = useRouter();

  async function handleLogout(e: any) {
    await supabase.auth.signOut()
    router.push('/login')
  }

  useEffect(() => {
    const user = supabase.auth.user()
    if (user?.user_metadata?.typeOfUser === "admin") {
      setAdmin(true)
    }
    if (user?.user_metadata?.typeOfUser === "q&a") {
      setQA(true)
    }
  }, [])

  return (
    <header style={{
      padding: "8px 8px 4px 8px",
      backgroundColor: "#c2c2c2",
      width: "100%",
      top: 0,
      zIndex: 1,
      position: "sticky",
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      maxHeight: "84px",
      height: "84px"
    }}>
      <FontAwesomeIcon onClick={() => router.push('/')} icon={faTicket} size={'10x'} style={{ color: "black", margin: "0 auto 0 12px", cursor: "pointer", maxWidth: mediaQueries.under768 ? "15%" : "3%", height: "100%" }} />
      {mediaQueries.under768 ?
        <FontAwesomeIcon
          icon={faBars}
          style={{
            color: "black",
            maxWidth: '7%',
            margin: "0 10px 0 0",
            cursor: "pointer",
            height: "100%"
          }}
          onClick={() => {
            handleHamburgerClick();
          }}
        />
        :
        <div style={{ display: "flex", margin: "0 12px" }}>
          <button className="header-button" onClick={() => router.push("/")}>Ticket Form</button>
          <button className="header-button" onClick={() => router.push("/ticket-list")}>All Tickets</button>
          {admin ?
            <button className="header-button" onClick={() => router.push("/dev-tickets")}>Review Claimed Tickets</button>
            : null}
          {admin ?
            <button className="header-button" onClick={() => router.push("/create-user")}>Create User</button>
            : null}
          {admin || QA ?
            <button className="header-button" onClick={() => router.push("/testing")}>QA Tickets</button>
            : null}
          {admin ?
            <button className="header-button" onClick={() => router.push("/kanban")}>Kanban Tables</button>
            : null}
          <button className="lastHeader-button" onClick={handleLogout}>Logout</button>
        </div>}
    </header>
  )
}