import { PrismaClient } from "@prisma/client";
import type { Prisma } from "@prisma/client";
const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
    {
        name: "Alice Johnson",
        email: "alice.johnson@example.com",
        password: "password123",
        height: 165.0,
        weight: 60.0,
        goal: "MAINTAIN",
        diseases: ["NONE"],
        age: 28,
        image: "https://randomuser.me/api/portraits/women/1.jpg"
    }
]

export async function main() {
    try {
        for (const u of userData) {
            await prisma.user.create({ data: u });
        }
    } catch (error) {
        console.error("Seeding error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();