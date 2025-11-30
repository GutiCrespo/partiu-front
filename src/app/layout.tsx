import type { Metadata } from 'next';
import './globals.css';
import { Poppins } from 'next/font/google';
import Navbar from '../components/navbar';

import { AuthProvider } from "@/contexts/auth"; 
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

import Script from 'next/script';
import { NavigationTransitionLoader } from "@/components/navigation-transition-loader";

export const metadata: Metadata = {
  title: 'Partiu - Sua viagem começa aqui',
  description: 'Gerencie suas viagens de forma fácil e intuitiva.', 
};

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const googleMapsApiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY;

  return (
    <html lang="pt-BR" className={poppins.className}>
      <body className="relative bg-white px-5 pb-10 min-h-[410px] md:pb-10">
        {/* Loader em toda troca de rota */}
        <NavigationTransitionLoader />

        <AuthProvider>
          <Navbar />
          <div className="relative w-full min-h-dvh mx-auto md:max-w-5xl md:px-6 md:py-4 mb-8">
            {children}
          </div>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </AuthProvider>

        {googleMapsApiKey && (
          <Script
            src={`https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places&loading=async`} 
            strategy="beforeInteractive"
          />
        )}
      </body>
    </html>
  );
}
