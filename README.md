---

# 🏋️‍♂️ GymNut – AI-Powered Fitness & Nutrition Tracker

**GymNut** is a modern, scalable web application that helps users track their meals, workouts, and progress while receiving **AI-powered personalized advice** on nutrition, fitness, and healthy habits.

## 🚀 Features

- ✅ **Advanced Authentication** – Secure user registration, login, and password reset with email verification
- ✅ **User Profiles** – Comprehensive health profiles with age, height, weight, fitness goals, and medical conditions
- ✅ **Meal Tracking** – Search and log meals with automatic nutrition calculation
- ✅ **Workout Tracking** – Log workouts and generate AI-powered workout plans
- ✅ **AI Advisor** – Personalized recommendations based on user profile and activity logs
- ✅ **Progress Analytics** – Visual dashboards for calories, macros, and training consistency
- ✅ **Responsive Design** – Modern, mobile-first UI with smooth animations

## 🛠 Tech Stack

### Frontend
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[TailwindCSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful, accessible UI components
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Lightweight state management

### Backend
- **[PostgreSQL](https://www.postgresql.org/)** - Robust relational database
- **[Prisma](https://www.prisma.io/)** - Type-safe database client
- **[Auth.js](https://authjs.dev/)** - Next-generation authentication
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation

### AI & External Services
- **[Google Gemini API](https://ai.google.dev/)** - AI-powered recommendations
- **[Open Food Facts API](https://world.openfoodfacts.org/data)** - Comprehensive food database
- **[Nodemailer](https://nodemailer.com/)** - Email service for notifications

## 📂 Project Structure

```
gymnut/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── meals/                # Meal tracking endpoints
│   │   ├── workouts/             # Workout tracking endpoints
│   │   └── food/                 # Food search endpoints
│   ├── (auth)/                   # Authentication pages
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   └── globals.css               # Global styles
├── components/                   # Reusable UI components
│   ├── ui/                       # Base UI components (shadcn/ui)
│   └── home/                     # Landing page components
├── lib/                          # Core utilities and services
│   ├── api.ts                    # API response utilities
│   ├── auth.ts                   # Authentication service
│   ├── constants.ts              # App configuration
│   ├── database.ts               # Database service layer
│   ├── errors.ts                 # Error handling utilities
│   ├── prisma.ts                 # Prisma client
│   ├── schemas.ts                # Zod validation schemas
│   ├── utils.ts                  # General utilities
│   └── validation.ts             # Validation helpers
├── hooks/                        # Custom React hooks
│   └── useAuth.ts                # Authentication and password strength hooks
├── stores/                       # State management
│   └── authStore.ts              # Authentication state
├── types/                        # TypeScript type definitions
│   └── index.ts                  # Shared types and interfaces
├── utils/                        # Utility functions
│   └── password.ts               # Password hashing utilities
├── prisma/                       # Database schema and migrations
│   └── schema.prisma             # Database schema
└── auth.ts                       # Auth.js configuration
```

## 🗄 Database Schema

### Core Models

```prisma
model User {
  id             String    @id @default(cuid())
  email          String    @unique
  password       String?
  name           String?
  gender         Gender    @default(MALE)
  height         Float?
  weight         Float?
  goal           Goal      @default(MAINTAIN)
  diseases       Disease[] @default([NONE])
  age            Int?
  image          String?
  resetToken     String?
  resetTokenExpires DateTime?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  
  // Relations
  meals          MealLog[]
  workouts       Workout[]
  mealPlans      MealPlan[]
  accounts       Account[]
  sessions       Session[]
}

model MealLog {
  id        String       @id @default(cuid())
  userId    String
  user      User         @relation(fields: [userId], references: [id])
  foodName  String
  foodImage String?
  category  MealCategory @default(LUNCH)
  quantity  Float?
  calories  Float
  protein   Float
  carbs     Float
  fat       Float
  fiber     Float?
  sugar     Float?
  sodium    Float?
  foodData  Json
  loggedAt  DateTime     @default(now())
  updatedAt DateTime     @updatedAt
  deletedAt DateTime?
}

model Workout {
  id        String    @id @default(cuid())
  userId    String
  user      User      @relation(fields: [userId], references: [id])
  plan      Json
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?
}
```

## 🔧 Architecture Highlights

### 1. **Service Layer Pattern**
- Centralized database operations in `lib/database.ts`
- Clean separation of concerns with dedicated service classes
- Consistent error handling and response formatting

### 2. **Advanced Error Handling**
- Custom error classes with proper HTTP status codes
- Centralized error handling utilities
- Type-safe error responses

### 3. **Validation System**
- Zod schemas for runtime type validation
- Reusable validation patterns and helpers
- Consistent error messages across the application

### 4. **API Response Standardization**
- Consistent API response format
- Proper HTTP status codes
- Type-safe response interfaces

### 5. **State Management**
- Zustand for lightweight, performant state management
- Type-safe store interfaces
- Clean separation of concerns

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL 12+
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/gymnut.git
   cd gymnut
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following variables:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/gymnut"
   
   # Authentication
   AUTH_SECRET="your-auth-secret"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   
   # Email
   AUTH_GOOGLE_EMAIL="your-email@gmail.com"
   AUTH_GOOGLE_APP="your-app-password"
   JWT_SECRET="your-jwt-secret"
   
   # App
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   pnpm prisma generate
   pnpm prisma db push
   ```

5. **Run the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!",
  "gender": "male"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "email": "john@example.com",
    "name": "John Doe",
    "gender": "MALE",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Registration successful",
  "statusCode": 201
}
```

#### POST `/api/auth/forgot-password`
Send password reset email.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

### Meal Tracking Endpoints

#### POST `/api/meals`
Log a new meal.

#### GET `/api/meals`
Retrieve user's meal history.

### Workout Tracking Endpoints

#### POST `/api/workouts`
Log a new workout.

#### GET `/api/workouts`
Retrieve user's workout history.

## 🧪 Testing

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Configure environment variables**
3. **Deploy automatically on push to main**

### Manual Deployment

```bash
# Build the application
pnpm build

# Start the production server
pnpm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Prisma](https://www.prisma.io/) for the excellent database toolkit
- [Auth.js](https://authjs.dev/) for secure authentication
- [Open Food Facts](https://world.openfoodfacts.org/) for the comprehensive food database

---

**Made with ❤️ for fitness enthusiasts everywhere**
