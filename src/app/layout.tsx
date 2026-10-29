import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ACCNO SOLUTION | Computer Repair, Apple Mac, Data Recovery & ERP',
  description: 'Enterprise-grade laptop, desktop, Apple Mac chip-level repair, cleanroom data recovery, CCTV networking, AMC services, and custom business ERP in Jammu.',
  keywords: [
    'Computer Repair Jammu', 'Laptop Repair', 'MacBook Repair', 'Data Recovery',
    'CCTV Installation', 'AMC Services', 'Repair Shop ERP', 'Marg ERP', 'Logic ERP'
  ],
  authors: [{ name: 'ACCNO SOLUTION' }],
  openGraph: {
    title: 'ACCNO SOLUTION - Enterprise Repair & ERP',
    description: 'Premier computer repair, Mac logic board repair, and repair shop ERP software.',
    url: 'https://www.accnosolution.com',
    siteName: 'ACCNO SOLUTION',
    images: [
      {
        url: 'https://www.accnosolution.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ACCNO SOLUTION',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#070B0A] text-white antialiased selection:bg-[#5ED29C] selection:text-[#070B0A]">
        {children}
      </body>
    </html>
  );
}
