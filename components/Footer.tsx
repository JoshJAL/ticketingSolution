import React from 'react';

export default function Footer() {
  return (
    <footer
      style={{
        padding: '8px 8px 4px 8px',
        backgroundColor: '#c2c2c2',
        width: '100%',
        bottom: 0,
        position: 'fixed',
        maxHeight: '84px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          margin: '0 12px',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'black',
        }}
      ></div>
    </footer>
  );
}
