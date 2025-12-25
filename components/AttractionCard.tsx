import React, { useState } from 'react';
import { Attraction } from '../types';
import { Check, Clock, Star, MapPin } from 'lucide-react';
import { getAttractionImageUrl } from '../services/imageService';

interface AttractionCardProps {
  attraction: Attraction;
  isSelected: boolean;
  onToggle: (attraction: Attraction) => void;
  onViewDetails: (attraction: Attraction) => void;
  index: number;
}

export const AttractionCard: React.FC<AttractionCardProps> = ({ 
  attraction, 
  isSelected, 
  onToggle, 
  onViewDetails, 
  index 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageUrl = getAttractionImageUrl(attraction.name);

  return (
    <div 
      className={`
        group relative h-96 rounded-2xl overflow-hidden cursor-pointer 
        transition-all duration-500 shadow-xl hover:shadow-2xl
        ${isSelected 
          ? 'ring-4 ring-teal-400 ring-offset-2 dark:ring-offset-slate-900 scale-105' 
          : 'hover:-translate-y-3'
        }
      `}
    >
      {/* Image Container */}
      <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-slate-400 to-slate-600">
        <img 
          src={imageUrl} 
          alt={attraction.name}
          className={`
            w-full h-full object-cover transition-all duration-700
            ${imageLoaded ? 'opacity-100' : 'opacity-40'}
            group-hover:scale-110
          `}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            setImageLoaded(true);
            (e.currentTarget as HTMLImageElement).src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23334155' width='100' height='100'/%3E%3C/svg%3E`;
          }}
        />
      </div>

      {/* Multi-layer Gradient Overlay for Better Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 via-40% to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/30 to-transparent z-10" />

      {/* Content Wrapper */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 z-20 pointer-events-none">
        
        {/* Top Section - Badges */}
        <div className="flex justify-between items-start gap-3 pointer-events-auto">
          {/* Rating Badge */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 backdrop-blur-md px-4 py-2 rounded-full shadow-lg hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 transform hover:scale-110">
            <Star size={16} className="text-yellow-900 fill-yellow-900" strokeWidth={3} />
            <span className="text-sm font-bold text-yellow-900">
              {attraction.rating.toFixed(1)}
            </span>
          </div>

          {/* Category Badge */}
          <div className="bg-gradient-to-r from-teal-500 to-cyan-500 backdrop-blur-md px-4 py-2 rounded-full shadow-lg max-w-[180px] hover:from-teal-400 hover:to-cyan-400 transition-all duration-300">
            <span className="text-xs font-bold text-white capitalize truncate block">
              {attraction.category}
            </span>
          </div>
        </div>

        {/* Bottom Section - Text Content and Controls */}
        <div className="space-y-4 pointer-events-none">
          {/* Title */}
          <div>
            <h3 className="text-3xl font-black text-white drop-shadow-2xl leading-tight mb-3">
              {attraction.name}
            </h3>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-3 text-white/90">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
              <Clock size={18} className="text-cyan-300" strokeWidth={2.5} />
            </div>
            <span className="text-base font-semibold drop-shadow-lg">
              {attraction.estimatedTime}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-white/85 line-clamp-2 drop-shadow-lg leading-relaxed font-medium">
            {attraction.description}
          </p>
        </div>
      </div>

      {/* Action Button - Fixed Position */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle(attraction);
        }}
        className={`
          absolute bottom-6 right-6 z-30 w-14 h-14 rounded-full flex items-center justify-center 
          transition-all duration-300 shadow-2xl font-bold text-xl
          transform hover:scale-125 pointer-events-auto
          ${isSelected 
            ? 'bg-gradient-to-br from-teal-400 to-cyan-500 text-slate-900 scale-110 hover:from-teal-300 hover:to-cyan-400 shadow-teal-400/50' 
            : 'bg-white/95 dark:bg-slate-800/95 text-slate-700 dark:text-white hover:bg-white dark:hover:bg-slate-700 border-2 border-white dark:border-slate-700'
          }
        `}
        title={isSelected ? "Remove from itinerary" : "Add to itinerary"}
      >
        {isSelected ? <Check size={24} strokeWidth={4} /> : '+'}
      </button>

      {/* View Details Button - Bottom Left */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onViewDetails(attraction);
        }}
        className="absolute bottom-6 left-6 z-30 flex items-center gap-2 text-teal-300 hover:text-teal-100 font-bold text-sm transition-all duration-300 group/btn pointer-events-auto drop-shadow-lg"
      >
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 group-hover/btn:bg-white/30 transition-colors">
          <MapPin size={16} className="text-teal-300" strokeWidth={3} />
        </div>
        <span className="hidden sm:inline">Details</span>
      </button>

      {/* Shine Effect on Hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-x-full group-hover:translate-x-full z-15" />
    </div>
  );
};