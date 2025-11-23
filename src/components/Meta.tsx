import Head from "next/head";
import packageInfo from "../../package.json";
import { appURL } from "@/lib/utils";
interface MetaProps {
  title?: string;
  description?: string;
  ogImage?: string;
  ogUrl: string;
  ogType?: string;
  twCard?: string;
}

const defaultCover: string = appURL + "/img/cartello_elezioni.webp";

const Meta: React.FC<MetaProps> = ({
  title = "Elezioni Regionali Puglia 2025",
  description = "Tutte le informazioni sulle elezioni regionali del 2025 in Puglia, con risultati in tempo reale e copertura completa.",
  ogImage = defaultCover,
  ogUrl = appURL,
  ogType = "website",
  twCard = "summmary",
}) => {
  const theTitle = `${title} | TRM network`;
  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {/* <meta httpEquiv="content-language" content="it" /> */}
      <link rel="icon" type="image/svg+xml" href="/apulia-icon.svg" />
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#94a3b8" />
      <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      <meta name="app-version" content={packageInfo.version} />

      {/* <link rel="manifest" href="/manifest.json" /> */}

      <meta name="description" content={description} />
      <meta charSet="utf-8" />

      <title>{theTitle}</title>

      <meta property="og:title" content={title + " | TRM network"} />
      <meta property="og:site_name" content={"trmnet.work"} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1280" />
      <meta property="og:image:height" content="720" />
      <meta property="og:image:secure_url" content={ogImage} />

      <meta property="twitter:card" content={twCard} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />
    </Head>
  );
};

export default Meta;
