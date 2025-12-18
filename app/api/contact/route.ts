import { NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const submission = await prisma.contactSubmission.create({
      data: {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        projectType: formData.get("projectType") as string,
        description: formData.get("description") as string,
        budget: (formData.get("budget") as string) || "",
        timeline: (formData.get("timeline") as string) || "",
        files: [], // You would upload files to storage and save URLs here
        status: "pending",
        language: "en", // This should be set from the language context
      },
    });

    // TODO: Send email notification to admin

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    console.error("Error creating submission:", error);
    return NextResponse.json(
      { error: "Error submitting form" },
      { status: 500 }
    );
  }
}
