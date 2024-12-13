"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import Typewriter from "typewriter-effect";
import { MessageCircle, Send, RefreshCw, Bot, Copy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface IMessage {
    role: string;
    content: string;
    id: number;
    timestamp?: Date;
    isTyping?: boolean;
}

export function ChatBot() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [retryCount, setRetryCount] = useState(0);
    const MAX_RETRIES = 3;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success("Message copied to clipboard!");
        } catch {
            toast.error("Failed to copy message");
        }
    };

    const clearChat = () => {
        setMessages([]);
        toast.success("Chat history cleared");
    };

    const retryLastMessage = async () => {
        if (messages.length === 0) return;
        
        const lastUserMessage = messages.findLast(msg => msg.role === "user");
        if (lastUserMessage) {
            await sendMessage(lastUserMessage.content);
        }
    };

    const sendMessage = async (messageContent?: string) => {
        const contentToSend = messageContent || message;
        if (!contentToSend.trim()) return;
        
        try {
            setLoading(true);
            
            const userMessage = {
                role: "user",
                content: contentToSend,
                id: Date.now(),
                timestamp: new Date(),
                isTyping: false
            };
            
            setMessages(prevMessages => [...prevMessages, userMessage]);
            setMessage("");
            
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages: [
                        ...messages.map(({ role, content }) => ({ role, content })),
                        { role: "user", content: contentToSend }
                    ]
                }),
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || "Failed to send message");
            }

            setMessages(prevMessages => [...prevMessages, {
                role: data.choices[0].message.role,
                content: data.choices[0].message.content,
                id: Date.now(),
                timestamp: new Date(),
                isTyping: true
            }]);

            setRetryCount(0);
        } catch (error) {
            console.error("Error:", error);
            toast.error("Failed to send message");
            
            if (retryCount < MAX_RETRIES) {
                setRetryCount(prev => prev + 1);
                await new Promise(resolve => setTimeout(resolve, 1000));
                await sendMessage(contentToSend);
            }
        } finally {
            setLoading(false);
        }
    };

    const formatTimestamp = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).format(date);
    };

    return (
        <div className="h-full flex flex-col bg-background">
            {/* Header */}
            <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="p-4 border-b flex justify-between items-center"
            >
                <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-semibold">Task Assistant</span>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearChat}
                    disabled={messages.length === 0}
                >
                    <span className="text-xs">Clear Chat</span>
                </Button>
            </motion.div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence>
                    {messages.map(message => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`flex items-start gap-2 ${
                                message.role === "assistant" ? "justify-start" : "justify-end"
                            }`}
                        >
                            {message.role === "assistant" && (
                                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                                    <Bot className="w-5 h-5" />
                                </div>
                            )}
                            
                            <motion.div 
                                className={`max-w-[80%] rounded-lg px-4 py-2 shadow-sm ${
                                    message.role === "assistant" 
                                        ? "bg-secondary" 
                                        : "bg-primary text-primary-foreground"
                                }`}
                                whileHover={{ scale: 1.01 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className="flex justify-between items-center gap-4 mb-1">
                                    <span className="text-xs opacity-70">
                                        {message.role === "assistant" ? "Assistant" : "You"}
                                    </span>
                                    {message.timestamp && (
                                        <span className="text-xs opacity-70">
                                            {formatTimestamp(message.timestamp)}
                                        </span>
                                    )}
                                </div>
                                <div className="text-sm whitespace-pre-wrap">
                                    {message.isTyping ? (
                                        <Typewriter
                                            options={{
                                                delay: 30,
                                                cursor: "",
                                            }}
                                            onInit={(typewriter) => {
                                                typewriter
                                                    .typeString(message.content)
                                                    .callFunction(() => {
                                                        setMessages(prev => 
                                                            prev.map(msg => 
                                                                msg.id === message.id 
                                                                    ? { ...msg, isTyping: false }
                                                                    : msg
                                                            )
                                                        );
                                                    })
                                                    .start();
                                            }}
                                        />
                                    ) : (
                                        message.content
                                    )}
                                </div>
                                <motion.div 
                                    className="flex justify-end mt-1"
                                    initial={{ opacity: 0 }}
                                    whileHover={{ opacity: 1 }}
                                >
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => copyToClipboard(message.content)}
                                        className="h-6 w-6 p-0"
                                    >
                                        <Copy className="w-3 h-3" />
                                    </Button>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <Skeleton className="h-16" />
                    </motion.div>
                )}

                {messages.length === 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center h-[30vh] text-center"
                    >
                        <h2 className="text-2xl font-bold mb-2">
                            <Typewriter
                                options={{
                                    loop: false,
                                    cursor: "_"
                                }}
                                onInit={(typewriter) => {
                                    typewriter
                                        .typeString("Hi! How can I assist you today?")
                                        .start();
                                }}
                            />
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Let me help you manage your tasks and projects effectively.
                        </p>
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="sticky bottom-0 bg-background border-t p-4 mt-auto"
            >
                <div className="flex gap-2">
                    <div className="flex-1 flex gap-2">
                        <Input 
                            type="text" 
                            placeholder="Type your message..." 
                            value={message} 
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    sendMessage();
                                }
                            }}
                            disabled={loading}
                            className="flex-1"
                        />
                        <Button 
                            onClick={() => sendMessage()} 
                            disabled={loading || !message.trim()}
                        >
                            {loading ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                        </Button>
                    </div>
                    <Button
                        variant="outline"
                        onClick={retryLastMessage}
                        disabled={loading || messages.length === 0}
                    >
                        <RefreshCw className="w-4 h-4" />
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}