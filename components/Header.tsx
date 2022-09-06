import { faBars, faTicket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useMediaQueries from 'media-queries-in-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { OnMouseEnter, OnMouseOut } from '../functions/HeaderMouseEvents';
import supabase from './supabase';

export default function Header({ hamburgerClick, handleHamburgerClick }: { hamburgerClick: boolean, handleHamburgerClick: () => void }) {
  const [admin, setAdmin] = useState(false);

  const mediaQueries = useMediaQueries({
    under768: '(max-width: 768px)',
  });

  const router = useRouter();

  const buttonBackgroundColor = "rgba(0, 0, 0, 0.25)";
  const buttonTextColor = "black";
  const buttonPadding = '10px';
  const buttonCursor = 'pointer';
  const buttonBorderRadius = '5px';

  async function handleLogout(e: any) {
    await supabase.auth.signOut()
    router.push('/login')
  }

  useEffect(() => {
    const user = supabase.auth.user()
    if (user?.user_metadata?.typeOfUser === "admin") {
      setAdmin(true)
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
    }}>
      <FontAwesomeIcon onClick={() => router.push('/')} icon={faTicket} size={'10x'} style={{ color: "black", margin: "0 auto 0 12px", cursor: "pointer", maxWidth: mediaQueries.under768 ? "15%" : "3%" }} />
      {mediaQueries.under768 ?
        <FontAwesomeIcon
          icon={faBars}
          style={{
            color: "black",
            maxWidth: '7%',
            margin: "0 10px 0 0",
            cursor: "pointer",
          }}
          onClick={handleHamburgerClick}
        />
        :
        <div style={{ display: "flex", margin: "0 12px" }}>
          <p onMouseEnter={(e) => OnMouseEnter(e)} onMouseOut={(e) => OnMouseOut(e)} onClick={() => router.push("/")} style={{ backgroundColor: buttonBackgroundColor, color: buttonTextColor, padding: buttonPadding, cursor: buttonCursor, borderRadius: buttonBorderRadius, marginRight: "10px" }}>Ticket Form</p>
          <p onMouseEnter={(e) => OnMouseEnter(e)} onMouseOut={(e) => OnMouseOut(e)} onClick={() => router.push("/ticket-list")} style={{ backgroundColor: buttonBackgroundColor, color: buttonTextColor, padding: buttonPadding, cursor: buttonCursor, borderRadius: buttonBorderRadius, marginRight: "10px" }}>Ticket List</p>
          {admin ?
            <p onMouseEnter={(e) => OnMouseEnter(e)} onMouseOut={(e) => OnMouseOut(e)} onClick={() => router.push("/dev-tickets")} style={{ backgroundColor: buttonBackgroundColor, color: buttonTextColor, padding: buttonPadding, cursor: buttonCursor, borderRadius: buttonBorderRadius, marginRight: "10px" }}>Developer Tickets</p>
            : null}
          {admin ?
            <p onMouseEnter={(e) => OnMouseEnter(e)} onMouseOut={(e) => OnMouseOut(e)} onClick={() => router.push("/create-user")} style={{ backgroundColor: buttonBackgroundColor, color: buttonTextColor, padding: buttonPadding, cursor: buttonCursor, borderRadius: buttonBorderRadius, marginRight: "10px" }}>Create User</p>
            : null}
          <p onMouseEnter={(e) => OnMouseEnter(e)} onMouseOut={(e) => OnMouseOut(e)} onClick={handleLogout} style={{ backgroundColor: buttonBackgroundColor, color: buttonTextColor, padding: buttonPadding, cursor: buttonCursor, borderRadius: buttonBorderRadius }}>Logout</p>
        </div>}
    </header>
  )
}