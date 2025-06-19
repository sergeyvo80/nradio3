import type { Metadata } from 'next';
import '@/styles/globals.scss';

export const metadata: Metadata = {
  title: 'NRadio',
  description: "Radio stations player",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {process.env.NEXT_PUBLIC_GTM_ID && (
      <head>
        {/*<!-- Global Site Tag (gtag.js) - Google Analytics -->*/}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GTM_ID}`}></script>
        <script dangerouslySetInnerHTML={{__html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${process.env.NEXT_PUBLIC_GTM_ID}', {
              page_path: window.location.pathname,
          });
        `}} />                              
      </head>
      )}          
      <body>
        {children}
      </body>
    </html>
  );
}
