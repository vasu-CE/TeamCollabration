import { useState } from "react";
import socket from "../lib/socket";
import axios from "axios";

const MessageInput = ({ chatUser, myId, setMessages }) => {
  const [text, setText] = useState("");

  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
      const res = await axios.post(`http://localhost:3000/api/messages/${chatUser.id}`, { text });

      setMessages((prev) => [...prev, res.data.data]);

      socket.emit("sendMessage", {
        receiverId: chatUser.id,
        text,
      });

      setText("");
    } catch (error) {
      console.error("Error sending message", error);
    }
  };

  return (
    <div className="flex gap-2 p-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-grow border rounded p-2"
        placeholder="Type a message..."
      />
      <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded">
        Send
      </button>
    </div>
  );
};

export default MessageInput;
