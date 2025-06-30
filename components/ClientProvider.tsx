// components/ClientProvider.tsx
'use client';

import React, { useEffect } from 'react';
import { useMovieStore } from '../store/movieStore';

interface ClientProviderProps {
  children: React.ReactNode;
}

const ClientProvider: React.FC<ClientProviderProps> = ({ children }) => {
  const { darkMode } = useMovieStore();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return <>{children}</>;
};

export default ClientProvider;