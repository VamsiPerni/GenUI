import { useState } from "react";

const ChatSidebar = ({ chatHistory, onSendPrompt }) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSendPrompt(input);
    setInput("");
  };

  return (
    <div className="chat-sidebar">
      <div className="chat-history">
        {chatHistory.map((msg, idx) => (
          <div key={idx} className={msg.isUser ? "user-msg" : "ai-msg"}>
            <pre>{msg.text}</pre>
          </div>
        ))}
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter prompt to generate component"
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export { ChatSidebar };
