import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter: adapter,
});

async function main() {
  try {
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Create or update admin user
    const admin = await prisma.user.upsert({
      where: { email: "admin@cncdesign.com" },
      update: {
        password: hashedPassword,
        role: "admin",
      },
      create: {
        email: "admin@cncdesign.com",
        password: hashedPassword,
        role: "admin",
      },
    });

    console.log("✅ Admin user created/updated:");
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   Password: admin123`);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
