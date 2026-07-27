import { useState, useRef, useEffect } from "react";

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: "ai", text: "Hey bro! I'm your BroBite AI Nutritionist. What are you craving today?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto-scroll to the newest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userText = input;
        setMessages((prev) => [...prev, { sender: "user", text: userText }]);
        setInput("");
        setIsLoading(true);

        try {
            // NOTE: If you are testing on your phone, change localhost to your IPv4 address!
            const response = await fetch("http://16.16.76.27:8000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userText,
                    user_name: localStorage.getItem("userName") || "Guest",
                }),
            });

            if (!response.ok) throw new Error("Server down");

            const data = await response.json();
            setMessages((prev) => [...prev, { sender: "ai", text: data.reply }]);
        } catch (error) {
            setMessages((prev) => [...prev, { sender: "ai", text: "Sorry bro, my AI brain is currently offline. Check the Python server!" }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* The Chat Window */}
            {isOpen && (
                <div className="bg-white w-80 sm:w-96 rounded-2xl shadow-2xl border border-gray-200 mb-4 overflow-hidden flex flex-col h-[500px] max-h-[80vh]">
                    {/* Header */}
                    <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
                        <div>
                            <h3 className="font-black text-lg">BroBite<span className="text-orange-500">AI</span></h3>
                            <p className="text-xs text-gray-400">Powered by Groq</p>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                            ✕
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === "user" ? "bg-orange-600 text-white rounded-br-none" : "bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm"}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Box */}
                    <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask for a meal recommendation..."
                            className="flex-1 bg-gray-100 px-4 py-2 rounded-full text-sm outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <button type="submit" disabled={isLoading} className="bg-gray-900 hover:bg-orange-600 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors">
                            ↑
                        </button>
                    </form>
                </div>
            )}

            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`${isOpen ? "hidden" : "flex"} bg-gray-900 hover:bg-orange-600 text-white w-14 h-14 rounded-full items-center justify-center shadow-xl transition-transform hover:scale-110`}
            >
                <span className="text-2xl">🤖</span>
            </button>
        </div>
    );
};

export default ChatWidget;