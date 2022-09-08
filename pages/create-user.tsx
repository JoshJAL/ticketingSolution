import useMediaQueries from 'media-queries-in-react';
import Head from 'next/head';
import React, { useEffect, useState } from 'react'
import Footer from '../components/Footer';
import HamburgerMenu from '../components/HamburgerMenu';
import Header from '../components/Header';
import supabase from '../components/supabase';

export default function CreateUser() {
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [selection, setSelection] = useState<string>('');
  const [creating, setCreating] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [hamburgerClick, setHamburgerClick] = useState(false);

  const mediaQueries = useMediaQueries({
    under768: '(max-width: 768px)',
  });

  useEffect(() => {
    const user = supabase.auth.user()
    if (!user || user.user_metadata.typeOfUser !== 'admin') {
      window.location.href = "/"
    }
  }, [])

  function handleSelectionChange(e: any) {
    setSelection(e.target.value)
  }

  async function createUser(e: any) {
    e.preventDefault();
    setCreating(true)
    if (selection === 'admin') {
      const { data, error } = await supabase
        .from('devs')
        .insert([
          { name: name.trim(), email: email.toLowerCase().trim() },
        ])
    } else if (selection === "q&a") {
      const { data, error } = await supabase
        .from('q&a')
        .insert([
          { name: name.trim(), email: email.toLowerCase().trim() },
        ])
    } else if (selection === 'generalUser') {
      const { data, error } = await supabase
        .from('generalUsers')
        .insert([
          { name: name.trim(), email: email.toLowerCase().trim() },
        ])
    }
    setCreating(false)
    setSubmitted(true)
  }

  function handleHamburgerClick() {
    setHamburgerClick(true);
  }

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Head>
        <title>Ticketing Solution</title>
        <meta name="ticketing" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={{ width: "100%", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", position: hamburgerClick ? "fixed" : "absolute" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", width: "100%", zIndex: 3 }}>
          <HamburgerMenu hamburgerClick={hamburgerClick} setHamburgerClick={setHamburgerClick} />
        </div>
        <Header hamburgerClick={hamburgerClick} handleHamburgerClick={handleHamburgerClick} />
        <main style={{ margin: 0, padding: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", height: "88vh", width: "100%", overflowY: "auto" }}>
          <form style={{ margin: "-150px 0 0 0" }}>
            {submitted ?
              <>
                <p>User has been created!</p>
                <button onClick={() => setSubmitted(false)} style={{ fontSize: 21, padding: "5px 10px", cursor: "pointer" }}>Create another?</button>
              </>
              :
              <>
                <label style={{ margin: "10px" }} >{"Enter user's email: "}</label>
                <input onChange={(e) => setEmail(e.target.value)} style={{ width: "250px" }} type="email" />
                <label style={{ margin: "10px" }} >{"Enter user's name: "}</label>
                <input onChange={(e) => setName(e.target.value)} style={{ width: "250px" }} type="text" />
                <select defaultValue={"user"} style={{ width: "250px", margin: "20px 0 0 0" }} onClick={(e) => handleSelectionChange(e)}>
                  <option value="generalUser">General User</option>
                  <option value="q&a">Q & A Team</option>
                  <option value="admin">Admin</option>
                </select>
                <button style={{ margin: "20px 0 10px 0", padding: '10px 20px' }} onClick={(e) => createUser(e)} >{creating ? "Creating user..." : "Create user"}</button>
              </>
            }
          </form>
          <Footer />
        </main>
      </div >
    </div >
  )
}