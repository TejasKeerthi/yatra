import React, { useState } from 'react';
import { Attraction } from '../types';
import { X, MapPin, Clock, Star, ExternalLink, Check, Globe, Upload } from 'lucide-react';
import { useSupabaseImages } from '../hooks/useSupabaseImages';
import { ImageUploadComponent } from './ImageUploadComponent';

interface AttractionDetailsModalProps {
  attraction: Attraction;
  isOpen: boolean;
  onClose: () => void;
  isSelected: boolean;
  onToggle: (attraction: Attraction) => void;
}

export const AttractionDetailsModal: React.FC<AttractionDetailsModalProps> = ({ 
  attraction, 
  isOpen, 
  onClose,
  isSelected,
  onToggle
}) => {
  const [showUpload, setShowUpload] = useState(false);
  const { primaryImage, allImages, loading, refetch } = useSupabaseImages(attraction.id);

  if (!isOpen) return null;

  // Use Supabase image if available, fallback to placeholder
  const displayImageUrl = primaryImage?.image_url || `https://picsum.photos/800/600?random=${attraction.id}`;
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(attraction.name + " " + attraction.category)}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 duration-300 border dark:border-slate-800">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors"
        >
          <X size={20} />
        </button>

        {/* Left: Image (Top on mobile) */}
        <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-slate-100 dark:bg-slate-800">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="animate-pulse text-slate-400">Loading image...</div>
            </div>
          ) : (
            <>
              <img 
                src={displayImageUrl} 
                alt={attraction.name}
                className="w-full h-full object-cover"
              />
              {/* Upload Hint Badge */}
              {!primaryImage && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <button
                    onClick={() => setShowUpload(true)}
                    className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-lg"
                  >
                    <Upload size={18} />
                    Add Photo
                  </button>
                </div>
              )}
            </>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent md:hidden" />
          <div className="absolute bottom-4 left-4 md:hidden text-white">
            <h2 className="text-2xl font-bold">{attraction.name}</h2>
            <p className="text-white/80 text-sm">{attraction.category}</p>
          </div>
        </div>

        {/* Right: Details */}
        <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto flex flex-col scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
          <div className="hidden md:block mb-6">
            <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-semibold text-sm mb-2 uppercase tracking-wider">
              <MapPin size={16} />
              {attraction.category}
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{attraction.name}</h2>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-lg font-medium text-sm border border-amber-100 dark:border-amber-800">
              <Star size={16} className="fill-amber-500 text-amber-500" />
              {attraction.rating} Rating
            </div>
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-lg font-medium text-sm">
              <Clock size={16} />
              {attraction.estimatedTime}
            </div>
          </div>

          <div className="prose prose-slate dark:prose-invert mb-8">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">About</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {attraction.description}
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Opening Hours</h3>
            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm">
              {attraction.openingHours}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">What travelers say</h3>
            <div className="space-y-3">
              {attraction.reviews?.map((review, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-3 rounded-xl shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{review.author}</span>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={10} className={i < Math.round(review.rating) ? "fill-current" : "text-slate-200 dark:text-slate-600"} />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-xs italic">"{review.comment}"</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto space-y-3">
             <button
               onClick={() => onToggle(attraction)}
               className={`
                 w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
                 ${isSelected 
                   ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-800' 
                   : 'bg-brand-600 dark:bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-200 dark:shadow-none'}
               `}
             >
               {isSelected ? (
                 <>Remove from Itinerary</>
               ) : (
                 <><Check size={20} /> Add to Itinerary</>
               )}
             </button>
             
             <div className="flex gap-3">
                <a 
                  href={mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3.5 rounded-xl font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center gap-2 transition-colors"
                >
                  <MapPin size={18} /> Maps
                </a>
                
                {attraction.sourceUrl && (
                  <a 
                    href={attraction.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-3.5 rounded-xl font-semibold text-brand-700 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30 border border-brand-100 dark:border-brand-800 hover:bg-brand-100 dark:hover:bg-brand-900/50 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Globe size={18} /> Source
                  </a>
                )}
             </div>

             {/* Image Upload Section */}
             {showUpload && (
               <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
                 <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Upload Attraction Photos</h4>
                 <ImageUploadComponent
                   attractionId={attraction.id}
                   maxFiles={5}
                   onUploadSuccess={() => {
                     refetch();
                     setShowUpload(false);
                   }}
                   onUploadError={(error) => {
                     console.error('Upload failed:', error);
                   }}
                 />
               </div>
             )}
             
             {!showUpload && allImages.length === 0 && (
               <button
                 onClick={() => setShowUpload(true)}
                 className="w-full py-2.5 rounded-lg font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center gap-2 transition-colors text-sm"
               >
                 <Upload size={16} /> Add Photos
               </button>
             )}

             {allImages.length > 0 && (
               <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                 <div className="flex justify-between items-center mb-3">
                   <h4 className="text-sm font-bold text-slate-900 dark:text-white">Photos ({allImages.length})</h4>
                   <button
                     onClick={() => setShowUpload(!showUpload)}
                     className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300"
                   >
                     {showUpload ? 'Hide' : 'Add More'}
                   </button>
                 </div>
                 {showUpload && (
                   <div className="mb-3">
                     <ImageUploadComponent
                       attractionId={attraction.id}
                       maxFiles={5}
                       onUploadSuccess={() => {
                         refetch();
                       }}
                       onUploadError={(error) => {
                         console.error('Upload failed:', error);
                       }}
                     />
                   </div>
                 )}
                 <div className="grid grid-cols-3 gap-2">
                   {allImages.slice(0, 6).map((img) => (
                     <img
                       key={img.id}
                       src={img.image_url}
                       alt="Attraction"
                       className="w-full h-20 object-cover rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors cursor-pointer"
                     />
                   ))}
                 </div>
               </div>
             )}
          </div>

        </div>
      </div>
    </div>
  );
};