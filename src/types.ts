export interface HousingListing {
  id: string;
  title: string;
  projectName: string;
  type: 'Apartment' | 'Maisonette' | 'Studio' | 'Townhouse';
  bedrooms: number;
  bathrooms: number;
  price: number; // in KES or local currency, we can display formatted
  currency: string;
  location: string;
  county: string;
  status: 'Completed' | 'Under Construction' | 'Planned';
  imageUrl: string;
  description: string;
  amenities: string[];
  accessibilityFeatures: string[];
  totalUnits: number;
  availableUnits: number;
  sizeSqFt: number;
  paymentPlan: string;
}

export interface TourBooking {
  id: string;
  listingId: string;
  listingTitle: string;
  projectName: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  date: string;
  time: string;
  tourType: 'In-Person' | 'Virtual Video';
  specialRequirements: string;
  status: 'Confirmed' | 'Rescheduled' | 'Cancelled';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface Inquiry {
  id: string;
  listingId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  message: string;
  timestamp: string;
}
