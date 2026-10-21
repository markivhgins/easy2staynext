import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BottomNav } from '@/components/layout/BottomNav';
import { getCurrentUser } from '@/lib/auth';
import { LocationProvider } from '@/context/LocationContext';
import { StockBackgroundAnimation } from '@/components/layout/StockBackgroundAnimation';
import CitySelectorModal from '@/components/location/CitySelectorModal';

export const metadata: Metadata = {
  title: 'Find2Stay | Verified Stays & Relocation Services Across India',
  description:
    'Discover verified PGs, hostels, flats, and society homes with transparent pricing, honest verification, and essential local services (tiffin, water, shifting) in Noida, Greater Noida, Ghaziabad, Gurugram, Delhi NCR and more.',
  icons: {
    icon: '/img/favicon.png',
    apple: '/img/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#1557D6',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let user = null;
  try {
    const rawUser = await getCurrentUser();
    if (rawUser) {
      const roles = (rawUser.roleAssignments as string[]) || ['USER'];
      user = {
        name: rawUser.displayName,
        phone: rawUser.phoneE164,
        role: roles[0] || 'USER',
        roles,
        isOpsOrAdmin: roles.includes('ADMIN') || roles.includes('OPERATIONS') || roles.includes('SUPER_ADMIN'),
        isOwner: roles.includes('OWNER'),
      };
    }
  } catch {
    // Unauthenticated
  }

  return (
    <html lang="en">
      <head>
        <link key="css-style" rel="stylesheet" href="/css/style.css" />
        <link key="css-theme" rel="stylesheet" href="/css/theme.css" />
        <link key="css-home" rel="stylesheet" href="/css/home.css" />
        <link key="css-map" rel="stylesheet" href="/css/map.css" />
      </head>
      <body>
        <LocationProvider>
          <StockBackgroundAnimation />
          <Header user={user} />
          <main>{children}</main>
          <Footer />
          <BottomNav user={user} />
          <CitySelectorModal />
        </LocationProvider>
      </body>
    </html>
  );
}
