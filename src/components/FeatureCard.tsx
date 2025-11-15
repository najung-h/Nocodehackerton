import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
  large?: boolean;
}

export function FeatureCard({ icon: Icon, title, description, onClick, large = false }: FeatureCardProps) {
  return (
    <button
      onClick={onClick}
      className={`group relative rounded-2xl bg-white p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-cyan-300 hover:scale-105 ${
        large ? 'aspect-square' : 'h-full'
      }`}
    >
      <div className="flex flex-col items-center justify-center h-full text-center gap-4">
        {/* Icon */}
        <div className={`rounded-full bg-gradient-to-br from-cyan-100 to-teal-100 flex items-center justify-center group-hover:from-cyan-200 group-hover:to-teal-200 transition-colors ${
          large ? 'w-20 h-20' : 'w-16 h-16'
        }`}>
          <Icon className={`text-cyan-600 ${large ? 'w-10 h-10' : 'w-8 h-8'}`} />
        </div>

        {/* Title */}
        <h3 className="text-gray-900">{title}</h3>

        {/* Description */}
        <p className={`text-gray-700 leading-relaxed ${large ? 'text-base' : 'text-sm'}`}>
          {description}
        </p>
      </div>
    </button>
  );
}