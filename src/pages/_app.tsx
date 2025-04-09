import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { HeroUIProvider } from "@heroui/react";
import AuthGuard from "@/components/AuthGuard";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return <>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
    //enableSystem={true}
    >
      <HeroUIProvider locale="de-DE">
        <AuthGuard>
          <Component {...pageProps} />
        </AuthGuard>
      </HeroUIProvider>
    </ThemeProvider>
  </>;
}
