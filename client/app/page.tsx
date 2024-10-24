"use client";
import { Send } from "lucide-react";
import React, { useState } from "react";
interface Response {
  id: number;
  sender: string;
  text: string;
  timestamp: string | null;
}
const Home = () => {
  const [messages, setMessages] = useState<Response[]>([
    {
      id: 1,
      sender: "Gemini",
      text: "Hello! How can I assist you today?",
      timestamp: null,
    },
  ]);

  const [inputText, setInputText] = useState(""); // For storing textarea value
  const [loading, setLoading] = useState(false); // For handling loading state

  const handleSendMessage = async () => {
    if (!inputText.trim()) return; // Prevent empty messages

    // Get current time for timestamp
    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Add the user's message to messages state
    const userMessage = {
      id: messages.length + 1,
      sender: "User",
      text: inputText,
      timestamp,
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputText(""); // Clear input
    setLoading(true); // Set loading state to true

    try {
      // Send request to backend
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: inputText }),
      });

      const data = await response.json();

      console.log("data is data", data);
      const aiMessage = {
        id: messages.length + 2,
        sender: "Gemini",
        text:
          data.result?.response?.candidates[0]?.content?.parts[0]?.text ||
          "Sorry, I couldn't understand that.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  return (
    <div className="flex h-screen justify-center items-center poppins-medium">
      <div className="w-full max-w-sm rounded-lg shadow-sm border bg-white h-[500px] overflow-hidden flex flex-col">
        <div className="h-10 border-b w-full flex items-center justify-between px-3">
          <h4 className="text-center font-semibold text-pink-500">Re-Chat</h4>
        </div>
        <div className="chat-area my-1 px-3 flex-1 flex flex-col gap-3 overflow-y-auto space-y-2 pt-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-1  ${
                msg.sender === "User" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender === "Gemini" && (
                <div className="h-12 w-12 min-w-12 rounded-full border bg-slate-800 text-pink-500 text-center align-middle flex items-center justify-center font-bold">
                  CB
                </div>
              )}
              <div
                className={`p-2 rounded-lg shadow-sm ${
                  msg.sender === "User"
                    ? "bg-white  border text-black"
                    : "bg-gray-100 border text-gray-800"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <span className="text-xs text-gray-400 block mt-1">
                  {msg.timestamp}
                </span>
              </div>
              {msg.sender === "User" && (
                <div className="h-12 w-12 rounded-full border bg-slate-800 text-white text-center align-middle flex items-center justify-center font-bold">
                  FA
                </div>
              )}
            </div>
          ))}
          {loading && <Loading />}
        </div>
        <div className="flex items-center border rounded-md px-2 w-full py-2 justify-between">
          <textarea
            placeholder="Type your message"
            className="outline-none resize-none flex-1 px-2 h-auto max-h-56 overflow-auto"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          ></textarea>
          <Send
            className="text-pink-500 hover:scale-110 transition-transform duration-150 cursor-pointer"
            onClick={handleSendMessage}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;

const Loading = () => (
  <div className="flex flex-row gap-2 items-center mt-2">
    <div className="w-2 h-2 rounded-full bg-pink-700 animate-bounce [animation-delay:.1s]"></div>
    <div className="w-2 h-2 rounded-full bg-pink-700 animate-bounce [animation-delay:.2s]"></div>
    <div className="w-2 h-2 rounded-full bg-pink-700 animate-bounce [animation-delay:.3s]"></div>
  </div>
);

// test commit
