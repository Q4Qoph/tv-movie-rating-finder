// app/layout.tsx
import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar';
import ClientProvider from '../components/ClientProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MovieFinder - Discover Movies & TV Shows',
  description: 'Find ratings, reviews, trailers, and detailed information about movies and TV shows.',
  keywords: 'movies, TV shows, ratings, reviews, trailers, IMDb, entertainment',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Navbar />
            <main>{children}</main>
          </div>
        </ClientProvider>
      </body>
    </html>
  );
}