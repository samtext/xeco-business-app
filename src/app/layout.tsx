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
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}