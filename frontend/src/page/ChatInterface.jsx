import React, { useState, useRef, useEffect } from 'react';
import { Search, Phone, Video, Mic, Smile, Image, Send } from 'lucide-react';
import Sidebar from './SideBar';

import img from "../assets/maitrik.jpg";

const ChatInterface = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);

  const chats = [
    { id: 1, name: 'Maitrik', avatar: img },
    { id: 2, name: 'Jay', avatar: img },
    { id: 3, name: 'Samarth', avatar: img },
  ];

  const initialMessages = {
    1: [
      { id: 1, text: "Hey, how's it going?", sender: 'user' },
      { id: 2, text: "All good, what about you?", sender: 'other' },
    ],
    2: [
      { id: 1, text: "Yo!", sender: 'user' },
      { id: 2, text: "What's up?", sender: 'other' },
    ],
    3: [
      { id: 1, text: "You coming for lunch?", sender: 'user' },
      { id: 2, text: "Yeah, let's go!", sender: 'other' },
    ],
  };

  const [messages, setMessages] = useState(initialMessages);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleMessageSubmit = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedChat) return;

    setMessages((prevMessages) => ({
      ...prevMessages,
      [selectedChat]: [...prevMessages[selectedChat], { id: Date.now(), text: inputMessage, sender: 'user' }],
    }));

    setInputMessage('');
  };

  const filteredChats = chats.filter(
    (chat) =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Chat List */}
      <div className="w-80 border-r flex flex-col bg-white">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chats..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              className={`flex items-center px-4 py-3 cursor-pointer hover:bg-gray-200 transition ${
                selectedChat === chat.id ? 'bg-gray-300' : ''
              }`}
              onClick={() => setSelectedChat(chat.id)}
            >
              <img
                src={chat.avatar}
                alt={chat.name}
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => (e.target.src = '/images/default-avatar.jpg')}
              />
              <div className="ml-3">
                <div className="font-medium text-gray-900">{chat.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Section */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b shadow-sm">
              <div className="flex items-center">
                <img
                  src={chats.find((chat) => chat.id === selectedChat)?.avatar}
                  alt="Chat Avatar"
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => (e.target.src = '/images/default-avatar.jpg')}
                />
                <div className="ml-3">
                  <div className="font-medium text-gray-900">
                    {chats.find((chat) => chat.id === selectedChat)?.name}
                  </div>
                  <div className="text-sm text-gray-500">Active now</div>
                </div>
              </div>
              <div className="flex space-x-4">
                <button className="hover:text-blue-500 transition">
                  <Phone className="h-6 w-6 text-gray-600" />
                </button>
                <button className="hover:text-blue-500 transition">
                  <Video className="h-6 w-6 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages[selectedChat]?.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-md px-4 py-2 rounded-xl break-words ${
                      message.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Field */}
            <form onSubmit={handleMessageSubmit} className="border-t p-4 bg-white flex items-center">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <div className="flex space-x-3 text-gray-400 ml-4">
                <button type="button" className="hover:text-blue-500 transition">
                  <Mic className="h-6 w-6" />
                </button>
                <button type="button" className="hover:text-blue-500 transition">
                  <Smile className="h-6 w-6" />
                </button>
                <button type="button" className="hover:text-blue-500 transition">
                  <Image className="h-6 w-6" />
                </button>
                <button type="submit" className="text-blue-600 hover:text-blue-700 transition">
                  <Send className="h-6 w-6" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">Select a chat to start messaging</div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
