export interface IMessage {
    role: string;
    content: string;
    id: number;
    timestamp?: Date;
    isTyping?: boolean;
}

export interface ChatConfiguration {
    model: string;
    maxTokens: number;
    temperature: number;
}

export interface MessageItemProps {
    message: IMessage;
    onCopy: (text: string) => Promise<void>;
    formatTimestamp: (date: Date) => string;
}