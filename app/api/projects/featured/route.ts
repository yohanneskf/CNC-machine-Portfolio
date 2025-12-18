import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET() {
  try {
    const featuredProjects = await prisma.project.findMany({
      where: { featured: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    });
    return NextResponse.json(featuredProjects);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching featured projects" },
      { status: 500 }
    );
  }
}
