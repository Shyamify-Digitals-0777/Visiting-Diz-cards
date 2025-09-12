# Harvinder Telecom - Digital Visiting Card

A comprehensive, production-ready Digital Visiting Card website for Harvinder Telecom featuring real-time reviews, interactive animations, and modern web design.

## 🚀 Features

### Core Features
- **Mobile-First Responsive Design** - Optimized for all devices with Tailwind CSS
- **Smart Review System** - Website reviews with Google My Business integration
- **Interactive Contact Actions** - Direct call, WhatsApp, directions, and sharing
- **Premium Animations** - Smooth Framer Motion animations with micro-interactions
- **Product Showcase** - Interactive product catalog with lazy loading
- **Brand Partners Display** - Animated brand partner grid with hover effects
- **Finance Partners** - EMI options with multiple banking partners
- **Google My Business Integration** - Automated review collection and GMB promotion

### Technical Features
- **React 18 with TypeScript** - Modern React with type safety
- **Framer Motion Animations** - Professional animations and transitions
- **Express.js Backend** - RESTful API with proper error handling
- **SQLite Database** - Local database for review storage
- **Web Share API** - Native sharing functionality
- **Progressive Web App** - PWA-ready with offline capabilities
- **SEO Optimized** - Meta tags and structured data
- **Email Automation** - Automated GMB review reminders with incentives
- **Review Analytics** - Track review collection performance and conversion rates

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks and TypeScript
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library for React
- **Axios** - HTTP client for API calls
- **Lucide React** - Beautiful SVG icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **SQLite3** - Database for review storage
- **CORS** - Cross-origin resource sharing
- **Input Validation** - Data sanitization and validation
- **Nodemailer** - Email service for GMB review reminders

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone or setup the project**
   ```bash
   # The project is already set up in your current directory
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Environment Setup**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Edit .env with your actual values
   nano .env
   ```

5. **Start the development servers**
   
   **Terminal 1 - Frontend:**
   ```bash
   npm run dev
   ```
   
   **Terminal 2 - Backend:**
   ```bash
   cd server
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - API Health Check: http://localhost:3001/api/health

## 📁 Project Structure

```
harvinder-telecom/
├── src/                          # Frontend source code
│   ├── components/               # React components
│   │   ├── HeroSection.tsx      # Main hero section with parallax
│   │   ├── ContactBar.tsx       # Contact action buttons
│   │   ├── BusinessInfo.tsx     # Business information card
│   │   ├── BrandPartners.tsx    # Brand partners grid
│   │   ├── FinancePartners.tsx  # EMI and finance options
│   │   ├── ProductShowcase.tsx  # Product catalog
│   │   ├── ReviewsSection.tsx   # Reviews with real-time updates
│   │   ├── ReviewAnalytics.tsx  # Review performance dashboard
│   │   └── Footer.tsx           # Footer with comprehensive info
│   ├── App.tsx                  # Main application component
│   ├── App.css                  # Custom styles and animations
│   ├── main.tsx                 # Application entry point
│   └── index.css                # Tailwind CSS imports
├── server/                       # Backend source code
│   ├── server.js                # Express.js server
│   ├── emailService.js          # Email automation service
│   ├── package.json             # Backend dependencies
│   └── reviews.db               # SQLite database (auto-created)
├── public/                       # Static assets
├── .env.example                 # Environment variables template
├── package.json                 # Frontend dependencies
├── tailwind.config.js           # Tailwind CSS configuration
├── vite.config.ts              # Vite configuration
└── README.md                   # This file
```

## 🎨 Design System

### Color Palette
- **Primary**: Warm beige (#F5F5DC) backgrounds
- **Secondary**: Dark navy (#1E3A8A) for headings and accents
- **CTA**: Green (#10B981) for call-to-action buttons
- **Additional**: Full spectrum with success, warning, and error states

### Animation Configuration
```javascript
const animationConfig = {
  motionDuration: 0.6,
  motionStagger: 0.1,
  motionEasing: [0.25, 0.46, 0.45, 0.94],
  hoverScale: 1.05,
  tapScale: 0.95
}
```

### Typography
- **Headings**: Bold, modern fonts with proper hierarchy
- **Body**: Clean, readable fonts with 150% line height
- **Weights**: Maximum 3 font weights for consistency

## 📱 Features Deep Dive

### Hero Section
- Parallax background with animated gradient
- Interactive logo with zoom animation
- Responsive call-to-action buttons
- Smooth scroll indicator

### Contact Bar
- Sticky navigation with direct action buttons
- Phone, WhatsApp, Maps, and Share functionality
- Touch-optimized button sizes (44px minimum)
- Smooth hover and tap animations

### Review System
- Real-time review submission and display
- Star rating system with interactive selection
- Copy-to-clipboard functionality for reviews
- Direct Google Reviews integration
- Form validation and error handling

### Product Showcase
- Category-based filtering with smooth transitions
- Lazy-loaded product images for performance
- Interactive product cards with hover effects
- Direct WhatsApp integration for inquiries
- Responsive grid layout

## 🔧 API Endpoints

### Reviews API
- `GET /api/reviews` - Fetch all reviews with pagination
- `POST /api/reviews` - Submit new review with validation
- `POST /api/send-gmb-reminder` - Send GMB review reminder email
- `POST /api/track-review-action` - Track review funnel analytics
- `GET /api/health` - Health check endpoint

### Request/Response Examples

**Submit Review:**
```bash
POST /api/reviews
Content-Type: application/json

{
  "name": "John Doe",
  "rating": 5,
  "title": "Excellent Service",
  "message": "Great experience with genuine products!"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "rating": 5,
  "title": "Excellent Service",
  "message": "Great experience with genuine products!",
  "createdAt": "2024-01-15"
}
```

**Send GMB Reminder:**
```bash
POST /api/send-gmb-reminder
Content-Type: application/json

{
  "customerEmail": "customer@example.com",
  "customerName": "John Doe"
}
```

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   npm install -g vercel
   vercel --prod
   ```

3. **Environment Variables**
   Set these in your deployment platform:
   ```
   VITE_API_BASE_URL=https://your-backend-url.com/api
   GOOGLE_PLACE_ID=your_google_place_id
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

### Backend Deployment (Railway/Heroku)

1. **Prepare for deployment**
   ```bash
   cd server
   ```

2. **Deploy to Railway**
   ```bash
   npm install -g @railway/cli
   railway login
   railway init
   railway up
   ```

3. **Environment Variables**
   ```
   NODE_ENV=production
   PORT=3001
   DATABASE_URL=./reviews.db
   GOOGLE_PLACE_ID=your_google_place_id
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

### Environment Configuration

Update your `.env` file with actual values:

```env
# Frontend
VITE_API_BASE_URL=https://your-api-domain.com/api

# Backend
PORT=3001
NODE_ENV=production

# Google My Business
GOOGLE_PLACE_ID=ChIJN1t_tDeuEmsRUsoyG83frY4

# Email Service
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_SERVICE=gmail

# Business Info
BUSINESS_PHONE=+919876543210
WHATSAPP_NUMBER=919876543210
BUSINESS_EMAIL=info@harvinder-telecom.com

# Google My Business Integration
## 🔄 Google My Business Integration Strategy

Since direct API posting to GMB is not possible, our system uses these proven strategies:

### 1. **Incentivized Review Collection**
- Offer discount codes for Google reviews
- Show immediate incentive modal after website review
- QR codes for easy mobile access to GMB review page

### 2. **Email Automation**
- Automated reminder emails with GMB review links
- Personalized messages with customer names
- Follow-up sequences for non-reviewers

### 3. **Analytics & Tracking**
- Monitor website-to-GMB conversion rates
- Track email open rates and click-through rates
- Review funnel analysis for optimization

### 4. **Compliance Features**
- No fake or automated reviews
- Genuine customer verification
- Transparent incentive disclosure
- Respect for customer choice

GOOGLE_PLACE_ID=your_google_place_id_here

## 🗺️ How to Get Your Google Place ID

To enable Google My Business integration, you need to find your Google Place ID:

### Method 1: Using Google Maps
1. Go to [Google Maps](https://maps.google.com)
2. Search for your business name and location
3. Click on your business listing
4. Look at the URL in your browser's address bar
5. Find the part that looks like `!1s0x0:0x123456789abcdef0!8m2!3d12.345678!4d-12.345678`
6. The Place ID is the long string after `!1s` (e.g., `ChIJN1t_tDeuEmsRUsoyG83frY4`)

### Method 2: Using Google Place ID Finder
1. Go to [Google Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id)
2. Search for your business
3. Copy the Place ID from the results

### Method 3: Using Google My Business
1. Log into your [Google My Business account](https://business.google.com)
2. Select your business location
3. Go to "Info" tab
4. The Place ID may be visible in the URL or business details

### Setting Up Place ID
Once you have your Place ID:
1. Copy your `.env.example` to `.env`
2. Replace `ChIJN1t_tDeuEmsRUsoyG83frY4` with your actual Place ID
3. Restart your development server

```env
VITE_GOOGLE_PLACE_ID=YOUR_ACTUAL_PLACE_ID_HERE
```

### Testing the Integration
After setting up your Place ID:
1. Submit a test review on your website
2. Click "Post This Review on Google" in the confirmation modal
3. Verify it opens the correct Google review page for your business

# Email Service (for GMB review reminders)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## 🔍 SEO & Performance

### Performance Optimizations
- **Lazy Loading** - Images and components loaded on demand
- **Code Splitting** - Optimized bundle sizes
- **Compression** - Gzip compression for assets
- **Caching** - Proper cache headers for static assets

### SEO Features
- **Meta Tags** - Proper title, description, and OG tags
- **Structured Data** - Schema.org markup for business
- **Sitemap** - XML sitemap for search engines
- **Analytics Ready** - Google Analytics integration ready

## 🧪 Testing

### Manual Testing Checklist
- [ ] Mobile responsiveness (320px to 2560px)
- [ ] Contact buttons functionality
- [ ] Review submission and display
- [ ] Product showcase filtering
- [ ] Animation performance
- [ ] Cross-browser compatibility
- [ ] Web Share API functionality
- [ ] Google Maps integration
- [ ] Email reminder system
- [ ] GMB review link functionality
- [ ] Analytics tracking

### Performance Testing
```bash
# Run Lighthouse audit
npm install -g lighthouse
lighthouse http://localhost:5173 --view
```

## 🔒 Security

### Backend Security
- **Input Validation** - All inputs sanitized and validated
- **SQL Injection Prevention** - Parameterized queries
- **Rate Limiting** - API rate limiting (implement in production)
- **CORS Configuration** - Proper cross-origin settings
- **Error Handling** - No sensitive data in error responses

### Frontend Security
- **XSS Prevention** - React's built-in protection
- **HTTPS Enforcement** - SSL/TLS in production
- **Environment Variables** - Sensitive data in env files

## 🤝 Customization

### Branding Customization
1. **Update business information** in components
2. **Modify color scheme** in `tailwind.config.js`
3. **Replace logo and images** in public folder
4. **Update contact details** throughout components

### Feature Extensions
- **Payment Integration** - Add Stripe/Razorpay
- **Inventory Management** - Product stock tracking
- **Customer Portal** - Order tracking system
- **Analytics Dashboard** - Business insights

## 📞 Support & Contact

For support or customization requests:
- **WhatsApp**: +91 98765 43210
- **Email**: info@harvinder-telecom.com
- **Address**: Shop No. 15, Main Market, Sector 22, Chandigarh

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Made with ❤️ for Harvinder Telecom**  
*Your Trusted Mobile & Electronics Partner*