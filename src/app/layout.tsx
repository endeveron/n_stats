import type { Metadata, Viewport } from 'next';
import { Mulish } from 'next/font/google';

import { Toaster } from '@/core/components/ui/Sonner';
import { APP_NAME, BASE_URL } from '@/core/constants';
import { Providers } from '@/core/context/providers';

import '@/core/globals.css';

export const viewport: Viewport = {
  interactiveWidget: 'resizes-content',
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f9fafa' },
    { media: '(prefers-color-scheme: dark)', color: '#17181c' },
  ],
};

const mulishSans = Mulish({
  variable: '--font-mulish-sans',
  subsets: ['cyrillic', 'latin'],
});

export const metadata: Metadata = {
  title: APP_NAME,
  applicationName: APP_NAME,
  metadataBase: new URL(BASE_URL),
  icons: {
    icon: {
      url: `${BASE_URL}/images/icons/favicon.ico`,
      type: 'image/image/ico',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${mulishSans.variable} antialiased`}>
        <Providers>
          <div className="layout">{children}</div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
