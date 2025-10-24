'use client';
import './globals.css';
import { MainLayout } from '@/components/layout/main-layout';
import { Toaster } from '@/components/ui/toaster';
import { DataProvider, useData } from '@/lib/data';
import { useEffect } from 'react';

function AppDynamicTitle() {
  const { config } = useData();

  useEffect(() => {
    if (config.storeName) {
      document.title = config.storeName;
    } else {
      document.title = 'AutoParts Manager';
    }
  }, [config.storeName]);

  return null;
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
          <DataProvider>
            <AppDynamicTitle />
            <MainLayout>{children}</MainLayout>
          </DataProvider>
        <Toaster />
      </body>
    </html>
  );
}
