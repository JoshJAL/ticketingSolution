import axios from "axios";
import { useRouter } from "next/router";
import { createContext, useState, useEffect, useContext } from "react";
import supabase from "../components/supabase";

const Context = createContext();

const Provider = ({ children }) => {
  const [user, setUser] = useState(supabase.auth.user());
  const router = useRouter();
 
  useEffect(() => {
    supabase.auth.onAuthStateChange(() => {
      setUser(user);
    })
    console.log(user)
  }, [])

  useEffect(() => {
    axios.post('/api/set-supabase-cookie', {
      event: user ? 'SIGNED_IN' : 'SIGNED_OUT', 
      session: supabase.auth.session(),
    })
  }, [user])

  const handleSignIn = async (e, setLoading, setNoAccount, email, password) => {
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

  const handleLogout = async (e) => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/login')
  }

  const exposed = {
    user, 
    handleSignIn,
    handleLogout,
  }

  return (
    <Context.Provider value={exposed}>
    {children}
    </Context.Provider>
  )
}

export const useUser = () => useContext(Context);

export default Provider;