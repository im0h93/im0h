# مؤهل (Moahel) - ATS Resume Builder SaaS Platform

A premium Arabic-first ATS Resume Builder platform with modern glassmorphism UI, enterprise-level architecture, and complete admin management system.

## 🌟 Features

### User Features
- **Arabic/English/Bilingual Resume Support** - Full RTL/LTR support
- **ATS Optimization Engine** - Score analysis and keyword optimization
- **3 Free Resume Credits** - With WhatsApp recharge option
- **Premium Dashboard** - Modern glassmorphism UI
- **PDF Export** - ATS-compatible resume generation
- **Dark/Light Mode** - Beautiful themes

### Admin Features
- **Protected Super Admin Dashboard** - Role-based access control
- **User Management** - View, edit, ban, delete users
- **Credit Management** - Manual credit adjustments
- **WhatsApp Settings** - Editable recharge configuration
- **Analytics Dashboard** - Usage statistics and charts
- **Platform Settings** - SEO, content, feature toggles

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 App Router, TypeScript, TailwindCSS
- **UI Components**: Custom shadcn/ui-inspired components
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Forms**: React Hook Form
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with RBAC

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your Supabase credentials

5. Run development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── dashboard/          # User dashboard
│   │   └── admin/          # Protected admin panel
│   ├── resume/             # Resume builder
│   └── api/                # API routes
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── layout/             # Layout components
│   └── admin/              # Admin-specific components
├── lib/                    # Utilities and helpers
├── store/                  # Zustand stores
├── types/                  # TypeScript types
└── utils/                  # Helper functions
```

## 🎨 Design System

### Colors
- Brand Blue: `#0ea5e9` to `#0c4a6e`
- Glass Effects: Frosted white/dark layers
- Gradients: Soft blue to indigo

### Typography
- Arabic: Noto Kufi Arabic
- English: Inter

### Themes
- Light: Off-white with soft blue gradients
- Dark: Deep navy with indigo glow

## 🔐 Security

- Role-based authentication
- Protected admin routes
- Session validation
- Activity logging
- Secure password handling

## 📱 Responsive Design

Fully responsive across all devices:
- Mobile first approach
- Tablet optimized
- Desktop enhanced

## 🌐 Localization

- Default: Arabic (RTL)
- Optional: English (LTR)
- Easy to add more languages

## 💳 Credit System

- 3 free resume generations per user
- WhatsApp-based recharge flow
- Admin manual credit management
- Transaction history tracking

## 📄 Database Schema

Key tables:
- `users` - User accounts with credits
- `resumes` - Resume data and templates
- `templates` - Available resume templates
- `credit_transactions` - Credit history
- `admin_logs` - Admin activity logs
- `platform_settings` - Configurable settings

## 🚧 Production Deployment

1. Build for production:
```bash
npm run build
```

2. Start production server:
```bash
npm start
```

## 📝 License

Proprietary - All rights reserved

## 👥 Support

For support, contact via WhatsApp or email through the platform.

---

Built with ❤️ for the Arab region's job seekers
