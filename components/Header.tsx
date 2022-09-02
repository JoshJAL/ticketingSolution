import { useRouter } from 'next/router';

export default function Header() {
  const router = useRouter();

  return (
    <header style={{
      padding: "8px 8px 4px 8px",
      backgroundColor: "#f5f5f5",
      width: "100%",
      top: 0,
      zIndex: 3,
      position: "sticky",
      display: "flex"
    }}>
      <div style={{ display: "flex", width: "100%", position: "relative", padding: "30px" }}>
        <p onClick={() => router.push("/ticket-list")} style={{ borderRadius: "5px", color: 'black', backgroundColor: "rgba(0, 0, 0, 0.35)", right: '6px', top: "-12%", position: "absolute", padding: "10px", cursor: "pointer" }}>Ticket List</p>
        <p onClick={() => router.push("/")} style={{ borderRadius: "5px", color: 'black', backgroundColor: "rgba(0, 0, 0, 0.35)", right: '5.5%', top: "-12%", position: "absolute", padding: "10px", cursor: "pointer" }}>Ticket Form</p>
      </div>
    </header>
  )
}