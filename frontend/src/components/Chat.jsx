import { useEffect, useState } from "react";
import socket from "../lib/socket";
import axios from "axios";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import Sidebar from "./Sidebar";

const Chat = () => {
  const [chatUser, setChatUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const myId = "YOUR_USER_ID"; // Get from auth context

  useEffect(() => {
    if (chatUser) {
      axios.get(`http://localhost:3000/api/messages/${chatUser.id}`).then((res) => {
        setMessages(res.data.data);
      });

      socket.on("newMessage", (msg) => {
        if (msg.senderId === chatUser.id) {
          setMessages((prev) => [...prev, msg]);
        }
      });

      return () => socket.off("newMessage");
    }
  }, [chatUser]);

  return (
    <div className="flex h-screen">
      <Sidebar setChatUser={setChatUser} />
      <div className="flex flex-col w-2/3 p-4">
        <h2 className="text-lg font-semibold mb-2">
          {chatUser ? chatUser.name : "Select a user"}
        </h2>
        {chatUser ? (
          <>
            <MessageList messages={messages} />
            <MessageInput chatUser={chatUser} myId={myId} setMessages={setMessages} />
          </>
        ) : (
          <p>Select a team member to start chatting</p>
        )}
      </div>
    </div>
  );
};

export default Chat;
