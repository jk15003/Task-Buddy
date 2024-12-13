import { ChatBot } from "./_components/ai-chat-bot";

export const runtime="edge";

const ChatBoxpage=()=>{
    return(
        <>
            <div className="h-screen w-full flex-1 flex flex-col">
                <ChatBot />
            </div>
        </>
    );
}

export default ChatBoxpage;