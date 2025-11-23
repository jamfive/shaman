import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { Roboto } from "next/font/google";
import '../styles/globals.css';
import { Providers } from '../components/Providers';
import Navbar from '../components/Navbar';

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const hideNavbar = router.pathname.startsWith('/widget');

  return (
    <div className={`${roboto.variable} antialiased`}>
      
      <Providers>
        {!hideNavbar && <Navbar />}
        <Component {...pageProps} />
      </Providers>
    </div>
  );
}