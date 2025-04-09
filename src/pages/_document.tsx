import { NextPageContext } from "next";
import Document, { Html, Head, Main, NextScript, DocumentContext } from "next/document";
import { loadEncryptedNotesFromFS } from "@/utils/loadNotesServer";

// Add a type declaration for the global variable
declare global {
  interface Window {
    __ENCRYPTED_NOTES_DATA__: string;
  }
}

Page.getInitialProps = async (ctx: DocumentContext) => {
  const encryptedData = await loadEncryptedNotesFromFS();
  const initialProps = await Document.getInitialProps(ctx);
  return { ...initialProps, encryptedData };
}

export default function Page({ encryptedData }: { encryptedData: string }) {
  return (
    <Html lang="de">
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <body className="antialiased">
        {/* Inject the encrypted data as a global variable */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__ENCRYPTED_NOTES_DATA__ = ${JSON.stringify(encryptedData)};`
          }}
        />

        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
