import type {Metadata} from 'next';
// Use basic system fonts to avoid runtime network fetches
// Google fonts require internet access during build which is
// unavailable in some environments.
// import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import { AppShell } from '@/components/ui/app-shell';


export const metadata: Metadata = {
  title: 'Lifemanager',
  description: 'Create goals and track your progress',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
