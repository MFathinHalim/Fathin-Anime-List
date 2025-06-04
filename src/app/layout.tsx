import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fathin's Anime List",
  description: "A simple anime list app using Next.js and Tailwind CSS",
  icons: "https://i.pinimg.com/736x/06/17/85/061785086f3d73ab1605e4f10b968fb9.jpg"
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
