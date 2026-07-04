import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ListingCard from './components/ListingCard';
import { HousingListing, TourBooking, ChatMessage } from './types';
import { 
  Building2, 
  Calendar, 
  ShieldAlert, 
  HelpCircle, 
  ArrowRight, 
  Sparkles, 
  Send, 
  X, 
  Check, 
  CheckCircle2, 
  PhoneCall, 
  Info,
  ChevronDown,
  Building,
  User,
  Heart,
  Accessibility,
  Calculator,
  Hammer,
  TrendingUp,
  Layers,
  MapPin,
  DollarSign,
  Users,
  Award,
  Mail,
  FileText,
  Landmark
} from 'lucide-react';

export default function App() {
  // Navigation & Tabs state
  const [activeTab, setActiveTab] = useState<'listings' | 'my-tours' | 'about' | 'faqs' | 'ai-assistant'>('listings');
  
  // Data State
  const [listings, setListings] = useState<HousingListing[]>([]);
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([]);
  const [bookedTours, setBookedTours] = useState<TourBooking[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCounty, setSelectedCounty] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedPriceMax, setSelectedPriceMax] = useState<number>(5000000);
  const [selectedStatusTab, setSelectedStatusTab] = useState<'All' | 'Completed' | 'Under Construction' | 'Planned'>('All');

  // Modal control states
  const [selectedTourListing, setSelectedTourListing] = useState<HousingListing | null>(null);
  const [selectedInquiryListing, setSelectedInquiryListing] = useState<HousingListing | null>(null);
  
  // Booking Form State
  const [bookingName, setBookingName] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingTourType, setBookingTourType] = useState<'In-Person' | 'Virtual Video'>('In-Person');
  const [bookingAccessibilityReq, setBookingAccessibilityReq] = useState('');
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Inquiry Form State
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);

  // Chatbot State
  const [isChatOpen, setIsChatOpen] = useState(true); // Open by default for user awareness
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Habari! I am **Nyumbani Assistant**, your National Housing guide. Ask me anything about our affordable houses, payment plans (like rent-to-own), or how to book a tour. Try clicking one of the suggested prompts below!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // FAQ Accordion Open State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Rural Loan Calculator & Inquiry States
  const [ruralLoanAmount, setRuralLoanAmount] = useState<number>(2000000);
  const [ruralLoanTerm, setRuralLoanTerm] = useState<number>(10); // years
  const [showRuralModal, setShowRuralModal] = useState<boolean>(false);
  const [ruralName, setRuralName] = useState<string>('');
  const [ruralEmail, setRuralEmail] = useState<string>('');
  const [ruralPhone, setRuralPhone] = useState<string>('');
  const [ruralCounty, setRuralCounty] = useState<string>('');
  const [ruralMessage, setRuralMessage] = useState<string>('');
  const [ruralSubmitting, setRuralSubmitting] = useState<boolean>(false);
  const [ruralSuccess, setRuralSuccess] = useState<boolean>(false);

  // About NHC Sub-Tab state
  const [aboutSubTab, setAboutSubTab] = useState<'overview' | 'gallery' | 'governance' | 'services' | 'contacts'>('overview');
  const [galleryFilter, setGalleryFilter] = useState<'All' | 'Completed' | 'Under Construction' | 'Planned'>('All');

  // Initial Data Fetch
  useEffect(() => {
    async function fetchData() {
      try {
        const listingsRes = await fetch('/api/listings');
        if (listingsRes.ok) {
          const listingsData = await listingsRes.json();
          setListings(listingsData);
        }
        
        const faqsRes = await fetch('/api/faqs');
        if (faqsRes.ok) {
          const faqsData = await faqsRes.json();
          setFaqs(faqsData);
        }

        const bookingsRes = await fetch('/api/bookings');
        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json();
          setBookedTours(bookingsData);
        }
      } catch (err) {
        console.error('Error fetching initial data:', err);
      } finally {
        setLoadingListings(false);
      }
    }
    fetchData();
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatOpen]);

  // Unique lists for filtering
  const counties: string[] = Array.from(new Set(listings.map(l => l.county)));
  const types: string[] = Array.from(new Set(listings.map(l => l.type))) as string[];

  // Filter listings
  const filteredListings = listings.filter(listing => {
    const matchesSearch = 
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.county.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCounty = selectedCounty === 'All' || listing.county === selectedCounty;
    const matchesType = selectedType === 'All' || listing.type === selectedType;
    const matchesPrice = listing.price <= selectedPriceMax;
    const matchesStatus = selectedStatusTab === 'All' || listing.status === selectedStatusTab;

    return matchesSearch && matchesCounty && matchesType && matchesPrice && matchesStatus;
  });

  // Handle Tour Booking Submission
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTourListing) return;

    setSubmittingBooking(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: selectedTourListing.id,
          listingTitle: selectedTourListing.title,
          projectName: selectedTourListing.projectName,
          userName: bookingName,
          userEmail: bookingEmail,
          userPhone: bookingPhone,
          date: bookingDate,
          time: bookingTime,
          tourType: bookingTourType,
          specialRequirements: bookingAccessibilityReq
        })
      });

      if (response.ok) {
        const result = await response.json();
        setBookingSuccess(true);
        // Add to booked tours locally
        setBookedTours(prev => [...prev, result.booking]);
        
        // Add a message to chat to confirm
        const confirmationMsg: ChatMessage = {
          id: `confirm-${Date.now()}`,
          sender: 'assistant',
          text: `🎉 **Tour Booked Successfully!**\nYour tour for **${selectedTourListing.title}** is scheduled for **${bookingDate}** at **${bookingTime}** (${bookingTourType}). We have sent details to **${bookingEmail}**.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages(prev => [...prev, confirmationMsg]);

        // Clear Form fields
        setTimeout(() => {
          setSelectedTourListing(null);
          setBookingSuccess(false);
          setBookingName('');
          setBookingEmail('');
          setBookingPhone('');
          setBookingDate('');
          setBookingTime('');
          setBookingAccessibilityReq('');
        }, 3000);
      }
    } catch (err) {
      console.error(err);
      alert('Error booking tour. Please try again.');
    } finally {
      setSubmittingBooking(false);
    }
  };

  // Handle Quick Inquiry Submission
  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiryListing) return;

    setSubmittingInquiry(true);
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: selectedInquiryListing.id,
          userName: inquiryName,
          userEmail: inquiryEmail,
          userPhone: inquiryPhone,
          message: inquiryMessage
        })
      });

      if (response.ok) {
        setInquirySuccess(true);
        setTimeout(() => {
          setSelectedInquiryListing(null);
          setInquirySuccess(false);
          setInquiryName('');
          setInquiryEmail('');
          setInquiryPhone('');
          setInquiryMessage('');
        }, 2500);
      }
    } catch (err) {
      console.error(err);
      alert('Error sending inquiry. Please try again.');
    } finally {
      setSubmittingInquiry(false);
    }
  };

  // Send Chat message to backend chatbot
  const handleSendChatMessage = async (textToSend: string) => {
    const userText = textToSend.trim();
    if (!userText) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const conversationHistory = [...chatMessages, userMsg];
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversationHistory })
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages(prev => [...prev, assistantMsg]);
      } else {
        throw new Error('Failed to fetch AI reply');
      }
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: "I experienced a connection bump, but don't worry! You can easily search for properties above or use the **'Schedule Tour'** button on any listing card. How else can I assist?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendChatMessage(chatInput);
    }
  };

  // Quick Chat Prompts
  const suggestedPrompts = [
    { label: "💰 Rent to Own plans", query: "What is the Tenant Purchase Scheme?" },
    { label: "♿ Accessible PWD units", query: "What accessibility features are supported for persons with disabilities?" },
    { label: "📍 Nairobi listings", query: "Show me affordable homes in Nairobi county" },
    { label: "🏢 Studio houses pricing", query: "Show me Studio units and prices" }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-950 antialiased">
      
      {/* Dynamic Navigation Bar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          // Scroll to top when tab changes for clean page experience
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }} 
      />

      {/* Hero & Multi-Criteria Search Section - Only on Listings page */}
      {activeTab === 'listings' && (
        <Hero
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCounty={selectedCounty}
          setSelectedCounty={setSelectedCounty}
          selectedPriceMax={selectedPriceMax}
          setSelectedPriceMax={setSelectedPriceMax}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          counties={counties}
          types={types}
          onOpenChat={() => setActiveTab('ai-assistant')}
        />
      )}

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full" tabIndex={-1}>
        
        {activeTab === 'listings' && (
          <section aria-label="Available Housing Listings">
            {/* Project Status Tabs */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-4 mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Building2 className="h-6 w-6 text-emerald-600" />
                  National Affordable Housing Directory
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Discover government-backed units designed for security, comfort, and financial inclusivity.
                </p>
              </div>

              {/* Status Toggles */}
              <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200/60 w-full sm:w-auto overflow-x-auto shrink-0">
                {(['All', 'Completed', 'Under Construction', 'Planned'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatusTab(status)}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
                      selectedStatusTab === status
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                    }`}
                    style={{ minHeight: '36px' }}
                  >
                    {status === 'All' ? 'All Developments' : status}
                  </button>
                ))}
              </div>
            </div>

            {/* Directory Results */}
            {filteredListings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    onBookTour={(list) => {
                      setSelectedTourListing(list);
                      // Pre-fill date fields to tomorrow
                      const tomorrow = new Date();
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      setBookingDate(tomorrow.toISOString().split('T')[0]);
                      setBookingTime('10:00');
                    }}
                    onQuickInquiry={(list) => {
                      setSelectedInquiryListing(list);
                      setInquiryMessage(`I am highly interested in "${list.title}" in ${list.location} and would like more details on the tenant purchase plan.`);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-xl mx-auto shadow-xs">
                <div className="bg-slate-100 p-4 rounded-full w-14 h-14 flex items-center justify-center mx-auto text-slate-400 mb-4">
                  <Building className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-800">No properties match your current filters</h3>
                <p className="text-slate-500 text-sm mt-1">
                  Try clearing some keyword search filters or adjusting the price ceiling to view more National Housing developments.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCounty('All');
                    setSelectedType('All');
                    setSelectedPriceMax(5000000);
                    setSelectedStatusTab('All');
                  }}
                  className="mt-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg transition"
                >
                  Reset All Search Filters
                </button>
              </div>
            )}
          </section>
        )}

        {/* My Booked Tours Tab */}
        {activeTab === 'my-tours' && (
          <section aria-label="My Scheduled Property Tours" className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-5 mb-6">
                <div className="bg-emerald-50 p-2.5 rounded-lg text-emerald-700">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Your Booked Property Tours</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Review dates, times, and tour modes for your selected properties.</p>
                </div>
              </div>

              {bookedTours.length > 0 ? (
                <div className="space-y-4">
                  {bookedTours.map((tour) => (
                    <div key={tour.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="space-y-1">
                        <span className={`text-[9px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded ${
                          tour.tourType === 'In-Person' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {tour.tourType} Tour
                        </span>
                        <h3 className="font-bold text-base text-slate-900 mt-1">{tour.listingTitle}</h3>
                        <p className="text-xs text-slate-400 font-mono">{tour.projectName}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 pt-1.5 font-medium">
                          <span>📅 Date: <strong className="text-slate-900">{tour.date}</strong></span>
                          <span>⏰ Time: <strong className="text-slate-900">{tour.time}</strong></span>
                          <span>👤 Visitor: <strong className="text-slate-900">{tour.userName}</strong></span>
                        </div>
                        {tour.specialRequirements && (
                          <div className="text-emerald-800 bg-emerald-50/70 border border-emerald-100 rounded p-2 mt-2">
                            <strong>♿ Accessibility / Support Needs:</strong> {tour.specialRequirements}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex sm:flex-col items-end gap-2 w-full sm:w-auto shrink-0 border-t sm:border-0 pt-3 sm:pt-0">
                        <span className="text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded border border-green-200 flex items-center gap-1">
                          <Check className="h-3.5 w-3.5" />
                          Confirmed Appointment
                        </span>
                        <p className="text-[10px] text-slate-400 font-medium">An agent will call/email 1 hour prior.</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                  <p className="text-slate-500 font-medium text-sm">You haven't scheduled any property tours yet.</p>
                  <p className="text-slate-400 text-xs mt-1">Browse our directory and click the "Schedule Tour" button to secure an appointment!</p>
                  <button
                    onClick={() => setActiveTab('listings')}
                    className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition"
                  >
                    Explore Housing Options
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* About NHC & Social Mission Tab */}
        {activeTab === 'about' && (
          <section aria-label="About National Housing Corporation" className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
            
            {/* NHC Corporate Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white shadow-lg border border-emerald-900/60">
              <div className="absolute inset-0 opacity-25">
                <img 
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80" 
                  alt="National Housing Corporation" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="relative p-8 md:p-12 max-w-3xl space-y-4">
                <span className="bg-emerald-600/90 text-white font-extrabold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded">
                  State Corporation of Kenya
                </span>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white leading-none">
                  National Housing Corporation (NHC)
                </h2>
                <p className="text-sm md:text-base text-slate-200 leading-relaxed font-medium">
                  Established under the Housing Act (Cap 117), NHC is the primary government vehicle for implementing the Bottom-up Economic Transformation Agenda (BETA) for housing, ensuring every Kenyan family has access to decent, secure, and affordable shelter.
                </p>
                <div className="flex flex-wrap gap-4 pt-2 font-mono text-[11px] text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Subsidized Interest Rates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>State-Certified Materials</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>PWD Inclusive Designs</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Sub-Navigation Tabs */}
            <div className="flex flex-wrap border-b border-slate-200 gap-1 pb-0.5" role="tablist" aria-label="About NHC sections">
              {[
                { id: 'overview', label: 'Mandate & Overview', icon: Landmark },
                { id: 'gallery', label: 'Iconic Projects Gallery', icon: Building2 },
                { id: 'governance', label: 'Corporate Leadership', icon: Users },
                { id: 'services', label: 'Joint Ventures & Consultancy', icon: Layers },
                { id: 'contacts', label: 'HQ & Regional Offices', icon: MapPin },
              ].map((subTab) => {
                const Icon = subTab.icon;
                const isActive = aboutSubTab === subTab.id;
                return (
                  <button
                    key={subTab.id}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setAboutSubTab(subTab.id as any)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-t-xl font-bold text-xs border-b-2 transition duration-150 cursor-pointer ${
                      isActive 
                        ? 'border-emerald-600 bg-slate-50 text-emerald-800' 
                        : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{subTab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Sub-Tab Content rendering */}
            
            {/* 1. MANDATE & OVERVIEW */}
            {aboutSubTab === 'overview' && (
              <div className="space-y-8 animate-fadeIn">
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                  <h3 className="font-bold text-slate-900 text-xl mb-3">Our Core Mandate</h3>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    The National Housing Corporation mandates and facilitates affordable urban planning, high-quality development, and accessible pathways to enable citizens to transition from tenancy to permanent homeownership. Under the Ministry of Lands, Public Works, Housing and Urban Development, we spearhead sustainable housing schemes, manufacture state-certified EPS panels, and offer specialized credit loans to empower both urban and rural communities.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Tenant Purchase Scheme */}
                  <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-emerald-50 p-2.5 rounded-xl text-emerald-700">
                          <Building className="h-6 w-6" />
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg">Tenant Purchase Scheme (TPS)</h3>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Our flagship rent-to-own initiative allows low-and-middle-income buyers to secure a permanent home without traditional bank mortgages. Under TPS, homebuyers put down a subsidized 10% to 15% deposit, immediately occupy the home, and redeem the remaining balance over 15 to 20 years at a flat, government-subsidized interest rate of 7% - 9% per annum.
                      </p>
                    </div>
                    <div className="border-t border-slate-100 pt-4 mt-6 flex items-center justify-between text-xs font-bold">
                      <span className="text-emerald-600">Subsidized Interest: 7-9%</span>
                      <button 
                        onClick={() => setActiveTab('listings')}
                        className="text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                      >
                        View TPS Properties <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* EPS Factory */}
                  <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-emerald-50 p-2.5 rounded-xl text-emerald-700">
                          <Hammer className="h-6 w-6" />
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg">Expanded Polystyrene (EPS) Factory</h3>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <img 
                          src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=300&q=80" 
                          alt="Construction using EPS panels" 
                          className="col-span-1 h-16 w-full object-cover rounded-lg"
                          referrerPolicy="no-referrer"
                        />
                        <p className="col-span-2 text-xs text-slate-500 leading-relaxed">
                          NHC operates a state-of-the-art manufacturing facility in Mavoko producing EPS panels. Consisting of a high-density polystyrene core sandwiched by galvanized steel mesh, these panels reduce construction costs by 30%, shorten construction time by 50%, and provide superior thermal insulation, sound-proofing, and fire resistance.
                        </p>
                      </div>
                    </div>
                    <div className="border-t border-slate-100 pt-4 mt-6 flex items-center justify-between text-xs font-bold">
                      <span className="text-emerald-700">Construction speed: 2x faster</span>
                      <span className="text-slate-400 font-medium">Manufactured in Mavoko</span>
                    </div>
                  </div>

                  {/* Accessibility Charter */}
                  <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-emerald-50 p-2.5 rounded-xl text-emerald-700">
                          <Accessibility className="h-6 w-6" />
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg">Inclusion & PWD Charter</h3>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        National Housing designs for absolute inclusion. Our Accessibility Charter mandates that ground-floor units across all developments are strictly prioritized for Persons with Disabilities (PWDs) and senior citizens. Doorways are widened to a minimum of 32 inches, visual/audible elevators are installed, ramps are standard, and tactile floor paving guides common walks.
                      </p>
                    </div>
                    <div className="border-t border-slate-100 pt-4 mt-6 flex items-center justify-between text-xs font-bold">
                      <span className="text-emerald-600">Priority Ground Floor</span>
                      <span className="text-slate-400 font-medium font-mono">Wheelchair Accessible</span>
                    </div>
                  </div>

                  {/* Rural Housing Loans */}
                  <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-emerald-50 p-2.5 rounded-xl text-emerald-700">
                          <TrendingUp className="h-6 w-6" />
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg">Rural Housing Loan Scheme</h3>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Own a piece of land in rural or peri-urban Kenya? NHC provides financial empowerment loans up to KSh 5,000,000 to construct a quality, certified home directly on your own plot. The rural loan program bypasses high-commercial banks, offering a flat 9% subsidized interest rate with flexible repayment periods up to 15 years.
                      </p>
                    </div>
                    <div className="border-t border-slate-100 pt-4 mt-6 flex items-center justify-between text-xs font-bold">
                      <span className="text-indigo-600">Subsidy Rate: 9% Flat</span>
                      <button 
                        onClick={() => {
                          setAboutSubTab('overview');
                          setTimeout(() => {
                            document.getElementById('rural-calculator')?.scrollIntoView({ behavior: 'smooth' });
                          }, 100);
                        }}
                        className="text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-bold cursor-pointer"
                      >
                        Try Rural Calculator <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                </div>

                {/* Rural Loan Interactive Repayment Calculator */}
                <div id="rural-calculator" className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-6 md:p-8 shadow-lg space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                    <div>
                      <h3 className="font-black text-white text-lg flex items-center gap-2">
                        <Calculator className="h-5 w-5 text-amber-400" />
                        Rural Housing Loan Calculator
                      </h3>
                      <p className="text-slate-400 text-xs mt-1">Estimate your monthly payment schedule under our 9% subsidized rural loan program.</p>
                    </div>
                    <span className="bg-amber-400/20 text-amber-300 font-mono text-[11px] font-bold px-3 py-1.5 rounded-lg border border-amber-400/30 self-start md:self-center">
                      Interest Rate: 9.0% Flat p.a.
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    
                    {/* Sliders and Toggles */}
                    <div className="lg:col-span-7 space-y-6">
                      {/* Amount Slider */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span className="text-slate-300">Loan Principal Amount</span>
                          <span className="text-amber-400 font-mono text-sm">
                            KSh {ruralLoanAmount.toLocaleString()}
                          </span>
                        </div>
                        <input 
                          id="loan-amount-slider"
                          type="range" 
                          min={500000} 
                          max={5000000} 
                          step={100000} 
                          value={ruralLoanAmount}
                          onChange={(e) => setRuralLoanAmount(Number(e.target.value))}
                          className="w-full accent-amber-400 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                          <span>Min: KSh 500,000</span>
                          <span>Max: KSh 5,000,000</span>
                        </div>
                      </div>

                      {/* Repayment Term */}
                      <div className="space-y-3">
                        <span className="text-xs font-bold text-slate-300 block">Repayment Period (Years)</span>
                        <div className="grid grid-cols-4 gap-2">
                          {[5, 10, 15, 20].map((term) => (
                            <button
                              key={term}
                              type="button"
                              onClick={() => setRuralLoanTerm(term)}
                              className={`py-2 px-3 rounded-xl font-bold text-xs transition ${
                                ruralLoanTerm === term 
                                  ? 'bg-amber-400 text-slate-950 shadow-md animate-pulse' 
                                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                              }`}
                            >
                              {term} Years
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Repayment Summary */}
                    <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
                      <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Estimated Repayment Plan</span>
                      
                      <div className="space-y-1">
                        <span className="text-xs text-slate-400 block">Monthly Installment</span>
                        <div className="text-2xl md:text-3xl font-black text-amber-400 font-mono">
                          KSh {Math.round((ruralLoanAmount + (ruralLoanAmount * 0.09 * ruralLoanTerm)) / (ruralLoanTerm * 12)).toLocaleString()}
                        </div>
                        <span className="text-[10px] text-slate-500 block leading-none">For {ruralLoanTerm * 12} calendar months</span>
                      </div>

                      <div className="border-t border-slate-800 pt-3 space-y-2 text-xs font-mono">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Principal:</span>
                          <span className="text-white">KSh {ruralLoanAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Total Interest (9% p.a.):</span>
                          <span className="text-white">KSh {Math.round(ruralLoanAmount * 0.09 * ruralLoanTerm).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-800 pt-2 font-bold text-sm">
                          <span className="text-slate-300">Total Payable:</span>
                          <span className="text-amber-400 font-semibold">KSh {Math.round(ruralLoanAmount + (ruralLoanAmount * 0.09 * ruralLoanTerm)).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Repayment Application Form */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mt-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-800 p-2 rounded-lg text-amber-400">
                        <Info className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white">Apply or Inquire for Rural Loan Scheme</h4>
                        <p className="text-[11px] text-slate-400">Ready to build? Submit a credit inquiry directly to our Rural Credit Officers.</p>
                      </div>
                    </div>

                    {ruralSuccess ? (
                      <div className="bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs p-4 rounded-xl flex items-center gap-3 animate-fadeIn">
                        <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                        <div>
                          <p className="font-bold">Rural Loan Credit Inquiry Submitted!</p>
                          <p className="text-[11px] text-emerald-300/90 mt-0.5">Thank you for your inquiry. A credit officer will call you back within 24 working hours to evaluate your plot documentation.</p>
                        </div>
                      </div>
                    ) : (
                      <form 
                        onSubmit={async (e) => {
                          e.preventDefault();
                          if (!ruralName || !ruralEmail || !ruralPhone || !ruralCounty) return;
                          setRuralSubmitting(true);
                          // Simulate api submit delay
                          await new Promise((resolve) => setTimeout(resolve, 800));
                          setRuralSubmitting(false);
                          setRuralSuccess(true);
                        }}
                        className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end"
                      >
                        <div className="space-y-1">
                          <label htmlFor="rural-name" className="text-[10px] text-slate-400 font-bold block">Your Name</label>
                          <input 
                            id="rural-name"
                            type="text" 
                            required
                            value={ruralName}
                            onChange={(e) => setRuralName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                          />
                        </div>
                        <div className="space-y-1">
                          <label htmlFor="rural-phone" className="text-[10px] text-slate-400 font-bold block">Phone Number</label>
                          <input 
                            id="rural-phone"
                            type="tel" 
                            required
                            value={ruralPhone}
                            onChange={(e) => setRuralPhone(e.target.value)}
                            placeholder="+254 700 000000"
                            className="w-full bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                          />
                        </div>
                        <div className="space-y-1">
                          <label htmlFor="rural-email" className="text-[10px] text-slate-400 font-bold block">Email Address</label>
                          <input 
                            id="rural-email"
                            type="email" 
                            required
                            value={ruralEmail}
                            onChange={(e) => setRuralEmail(e.target.value)}
                            placeholder="name@domain.co.ke"
                            className="w-full bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                          />
                        </div>
                        <div className="space-y-1">
                          <label htmlFor="rural-county" className="text-[10px] text-slate-400 font-bold block">County of Plot</label>
                          <input 
                            id="rural-county"
                            type="text" 
                            required
                            value={ruralCounty}
                            onChange={(e) => setRuralCounty(e.target.value)}
                            placeholder="e.g. Kakamega"
                            className="w-full bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                          />
                        </div>
                        <div className="md:col-span-4 flex justify-between items-center pt-2 gap-4">
                          <p className="text-[10px] text-slate-500 leading-normal max-w-xl">
                            Applicants must hold a valid Title Deed or Certificate of Lease in their name. Plot should be accessible and verified for standard security evaluation.
                          </p>
                          <button
                            type="submit"
                            disabled={ruralSubmitting || !ruralName || !ruralEmail || !ruralPhone || !ruralCounty}
                            className="bg-amber-400 hover:bg-amber-500 disabled:bg-slate-700 disabled:text-slate-400 text-slate-950 font-extrabold text-xs px-6 py-2.5 rounded-xl transition cursor-pointer whitespace-nowrap"
                          >
                            {ruralSubmitting ? 'Evaluating details...' : 'Submit Credit Inquiry'}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 2. ICONIC PROJECTS GALLERY */}
            {aboutSubTab === 'gallery' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">National Housing Corporation Projects</h3>
                    <p className="text-xs text-slate-500 mt-1">Explore photos and key specifications of flagship developments spearheading the housing agenda.</p>
                  </div>
                  
                  {/* Gallery Filters */}
                  <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter projects by completion status">
                    {['All', 'Completed', 'Under Construction', 'Planned'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setGalleryFilter(status as any)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                          galleryFilter === status
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Projects Grid with Photos */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      id: 'gal-pangani',
                      title: 'Pangani Affordable Housing Scheme',
                      location: 'Ring Road, Pangani, Nairobi',
                      county: 'Nairobi',
                      status: 'Completed',
                      units: '1,562 Units',
                      description: 'Part of the Nairobi Urban Regeneration Program. This state-of-the-art housing complex provides modern high-density vertical apartments with state certified solar energy networks, wastewater recycling, and inclusive elevators.',
                      imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
                      badge: 'Urban Regeneration Model'
                    },
                    {
                      id: 'gal-stoni-athi',
                      title: 'Stoni Athi Waterfront Estate',
                      location: 'Mombasa Road, Athi River',
                      county: 'Machakos',
                      status: 'Under Construction',
                      units: '850 Units (Phase II active)',
                      description: 'A massive scenic master-planned community. Incorporates both traditional masonry maisonettes and modular studio/apartment blocks constructed with Mavoko EPS technology, offering high thermal efficiency and spacious layout plans.',
                      imageUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=600&q=80',
                      badge: 'Master-Planned Community'
                    },
                    {
                      id: 'gal-eps-factory',
                      title: 'Mavoko EPS Manufacturing Plant',
                      location: 'Mavoko Industrial Park, Machakos',
                      county: 'Machakos',
                      status: 'Completed',
                      units: '120,000 Panels / Year',
                      description: 'NHC\'s ultra-modern manufacturing plant producing Expanded Polystyrene (EPS) construction panels. EPS sandwich panels reduce building costs by 30% and halve erection times while guaranteeing bullet and fire-resistant structures.',
                      imageUrl: 'https://images.unsplash.com/photo-1581094125919-76c228c28e96?auto=format&fit=crop&w=600&q=80',
                      badge: 'Green Material Technology'
                    },
                    {
                      id: 'gal-kanyakwar',
                      title: 'Kanyakwar Affordable Housing Scheme',
                      location: 'Off Kakamega Road, Kisumu',
                      county: 'Kisumu',
                      status: 'Planned',
                      units: '400 Apartments',
                      description: 'An upcoming lakeside model development configured with standard 1, 2, and 3-bedroom options. Emphasizes modern design guidelines, panoramic views of Lake Victoria, central borehole water loops, and accessible common gardens.',
                      imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80',
                      badge: 'Lakeside Green Living'
                    },
                    {
                      id: 'gal-marula',
                      title: 'Kipchoge Keino Estate (Marula)',
                      location: 'Marula Area, Eldoret Town',
                      county: 'Uasin Gishu',
                      status: 'Completed',
                      units: '150 modern flats',
                      description: 'An architectural benchmark in Eldoret. The estate consists of three-bedroom modern apartments engineered with EPS technology. Features ample recreational spaces, state-of-the-art security patrols, and wide tactile common walkways.',
                      imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80',
                      badge: 'Affordable Sports City Link'
                    },
                    {
                      id: 'gal-changamwe',
                      title: 'Changamwe Heights Redevelopment',
                      location: 'Changamwe West, Mombasa',
                      county: 'Mombasa',
                      status: 'Planned',
                      units: '250 Apartments',
                      description: 'A designed coastal community optimized to support ocean breeze ventilation, tile flooring, and reliable central water reserves. Configured with a designated accessibility track guaranteeing ground-floor mobility priority for senior citizens.',
                      imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
                      badge: 'Coastal Cross-Ventilation'
                    }
                  ].filter(p => galleryFilter === 'All' || p.status === galleryFilter).map((project) => (
                    <div key={project.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
                      <div>
                        {/* Project Image */}
                        <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                          <img 
                            src={project.imageUrl} 
                            alt={project.title} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <span className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded-full text-white ${
                            project.status === 'Completed' ? 'bg-emerald-600' :
                            project.status === 'Under Construction' ? 'bg-emerald-700' : 'bg-amber-500'
                          }`}>
                            {project.status}
                          </span>
                        </div>

                        {/* Project Info */}
                        <div className="p-4 space-y-2">
                          <span className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-600 font-mono">
                            {project.badge}
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm leading-snug">{project.title}</h4>
                          
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                            <span>{project.location}</span>
                          </div>

                          <p className="text-slate-600 text-[11px] leading-relaxed pt-1.5 border-t border-slate-100">
                            {project.description}
                          </p>
                        </div>
                      </div>

                      {/* Footer Specs */}
                      <div className="bg-slate-50 border-t border-slate-100 px-4 py-3 flex items-center justify-between text-xs font-bold text-slate-700">
                        <span className="font-mono text-[10px] bg-slate-200/60 px-2 py-0.5 rounded text-slate-600">
                          {project.county} County
                        </span>
                        <span className="text-emerald-700 font-mono text-[11px]">{project.units}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. CORPORATE GOVERNANCE */}
            {aboutSubTab === 'governance' && (
              <div className="space-y-8 animate-fadeIn">
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                  <div className="max-w-3xl space-y-2">
                    <h3 className="font-bold text-slate-900 text-lg">NHC Corporate Governance</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Guided by integrity, transparency, and a devotion to national transformation, the National Housing Corporation (NHC) board and executive leaders coordinate efforts directly with the Ministry of Lands, Public Works, Housing and Urban Development to implement housing development goals under Kenya\'s bottom-up economic plan.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Board Chairman */}
                  <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row gap-5 items-start">
                    <div className="bg-emerald-50 text-emerald-700 p-4 rounded-full border border-emerald-100 shrink-0 mx-auto md:mx-0">
                      <User className="h-10 w-10 text-emerald-600" />
                    </div>
                    <div className="space-y-3 text-center md:text-left">
                      <div>
                        <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest font-mono">Board Chairperson</span>
                        <h4 className="font-bold text-slate-900 text-lg">Hon. Yusuf Chanzu</h4>
                        <p className="text-[11px] text-slate-400 font-medium">National Housing Corporation Kenya Board</p>
                      </div>
                      <p className="text-slate-600 text-xs leading-relaxed border-t border-slate-100 pt-3">
                        Hon. Yusuf Chanzu provides robust strategic and political oversight to ensure that NHC projects remain aligned with national policy. His long expertise in governance, infrastructure development, and national administration guarantees that the corporation executes housing projects transparently and within the public interest.
                      </p>
                    </div>
                  </div>

                  {/* Managing Director */}
                  <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row gap-5 items-start">
                    <div className="bg-emerald-50 text-emerald-700 p-4 rounded-full border border-emerald-100 shrink-0 mx-auto md:mx-0">
                      <User className="h-10 w-10 text-emerald-600" />
                    </div>
                    <div className="space-y-3 text-center md:text-left">
                      <div>
                        <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest font-mono">Managing Director & CEO</span>
                        <h4 className="font-bold text-slate-900 text-lg">Mr. David Njuguna</h4>
                        <p className="text-[11px] text-slate-400 font-medium">Chief Executive, NHC Kenya</p>
                      </div>
                      <p className="text-slate-600 text-xs leading-relaxed border-t border-slate-100 pt-3">
                        Mr. David Njuguna leads the executive management team and oversees the technical implementation of NHC\'s core programs. Under his leadership, NHC has scaled up the output of the Mavoko EPS panel factory, launched new Joint Ventures with County Governments, and streamlined tenant credit loan facilities to expand urban shelter nationwide.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Board Integrity Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row gap-6 items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Award className="h-5 w-5 text-emerald-600" />
                      Commitment to Clean Housing Governance
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
                      The NHC board adheres strictly to Chapter Six of the Constitution of Kenya on Leadership and Integrity. Every project undergoes thorough state audit, ensuring value for money, reliable construction materials, and non-exploitative interest structures for Kenyan citizens.
                    </p>
                  </div>
                  <span className="font-mono text-[10px] font-extrabold text-slate-400 uppercase tracking-widest bg-white border border-slate-200 px-3 py-1.5 rounded-lg">
                    ISO 9001:2015 Certified
                  </span>
                </div>
              </div>
            )}

            {/* 4. JOINT VENTURES & SERVICES */}
            {aboutSubTab === 'services' && (
              <div className="space-y-8 animate-fadeIn">
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                  <h3 className="font-bold text-slate-900 text-xl mb-3">Our Core Mandates & Professional Services</h3>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    National Housing Corporation is not only a developer but also a licensed architectural, engineering, and project management partner. We work hand-in-hand with private landowners, county governments, and corporate partners to scale up shelter availability through Joint Ventures and technical consultancy.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Joint Ventures */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="bg-emerald-50 text-emerald-700 p-2.5 rounded-xl w-fit">
                        <Layers className="h-6 w-6 text-emerald-600" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-base">Joint Venture Partnerships</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Are you a private landowner, real estate trust, or County Government with prime development land? NHC offers structural joint venture frameworks. We provide technical development capital, state-certified EPS panel supplies, and marketing, while you provide the land block.
                      </p>
                    </div>
                    <div className="border-t border-slate-100 pt-3 text-[10px] font-mono text-slate-400 font-semibold">
                      Requirements: Minimum 5 Acres, Valid Title Deed
                    </div>
                  </div>

                  {/* Professional Consultancy */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="bg-blue-50 text-blue-700 p-2.5 rounded-xl w-fit">
                        <Hammer className="h-6 w-6 text-blue-600" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-base">Professional Consultancy Services</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        We deploy NHC\'s licensed, in-house experts to support third-party residential and commercial projects. Services include Architectural Concepts, Civil & Structural Engineering, Quantity Surveying, Land Valuation, and high-fidelity Project Management.
                      </p>
                    </div>
                    <div className="border-t border-slate-100 pt-3 text-[10px] font-mono text-slate-400 font-semibold">
                      Fields: Architecture, QS, Civil Eng, PM
                    </div>
                  </div>

                  {/* Estate Management */}
                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="bg-amber-50 text-amber-700 p-2.5 rounded-xl w-fit">
                        <Building className="h-6 w-6 text-amber-600" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-base">Estate Management & Rental Services</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        We manage rental houses and completed residential estates under the state housing scheme. Our team coordinates water, sanitation, road maintenance, prepaid solar grid connections, safety patrols, and tenant relations to maintain value.
                      </p>
                    </div>
                    <div className="border-t border-slate-100 pt-3 text-[10px] font-mono text-slate-400 font-semibold">
                      Services: Water, Security, Power, Waste
                    </div>
                  </div>

                </div>

                {/* Inquiry CTA */}
                <div className="bg-slate-900 text-white rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <h4 className="font-bold text-sm text-white">Partner with National Housing Corporation</h4>
                    <p className="text-slate-400 text-xs mt-0.5">Interested in joint development, land leasing, or booking our certified design consultants?</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('ai-assistant')}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-lg transition shrink-0 cursor-pointer"
                  >
                    Consult Nyumbani AI Assistant
                  </button>
                </div>
              </div>
            )}

            {/* 5. HQ & REGIONAL OFFICES */}
            {aboutSubTab === 'contacts' && (
              <div className="space-y-8 animate-fadeIn">
                
                {/* Headquarters Card */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                  
                  <div className="md:col-span-7 space-y-4">
                    <span className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold uppercase font-mono tracking-wider px-2.5 py-1 rounded">
                      National Headquarters
                    </span>
                    <h3 className="font-bold text-slate-900 text-2xl">NHC House, Nairobi</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Our national headquarters coordinate administrative operations, loan distributions, structural material certifications, and main property registrations. Situated in the heart of Nairobi, our Customer Experience desks are open to guide visitors through booking site tours and making Tenant Purchase Scheme allocations.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700 pt-2 font-medium">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4.5 w-4.5 text-emerald-600" />
                        <span>Aga Khan Walk, Nairobi Town</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <PhoneCall className="h-4.5 w-4.5 text-emerald-600" />
                        <span>+254 20 3312147 / 3312149</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4.5 w-4.5 text-emerald-600" />
                        <span>info@nhckenya.go.ke</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4.5 w-4.5 text-emerald-600" />
                        <span>P.O. Box 30257 - 00100 Nairobi</span>
                      </div>
                    </div>
                  </div>

                  {/* Visual Office Card */}
                  <div className="md:col-span-5 bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-xl p-6 space-y-4 border border-emerald-900/40 shadow-inner">
                    <h4 className="font-bold text-sm text-emerald-400">Visitor Assistance Desk</h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      We warmly welcome walk-in citizens for inquiries regarding plots evaluation for rural loans or outright purchase payments.
                    </p>
                    <div className="text-[11px] font-mono space-y-1 text-slate-400 border-t border-slate-800 pt-3">
                      <div className="flex justify-between">
                        <span>Monday - Friday:</span>
                        <span className="text-white">8:00 AM - 5:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Saturdays:</span>
                        <span className="text-white">Closed (Site Tours Only)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sundays / Holidays:</span>
                        <span className="text-white">Closed</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Regional Offices Section */}
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 text-lg">Regional Branch Offices</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    National Housing Corporation operates three fully operational regional branches across Kenya to serve citizens locally and ensure prompt construction monitoring.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Coastal Branch */}
                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
                      <span className="text-[9px] font-extrabold uppercase font-mono tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                        Coast Regional Branch
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">Mombasa Regional Office</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Responsible for coastal redevelopment, oceanfront planning schemes, and local beachfront housing allocations.
                      </p>
                      <div className="text-[11px] font-medium text-slate-700 space-y-1.5 pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span>NHC House, Mombasa Island</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <PhoneCall className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span>+254 722 511110</span>
                        </div>
                      </div>
                    </div>

                    {/* Western / Lake Region */}
                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
                      <span className="text-[9px] font-extrabold uppercase font-mono tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                        Lake Regional Branch
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">Kisumu Regional Office</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Directs Nyanza, Western, and South Rift valley affordable housing plans, lakefront apartments, and regional rural loans evaluation.
                      </p>
                      <div className="text-[11px] font-medium text-slate-700 space-y-1.5 pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span>Kisumu Town Outer Circle</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <PhoneCall className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span>+254 735 993030</span>
                        </div>
                      </div>
                    </div>

                    {/* North Rift Region */}
                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
                      <span className="text-[9px] font-extrabold uppercase font-mono tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                        North Rift Regional Branch
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">Eldoret Regional Office</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Facilitates housing projects in Uasin Gishu, Trans Nzoia, and surrounding agricultural areas, including Kipchoge Keino estate.
                      </p>
                      <div className="text-[11px] font-medium text-slate-700 space-y-1.5 pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span>Eldoret Town Central Plaza</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <PhoneCall className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span>+254 20 3312147</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            )}

          </section>
        )}

        {/* AI Assistant Tab Page */}
        {activeTab === 'ai-assistant' && (
          <section aria-label="Nyumbani AI Assistant" className="max-w-6xl mx-auto animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Left Column: Info & Shortcuts */}
              <div className="lg:col-span-4 flex flex-col justify-between bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-2xl p-6 shadow-md border border-slate-800">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-600 p-2.5 rounded-xl text-white shadow-lg animate-pulse">
                      <Sparkles className="h-6 w-6 text-amber-300 fill-amber-300" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold tracking-tight text-white">Nyumbani AI</h2>
                      <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        Active Specialist Support
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-slate-800 pt-4">
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Welcome to your personal National Housing specialist. This AI assistant is integrated with our current property inventory, the Tenant Purchase Scheme (TPS) guidelines, and our PWD accessibility charter.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Common Questions to Ask</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { label: "What is rent-to-own (TPS)?", text: "What is the Tenant Purchase Scheme and how do the payment installments work?" },
                        { label: "Ground-floor PWD priority?", text: "What is the policy for ground-floor unit allocation for persons with disabilities (PWD)?" },
                        { label: "Show me Nairobi listings", text: "Show me affordable homes and prices in Nairobi county" },
                        { label: "What is the entry-level price?", text: "What are the cheapest studio/1-bedroom developments currently available?" }
                      ].map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendChatMessage(item.text)}
                          className="w-full text-left bg-slate-800/40 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 p-3 rounded-xl transition text-xs text-slate-200 hover:text-white flex items-start gap-2.5 font-medium cursor-pointer"
                        >
                          <ArrowRight className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-5 mt-6 lg:mt-0">
                  <div className="flex items-center gap-2 bg-slate-900/50 border border-slate-800 p-3 rounded-lg">
                    <Info className="h-4 w-4 text-emerald-400 shrink-0" />
                    <p className="text-[10px] text-slate-400 leading-normal">
                      The National Housing Corporation is dedicated to equal opportunity housing. Ground floor units are prioritized for residents with mobility limitations.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Beautiful Chat Interface */}
              <div className="lg:col-span-8 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px] lg:min-h-[580px]">
                {/* Chat Area Header */}
                <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Consultation Channel</h3>
                    <p className="text-slate-500 text-[11px]">Real-time assistance, payments advisory & booking support</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setChatMessages([
                        {
                          id: 'welcome',
                          sender: 'assistant',
                          text: "Habari! I am **Nyumbani Assistant**, your National Housing guide. Ask me anything about our affordable houses, payment plans (like rent-to-own), or how to book a tour. Try clicking one of the suggested prompts below!",
                          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        }
                      ]);
                    }}
                    className="text-xs font-bold text-slate-500 hover:text-emerald-700 bg-slate-200/50 hover:bg-emerald-50 px-2.5 py-1.5 rounded-lg transition"
                  >
                    Reset Chat
                  </button>
                </div>

                {/* Messages Panel */}
                <div className="flex-1 p-6 bg-slate-50/50 overflow-y-auto flex flex-col gap-4 max-h-[400px] lg:max-h-[440px]">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-4 rounded-xl text-xs sm:text-sm leading-relaxed max-w-[85%] ${
                        msg.sender === 'user'
                          ? 'bg-emerald-700 text-white self-end font-medium shadow-xs'
                          : 'bg-white text-slate-800 border border-slate-200/80 self-start shadow-2xs'
                      }`}
                    >
                      <div className="space-y-1">
                        {msg.text.split('\n').map((line, lidx) => {
                          let formattedLine = line;
                          if (formattedLine.includes('**')) {
                            const parts = formattedLine.split('**');
                            return (
                              <p key={lidx}>
                                {parts.map((p, pidx) => pidx % 2 === 1 ? <strong key={pidx} className="font-bold text-slate-950">{p}</strong> : p)}
                              </p>
                            );
                          }
                          return <p key={lidx}>{formattedLine}</p>;
                        })}
                      </div>
                      <span className={`block text-[9px] text-right mt-1.5 font-mono ${
                        msg.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'
                      }`}>
                        {msg.timestamp}
                      </span>
                    </div>
                  ))}

                  {isChatLoading && (
                    <div className="bg-white border border-slate-200 p-4 rounded-xl text-xs text-slate-500 self-start max-w-[80%] flex items-center gap-3 shadow-2xs">
                      <span className="flex space-x-1 shrink-0">
                        <span className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </span>
                      <span>Nyumbani AI is matching listing data...</span>
                    </div>
                  )}

                  <div ref={chatBottomRef} />
                </div>

                {/* Suggestions bar */}
                <div className="px-6 py-2.5 bg-slate-50 border-t border-slate-100 overflow-x-auto whitespace-nowrap flex gap-2 scrollbar-none">
                  {suggestedPrompts.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendChatMessage(p.query)}
                      className="inline-block bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-700 text-xs px-3 py-1.5 rounded-full transition cursor-pointer shrink-0 font-bold shadow-2xs"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {/* Message input space */}
                <div className="p-4 border-t border-slate-200 bg-white">
                  <div className="flex gap-3 items-center bg-slate-100 rounded-xl px-4 py-3 border border-slate-200 focus-within:ring-2 focus-within:ring-emerald-600 transition-all">
                    <input
                      type="text"
                      placeholder="Ask about affordable housing developments, Tenant Purchase Scheme, pricing, or locations..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="bg-transparent text-sm text-slate-900 w-full focus:outline-none"
                      aria-label="Dedicated chat input"
                    />
                    <button
                      type="button"
                      onClick={() => handleSendChatMessage(chatInput)}
                      className="w-9 h-9 bg-emerald-600 hover:bg-emerald-700 rounded-xl flex items-center justify-center text-white transition shrink-0 shadow-sm"
                      aria-label="Send query"
                    >
                      <Send className="h-4 w-4 text-white" />
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </section>
        )}

        {/* FAQs Tab */}
        {activeTab === 'faqs' && (
          <section aria-label="Frequently Asked Questions" className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-5 mb-6">
                <div className="bg-emerald-50 p-2.5 rounded-lg text-emerald-700">
                  <HelpCircle className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">National Housing Knowledge Base</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Find answers to criteria, allocations, PWD facilities, and financial schemes.</p>
                </div>
              </div>

              {faqs.length > 0 ? (
                <div className="space-y-3" role="presentation">
                  {faqs.map((faq, index) => {
                    const isOpen = openFaqIndex === index;
                    return (
                      <div 
                        key={index} 
                        className="border border-slate-200 rounded-lg overflow-hidden transition-colors"
                      >
                        <button
                          onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                          className="w-full flex justify-between items-center p-4 bg-slate-50/50 hover:bg-slate-50 text-left font-bold text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-600"
                          style={{ minHeight: '48px' }}
                          aria-expanded={isOpen}
                        >
                          <span>{faq.question}</span>
                          <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform duration-200 shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {isOpen && (
                          <div className="p-4 bg-white border-t border-slate-100 text-xs text-slate-600 leading-relaxed">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-slate-500 text-center py-6 text-sm">Loading FAQs...</p>
              )}
            </div>
          </section>
        )}

      </main>

      {/* FOOTER BAR */}
      <footer className="bg-white border-t border-slate-200 px-6 sm:px-8 py-6 text-xs text-slate-400 font-medium shrink-0 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>© 2026 National Housing Corporation Kenya. All rights reserved.</div>
          <div className="flex gap-6 flex-wrap justify-center">
            <a href="#" className="hover:text-emerald-700 transition">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-700 transition">Terms of Service</a>
            <span className="hover:text-emerald-700 transition flex items-center gap-1">
              🏠 Equal Housing Opportunity
            </span>
          </div>
        </div>
      </footer>

      {/* SCHEDULE TOUR MODAL */}
      {selectedTourListing && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden my-8">
            {/* Modal Header */}
            <div className="bg-emerald-800 text-white px-6 py-4 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300">Book Property Appointment</span>
                <h3 className="font-bold text-lg leading-tight truncate">Schedule Tour</h3>
              </div>
              <button 
                onClick={() => setSelectedTourListing(null)}
                className="text-white/80 hover:text-white p-1 hover:bg-emerald-950 rounded-md transition"
                aria-label="Close modal"
                style={{ minWidth: '44px', minHeight: '44px' }}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
              
              {/* Target Property display card */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 flex items-center gap-3">
                <img 
                  src={selectedTourListing.imageUrl} 
                  alt="" 
                  className="w-12 h-12 object-cover rounded-md border border-slate-200 shrink-0" 
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-mono text-slate-400 uppercase">Selected Property</h4>
                  <p className="text-sm font-bold text-slate-900 truncate">{selectedTourListing.title}</p>
                  <p className="text-xs text-slate-500 font-mono">{selectedTourListing.projectName}</p>
                </div>
              </div>

              {bookingSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <div className="bg-green-100 text-green-700 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h4 className="font-bold text-green-900">Appointment Booked Successfully!</h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    We have reserved your slot for **{bookingDate}** at **{bookingTime}**. An confirmation email and SMS with tour directions has been dispatched to your contact details.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label htmlFor="booking-name" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="booking-name"
                        type="text"
                        required
                        value={bookingName}
                        onChange={(e) => setBookingName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        style={{ minHeight: '44px' }}
                      />
                    </div>

                    {/* Email Address */}
                    <div>
                      <label htmlFor="booking-email" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="booking-email"
                        type="email"
                        required
                        value={bookingEmail}
                        onChange={(e) => setBookingEmail(e.target.value)}
                        placeholder="johndoe@example.com"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        style={{ minHeight: '44px' }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Phone Number */}
                    <div>
                      <label htmlFor="booking-phone" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="booking-phone"
                        type="tel"
                        required
                        value={bookingPhone}
                        onChange={(e) => setBookingPhone(e.target.value)}
                        placeholder="e.g. +254 712 345678"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        style={{ minHeight: '44px' }}
                      />
                    </div>

                    {/* Tour Mode */}
                    <div>
                      <label htmlFor="booking-type" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Tour Mode <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="booking-type"
                        value={bookingTourType}
                        onChange={(e) => setBookingTourType(e.target.value as any)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        style={{ minHeight: '44px' }}
                      >
                        <option value="In-Person">In-Person Site Visit</option>
                        <option value="Virtual Video">Virtual Video Chat (WhatsApp/Meet)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Date */}
                    <div>
                      <label htmlFor="booking-date" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Preferred Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="booking-date"
                        type="date"
                        required
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        style={{ minHeight: '44px' }}
                      />
                    </div>

                    {/* Time Slot */}
                    <div>
                      <label htmlFor="booking-time" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Preferred Time Slot <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="booking-time"
                        required
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        style={{ minHeight: '44px' }}
                      >
                        <option value="09:00">Morning Slot (09:00 AM)</option>
                        <option value="11:00">Mid-Morning (11:00 AM)</option>
                        <option value="14:00">Afternoon (02:00 PM)</option>
                        <option value="16:00">Late Afternoon (04:00 PM)</option>
                      </select>
                    </div>
                  </div>

                  {/* Accessibility & Special Requirements Needs */}
                  <div>
                    <label htmlFor="booking-req" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      ♿ Special Requirements & Accessibility Needs
                    </label>
                    <textarea
                      id="booking-req"
                      rows={2}
                      value={bookingAccessibilityReq}
                      onChange={(e) => setBookingAccessibilityReq(e.target.value)}
                      placeholder="e.g. Wheelchair access path, ground-floor guide assistance, language interpreter..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                    <span className="text-[10px] text-slate-400 font-medium">NHC provides custom on-site assistance for residents with mobility or other constraints.</span>
                  </div>

                  {/* Action buttons */}
                  <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setSelectedTourListing(null)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition"
                      style={{ minHeight: '44px' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submittingBooking}
                      className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition flex items-center justify-center gap-2"
                      style={{ minHeight: '44px' }}
                    >
                      {submittingBooking ? 'Booking Slot...' : 'Confirm Appointment Slot'}
                    </button>
                  </div>
                </>
              )}

            </form>
          </div>
        </div>
      )}

      {/* QUICK INQUIRY MODAL */}
      {selectedInquiryListing && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 font-mono">Property Interest</span>
                <h3 className="font-bold text-base leading-tight truncate">Direct Property Inquiry</h3>
              </div>
              <button 
                onClick={() => setSelectedInquiryListing(null)}
                className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded-md transition"
                aria-label="Close inquiry modal"
                style={{ minWidth: '44px', minHeight: '44px' }}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleInquirySubmit} className="p-6 space-y-4">
              
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs text-slate-600">
                You are asking about: <strong className="text-slate-900">{selectedInquiryListing.title}</strong> in {selectedInquiryListing.county}.
              </div>

              {inquirySuccess ? (
                <div className="py-6 text-center space-y-2">
                  <div className="bg-green-100 text-green-700 p-2.5 rounded-full w-10 h-10 flex items-center justify-center mx-auto">
                    <Check className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-slate-900">Inquiry Received</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Our sales relations team will contact you back at **{inquiryEmail}** or **{inquiryPhone}** within 24 business hours.
                  </p>
                </div>
              ) : (
                <>
                  {/* Visitor name */}
                  <div>
                    <label htmlFor="inq-name" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="inq-name"
                      type="text"
                      required
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      placeholder="e.g. Jane Mwangi"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      style={{ minHeight: '44px' }}
                    />
                  </div>

                  {/* Visitor email */}
                  <div>
                    <label htmlFor="inq-email" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Email address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="inq-email"
                      type="email"
                      required
                      value={inquiryEmail}
                      onChange={(e) => setInquiryEmail(e.target.value)}
                      placeholder="e.g. jane.mwangi@example.com"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      style={{ minHeight: '44px' }}
                    />
                  </div>

                  {/* Visitor phone */}
                  <div>
                    <label htmlFor="inq-phone" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Phone number (optional)
                    </label>
                    <input
                      id="inq-phone"
                      type="tel"
                      value={inquiryPhone}
                      onChange={(e) => setInquiryPhone(e.target.value)}
                      placeholder="e.g. +254 700 000000"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      style={{ minHeight: '44px' }}
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="inq-message" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Inquiry Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="inq-message"
                      required
                      rows={3}
                      value={inquiryMessage}
                      onChange={(e) => setInquiryMessage(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setSelectedInquiryListing(null)}
                      className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg transition"
                      style={{ minHeight: '44px' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submittingInquiry}
                      className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition"
                      style={{ minHeight: '44px' }}
                    >
                      {submittingInquiry ? 'Sending...' : 'Send Inquiry'}
                    </button>
                  </div>
                </>
              )}

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
