import React from 'react';
import { HousingListing } from '../types';
import { MapPin, ArrowRight, UserCheck, ShieldCheck, Heart, Home } from 'lucide-react';

interface ListingCardProps {
  key?: string;
  listing: HousingListing;
  onBookTour: (listing: HousingListing) => void;
  onQuickInquiry: (listing: HousingListing) => void;
}

export default function ListingCard({ listing, onBookTour, onQuickInquiry }: ListingCardProps) {
  // Pick badge colors depending on the construction status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'Under Construction':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Planned':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  return (
    <article 
      className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full focus-within:ring-2 focus-within:ring-emerald-600"
      aria-labelledby={`listing-title-${listing.id}`}
    >
      {/* Property Image & Status */}
      <div className="relative h-48 bg-slate-100 overflow-hidden shrink-0">
        <img
          src={listing.imageUrl}
          alt={listing.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            // fallback image
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-1 rounded border ${getStatusBadge(listing.status)} shadow-sm`}>
            {listing.status}
          </span>
          <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-1 bg-slate-900/80 text-white rounded shadow-sm">
            {listing.type}
          </span>
        </div>
        
        {/* Availability chip */}
        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs text-slate-900 text-[11px] font-bold px-2 py-1 rounded-md shadow-xs">
          {listing.availableUnits > 0 ? (
            <span className="text-emerald-700">{listing.availableUnits} of {listing.totalUnits} Units Available</span>
          ) : (
            <span className="text-red-600">Fully Allocated</span>
          )}
        </div>
      </div>

      {/* Property Information */}
      <div className="p-5 flex-1 flex flex-col">
        {/* County and Location */}
        <div className="flex items-center text-slate-500 text-xs mb-1">
          <MapPin className="h-3.5 w-3.5 text-emerald-600 mr-1 shrink-0" aria-hidden="true" />
          <span className="truncate">{listing.location}, {listing.county} County</span>
        </div>

        {/* Title */}
        <h3 
          id={`listing-title-${listing.id}`} 
          className="font-bold text-lg text-slate-900 tracking-tight leading-snug line-clamp-1 hover:text-emerald-700 transition-colors"
        >
          {listing.title}
        </h3>

        {/* Project Name Subtitle */}
        <p className="text-xs text-slate-400 font-medium mb-3 mt-0.5 font-mono">
          {listing.projectName}
        </p>

        {/* Short Description */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {listing.description}
        </p>

        {/* Accessibility Features Section */}
        <div className="mb-4 pt-3 border-t border-slate-100 flex-1">
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            ♿ Universal Accessibility features
          </span>
          <div className="flex flex-wrap gap-1">
            {listing.accessibilityFeatures.map((feat, idx) => (
              <span 
                key={idx} 
                className="inline-flex items-center text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded"
              >
                {feat}
              </span>
            ))}
          </div>
        </div>

        {/* Basic specifications */}
        <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-lg text-center text-xs text-slate-600 mb-4 border border-slate-100 font-medium">
          <div>
            <span className="block text-[10px] text-slate-400 uppercase font-bold">Bedrooms</span>
            <span className="text-slate-800 font-bold">{listing.bedrooms === 0 ? 'Studio' : `${listing.bedrooms} Bed`}</span>
          </div>
          <div className="border-x border-slate-200">
            <span className="block text-[10px] text-slate-400 uppercase font-bold">Bathrooms</span>
            <span className="text-slate-800 font-bold">{listing.bathrooms} Bath</span>
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 uppercase font-bold">Size</span>
            <span className="text-slate-800 font-bold">{listing.sizeSqFt} sq ft</span>
          </div>
        </div>

        {/* Key Payment Plan tag */}
        <div className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-md p-2 mb-4 font-medium flex items-start gap-1.5">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          <span><strong className="text-emerald-900 font-bold">Purchase Plan:</strong> {listing.paymentPlan}</span>
        </div>

        {/* Price & Action Triggers */}
        <div className="flex justify-between items-center pt-3 border-t border-slate-100 mt-auto">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Purchase Price</span>
            <span className="text-lg font-black text-slate-900 font-mono">
              {listing.currency} {listing.price.toLocaleString()}
            </span>
          </div>
          
          <div className="flex gap-1.5">
            <button
              onClick={() => onQuickInquiry(listing)}
              className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-2.5 py-2 rounded-lg text-xs font-semibold border border-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
              title="Quick Property Inquiry"
              style={{ minHeight: '38px' }}
            >
              Inquire
            </button>
            <button
              onClick={() => onBookTour(listing)}
              className="text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-700 text-xs font-bold py-2 px-3.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-700 flex items-center gap-1"
              style={{ minHeight: '38px' }}
            >
              <span>Schedule Tour</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

      </div>
    </article>
  );
}
