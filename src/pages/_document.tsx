import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="it">
      <Head>
        <meta
          name="description"
          content="Risultati e affluenze delle elezioni regionali della Puglia 2025"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
