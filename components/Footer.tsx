import React from 'react'

export default function Footer() {
  return (
    <footer style={{
      padding: "8px 8px 4px 8px",
      backgroundColor: "#c2c2c2",
      width: "100%",
      bottom: 0,
      position: "fixed",
      maxHeight: "84px"
    }}>
      <div style={{ display: "flex", flexDirection: "column", margin: "0 12px", alignItems: 'center', justifyContent: "center", color: "black" }}>
        <p style={{ marginBottom: 6, marginTop: 12 }}>Feature request?</p>
        <p style={{ marginTop: 0 }}>Message me on Slack: <a href='https://robgrahamenterprises.slack.com/team/U03FNSPEYJG' style={{ color: "black" }}>Joshua Levine</a></p>
      </div>
    </footer>
  )
}
