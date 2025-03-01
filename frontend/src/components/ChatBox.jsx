import { useChatStore } from "../store/useChatStore";  //1
import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";//2
import MessageInput from "./MessageInput";
import { useAuthStore } from "../store/useAuthStore";//3
import { formatMessageTime } from "../lib/utils";

// Import ShadCN UI components
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react"; // For loading state

const ChatBox = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
      subscribeToMessages();
    }
    return () => unsubscribeFromMessages();
  }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <ChatHeader />

      {/* Show loader instead of Skeleton when loading */}
      {isMessagesLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
        </div>
      ) : (
        <ScrollArea className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length > 0 ? (
            messages.map((message) => (
              <div
                key={message._id}
                className={`flex items-end ${message.senderId === authUser._id ? "justify-end" : "justify-start"}`}
                ref={messageEndRef}
              >
                {/* Avatar */}
                <Avatar className="mr-2">
                  <AvatarImage
                    src={
                      message.senderId === authUser._id
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
                    }
                    alt="Profile"
                  />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>

                {/* Message Bubble */}
                <Card className={`p-3 max-w-xs ${message.senderId === authUser._id ? "bg-primary text-white" : "bg-secondary"}`}>
                  {message.image && (
                    <img src={message.image} alt="Attachment" className="rounded-md mb-2 w-full" />
                  )}
                  {message.text && <p>{message.text}</p>}
                  <time className="text-xs opacity-50 mt-1 block">{formatMessageTime(message.createdAt)}</time>
                </Card>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 text-sm">
              No messages yet. Start the conversation!
            </div>
          )}
        </ScrollArea>
      )}

      {/* Input Field */}
      <MessageInput />
    </div>
  );
};

export default ChatBox;
