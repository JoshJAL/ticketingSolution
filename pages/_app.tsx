import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Provider as SupabaseProvider } from 'react-supabase';
import supabase from '../functions/supabase';
import UserProvider from '../context/user';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <SupabaseProvider value={supabase}>
        <Component {...pageProps} />
      </SupabaseProvider>
    </UserProvider>
  );
}

export default MyApp;
