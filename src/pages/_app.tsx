import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { HeroUIProvider } from "@heroui/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <HeroUIProvider locale="de-DE">
        <Component {...pageProps} />
      </HeroUIProvider>
    </ThemeProvider>
  );
}
