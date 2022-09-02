import { faTicket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/router';

export default function Header() {
  const router = useRouter();

  const buttonBackgroundColor = "rgba(0, 0, 0, 0.35)";
  const buttonTextColor = "black";
  const buttonPadding = '10px';
  const buttonCursor = 'pointer';
  const buttonBorderRadius = '5px';

  return (
    <header style={{
      padding: "8px 8px 4px 8px",
      backgroundColor: "#f5f5f5",
      width: "100%",
      top: 0,
      zIndex: 3,
      position: "sticky",
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center"
    }}>
      <FontAwesomeIcon onClick={() => router.push('/')} icon={faTicket} style={{ color: "black", margin: "0 auto 0 12px", fontSize: 45, cursor: "pointer" }} />
      <div style={{ display: "flex", margin: "0 12px" }}>
        <p onClick={() => router.push("/")} style={{ backgroundColor: buttonBackgroundColor, color: buttonTextColor, padding: buttonPadding, cursor: buttonCursor, borderRadius: buttonBorderRadius, marginRight: "10px" }}>Ticket Form</p>
        <p onClick={() => router.push("/ticket-list")} style={{ backgroundColor: buttonBackgroundColor, color: buttonTextColor, padding: buttonPadding, cursor: buttonCursor, borderRadius: buttonBorderRadius }}>Ticket List</p>
      </div>
    </header>
  )
}