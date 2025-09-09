# 💕 Pup - Purpose-Driven Marriage Platform

> *Find someone who shares your purpose*

Pup is a revolutionary marriage platform that connects individuals based on their life purpose, values, and mission rather than just superficial interests. We believe that purpose is the foundation of lasting love and that shared values create stronger bonds than shared interests.

## 🌟 Our Mission

We believe that:
- **Purpose is the foundation of lasting love**
- **Shared values create stronger bonds than shared interests**
- **Your life's mission deserves a partner who amplifies it**
- **Compatibility is about alignment, not similarity**
- **Marriage should be a partnership of purpose**

## ✨ Key Features

### 🎯 Purpose-Based Matching
- **Purpose Domains**: Social, Environmental, Technological, Educational, Religious, Personal
- **Purpose Archetypes**: Leader, Creator, Healer, Explorer, Advocate, Visionary
- **Purpose Modalities**: Individual, Community, Global
- **Compatibility Scoring**: Advanced algorithm based on purpose alignment

### 👤 Comprehensive Profiles
- **Personal Information**: Age, location, education, profession
- **Purpose Narrative**: Detailed description of life mission and values
- **Lifestyle Preferences**: Religion, politics, habits, interests
- **Photo Management**: Multiple photos with approval system

### 💝 Smart Matching System
- **Interest Management**: See who likes you and who you admire
- **Match Discovery**: Browse compatible profiles
- **Real-time Updates**: Live notifications for new matches
- **Advanced Filters**: Filter by location, age, profession, purpose domain

### 🔐 Secure & Private
- **JWT Authentication**: Secure token-based authentication
- **Refresh Token Flow**: Seamless session management
- **Profile Verification**: Email verification and photo approval
- **Privacy Controls**: Control who can see your profile

## 🚀 Tech Stack

### Frontend
![Next.js](https://img.shields.io/badge/Next.js-14.2.16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-Latest-pink?style=for-the-badge&logo=framer)

### Backend & Database
![Node.js](https://img.shields.io/badge/Node.js-Latest-green?style=for-the-badge&logo=node.js)
![Prisma](https://img.shields.io/badge/Prisma-6.15.0-2D3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-316192?style=for-the-badge&logo=postgresql)
![JWT](https://img.shields.io/badge/JWT-Latest-000000?style=for-the-badge&logo=jsonwebtokens)

### UI Components & Styling
![Radix UI](https://img.shields.io/badge/Radix_UI-Latest-161618?style=for-the-badge&logo=radix-ui)
![ShadCN UI](https://img.shields.io/badge/ShadCN_UI-Latest-000000?style=for-the-badge)
![Lucide React](https://img.shields.io/badge/Lucide_React-0.454.0-FF6B6B?style=for-the-badge)
![Class Variance Authority](https://img.shields.io/badge/CVA-0.7.1-000000?style=for-the-badge)

### State Management & Forms
![Zustand](https://img.shields.io/badge/Zustand-Latest-FF6B6B?style=for-the-badge)
![React Hook Form](https://img.shields.io/badge/React_Hook_Form-7.54.1-EC5990?style=for-the-badge)
![Zod](https://img.shields.io/badge/Zod-3.24.1-3E67B1?style=for-the-badge)

### Authentication & Security
![bcryptjs](https://img.shields.io/badge/bcryptjs-3.0.2-FF6B6B?style=for-the-badge)
![Jose](https://img.shields.io/badge/Jose-6.1.0-000000?style=for-the-badge)
![Google OAuth](https://img.shields.io/badge/Google_OAuth-0.12.2-4285F4?style=for-the-badge&logo=google)

### Development Tools
![ESLint](https://img.shields.io/badge/ESLint-8.57.1-4B32C3?style=for-the-badge&logo=eslint)
![Prettier](https://img.shields.io/badge/Prettier-3.3.3-F7B93E?style=for-the-badge&logo=prettier)
![Docker](https://img.shields.io/badge/Docker-Latest-2496ED?style=for-the-badge&logo=docker)

### Analytics & Monitoring
![Vercel Analytics](https://img.shields.io/badge/Vercel_Analytics-Latest-000000?style=for-the-badge&logo=vercel)
![Sentry](https://img.shields.io/badge/Sentry-10-362D59?style=for-the-badge&logo=sentry)

## 🏗️ Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication pages
│   │   ├── login/
│   │   └── signup/
│   ├── (public)/                 # Protected pages
│   │   ├── dashboard/            # Main dashboard
│   │   ├── matches/              # Match discovery
│   │   ├── interested/           # Interest management
│   │   ├── onboarding/           # User onboarding
│   │   └── profile/              # Profile management
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── matches/              # Match management
│   │   ├── profile/              # Profile operations
│   │   └── user/                 # User operations
│   └── globals.css               # Global styles
├── components/                   # Reusable components
│   ├── common/                   # Common UI components
│   │   ├── layout/               # Layout components
│   │   └── section-heading.tsx   # Reusable headings
│   ├── feature/                  # Feature-specific components
│   │   ├── dashboard/            # Dashboard components
│   │   ├── interested/           # Interest page components
│   │   ├── matches/              # Match page components
│   │   └── landing/              # Landing page components
│   └── ui/                       # ShadCN UI components
├── lib/                          # Utility libraries
│   ├── jwt.ts                    # JWT utilities
│   └── seed.ts                   # Database seeding
├── services/                     # API services
│   └── api/                      # API service classes
├── store/                        # Zustand stores
│   └── features/                 # Feature stores
└── types/                        # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pup-marriage.git
   cd pup-marriage
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your environment variables:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/pup_marriage"
   JWT_SECRET="your-jwt-secret"
   JWT_REFRESH_SECRET="your-refresh-secret"
   NEXTAUTH_SECRET="your-nextauth-secret"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

4. **Set up the database**
   ```bash
   npm run prisma:migrate
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🐳 Docker Setup

### Development
```bash
npm run docker:dev
```

### Production
```bash
npm run docker:prod
```

### Database Migration
```bash
npm run docker:migrate
```

## 📱 Features Overview

### Landing Page
- **Emotive Hero**: Animated gradient background with purpose-driven messaging
- **Purpose Manifesto**: Core beliefs and mission statement
- **Values Grid**: Key platform values and benefits
- **Masonry Gallery**: User testimonials and success stories
- **Pup Visualizer**: Interactive video showcasing the platform
- **Pricing Plans**: Subscription tiers and features
- **FAQ Section**: Common questions and answers

### Dashboard
- **Welcome Section**: Personalized greeting and overview
- **Stats Cards**: Key metrics and activity summary
- **Profile Completion**: Progress tracking and missing fields
- **Recent Matches**: Latest compatible profiles
- **Admirers Section**: Users who have shown interest
- **Quick Actions**: Fast navigation to key features

### Match Discovery
- **Profile Grid**: Browse compatible profiles
- **Advanced Filters**: Filter by multiple criteria
- **Compatibility Scores**: AI-powered matching algorithm
- **Load More**: Pagination for large result sets

### Interest Management
- **Who Likes You**: See who has admired your profile
- **You Admire**: Track your interests and interactions
- **Matches**: Mutual interests and connections
- **Response Rate**: Engagement metrics and insights

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout
- `GET /api/auth/check` - Verify authentication status

### Profile Management
- `GET /api/profile/[id]` - Get user profile
- `PUT /api/user/profile` - Update profile
- `POST /api/user/photos` - Upload photos
- `POST /api/user/onboarding` - Complete onboarding

### Matching System
- `GET /api/matches` - Get potential matches
- `POST /api/admire` - Express interest in a profile

## 🎨 Design System

### Color Palette
- **Primary**: Purpose-driven purple/violet
- **Secondary**: Complementary accent colors
- **Background**: Clean whites and subtle grays
- **Text**: High contrast for accessibility

### Typography
- **Headings**: Bold, modern sans-serif
- **Body**: Clean, readable font stack
- **Accent**: Serif for manifesto and special content

### Animations
- **Framer Motion**: Smooth, purposeful animations
- **Scroll-based**: Parallax and reveal effects
- **Micro-interactions**: Hover states and transitions

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **ShadCN UI** for the beautiful component library
- **Radix UI** for accessible primitives
- **Framer Motion** for smooth animations
- **Prisma** for the excellent ORM
- **Next.js** team for the amazing framework

## 📞 Support

- **Email**: alimalikali1928@gmail.com

---

**Built with ❤️ for purpose-driven connections**

*Find someone who shares your purpose. Find your Pup.*