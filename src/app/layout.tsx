import type { Metadata } from 'next';
import { Nunito_Sans } from 'next/font/google';
import './globals.css';

const nunito = Nunito_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--font-nunito',
  display: 'swap',
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: 'SignAble - Academic ASL Studio',
  description: 'Interactive sign-supported academic learning and camera-based sign practice prototype.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={nunito.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-surface font-sans text-on-surface antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
