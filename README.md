
---

# 🏋️‍♂️ GymNut – AI-Powered Fitness & Nutrition Tracker  

**GymNut** is a web-first application that helps users track their meals, workouts, and progress while receiving **AI-powered personalized advice** on nutrition, fitness, and healthy habits.  

It combines **Next.js 15, TypeScript, Tailwind, Prisma, PostgreSQL, Auth.js, and a free AI model (Gemini/Hugging Face)** to create a modern fitness assistant.  

---

## 🚀 Features  

- ✅ **Authentication & Profiles** – Users can sign up with email/social login and create a health profile (age, height, weight, fitness goals, diseases/conditions).  
- ✅ **Meal Tracking** – Search food from external APIs (Open Food Facts / USDA), log meals, and automatically calculate calories, proteins, carbs, fats, and vitamins.  
- ✅ **Workout Tracking** – Users can log workouts or generate AI-powered workout plans.  
- ✅ **AI Advisor** – Personalized recommendations for meals & workouts based on user profile and logs.  
- ✅ **Progress & Analytics** – Visual dashboards for calories, macros, and training consistency.  

---

## 🛠 Tech Stack  

- **Frontend**: [Next.js 15 (App Router)](https://nextjs.org/) + [TypeScript](https://www.typescriptlang.org/) + [TailwindCSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)  
- **Database**: [PostgreSQL](https://www.postgresql.org/) + [Prisma](https://www.prisma.io/)  
- **Authentication**: [Auth.js](https://authjs.dev/)  
- **AI Layer**: [Google Gemini API](https://ai.google.dev/) *(free tier for MVP)*  
- **Nutrition Data**: [Open Food Facts API](https://world.openfoodfacts.org/data) or [USDA FoodData Central](https://fdc.nal.usda.gov/api-guide.html)  

---


## 📂 Project Structure  

```
gymnut/
├── prisma/               # Database schema & migrations
│   └── schema.prisma
│
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── (auth)/       # Auth pages (login/register)
│   │   ├── dashboard/    # User dashboard (meals/workouts)
│   │   ├── api/          # Next.js API routes
│   │   └── page.tsx      # Landing page
│   │
│   ├── components/       # UI components
│   ├── lib/              # Utilities (auth, prisma, ai, foodApi)
│   ├── styles/           # Tailwind styles
│   └── types/            # TypeScript types
│
├── .env                  # Env variables (DB, API keys)
└── package.json
```

---

## 🗄 Database Models (Prisma Preview)  

```prisma
model User {
  id        String    @id @default(cuid())
  email     String    @unique
  name      String?
  height    Float?
  weight    Float?
  goal      Goal      @default(MAINTAIN)
  diseases  String[]
  age       Int?
  meals     MealLog[]
  workouts  Workout[]
  createdAt DateTime  @default(now())
}

model MealLog {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  foodData  Json     // cached from external API
  calories  Float
  protein   Float
  carbs     Float
  fat       Float
  loggedAt  DateTime @default(now())
}

model Workout {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  type      String
  exercises Json     // list of exercises, sets/reps
  createdAt DateTime @default(now())
}

enum Goal {
  LOSE
  MAINTAIN
  GAIN
}
```

---

## 🔗 External APIs  

- **Food Database** –  
  `lib/foodApi.ts` → integrates with **Open Food Facts API** (includes nutrition + images) → food data cached inside `MealLog`.  

- **AI Advisor** –  
  `lib/ai.ts` → wraps **Gemini API** (default) or **Hugging Face local model** → accepts:  
  - User metrics (height, weight, goal, diseases)  
  - Today’s meals/workouts  
  - Generates advice (meal suggestion, workout routine, calorie adjustments).  

---

## 🔄 Data Flow  

1. User signs up → profile stored in Postgres via Prisma.  
2. User logs meals → food data fetched from API → saved in `MealLog`.  
3. User requests advice → backend fetches profile + meals → passes context into AI.  
4. AI responds → personalized plan shown in dashboard.  

---

## ⚙️ Getting Started  

### 1️⃣ Install dependencies
```bash
npm install
```

### 2️⃣ Setup environment variables (`.env`)
```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="strong-secret"
NEXTAUTH_URL="http://localhost:3000"
GEMINI_API_KEY="your_gemini_key"
FOOD_API_KEY="openfoodfacts_or_usda"
```

### 3️⃣ Setup database
```bash
npx prisma migrate dev
```

### 4️⃣ Run development server
```bash
npm run dev
```
App runs on → http://localhost:3000  

---

## 🧠 AI Agent Instructions  

If you are an AI agent interacting with this repo:  

- **Your role**: Act as GymNut fitness & nutrition coach.  
- **Context needed**: Always fetch user profile (height, weight, goals, diseases) and most recent meals before making suggestions.  
- **Sources**: Use `lib/foodApi.ts` for food data → macros + nutrition.  
- **Output**: Suggestions must be actionable meal/workout advice, tailored to the user’s health profile + goals.  
- **Constraints**: Never recommend meals/exercises that conflict with logged diseases or health restrictions.  

---

## 🛣️ Roadmap  

- [ ] MVP: User signup → log meals → AI generates 1-day workout & meal plan  
- [ ] Nutrition breakdown charts (macros, vitamins)  
- [ ] Weekly progress reports  
- [ ] AI-generated grocery list  
- [ ] Mobile + Wearable integration (future)  

---

## 🏆 Why GymNut?  
Most apps just *track data*. GymNut **interprets** it → giving you **clear, personalized actions** each day.  
Think of it as your **pocket AI fitness coach**.  

---

✨ **Contribution**: PRs welcome. Developers & fitness experts can add features, expand food dataset support, or fine-tune AI prompts.  
📧 Contact: [Your Email/GitHub]  


---
