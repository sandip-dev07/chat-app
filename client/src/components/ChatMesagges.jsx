import { useState, useEffect } from "react";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid"; // Import uuidv4

const socket = io("http://localhost:8000");

const ChatMessages = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const id = uuidv4();
    setUserId(id);

    // Listen for incoming messages from the server
    const messageListener = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };
    socket.on("message", messageListener);

    return () => {
      socket.off("message", messageListener);
    };
  }, []);

  const sendMessage = () => {
    const msgData = {
      message: inputText,
      time: `${new Date(Date.now()).getHours()}:${new Date(
        Date.now()
      ).getMinutes()}`,
      userId: userId,
    };

    // Send the message to the server
    socket.emit("message", msgData);
    setInputText("");
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="w-[700px] shadow-md bg-white p-4 rounded-lg">
      <h1 className="w-full text-center text-xl font-semibold text-gray-800">
        Chatting App
      </h1>
      <div className="w-full border mt-4 mb-4 h-[550px] rounded-md p-3 overflow-y-auto flex flex-col-reverse">
        {messages
          .slice()
          .reverse()
          .map((message, index) => (
            <div
              key={index}
              className={`box w-fit max-w-[45%] flex flex-col mb-3 ${
                userId === message?.userId && "ml-auto"
              }`}
            >
              <p
                className={` w-full flex flex-wrap break-words  p-1 px-2   rounded-md ${
                  userId === message?.userId
                    ? "bg-black text-white"
                    : "bg-gray-200"
                }`}
              >
                {message?.message}
              </p>
              <span
                className={` px-2 text-[12px] text-gray-500 ${
                  userId === message?.userId && "text-end"
                }`}
              >
                {message?.time}
              </span>
            </div>
          ))}
      </div>
      <div className=" w-full flex items-center gap-1">
        <input
          className="w-full border p-1 px-3 text-[17px] rounded-md"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={handleKeyPress}
        />
        <button
          className="bg-green-600 text-white p-1 px-3 rounded-md focus:outline-none outline-none"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatMessages;
