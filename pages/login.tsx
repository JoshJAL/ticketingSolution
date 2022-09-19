import useMediaQueries from 'media-queries-in-react';
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import supabase from '../components/supabase';
import palette from '../styles/palette';

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [noAccount, setNoAccount] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);

  const mediaQueries = useMediaQueries({
    under768: '(max-width: 768px)',
  });

  async function handleSignIn(e: any) {
    e.preventDefault();
    setLoading(true);
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
    setLoading(false);
  }

  const router = useRouter();

  function checkCapsLock(event: any) {
    if (event.getModifierState("CapsLock")) {
      setIsCapsLockOn(true);
      return isCapsLockOn;
    } else {
      setIsCapsLockOn(false);
      return isCapsLockOn;
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <form>
        {isCapsLockOn ?
          <p style={{ color: palette.emergencyRed, fontWeight: 700 }}>Warning: Caps Lock is on!</p>
          : null}
        {noAccount ?
          <p style={{ margin: "0 20px", textAlign: "center" }}>{"You don't have an account! "}<a onClick={() => router.push('/sign-up')} style={{ cursor: "pointer", textDecoration: "underline" }}>Sign Up!</a></p>
          :
          <>
            <label>Login!</label>
            <label style={{ margin: "10px" }}>Email:</label>
            <input style={{ width: mediaQueries.under768 ? "250px" : "350px" }} onChange={(e) => setEmail(e.target.value)} value={email} type="email" onKeyUp={(event) => checkCapsLock(event)} />
            <label style={{ margin: "10px" }}>Password:</label>
            <input style={{ width: mediaQueries.under768 ? "250px" : "350px" }} onChange={(e) => setPassword(e.target.value)} value={password} type="password" onKeyUp={(event) => checkCapsLock(event)} />
            <button style={{ margin: "10px", fontSize: 18, padding: '10px', cursor: "pointer" }} onClick={(e) => { handleSignIn(e) }}>{loading ? "Logging in..." : "Login"}</button>
            <p style={{ margin: "0 20px", textAlign: "center" }}>{"Don't have an account? "}<a onClick={() => router.push('/sign-up')} style={{ cursor: "pointer", textDecoration: "underline" }}>Sign Up!</a></p>
          </>
        }
      </form>
    </div>
  )
}