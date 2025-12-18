import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        titleEn: true,
        titleAm: true,
        descriptionEn: true,
        descriptionAm: true,
        category: true,
        materials: true,
        images: true,
        featured: true,
        dimensions: true,
        createdAt: true,
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      {
        error: "Error fetching projects",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const project = await prisma.project.create({
      data: {
        titleEn: body.titleEn,
        titleAm: body.titleAm,
        descriptionEn: body.descriptionEn,
        descriptionAm: body.descriptionAm,
        category: body.category,
        materials: body.materials,
        dimensions: body.dimensions,
        images: body.images,
        featured: body.featured || false,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating project" },
      { status: 500 }
    );
  }
}
