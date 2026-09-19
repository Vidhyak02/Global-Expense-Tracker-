import { useState, useRef, useEffect } from "react";

function AIChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I'm your Global Expense AI assistant. Ask me anything about your USA and India expenses, money transfers, or financial advice.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Get real user data
  const getUserData = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) return null;

    const email = currentUser.email;
    const usa = JSON.parse(localStorage.getItem(`expenses_${email}`)) || [];
    const india = JSON.parse(localStorage.getItem(`indiaExpenses_${email}`)) || [];
    const transfers = JSON.parse(localStorage.getItem(`transfers_${email}`)) || [];

    const totalUSA = usa.reduce((sum, e) => sum + Number(e.amount), 0);
    const totalIndia = india.reduce((sum, e) => sum + Number(e.amount), 0);
    const totalSent = transfers.reduce((sum, t) => sum + Number(t.amount), 0);
    const totalReceived = transfers.reduce(
      (sum, t) => sum + Number(t.inrReceived || 0),
      0
    );

    const getHighest = (expenses) => {
      if (expenses.length === 0) return null;
      const map = {};
      expenses.forEach((e) => {
        map[e.category] = (map[e.category] || 0) + Number(e.amount);
      });
      const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]);
      return sorted[0];
    };

    return {
      name: currentUser.name,
      totalUSA,
      totalIndia,
      totalSent,
      totalReceived,
      usaCount: usa.length,
      indiaCount: india.length,
      transferCount: transfers.length,
      highestUSA: getHighest(usa),
      highestIndia: getHighest(india),
    };
  };

  // Clean local answers (no special characters)
  const getLocalAnswer = (question) => {
    const data = getUserData();
    if (!data) return "Please login first.";

    const q = question.toLowerCase();

    // USA spending
    if (
      q.includes("usa") &&
      (q.includes("spend") || q.includes("total") || q.includes("how much"))
    ) {
      return `You have spent a total of $${data.totalUSA.toLocaleString()} in the USA across ${data.usaCount} expenses.`;
    }

    // India spending
    if (
      q.includes("india") &&
      (q.includes("spend") || q.includes("total") || q.includes("how much"))
    ) {
      return `You have spent a total of Rs ${data.totalIndia.toLocaleString()} in India across ${data.indiaCount} expenses.`;
    }

    // Money sent
    if (
      q.includes("sent") ||
      q.includes("transfer") ||
      q.includes("money sent")
    ) {
      return `You have sent $${data.totalSent.toLocaleString()} to India so far (${data.transferCount} transfers). India received approximately Rs ${data.totalReceived.toLocaleString()}.`;
    }

    // Highest USA
    if (q.includes("highest") && q.includes("usa")) {
      if (!data.highestUSA)
        return "You do not have any USA expenses yet.";
      return `Your highest USA expense category is ${data.highestUSA[0]} with $${data.highestUSA[1].toLocaleString()}.`;
    }

    // Highest India
    if (q.includes("highest") && q.includes("india")) {
      if (!data.highestIndia)
        return "You do not have any India expenses yet.";
      return `Your highest India expense category is ${data.highestIndia[0]} with Rs ${data.highestIndia[1].toLocaleString()}.`;
    }

    // Advice
    if (
      q.includes("advice") ||
      q.includes("reduce") ||
      q.includes("saving") ||
      q.includes("cut")
    ) {
      let advice = "Here are some practical tips based on your data:\n\n";

      if (data.highestIndia) {
        advice += `Your biggest India expense is ${data.highestIndia[0]} (Rs ${data.highestIndia[1].toLocaleString()}). Review if you can reduce it.\n`;
      }
      advice += "Track discretionary categories like Shopping and Entertainment more carefully.\n";
      advice += "Set a monthly budget for India expenses and stick to it.\n";
      advice += "Compare your USA vs India spending on the Comparison page for better visibility.";

      return advice;
    }

    // Balance
    if (
      q.includes("balance") ||
      q.includes("left") ||
      q.includes("remaining")
    ) {
      const balance = data.totalReceived - data.totalIndia;
      return `After receiving Rs ${data.totalReceived.toLocaleString()} in India and spending Rs ${data.totalIndia.toLocaleString()}, your current India balance is Rs ${balance.toLocaleString()}.`;
    }

    // Default
    return `I can help you with:
How much you spent in USA or India
Money you sent to India
Your highest expense categories
Advice to reduce expenses
Current India balance

Try asking one of these.`;
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    await new Promise((r) => setTimeout(r, 500));

    try {
      const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

      if (API_KEY && API_KEY.length > 10) {
        const data = getUserData();
        const context = data
          ? `User: ${data.name}
USA Total: $${data.totalUSA}
India Total: Rs ${data.totalIndia}
Money Sent: $${data.totalSent}
Highest USA: ${data.highestUSA ? data.highestUSA[0] : "None"}
Highest India: ${data.highestIndia ? data.highestIndia[0] : "None"}`
          : "";

        const prompt = `You are a helpful financial assistant.
${context}

User question: ${userMessage}

Give a short, friendly and practical answer. Do not use any special characters, asterisks, or markdown. Use only plain text.`;

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
            }),
          }
        );

        const result = await res.json();

        if (res.ok && result.candidates?.[0]?.content?.parts?.[0]?.text) {
          let reply = result.candidates[0].content.parts[0].text;
          // Clean any leftover special characters
          reply = reply.replace(/\*\*/g, "").replace(/\*/g, "").replace(/•/g, "-");
          setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
          setLoading(false);
          return;
        }
      }

      // Local fallback
      const localReply = getLocalAnswer(userMessage);
      setMessages((prev) => [...prev, { role: "assistant", text: localReply }]);
    } catch (err) {
      const localReply = getLocalAnswer(userMessage);
      setMessages((prev) => [...prev, { role: "assistant", text: localReply }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full w-14 h-14 shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
      >
        {isOpen ? (
          <span className="text-2xl">X</span>
        ) : (
          <span className="text-2xl">AI</span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[520px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-600 text-white px-4 py-3 flex items-center justify-between">
            <div>
              <p className="font-semibold">Expense AI Assistant</p>
              <p className="text-xs text-indigo-200">Works offline too</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-indigo-200 text-xl"
            >
              X
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-line ${
                    msg.role === "user"
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 px-4 py-2 rounded-2xl rounded-bl-none text-sm text-gray-500">
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about your expenses..."
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="bg-indigo-600 text-white px-5 py-2.5 rounded-full hover:bg-indigo-700 disabled:bg-gray-400 transition text-sm font-medium"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AIChatBox;