# Juron.Net ISP Management System

A comprehensive Progressive Web App (PWA) for managing Internet Service Provider operations, built with React, TypeScript, Tailwind CSS, and Supabase.

## 🚀 Features

### Customer Portal
- **Dual Login System**
  - Invoice number login (Format: JRN-XXXXXX)
  - Google OAuth authentication
- Payment status tracking
- Upload payment proofs
- Submit and track support tickets
- View service details and billing history

### Admin Dashboard
- **KPI Overview**
  - Total customers with trends
  - Monthly revenue tracking
  - Pending payments counter
  - Overdue customer alerts
- **Customer Management**
  - Full CRUD operations
  - Auto-GPS location picker
  - Satellite map integration
  - Status tracking (Active/Overdue/Inactive)
- **Financial Management**
  - Income tracking (subscriptions, installations, fees)
  - Expense tracking by category
  - Monthly profit/loss statements
  - Category-wise breakdowns
  - Export to CSV/Excel
- **Payment Verification**
  - Review payment proofs
  - Approve/reject with notes
  - Auto WhatsApp notifications
- **Maps & GPS**
  - Interactive satellite maps
  - Customer location markers (color-coded by status)
  - Technician GPS tracking
  - Density heatmaps

### Automation
- Auto-isolate customers after X days overdue
- WhatsApp payment reminders
- Status change notifications
- Daily reports for admins

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand + React Query
- **Maps**: React-Leaflet with OpenStreetMap
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **PWA**: Workbox service workers
- **Deployment**: Vercel (frontend) + Supabase (backend)

## 📋 Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier works)
- Git

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/keyscribes/Juron-net-apk.git
cd Juron-net-apk
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to be ready
3. Go to Settings > API to find your credentials
4. Run the SQL from `docs/DATABASE_SCHEMA.md` in the SQL Editor

### 4. Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and fill in your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

### 5. Setup Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:5173` (development)
   - `https://your-domain.com` (production)
6. Copy the Client ID to your `.env` file

### 6. Configure Supabase Authentication

In Supabase Dashboard:
1. Go to Authentication > Providers
2. Enable Email provider
3. Enable Google provider (paste your Google OAuth credentials)
4. Add your site URL in Configuration > URL Configuration

### 7. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

## 📦 Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🚀 Deployment

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard
4. Configure domain and SSL

### Deploy Database to Supabase

Already deployed if you created a Supabase project. No additional steps needed.

## 📱 PWA Installation

The app can be installed as a native app on mobile devices:

1. Open the app in a mobile browser
2. Look for "Add to Home Screen" or "Install App" prompt
3. Click install
4. App will be available as a native app

## 🔐 Default Admin Access

**Super Admin Credentials:**
- Email: `juronnett@gmail.com`
- Password: `Juron.net` (Set this during first Google OAuth login)

**Important:** Change the password immediately after first login!

## 📁 Project Structure

```
Juron-net-apk/
├── docs/                      # Documentation
│   └── DATABASE_SCHEMA.md     # Complete database schema
├── public/                    # Static assets
│   ├── manifest.json          # PWA manifest
│   └── icons/                 # App icons
├── src/
│   ├── components/            # Reusable components
│   │   ├── ui/               # UI components (Button, Card, etc.)
│   │   ├── layouts/          # Layout components
│   │   └── features/         # Feature-specific components
│   ├── pages/                # Page components
│   │   ├── admin/            # Admin pages
│   │   ├── customer/         # Customer pages
│   │   └── auth/             # Authentication pages
│   ├── lib/                  # Utilities and configurations
│   │   ├── supabase.ts       # Supabase client
│   │   └── utils.ts          # Helper functions
│   ├── store/                # State management
│   │   └── authStore.ts      # Auth state
│   ├── types/                # TypeScript types
│   │   └── database.ts       # Database types
│   ├── App.tsx               # Main app component
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles
├── .env.example              # Environment variables template
├── package.json              # Dependencies
├── vite.config.ts            # Vite configuration
├── tailwind.config.ts        # Tailwind configuration
└── tsconfig.json             # TypeScript configuration
```

## 🎯 Key Features Implementation

### 1. Auto-GPS Location Picker

The location picker component automatically gets the user's current location using the browser's Geolocation API:

```typescript
import { getCurrentLocation } from '../lib/utils';

const location = await getCurrentLocation();
// { latitude: -6.xxx, longitude: 106.xxx, accuracy: 10 }
```

### 2. Payment Verification Workflow

1. Customer uploads payment proof
2. Payment status set to "pending"
3. Admin reviews in Payment Verification page
4. Admin approves/rejects with notes
5. Customer status auto-updates to "active" on approval
6. WhatsApp notification sent to customer

### 3. Financial Tracking

- **Auto Income**: Verified payments automatically counted as income
- **Manual Income**: Add non-subscription income (installations, fees, equipment sales)
- **Expenses**: Track all business expenses by category
- **Reports**: Monthly profit/loss with category breakdowns

### 4. Maps Integration

Uses React-Leaflet with OpenStreetMap (free, no API key needed):

```typescript
// Marker colors based on customer status
- Green: Active customers
- Yellow: Overdue (< 30 days)
- Red: Inactive (> 30 days)
```

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- JWT authentication with auto-refresh
- Role-based access control (RBAC)
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- Encrypted data at rest

## 📊 Database Schema

Complete schema documentation available in `docs/DATABASE_SCHEMA.md`.

**Key Tables:**
- `customers` - Customer information
- `payments` - Payment records
- `expenses` - Business expenses
- `income` - Manual income entries
- `packages` - Internet packages
- `tickets` - Support tickets
- `users` - Admin/technician accounts
- `settings` - App configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is private and proprietary to Juron.Net.

## 🆘 Support

For support, email: juronnett@gmail.com

## 🗺️ Roadmap

### Phase 1: MVP (Completed)
- [x] Authentication system
- [x] Admin dashboard
- [x] Customer management
- [x] Basic payment verification
- [x] Auto-GPS location picker

### Phase 2: Financial System (Completed)
- [x] Expense tracking
- [x] Income tracking
- [x] Financial dashboard
- [x] Monthly reports
- [x] WhatsApp integration

### Phase 3: Enhancements (In Progress)
- [ ] Advanced analytics
- [ ] Technician mobile app features
- [ ] WhatsApp Business API integration
- [ ] Multi-language support (ID/EN)
- [ ] Advanced reporting

### Phase 4: Future
- [ ] Mobile apps (iOS/Android via Capacitor)
- [ ] Invoice generation
- [ ] Automated billing
- [ ] Customer self-service portal enhancements
- [ ] Integration with payment gateways

## 💡 Tips

### For Development

```bash
# Run with hot reload
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

### For Production

1. Always use environment variables for sensitive data
2. Enable Supabase backups (daily recommended)
3. Monitor error logs in Vercel and Supabase
4. Set up uptime monitoring
5. Configure proper CORS settings
6. Use CDN for static assets
7. Enable rate limiting on API endpoints

## 🎨 Customization

### Colors

Edit `tailwind.config.ts` to customize theme colors:

```typescript
colors: {
  primary: '#3B82F6',   // Blue
  secondary: '#10B981', // Green
  warning: '#F59E0B',   // Yellow
  danger: '#EF4444',    // Red
}
```

### Logo

Replace icons in `public/` directory:
- `icon-192x192.png`
- `icon-512x512.png`
- `icon.svg`

## 📈 Performance

- Lighthouse Score: 95+
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Supports offline mode (PWA)
- Optimized bundle size

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android)

## 📞 Contact

**Juron.Net**
- Website: https://app.juron.net
- Email: juronnett@gmail.com
- Support: [Support Portal]

---

Made with ❤️ by Juron.Net Team
