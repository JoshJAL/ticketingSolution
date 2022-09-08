import useMediaQueries from 'media-queries-in-react';
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import supabase from '../components/supabase';

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [noAccount, setNoAccount] = useState(false);

  const mediaQueries = useMediaQueries({
    under768: '(max-width: 768px)',
  });
  const router = useRouter();

  async function handleSignIn(e: any) {
    e.preventDefault();
    let { user, error } = await supabase.auth.signIn({
      email: email,
      password: password
    })
    if (error) {
      setNoAccount(true)
      return;
    }
    if (user) {
      router.push('/');
    }
  }

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
            <button style={{ margin: "10px", fontSize: 18, padding: '10px', cursor: "pointer" }} onClick={(e) => handleSignIn(e)}>Login</button>
            <p style={{ margin: "0 20px", textAlign: "center" }}>{"Don't have an account? "}<a onClick={() => router.push('/sign-up')} style={{ cursor: "pointer", textDecoration: "underline" }}>Sign Up!</a></p>
          </>
        }
      </form>
    </div>
  )
}