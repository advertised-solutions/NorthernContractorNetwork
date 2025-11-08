import { Metadata } from 'next';
import 'bootstrap/dist/css/bootstrap.css'
import './style/scss/style.scss'
import 'animate.css/animate.css'
import { Providers } from '@/components/providers';



export const metadata: Metadata = {
  title: "ListingHub - Next Ts Business Directory & Listing Template",
  description: "ListingHub - Next Ts Business Directory & Listing Template",
  // Performance metadata
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  themeColor: "#00357a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
       <head>
         {/* Performance optimizations */}
         <link rel="preconnect" href="https://cdn.jsdelivr.net" />
         <link rel="preconnect" href="https://cdnjs.cloudflare.com" />
         <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
         
         {/* Defer non-critical scripts */}
         <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" defer></script>
         <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
       </head>
      <body className={``}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
