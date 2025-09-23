import Providers from '@/store/Providers';
import './globals.css';
import { GoogleAnalytics } from '@next/third-parties/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthGuard from '@/components/AuthGuard';
import ScrollToTopButton from '@/components/ui/ScrollToTopButton';
import { Plus_Jakarta_Sans } from 'next/font/google';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
});

export const metadata = {
  metadataBase: new URL('https://faujx.com'),
  title:
    'FaujX - Mission-Driven Tech Hiring Platform | Discover, Vet & Deploy Foundation Engineers',
  description:
    'FaujX is a mission-driven tech hiring platform that discovers, vets, upskills, and deploys Foundation Engineers. Accelerate careers, enable teams, and empower experts with real-world capabilities.',
  keywords:
    'tech hiring, software engineers, foundation engineers, tech recruitment, engineering talent, software development, career acceleration, tech upskilling, engineering mentorship, tech hiring platform',
  authors: [{ name: 'FaujX' }],
  creator: 'FaujX',
  publisher: 'FaujX',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    url: 'https://faujx.com/',
    title: 'FaujX - Mission-Driven Tech Hiring Platform',
    description:
      'Discover, vet, upskill, and deploy Foundation Engineers. Accelerate careers, enable teams, and empower experts with real-world capabilities.',
    siteName: 'FaujX',
    images: [
      {
        url: '/social-share.png',
        width: 1200,
        height: 630,
        alt: 'FaujX - Mission-Driven Tech Hiring Platform',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FaujX - Mission-Driven Tech Hiring Platform',
    description:
      'Discover, vet, upskill, and deploy Foundation Engineers. Accelerate careers, enable teams, and empower experts.',
    images: ['/social-share.png'],
    site: '@faujx',
    creator: '@faujx',
  },
  alternates: {
    canonical: 'https://faujx.com/',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jakarta.className}>
      <head>
        {/* Viewport and essential meta tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#1F514C" />
        <meta name="msapplication-TileColor" content="#1F514C" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="FaujX" />
        <meta name="application-name" content="FaujX" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* Favicon and App Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon-192x192.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'FaujX',
              url: 'https://faujx.com',
              logo: 'https://faujx.com/favicon.ico',
              description:
                'Mission-driven tech hiring platform that discovers, vets, upskills, and deploys Foundation Engineers',
              foundingDate: '2024',
              sameAs: [
                'https://linkedin.com/company/faujx',
                'https://twitter.com/company/faujx',
                'https://twitter.com/faujx',
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer service',
                email: 'contact@faujx.com',
              },
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'US',
              },
              areaServed: 'Worldwide',
              serviceType: 'Tech Hiring Platform',
              hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'FaujX Services',
                itemListElement: [
                  {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: 'Foundation Engineer Hiring',
                      description:
                        'Discover, vet, and deploy pre-vetted engineering talent',
                    },
                  },
                  {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: 'Engineering Career Development',
                      description:
                        'Upskill and accelerate engineering careers with mentorship',
                    },
                  },
                  {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: 'Expert Mentorship',
                      description:
                        'Connect with experienced engineering mentors',
                    },
                  },
                ],
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans bg-background text-foreground w-full">
        <Providers>
          <AuthGuard>{children}</AuthGuard>
          <ScrollToTopButton />
          <GoogleAnalytics gaId="G-5SNKDVPJ9M" />
          <SpeedInsights />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </Providers>
      </body>
    </html>
  );
}
