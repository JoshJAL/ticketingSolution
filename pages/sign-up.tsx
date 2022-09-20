import useMediaQueries from 'media-queries-in-react';
import Head from 'next/head';
import React, { useEffect, useState } from 'react'
import supabase from '../functions/supabase';
import palette from '../styles/palette';

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminEmails, setAdminEmails] = useState<any>([]);
  const [admins, setAdmins] = useState<any>([]);
  const [qAEmails, setqAEmails] = useState<any>([]);
  const [qAs, setQAs] = useState<any>([]);
  const [generalUserEmails, setGeneralUserEmails] = useState<any>([]);
  const [generalUser, setGeneralUser] = useState<any>([]);
  const [notAllowed, setNotAllowed] = useState(false);
  const [verify, setVerify] = useState(false);
  const [creating, setCreating] = useState(false);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);


  async function fetchAdminEmails() {
    let { data: devs, error } = await supabase
      .from('devs')
      .select('*')
    setAdmins(devs)
    setAdminEmails(devs?.map((dev) => dev.email))
  }

  async function fetchQAEmails() {
    let { data: qas, error } = await supabase
      .from('q&a')
      .select('*')
    setQAs(qas)
    setqAEmails(qas?.map((qaMember) => qaMember.email))
  }

  async function fetchGeneralUserEmails() {
    let { data: users, error } = await supabase
      .from('generalUsers')
      .select('*')
    setGeneralUser(users)
    setGeneralUserEmails(users?.map((generalUser) => generalUser.email))
  }

  function setAdminName(email: string) {
    return admins.find((admin: any) => admin.email === email.toLowerCase().trim())?.name
  }

  function setWhiteListName(email: string) {
    return generalUser.find((user: any) => user.email === email.toLowerCase().trim())?.name
  }

  function setQAName(email: string) {
    return qAs.find((qa: any) => qa.email === email.toLowerCase().trim())?.name
  }

  useEffect(() => {
    fetchAdminEmails();
    fetchQAEmails();
    fetchGeneralUserEmails();
  }, [])

  const mediaQueries = useMediaQueries({
    under768: '(max-width: 768px)',
  });

  async function handleSignUp(e: any) {
    setCreating(true);
    e.preventDefault();
    if (adminEmails.includes(email.trim().toLowerCase())) {
      const { user, error } = await supabase.auth.signUp(
        {
          email: email.toLowerCase().trim(),
          password: password,
        },
        {
          data: {
            typeOfUser: "admin",
            name: setAdminName(email)
          },
        }
      )
      setVerify(true);
    } else if (qAEmails.includes(email.trim().toLowerCase())) {
      let { user, error } = await supabase.auth.signUp(
        {
          email: email.toLowerCase().trim(),
          password: password
        },
        {
          data: {
            typeOfUser: "q&a",
            name: setQAName(email)
          },
        }
      )
      setVerify(true);
    } else if (generalUserEmails.includes(email.trim().toLowerCase())) {
      let { user, error } = await supabase.auth.signUp(
        {
          email: email.toLowerCase().trim(),
          password: password
        },
        {
          data: {
            typeOfUser: "general",
            name: setWhiteListName(email)
          },
        }
      )
      setVerify(true);
    } else {
      setNotAllowed(true)
    }
    setCreating(false);
  }

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
      <Head>
        <title>Ticketing Solution</title>
        <meta name="Quick Ticketing Solution" />
        <link rel="icon" href="/ticket-favicon.png" />
      </Head>
      <form style={{ border: mediaQueries.under768 ? "none" : "1px solid black", borderRadius: "10px" }}>
        {verify ? <p style={{ textAlign: "center", margin: "20px" }}>{"Please check your email and verify your account!"}</p>
          :
          <>
            {isCapsLockOn ?
              <p style={{ color: palette.emergencyRed, fontWeight: 700 }}>Warning: Caps Lock is on!</p>
              : null}
            <label style={{ textAlign: "center", color: notAllowed ? palette.emergencyRed : "black" }}>{notAllowed ? "You are not authorized to create an account with that email" : "Create an account!"}</label>
            <label style={{ margin: "10px" }}>{"Email:"}</label>
            <input style={{ width: mediaQueries.under768 ? "250px" : "350px" }} onChange={(e) => setEmail(e.target.value)} value={email} type="email" onKeyUp={(event) => checkCapsLock(event)} />
            <label style={{ margin: "10px" }}>{"Password:"}</label>
            <input style={{ width: mediaQueries.under768 ? "250px" : "350px" }} onChange={(e) => setPassword(e.target.value)} value={password} type="password" onKeyUp={(event) => checkCapsLock(event)} />
            <button style={{ margin: "10px 20px", fontSize: 18, padding: '10px', cursor: "pointer" }} onClick={(e) => handleSignUp(e)}>{creating ? "Creating Account..." : "Sign Up"}</button>
          </>
        }
      </form>
    </div>
  )
}