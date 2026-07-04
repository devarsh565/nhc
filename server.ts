import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { HOUSING_LISTINGS, GENERAL_FAQS } from './src/data/listings.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory store for tour bookings and inquiries in this session
const bookings: any[] = [];
const inquiries: any[] = [];

// Lazy-initialized Gemini client
let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim() !== '') {
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
  }
  return aiClient;
}

// 1. Get Listings API
app.get('/api/listings', (req, res) => {
  res.json(HOUSING_LISTINGS);
});

// 2. Get FAQs API
app.get('/api/faqs', (req, res) => {
  res.json(GENERAL_FAQS);
});

// 3. Tour Booking API
app.post('/api/bookings', (req, res) => {
  const { listingId, listingTitle, projectName, userName, userEmail, userPhone, date, time, tourType, specialRequirements } = req.body;
  
  if (!listingId || !userName || !userEmail || !userPhone || !date || !time) {
    return res.status(400).json({ error: 'Missing required booking details.' });
  }

  const newBooking = {
    id: `booking-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    listingId,
    listingTitle,
    projectName,
    userName,
    userEmail,
    userPhone,
    date,
    time,
    tourType: tourType || 'In-Person',
    specialRequirements: specialRequirements || '',
    status: 'Confirmed'
  };

  bookings.push(newBooking);
  res.status(201).json({ success: true, booking: newBooking });
});

// Get Bookings
app.get('/api/bookings', (req, res) => {
  res.json(bookings);
});

// 4. Quick Inquiry API
app.post('/api/inquiries', (req, res) => {
  const { listingId, userName, userEmail, userPhone, message } = req.body;

  if (!listingId || !userName || !userEmail || !message) {
    return res.status(400).json({ error: 'Missing required inquiry details.' });
  }

  const newInquiry = {
    id: `inquiry-${Date.now()}`,
    listingId,
    userName,
    userEmail,
    userPhone: userPhone || '',
    message,
    timestamp: new Date().toISOString()
  };

  inquiries.push(newInquiry);
  res.status(201).json({ success: true, inquiry: newInquiry });
});

// 5. Chatbot with Gemini API
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Invalid or empty messages array.' });
  }

  const userMessage = messages[messages.length - 1].text;

  // Setup prompt engineering for the bot
  const systemInstruction = `You are "Nyumbani Assistant", the official AI Chatbot of the National Housing Corporation (NHC).
Your goal is to assist users looking for affordable housing listings, answering questions about projects, scheduling tours, and general FAQs.

Here is the current catalog of affordable housing listings at the National Housing Corporation:
${JSON.stringify(HOUSING_LISTINGS, null, 2)}

Here are the General FAQs:
${JSON.stringify(GENERAL_FAQS, null, 2)}

Guidelines:
1. Use a welcoming, polite, and professional tone.
2. Provide specific details from the listings (price, location, amenities, accessibility, payment plan) when matching a user request. Use KSh (Kenya Shillings) and format prices nicely (e.g. KSh 3,000,000).
3. If a user is looking for a house under a specific price, search the catalog and recommend the best options.
   - Studio under 2 Million: Pangani Heights - Studio (KSh 1,500,000)
   - 1 Bedroom: Mzizima Sea Breeze (KSh 2,200,000)
   - 2 Bedroom: Pangani Heights (KSh 3,000,000) or Kanyakwar Ridge (KSh 2,800,000)
   - 3 Bedroom Maisonette/Townhouse: Lanet Meadows (KSh 4,500,000) or Stoni Athi (KSh 4,800,000)
4. If they ask about accessibility for persons with disabilities (PWDs), highlight features like "Step-free Entrance", "Ground Floor Bedroom & Bath", "Wide Doorways", "Tactile Paving", and mention NHC's Equity & Inclusion policy.
5. If they want to schedule a physical or virtual tour, explain that they can use the "Schedule a Tour" button on any listing, or collect their Name, Email, Phone, Preferred Date, and Preferred Time.
6. Keep answers relatively concise and highly scannable (using bullet points and bold text where appropriate). Do not use markdown headers larger than ###.
7. Be honest. If a project is not in our list, say so and offer to search for similar completed/under construction projects.
`;

  const client = getAIClient();

  if (client) {
    try {
      // Map message history into Gemini schema (user / model)
      const formattedContents = messages.map((m: any) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const response = await client.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const reply = response.text || "I apologize, I could not generate a response. How else can I assist you today?";
      return res.json({ reply });
    } catch (error: any) {
      console.error('Error in Gemini API call:', error);
      // Fallback to rule-based logic if Gemini fails
    }
  }

  // Smart local Rule-Based Fallback logic (runs if API key is missing or failed)
  const query = userMessage.toLowerCase();
  let reply = '';

  if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
    reply = "Habari! Welcome to **Nyumbani Assistant**, your National Housing Corporation guide. I can help you search for affordable housing, explain our Tenant Purchase scheme, or schedule tours. How may I assist you today?";
  } else if (query.includes('how to buy') || query.includes('apply') || query.includes('requirements') || query.includes('eligible')) {
    reply = "To purchase a house with NHC, you should:\n" +
            "1. Be a citizen of legal age.\n" +
            "2. Provide your ID, KRA PIN, and 3-6 months certified payslips or bank statements.\n" +
            "3. Register and apply on our portal.\n" +
            "Priority is allocated to first-time homebuyers and lower-income families. Would you like to view our completed projects like **Pangani Heights** or **Lanet Meadows**?";
  } else if (query.includes('price') || query.includes('how much') || query.includes('cost') || query.includes('affordable')) {
    reply = "We offer extremely affordable options starting at **KSh 1,500,000**:\n" +
            "• **Studio (Pangani Heights)** - KSh 1.5M\n" +
            "• **1 Bedroom (Mzizima Sea Breeze)** - KSh 2.2M\n" +
            "• **2 Bedroom (Kanyakwar Ridge)** - KSh 2.8M\n" +
            "• **2 Bedroom (Pangani Heights)** - KSh 3.0M\n" +
            "• **3 Bedroom Townhouse (Lanet Meadows)** - KSh 4.5M\n" +
            "• **3 Bedroom Maisonette (Stoni Athi)** - KSh 4.8M\n\n" +
            "Which of these counties are you interested in? (Nairobi, Mombasa, Kisumu, Nakuru, Machakos)";
  } else if (query.includes('disabled') || query.includes('pwd') || query.includes('accessibility') || query.includes('wheelchair') || query.includes('accessibility features')) {
    reply = "National Housing Corporation is committed to **Universal Design and Equity**. All our projects feature dedicated PWD-friendly support:\n" +
            "• **Step-free main entrances** and ramps.\n" +
            "• **Elevators** in mid-to-high-rise units with audio-visual alerts.\n" +
            "• Prioritized ground floor allocations with ground-floor master suite options (like **Stoni Athi Maisonettes**).\n" +
            "• Wide doors (32\"+) and lower control switches.\n\n" +
            "Please check the **Accessibility Details** tab on any property page or let me know which project you want to explore!";
  } else if (query.includes('tour') || query.includes('visit') || query.includes('schedule') || query.includes('book')) {
    reply = "You can easily schedule a tour! Click the **'Schedule a Tour'** button on any listing page. You can choose an **In-Person** visit or a **Virtual Video** tour. I can also register your contact info if you drop your Name, Email, and Phone number here.";
  } else if (query.includes('tenant purchase') || query.includes('rent to own') || query.includes('payment') || query.includes('scheme') || query.includes('deposit')) {
    reply = "Our popular **Tenant Purchase Scheme (TPS)** acts as a rent-to-own plan. Typically, you pay a **10% to 20% deposit** upfront, and pay the remaining balance over **15 to 20 years** at low subsidized interest rates (7-9%). Monthly payments are similar to regular rental rates! Perfect for securing your own home.";
  } else if (query.includes('nairobi') || query.includes('pangani')) {
    reply = "In Nairobi County, we have **Pangani Heights** offering:\n" +
            "• Studio Apartments at KSh 1,500,000 (Available)\n" +
            "• 2 Bedroom Apartments at KSh 3,000,000 (Limited Availability)\n" +
            "Both are Completed and feature step-free entrance, elevator access, and excellent transport connections on Ring Road Pangani.";
  } else if (query.includes('mombasa') || query.includes('mzizima')) {
    reply = "In Mombasa County, our **Mzizima Sea Breeze** project is Under Construction and offers 1 Bedroom homes at **KSh 2,200,000** with marine architecture, high-speed elevators, and flexible Rent-to-Own schemes.";
  } else if (query.includes('kisumu') || query.includes('kanyakwar')) {
    reply = "In Kisumu County, our **Kanyakwar Ridge** project is in the Planned phase, offering 2 Bedroom Family Flats at **KSh 2,800,000** with beautiful lake views, bicycle lanes, and fully wheelchair-accessible bathroom spaces.";
  } else {
    reply = "I am Nyumbani Assistant. I can tell you about our housing schemes like the Tenant Purchase Scheme, pricing, accessibility design, or details on projects like **Pangani Heights**, **Stoni Athi**, **Mzizima Sea Breeze**, **Kanyakwar Ridge**, and **Lanet Meadows**. How can I help you find your dream affordable home today?";
  }

  // Adding a tiny disclaimer that we are running locally so users get a realistic feel
  if (!getAIClient()) {
    reply += "\n\n*(Nyumbani Assistant running in high-fidelity local match mode. Connect your Gemini API Key in Settings > Secrets to unlock full conversational AI capabilities!)*";
  }

  res.json({ reply });
});

// Vite middleware and static asset serving configuration
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`National Housing Corporation server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
