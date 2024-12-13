import { Button } from "@/components/ui/button";
import { Bot, Copy, User } from "lucide-react";
import Typewriter from "typewriter-effect";
import { MessageItemProps } from "@/app/api/chat/types";
import { motion } from "framer-motion";

export function MessageItem({ message, onCopy, formatTimestamp }: MessageItemProps) {
    const isBot = message.role === "assistant";

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-start gap-3 ${isBot ? "justify-start" : "justify-end"}`}
        >
            {isBot && (
                <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-blue-600 p-1.5 shadow-lg ring-1 ring-blue-400/30">
                        <Bot className="w-full h-full text-white" />
                    </div>
                </div>
            )}
            
            <motion.div 
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className={`group relative flex flex-col max-w-[80%] rounded-2xl px-4 py-3 shadow-md 
                    ${isBot ? 
                        "bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900" : 
                        "bg-gradient-to-br from-blue-500 to-blue-600 text-white"}`
                }
            >
                <div className="flex justify-between items-center gap-4 mb-1">
                    <span className={`text-xs font-medium ${isBot ? "text-blue-600 dark:text-blue-400" : "text-blue-100"}`}>
                        {isBot ? "Friend" : "You"}
                    </span>
                    {message.timestamp && (
                        <span className={`text-xs ${isBot ? "text-gray-400 dark:text-gray-500" : "text-blue-100"}`}>
                            {formatTimestamp(message.timestamp)}
                        </span>
                    )}
                </div>

                <div className={`text-sm whitespace-pre-wrap ${isBot ? "text-gray-600 dark:text-gray-300" : "text-white"}`}>
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
                                        // Completion callback would be handled by parent
                                    })
                                    .start();
                            }}
                        />
                    ) : (
                        message.content
                    )}
                </div>

                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onCopy(message.content)}
                        className={`h-6 w-6 p-0 hover:bg-opacity-10 ${
                            isBot ? 
                                "hover:bg-gray-500 text-gray-500" : 
                                "hover:bg-white text-white"
                        }`}
                    >
                        <Copy className="w-3 h-3" />
                    </Button>
                </div>

                {/* Message tail */}
                <div className={`absolute ${isBot ? "left-[-8px]" : "right-[-8px]"} top-4 w-2 h-2 transform ${
                    isBot ? 
                        "rotate-45 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900" : 
                        "rotate-45 bg-gradient-to-br from-blue-500 to-blue-600"
                }`} />
            </motion.div>

            {!isBot && (
                <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-blue-700 p-1.5 shadow-lg ring-1 ring-blue-500/30">
                        <User className="w-full h-full text-white" />
                    </div>
                </div>
            )}
        </motion.div>
    );
}