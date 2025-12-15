import prisma from "./prisma";
import { NotFoundError, ConflictError } from "./errors";

export class UserService {
  static async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        gender: true,
        height: true,
        weight: true,
        goal: true,
        diseases: true,
        age: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  }

  static async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  static async create(data: {
    email: string;
    password: string;
    name: string;
    gender: "MALE" | "FEMALE";
    age?: number;
    height?: number;
    weight?: number;
    goal?: "LOSE" | "MAINTAIN" | "GAIN";
    diseases?: ("DIABETES" | "HYPERTENSION" | "HEART_DISEASE" | "ASTHMA" | "NONE")[];
  }) {
    const existing = await this.findByEmail(data.email);
    if (existing) {
      throw new ConflictError("Email already registered");
    }

    return await prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        name: data.name,
        gender: data.gender,
        age: data.age,
        height: data.height,
        weight: data.weight,
        goal: data.goal,
        diseases: data.diseases,
      },
      select: {
        id: true,
        email: true,
        name: true,
        gender: true,
        createdAt: true,
      },
    });
  }

  static async update(id: string, data: any) {
    const user = await this.findById(id);

    return await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        gender: true,
        height: true,
        weight: true,
        goal: true,
        diseases: true,
        age: true,
        image: true,
        updatedAt: true,
      },
    });
  }

  static async updateResetToken(
    email: string,
    resetToken: string,
    expiresAt: Date
  ) {
    return await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpires: expiresAt,
      },
    });
  }
}

export class MealService {
  static async create(userId: string, data: any) {
    return await prisma.mealLog.create({
      data: {
        userId,
        ...data,
      },
    });
  }

  static async findByUser(
    userId: string,
    options?: {
      date?: string;
      limit?: number;
    }
  ) {
    const { date, limit = 20 } = options || {};

    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      return await prisma.mealLog.findMany({
        where: {
          userId,
          loggedAt: {
            gte: start,
            lte: end,
          },
        },
        orderBy: { loggedAt: "desc" },
      });
    }

    return await prisma.mealLog.findMany({
      where: { userId },
      orderBy: { loggedAt: "desc" },
      take: limit,
    });
  }

  static async findById(id: string, userId: string) {
    const meal = await prisma.mealLog.findFirst({
      where: { id, userId },
    });

    if (!meal) {
      throw new NotFoundError("Meal not found");
    }

    return meal;
  }

  static async update(id: string, userId: string, data: any) {
    await this.findById(id, userId);

    return await prisma.mealLog.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string, userId: string) {
    await this.findById(id, userId);

    return await prisma.mealLog.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

export class WorkoutService {
  static async create(userId: string, data: any) {
    return await prisma.workout.create({
      data: {
        userId,
        plan: data,
      },
    });
  }

  static async findByUser(userId: string, limit: number = 20) {
    return await prisma.workout.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  static async findById(id: string, userId: string) {
    const workout = await prisma.workout.findFirst({
      where: { id, userId },
    });

    if (!workout) {
      throw new NotFoundError("Workout not found");
    }

    return workout;
  }

  static async update(id: string, userId: string, data: any) {
    await this.findById(id, userId);

    return await prisma.workout.update({
      where: { id },
      data: { plan: data },
    });
  }

  static async delete(id: string, userId: string) {
    await this.findById(id, userId);

    return await prisma.workout.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

export class MealPlanService {
  static async create(userId: string, data: any) {
    return await prisma.mealPlan.create({
      data: {
        userId,
        plan: data,
      },
    });
  }

  static async findByUser(userId: string, limit: number = 10) {
    return await prisma.mealPlan.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  static async findById(id: string, userId: string) {
    const plan = await prisma.mealPlan.findFirst({
      where: { id, userId },
    });

    if (!plan) {
      throw new NotFoundError("Meal plan not found");
    }

    return plan;
  }

  static async update(id: string, userId: string, data: any) {
    await this.findById(id, userId);

    return await prisma.mealPlan.update({
      where: { id },
      data: { plan: data },
    });
  }

  static async delete(id: string, userId: string) {
    await this.findById(id, userId);

    return await prisma.mealPlan.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
