import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
  title: '자미두수 명반 대시보드 · JamiDusu',
  description: '생년월일시로 자미두수 명반을 만들고 명궁, 12궁, 사화, 대한과 유년 흐름을 한국어로 확인하는 대시보드',
  keywords: '자미두수, 사주, 명반, 운세, 명궁, 사화, 대한, 유년, 12궁',
  metadataBase: new URL('https://jamidusu.xsw.kr'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: '자미두수 명반 대시보드 · JamiDusu',
    description: '자미두수 명반, 격국, 대한/유년 흐름을 한국어로 확인합니다.',
    url: 'https://jamidusu.xsw.kr',
    siteName: 'JamiDusu',
    locale: 'ko_KR',
    type: 'website',
  },
  // Search engine verification values are optional.
  verification: {
    // Google Search Console value can be supplied through env.
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || undefined,
    // Bing Webmaster Tools value can be supplied through env.
    other: {
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION || '808FFC6023A2C359B375DD860FEDA856',
      'baidu-site-verification': process.env.NEXT_PUBLIC_BAIDU_VERIFICATION || '',
      '360-site-verification': process.env.NEXT_PUBLIC_360_VERIFICATION || '',
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('ziwei-theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);else document.documentElement.setAttribute('data-theme','dark');}catch(e){}})();` }} />
      </head>
      <body className="min-h-screen">
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
