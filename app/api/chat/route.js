import { NextResponse } from "next/server";
import { getAssistantResponse } from "@/lib/assistant";

export async function POST(request) {
  try {
    const { message, history } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const aiResult = await getAssistantResponse(message, history || []);
    return NextResponse.json(aiResult);
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}