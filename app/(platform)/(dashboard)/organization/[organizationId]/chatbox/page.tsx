import { ChatBot } from "./_components/ai-chat-bot";


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