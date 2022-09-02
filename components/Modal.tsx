import { CSSProperties } from "react";

export default function Modal({ children, styleOverride }: { children: any, styleOverride?: CSSProperties }) {

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      zIndex: 10,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,35%)",
      ...styleOverride
    }}>
      {children}
    </div>
  )
}