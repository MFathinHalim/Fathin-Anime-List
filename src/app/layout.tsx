import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fathin's Anime List",
  description: "A simple anime list app using Next.js and Tailwind CSS",
  icons: "a.jpg"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
