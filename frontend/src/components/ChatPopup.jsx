import { useState } from "react";

const ChatPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY; // ✅ Ensure it's set in .env

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "HTTP-Referer": "http://localhost:5173", // ✅ Change this to your actual site
            "X-Title": "MyChatApp",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "openai/gpt-4o",
            messages: newMessages,
            max_tokens: 1000, // ✅ Adjusted to reasonable value
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(
          `Error ${response.status}: ${
            errorData.error?.message || "Unknown error"
          }`
        );
      }

      const data = await response.json();
      const botMessage =
        data.choices?.[0]?.message?.content || "No response received.";

      setMessages([...newMessages, { role: "assistant", content: botMessage }]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages([
        ...newMessages,
        { role: "assistant", content: "API Error: " + error.message },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4">
      <button
        onClick={toggleChat}
        className="bg-blue-600 text-white p-3 rounded-full shadow-lg"
      >
        {isOpen ? "Close" : "Chat"}
      </button>

      {isOpen && (
        <div className="bg-white w-80 h-96 p-4 shadow-lg rounded-lg fixed bottom-14 right-4 flex flex-col">
          <div className="flex-grow overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 ${
                  msg.role === "user" ? "text-right" : "text-left"
                }`}
              >
                <span
                  className={`px-3 py-1 rounded-lg text-black ${
                    msg.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300"
                  }`}
                >
                  {msg.content}
                </span>
              </div>
            ))}
            {loading && <p className="text-gray-500">Thinking...</p>}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="border p-2 flex-grow rounded"
              placeholder="Type a message..."
            />
            <button
              onClick={sendMessage}
              className="bg-green-600 text-white p-2 rounded"
              disabled={loading}
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPopup;
