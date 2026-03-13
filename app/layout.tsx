import type { Metadata } from "next";
import "./globals.css";
import Navigation from "../components/Navigation";

export const metadata: Metadata = {
  title: "IITP Hub | Campus App",
  description: "Your ultimate IIT Patna campus companion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navigation />
        {/* We add margin so the content doesn't hide behind the nav bars */}
        <main className="md:ml-64 pb-20 md:pb-0 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}