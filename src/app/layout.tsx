export const metadata = { title: 'Future-Readiness Assessment', description: 'Benchmark your L&D maturity' };

import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}
