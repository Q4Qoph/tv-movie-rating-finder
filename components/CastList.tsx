// components/CastList.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useMovieStore } from '../store/movieStore';

interface CastMember {
  id: string;
  image: string;
  name: string;
  asCharacter: string;
}

interface CastListProps {
  cast: CastMember[];
  title?: string;
}

const CastList: React.FC<CastListProps> = ({ cast, title = "Cast" }) => {
  const { darkMode } = useMovieStore();

  if (!cast || cast.length === 0) return null;

  return (
    <div className="mb-8">
      <h3 className={`text-xl font-semibold mb-4 ${
        darkMode ? 'text-white' : 'text-gray-900'
      }`}>
        {title}
      </h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {cast.slice(0, 12).map((member) => (
          <Link 
            key={member.id} 
            href={`/name/${member.id}`}
            className="group"
          >
            <div className={`rounded-lg overflow-hidden transition-transform duration-200 hover:scale-105 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-md`}>
              <div className="aspect-[3/4] relative">
                <Image
                  src={member.image || '/placeholder-person.jpg'}
                  alt={member.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                />
              </div>
              <div className="p-3">
                <h4 className={`font-medium text-sm mb-1 line-clamp-2 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {member.name}
                </h4>
                <p className={`text-xs line-clamp-2 ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {member.asCharacter}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CastList;