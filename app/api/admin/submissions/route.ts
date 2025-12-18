import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import prisma from "@/prisma/client";

export async function GET(request: Request) {
  try {
    // Check authentication
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

    // Verify token
    try {
      await jwtVerify(token, secret);
    } catch (error) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch submissions
    const submissions = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        projectType: true,
        description: true,
        budget: true,
        timeline: true,
        files: true,
        status: true,
        language: true,
        createdAt: true,
      },
    });

    return NextResponse.json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      {
        error: "Error fetching submissions",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
