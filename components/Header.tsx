import { faTicket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useMediaQueries from 'media-queries-in-react';
import { useRouter } from 'next/router';
import { OnMouseEnter, OnMouseOut } from '../functions/HeaderMouseEvents';

export default function Header() {
  const mediaQueries = useMediaQueries({
    under768: '(max-width: 768px)',
  });

  const router = useRouter();

  const buttonBackgroundColor = "rgba(0, 0, 0, 0.25)";
  const buttonTextColor = "black";
  const buttonPadding = '10px';
  const buttonCursor = 'pointer';
  const buttonBorderRadius = '5px';

  return (
    <header style={{
      padding: "8px 8px 4px 8px",
      backgroundColor: "#c2c2c2",
      width: "100%",
      top: 0,
      zIndex: 3,
      position: "sticky",
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
    }}>
      <FontAwesomeIcon onClick={() => router.push('/')} icon={faTicket} style={{ color: "black", margin: "0 auto 0 12px", cursor: "pointer", maxWidth: mediaQueries.under768 ? "15%" : "3%", fontSize: 24 }} />
      <div style={{ display: "flex", margin: "0 12px" }}>
        <p onMouseEnter={(e) => OnMouseEnter(e)} onMouseOut={(e) => OnMouseOut(e)} onClick={() => router.push("/")} style={{ backgroundColor: buttonBackgroundColor, color: buttonTextColor, padding: buttonPadding, cursor: buttonCursor, borderRadius: buttonBorderRadius, marginRight: "10px" }}>Ticket Form</p>
        <p onMouseEnter={(e) => OnMouseEnter(e)} onMouseOut={(e) => OnMouseOut(e)} onClick={() => router.push("/ticket-list")} style={{ backgroundColor: buttonBackgroundColor, color: buttonTextColor, padding: buttonPadding, cursor: buttonCursor, borderRadius: buttonBorderRadius }}>Ticket List</p>
      </div>
    </header>
  )
}