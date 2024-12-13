import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { defaultConfig,systemPrompt } from '@/lib/claude';
export const runtime = 'edge';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        
        const response = await anthropic.messages.create({
            model: defaultConfig.model,
            max_tokens: defaultConfig.maxTokens,
            messages: body.messages.map(({ role, content }: { role: string, content: string }) => ({
                role: role === "user" ? "user" : "assistant",
                content: content
            })),
            system: systemPrompt,
            temperature: defaultConfig.temperature,
        });

        return NextResponse.json({
            choices: [{
                message: {
                    role: "assistant",
                    content: (response.content[0] as { text: string }).text 
                }
            }]
        });
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json(
            { error: "Failed to process chat request" },
            { status: 500 }
        );
    }
}