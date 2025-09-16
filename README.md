---

# 🏋️‍♂️ GymNut – AI-Powered Fitness & Nutrition Tracker

**GymNut** is a modern, scalable web application that helps users track their meals, workouts, and progress while receiving **AI-powered personalized advice** on nutrition, fitness, and healthy habits.

## 🚀 Features

### 🔐 Authentication & Security
- ✅ **Advanced Authentication** – Secure user registration, login, and password reset with email verification
- ✅ **Password Reset System** – Email-based password recovery with JWT tokens
- ✅ **Session Management** – Secure session handling with Auth.js
- ✅ **Input Validation** – Comprehensive Zod-based validation for all endpoints

### 👤 User Management
- ✅ **User Profiles** – Comprehensive health profiles with age, height, weight, fitness goals, and medical conditions
- ✅ **Profile Image Upload** – Cloudinary integration for secure image storage
- ✅ **Location Support** – Regional customization for meal and workout recommendations
- ✅ **Medical Conditions** – Support for diabetes, hypertension, heart disease, and asthma

### 🍽️ Meal & Nutrition
- ✅ **Food Search** – Integration with Open Food Facts API for comprehensive food database
- ✅ **Meal Logging** – Track meals with detailed nutrition information (calories, macros, micronutrients)
- ✅ **AI Meal Planning** – Google Gemini-powered personalized meal plans with cultural adaptation
- ✅ **Meal Categories** – Breakfast, lunch, dinner, and snack categorization
- ✅ **Nutrition Tracking** – Complete macro and micronutrient tracking

### 💪 Workout & Fitness
- ✅ **AI Workout Plans** – Google Gemini-generated personalized workout routines
- ✅ **Multiple Training Methods** – Support for various workout splits (PPL, Upper/Lower, etc.)
- ✅ **Fitness Level Adaptation** – Beginner to advanced workout customization
- ✅ **Workout History** – Save and retrieve previous workout plans
- ✅ **Exercise Tracking** – Detailed exercise logging with sets, reps, and duration

### 🤖 AI Integration
- ✅ **Google Gemini AI** – Advanced AI recommendations for nutrition and fitness
- ✅ **Cultural Adaptation** – Region-specific meal and workout recommendations
- ✅ **Health-Conscious Planning** – AI considers medical conditions and dietary restrictions
- ✅ **Retry Logic** – Robust error handling with fallback models

### 🏗️ Backend Architecture
- ✅ **Service Layer Pattern** – Clean separation of concerns with dedicated service classes
- ✅ **Database Abstraction** – Prisma-based data access with type safety
- ✅ **Error Handling** – Centralized error management with custom error classes
- ✅ **API Standardization** – Consistent response formats across all endpoints
- ✅ **Email Service** – Professional HTML email templates for notifications
- ✅ **Image Processing** – Cloudinary integration for secure file uploads

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
- **[Google Gemini API](https://ai.google.dev/)** - AI-powered recommendations with retry logic
- **[Open Food Facts API](https://world.openfoodfacts.org/data)** - Comprehensive food database
- **[Cloudinary](https://cloudinary.com/)** - Image upload and processing service
- **[Nodemailer](https://nodemailer.com/)** - Professional HTML email service for notifications

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
│   ├── api.ts                    # Standardized API response utilities
│   ├── auth.ts                   # Authentication service
│   ├── constants.ts              # App configuration and constants
│   ├── database.ts               # Service layer (UserService, MealService, WorkoutService)
│   ├── errors.ts                 # Custom error classes and handling
│   ├── prisma.ts                 # Prisma client configuration
│   ├── schemas.ts                # Comprehensive Zod validation schemas
│   ├── utils.ts                  # General utility functions
│   ├── validation.ts             # Reusable validation helpers
│   └── services/                 # External service integrations
│       ├── cloudinary.ts         # Image upload service
│       ├── email.ts              # Email service with HTML templates
│       └── tokens.ts             # JWT token management
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
  location       String    @default("Egypt")
  emailVerified  DateTime?
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
  foodData  Json         // cached from external API
  category  MealCategory @default(LUNCH)
  quantity  Float?       // in grams
  foodName  String       // "Grilled Chicken Breast"
  foodImage String?      // snapshot of image URL
  foodBrand String?      // e.g., "Trader Joe's" (optional)
  portion   String?
  calories  Float
  protein   Float
  carbs     Float
  fat       Float
  fiber     Float?       // optional, extra
  sugar     Float?       // optional, extra
  sodium    Float? 
  loggedAt  DateTime     @default(now())
  updatedAt DateTime     @updatedAt
  deletedAt DateTime?

  @@index([userId, loggedAt])
}

model Workout {
  id        String    @id @default(cuid())
  userId    String
  user      User      @relation(fields: [userId], references: [id])
  method    String?   // e.g., "Push/Pull/Legs (PPL) Split"
  plan      Json      // AI-generated workout plan with exercises
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?

  @@index([userId, createdAt])
}

model MealPlan {
  id        String    @id @default(cuid())
  userId    String
  user      User      @relation(fields: [userId], references: [id])
  plan      Json      // AI-generated meal plan
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?

  @@index([userId, createdAt])
}
```

## 🔧 Architecture Highlights

### 1. **Service Layer Pattern**
- Centralized database operations in `lib/database.ts`
- Dedicated service classes: `UserService`, `MealService`, `WorkoutService`, `MealPlanService`
- Clean separation of concerns with consistent error handling
- Type-safe database operations with Prisma

### 2. **Advanced Error Handling**
- Custom error classes (`NotFoundError`, `ConflictError`) with proper HTTP status codes
- Centralized error handling utilities in `lib/errors.ts`
- Type-safe error responses with standardized formats
- Comprehensive error logging and debugging support

### 3. **Validation System**
- Comprehensive Zod schemas for runtime type validation
- Reusable validation patterns and helpers in `lib/validation.ts`
- Consistent error messages across the application
- Form validation with React Hook Form integration

### 4. **API Response Standardization**
- Consistent API response format with `createApiResponse()` utility
- Proper HTTP status codes and error handling
- Type-safe response interfaces
- Standardized success and error response structures

### 5. **AI Integration Architecture**
- Google Gemini API integration with retry logic and fallback models
- Structured AI prompts for consistent output
- Cultural and regional adaptation for meal and workout plans
- Health-conscious AI recommendations based on user conditions

### 6. **External Service Integration**
- Cloudinary integration for secure image uploads
- Professional HTML email templates with Nodemailer
- Open Food Facts API for comprehensive food database
- JWT token management for secure authentication

### 7. **State Management**
- Zustand for lightweight, performant state management
- Type-safe store interfaces
- Clean separation of concerns between UI and business logic

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
   
   # Email Service
   AUTH_GOOGLE_EMAIL="your-email@gmail.com"
   AUTH_GOOGLE_APP="your-app-password"
   JWT_SECRET="your-jwt-secret"
   
   # AI Services
   GEMINI_API_KEY="your-google-gemini-api-key"
   
   # Image Upload
   CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
   CLOUDINARY_API_KEY="your-cloudinary-api-key"
   CLOUDINARY_API_SECRET="your-cloudinary-api-secret"
   
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
Log a new meal with detailed nutrition information.

**Request Body:**
```json
{
  "foodName": "Grilled Chicken Breast",
  "foodImage": "https://example.com/chicken.jpg",
  "category": "LUNCH",
  "quantity": 150,
  "portion": "1 piece",
  "calories": 250,
  "protein": 46,
  "carbs": 0,
  "fat": 5,
  "fiber": 0,
  "sugar": 0,
  "sodium": 74,
  "foodData": {}
}
```

#### GET `/api/meals`
Retrieve user's meal history with optional date filtering.

**Query Parameters:**
- `date` (optional): Filter meals by specific date (YYYY-MM-DD)

#### POST `/api/meals/plan`
Generate AI-powered personalized meal plan.

**Request Body:**
```json
{
  "dietType": "balanced",
  "mealDays": 7
}
```

#### POST `/api/meals/save-plan`
Save a generated meal plan to user's history.

### Workout Tracking Endpoints

#### POST `/api/workouts/plan`
Generate AI-powered personalized workout plan.

**Request Body:**
```json
{
  "fitnessLevel": "beginner",
  "workoutDays": 5,
  "method": "Push/Pull/Legs (PPL) Split"
}
```

#### POST `/api/workouts/save-plan`
Save a generated workout plan to user's history.

#### GET `/api/workouts/plan?latest=true`
Retrieve the most recent workout plan.

#### GET `/api/workouts/plan`
Retrieve all saved workout plans.

### Food Search Endpoints

#### GET `/api/food?q=chicken`
Search for food items using Open Food Facts API.

**Query Parameters:**
- `q`: Search query for food items

### User Management Endpoints

#### GET `/api/user/get-user-data`
Retrieve current user's profile data.

#### POST `/api/user/update-user-data`
Update user profile information.

**Request Body:**
```json
{
  "name": "John Doe",
  "age": 25,
  "height": 175,
  "weight": 70,
  "goal": "MAINTAIN",
  "diseases": ["NONE"]
}
```

#### POST `/api/user/upload-image-signature`
Get Cloudinary upload signature for secure image uploads.

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
