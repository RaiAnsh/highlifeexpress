import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "High Life Express \u2013 Premium Cannabis Delivery",
  description: "Licensed Ontario cannabis delivery service. Serving Ontario, adults 19+ only.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
