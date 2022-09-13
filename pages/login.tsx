import useMediaQueries from 'media-queries-in-react';
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import { useUser } from '../context/user';

export default function SignUp() {
  const { handleSignIn } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [noAccount, setNoAccount] = useState(false);
  const [loading, setLoading] = useState(false);

  const mediaQueries = useMediaQueries({
    under768: '(max-width: 768px)',
  });

  const router = useRouter();

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <form>
        {noAccount ?
          <p style={{ margin: "0 20px", textAlign: "center" }}>{"You don't have an account! "}<a onClick={() => router.push('/sign-up')} style={{ cursor: "pointer", textDecoration: "underline" }}>Sign Up!</a></p>
          :
          <>
            <label>Login!</label>
            <label style={{ margin: "10px" }}>Email:</label>
            <input style={{ width: mediaQueries.under768 ? "250px" : "350px" }} onChange={(e) => setEmail(e.target.value)} value={email} type="email" />
            <label style={{ margin: "10px" }}>Password:</label>
            <input style={{ width: mediaQueries.under768 ? "250px" : "350px" }} onChange={(e) => setPassword(e.target.value)} value={password} type="password" />
            <button style={{ margin: "10px", fontSize: 18, padding: '10px', cursor: "pointer" }} onClick={(e) => handleSignIn(e, setLoading, setNoAccount, email, password)}>{loading ? "Logging in..." : "Login"}</button>
            <p style={{ margin: "0 20px", textAlign: "center" }}>{"Don't have an account? "}<a onClick={() => router.push('/sign-up')} style={{ cursor: "pointer", textDecoration: "underline" }}>Sign Up!</a></p>
          </>
        }
      </form>
    </div>
  )
}