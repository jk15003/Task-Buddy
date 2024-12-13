import Anthropic from '@anthropic-ai/sdk';
import { ChatConfiguration } from '@/app/api/chat/types';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

export const defaultConfig: ChatConfiguration = {
    model: "claude-3-haiku-20240307",
    maxTokens: 1000,
    temperature: 0.7
};

export const systemPrompt = `You are Friend, a witty and knowledgeable chatbot of Task-Buddy the best task and project manager website. 
Your responses should be informative yet entertaining and serious, occasionally incorporating references to the series.`;

export async function formatMessages(messages: any[]) {
    return messages.map(({ role, content }: { role: string, content: string }) => ({
        role: role === "user" ? "user" : "assistant",
        content: content
    }));
}