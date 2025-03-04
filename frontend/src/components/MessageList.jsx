const MessageList = ({ messages }) => {
    return (
      <div className="h-64 overflow-y-auto p-2 bg-gray-100 rounded">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 my-1 rounded ${
              msg.isMine ? "bg-blue-500 text-white self-end" : "bg-gray-300"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
    );
  };
  
  export default MessageList;
  