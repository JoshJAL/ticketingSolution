import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Provider as SupabaseProvider } from 'react-supabase';
import supabase from '../components/supabase';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SupabaseProvider value={supabase}>
      <Component {...pageProps} />
    </SupabaseProvider>
  )
}

export default MyApp