import useMediaQueries from 'media-queries-in-react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import Footer from '../components/Footer';
import Header from '../components/Header';
import supabase from '../components/supabase';

export default function createUser() {
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [selection, setSelection] = useState<string>('');
  const [creating, setCreating] = useState<boolean>(false);

  const mediaQueries = useMediaQueries({
    under768: '(max-width: 768px)',
  });

  const router = useRouter();

  useEffect(() => {
    const user = supabase.auth.user()
    if (!user || user.user_metadata.role !== 'admin') {
      router.push('/')
    }
    console.log(user)
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
    } else if (selection === 'user') {
      const { data, error } = await supabase
        .from('users')
        .insert([
          { name: name.trim(), email: email.toLowerCase().trim() },
        ])
    }
    setCreating(false)
  }

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Head>
        <title>Ticketing Solution</title>
        <meta name="ticketing" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main style={{ margin: 0, padding: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", height: "88vh", width: "100%", overflowY: "auto" }}>
        <form style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: mediaQueries.under768 ? "100%" : "30%", height: mediaQueries.under768 ? "100%" : "30%", border: mediaQueries.under768 ? "none" : "1px solid rgba(255, 255, 255, 0.5)", borderRadius: "10px", fontSize: 24 }}>
          <label style={{ margin: "10px" }} >Enter user's email: </label>
          <input onChange={(e) => setEmail(e.target.value)} style={{ padding: "5px", width: "40%" }} type="email" />
          <label style={{ margin: "10px" }} >Enter user's name: </label>
          <input onChange={(e) => setName(e.target.value)} style={{ padding: "5px", width: "40%" }} type="text" />
          <select defaultValue={"user"} style={{ width: mediaQueries.under768 ? "75%" : "25%", cursor: "pointer", margin: "20px 0 0 0" }} onClick={(e) => handleSelectionChange(e)}>
            <option value="user">General User</option>
            <option value="admin">Admin</option>
          </select>
          <button style={{ margin: "5%", fontSize: 18, padding: '10px', cursor: "pointer" }} onClick={(e) => createUser(e)} >{creating ? "Creating user..." : "Create user"}</button>
        </form>
        <Footer />
      </main>
    </div >
  )
}