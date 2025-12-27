import React, { useState } from 'react';
import { Attraction } from '../types';
import { Check, Clock, Star, MapPin } from 'lucide-react';
import { getAttractionImageUrl } from '../services/imageService';
import { useSupabaseImages } from '../hooks/useSupabaseImages';

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
  const { primaryImage } = useSupabaseImages(attraction.id);
  
  // Use Supabase image if available, fallback to default
  const imageUrl = primaryImage?.image_url || getAttractionImageUrl(attraction.name);

  return (
    <div 
      className={`
        group h-full flex flex-col rounded-2xl overflow-hidden 
        bg-white dark:bg-slate-800 transition-all duration-400
        ${isSelected 
          ? 'ring-3 ring-teal-500 shadow-2xl shadow-teal-500/20 scale-105 dark:ring-offset-slate-900 dark:ring-offset-2' 
          : 'shadow-lg hover:shadow-2xl hover:-translate-y-2'
        }
      `}
    >
      {/* IMAGE SECTION - Tall, Clean */}
      <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-slate-300 to-slate-500">
        <img 
          src={imageUrl} 
          alt={attraction.name}
          className={`
            w-full h-full object-cover transition-all duration-500
            ${imageLoaded ? 'opacity-100' : 'opacity-20'}
            group-hover:scale-105
          `}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            setImageLoaded(true);
            (e.currentTarget as HTMLImageElement).src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%236b7280' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' font-size='20' fill='white' text-anchor='middle' dy='.3em'%3EImage Loading%3C/text%3E%3C/svg%3E`;
          }}
        />

        {/* Quick Rating Badge - Top Left */}
        <div className="absolute top-3 left-3 flex items-center gap-2 bg-yellow-400 px-3 py-1.5 rounded-full shadow-md">
          <Star size={14} className="text-yellow-700 fill-yellow-700" strokeWidth={3} />
          <span className="text-xs font-bold text-yellow-900">
            {attraction.rating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* CONTENT SECTION - Clean and Organized */}
      <div className="flex flex-col flex-grow p-5 space-y-4">
        
        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight line-clamp-2">
          {attraction.name}
        </h3>

        {/* Duration Info */}
        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
          <div className="bg-teal-50 dark:bg-teal-900/30 p-2 rounded-lg">
            <Clock size={16} className="text-teal-600 dark:text-teal-400" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-semibold">
            {attraction.estimatedTime}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed flex-grow">
          {attraction.description}
        </p>

        {/* Category Badge */}
        <div className="inline-block">
          <span className="inline-block bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 text-xs font-bold px-3 py-1.5 rounded-full capitalize">
            {attraction.category}
          </span>
        </div>

        {/* Action Buttons - Bottom */}
        <div className="flex gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={() => onViewDetails(attraction)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg 
              text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300
              hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors font-semibold text-sm"
          >
            <MapPin size={16} strokeWidth={2.5} />
            <span>Details</span>
          </button>

          <button
            onClick={() => onToggle(attraction)}
            className={`
              flex items-center justify-center px-4 py-2.5 rounded-lg font-bold 
              transition-all duration-300 
              ${isSelected
                ? 'bg-teal-500 text-white hover:bg-teal-600 shadow-md'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600'
              }
            `}
            title={isSelected ? "Remove" : "Add"}
          >
            {isSelected ? <Check size={20} strokeWidth={3} /> : <span className="text-lg">+</span>}
          </button>
        </div>
      </div>
    </div>
  );
};