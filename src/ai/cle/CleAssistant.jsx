// src/components/AskCleAssistant.jsx
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSupabaseAuth } from "../../context/ClerkAuthContext";

export default function AskCleAssistant() {
  const { user } = useSupabaseAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initial greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 1,
          role: "assistant",
          content: "Hey! I'm Cle, your personal guide. How can I help you explore the World of Karma 360 today?",
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Call OpenAI API
      const response = await fetch("/api/ask-cle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: inputValue,
          userId: user?.id,
          conversationHistory: messages,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const assistantMessage = {
          id: messages.length + 2,
          role: "assistant",
          content: data.reply,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);

        // Store conversation in Supabase
        if (user) {
          await storeConversation(userMessage, assistantMessage);
        }
      } else {
        throw new Error(data.error || "Failed to get response");
      }
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = {
        id: messages.length + 2,
        role: "assistant",
        content:
          "I encountered an error. Please try again or check back later.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const storeConversation = async (userMsg, assistantMsg) => {
    try {
      await fetch("/api/store-conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          userMessage: userMsg.content,
          assistantMessage: assistantMsg.content,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error("Failed to store conversation:", error);
    }
  };

  return (
    <>
      {/* FLOATING AVATAR BUBBLE */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-lg hover:shadow-xl border-2 border-cyan-300/50 flex items-center justify-center text-white font-bold text-2xl cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        💬
      </motion.button>

      {/* CHAT MODAL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end md:items-center justify-end md:justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Chat Window */}
            <motion.div
              className="relative w-full md:w-[450px] h-[600px] md:h-[700px] rounded-2xl md:rounded-3xl bg-gradient-to-b from-slate-900 to-slate-800 border border-cyan-400/30 shadow-2xl flex flex-col"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              {/* HEADER */}
              <div className="flex items-center justify-between p-5 border-b border-cyan-400/20 bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white font-bold text-lg">
                    C
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-cyan-100">Cle</p>
                    <p className="text-xs text-cyan-300/60">AI Guide</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-cyan-300/70 hover:text-cyan-100 transition text-xl"
                >
                  ✕
                </button>
              </div>

              {/* MESSAGES */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.role === "user"
                          ? "bg-cyan-600 text-white rounded-br-none"
                          : "bg-slate-700 text-cyan-100 rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    className="flex justify-start"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="bg-slate-700 px-4 py-2 rounded-lg rounded-bl-none">
                      <div className="flex gap-2">
                        <motion.div
                          className="w-2 h-2 bg-cyan-400 rounded-full"
                          animate={{ y: [0, -8, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: 0,
                          }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-cyan-400 rounded-full"
                          animate={{ y: [0, -8, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: 0.2,
                          }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-cyan-400 rounded-full"
                          animate={{ y: [0, -8, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: 0.4,
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* INPUT */}
              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-cyan-400/20 bg-slate-900/50"
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask anything..."
                    className="flex-1 px-4 py-2 rounded-lg bg-slate-700 text-cyan-100 placeholder-cyan-300/40 border border-cyan-400/20 focus:border-cyan-400/50 focus:outline-none text-sm"
                    disabled={isLoading}
                  />
                  <motion.button
                    type="submit"
                    disabled={isLoading || !inputValue.trim()}
                    className="px-4 py-2 rounded-lg bg-cyan-600 text-white font-semibold hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Send
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
