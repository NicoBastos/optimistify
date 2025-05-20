import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { WeatherEffects } from '@/components/WeatherEffects';
import "./globals.css";
import ClientProviders from "./ClientProviders";


export const metadata: Metadata = {
  title: "Optimistify",
  description: "Transform negative thoughts into positive perspectives",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark`}>
      <body className="flex flex-col h-screen overflow-hidden">
        <ClientProviders>
          <WeatherEffects />
          <Header />
          <main className="flex-1">
            {children}
          </main>
        </ClientProviders>
      </body>
    </html>
  );
}
