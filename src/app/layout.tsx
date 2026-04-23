import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'XecoFlow - Business Payments & Airtime Automation',
  description: 'Aggregate all your tills, automate airtime delivery, and accept STK payments—all from one backend.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#8B1D1D" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}