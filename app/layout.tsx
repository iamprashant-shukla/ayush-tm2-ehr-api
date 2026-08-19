import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AYUSH TM2 & NAMASTE Terminology Search | EHR API',
  description:
    'Multilingual Fuzzy Search Engine & EHR Terminology microservice mapping AYUSH NAMASTE codes to WHO ICD-11 Traditional Medicine Module 2 (TM2) for ABDM-compliant health systems.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
