import { chatRequestSchema } from "@/app/types/chat";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { z } from "zod";

const client = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 驗證請求資料
    const validatedData = chatRequestSchema.parse(body);
    const { messages } = validatedData;

    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
    });

    return NextResponse.json(completion.choices[0].message.content);
  } catch (error) {
    console.error(error);

    // 如果是 Zod 驗證錯誤，返回 400 狀態碼
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
