import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sconto IG Post Reporting",
  description: "MoM dashboard výkonu instagramových postů pro Sconto CZ/SK.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body>{children}</body>
    </html>
  );
}
