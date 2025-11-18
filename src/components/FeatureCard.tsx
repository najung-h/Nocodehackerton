import React from 'react';
import { LucideIcon } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
  large?: boolean;
  imageUrl?: string;
}

export function FeatureCard({ icon: Icon, title, description, onClick, large = false, imageUrl }: FeatureCardProps) {
  return (
    <button
      onClick={onClick}
      className={`group relative rounded-2xl bg-white p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-[#83AF3B] hover:scale-105 w-full h-full`}
    >
      <div className="flex flex-col items-center justify-center h-full text-center gap-4">
        {/* Icon */}
        {imageUrl ? (
          <div className="rounded-full overflow-hidden flex items-center justify-center w-16 h-16">
            <ImageWithFallback 
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="rounded-full bg-gradient-to-br from-[#83AF3B]/20 to-[#9ec590]/20 flex items-center justify-center group-hover:from-[#83AF3B]/30 group-hover:to-[#9ec590]/30 transition-colors w-16 h-16">
            <Icon className="text-[#83AF3B] w-8 h-8" />
          </div>
        )}

        {/* Title */}
        <h3 className="text-gray-900 text-xl md:text-2xl font-bold">{title}</h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </button>
  );
}