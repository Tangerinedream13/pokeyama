import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pokeyama Collection",
  description: "Browse the Yamas of Pokeyama.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
