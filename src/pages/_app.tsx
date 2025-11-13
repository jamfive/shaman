import type { AppProps } from 'next/app';
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
  return (
    <div className={`${roboto.variable} antialiased`}>
      <Providers>
        <Navbar />
        <Component {...pageProps} />
      </Providers>
    </div>
  );
}