import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Future Readiness App",
  description: "Next.js + Tailwind starter with an Assessment component",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-bg text-ink antialiased">{children}</body>
    </html>
  );
}
