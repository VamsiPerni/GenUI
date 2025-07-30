import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import { axiosInstance } from "../axios/axiosInstance";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { toast } from "react-toastify";
import { FiSend, FiLoader } from "react-icons/fi";
import ComponentPreview from "../components/componentPreview";
import CodeInspector from "../components/codeInspector";

// --- ChatSidebar now expects {role, message} messages
const ChatSidebar = ({ chat }) => (
  <div className="flex flex-col h-full overflow-y-auto p-4 space-y-4">
    {chat.map((msg, idx) => (
      <div
        key={msg._id || idx}
        className={`flex ${
          msg.role === "user" ? "justify-end" : "justify-start"
        }`}
      >
        <div
          className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
            msg.role === "user"
              ? "bg-indigo-500 text-white"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          <p className="whitespace-pre-wrap text-sm">{msg.message}</p>
        </div>
      </div>
    ))}
  </div>
);

const SessionPage = () => {
  const { id: sessionId } = useParams();
  const messagesEndRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [chatHistory, setChatHistory] = useState([]);
  const [generatedCode, setGeneratedCode] = useState({ jsx: "", css: "" });
  const [isGenerating, setIsGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [input, setInput] = useState("");

  // Scroll to bottom of chat when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // Load session data with full chat and code
  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/sessions/${sessionId}`);
        const session = res.data.session;
        setChatHistory(session.chat || []);
        setGeneratedCode(session.generatedCode || { jsx: "", css: "" });
      } catch (error) {
        toast.error("Failed to load session info.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  // Handle prompt send: new user/AI messages added, DB updated
  const handleSendPrompt = async (e) => {
    if (e) e.preventDefault(); // for form submit
    if (!input.trim()) return;

    const userMessage = { role: "user", message: input };

    setIsGenerating(true);
    setInput(""); // clear input immediately

    try {
      // Add user message first for immediate feedback
      setChatHistory((prev) => [...prev, userMessage]);

      // Request AI component
      const res = await axiosInstance.post("/ai/generate-component", {
        prompt: input,
        sessionId,
      });

      if (!res.data.isSuccess) {
        throw new Error(res.data.message || "AI generation failed");
      }

      const aiResponse = res.data.data;
      const aiMessage = {
        role: "assistant",
        message: `Component generated successfully!\n(JSX: ${aiResponse.jsx.length} chars, CSS: ${aiResponse.css.length} chars)`,
      };

      // Update chat and save to DB together using up-to-date state
      setChatHistory((prevChat) => {
        const updatedChat = [...prevChat, aiMessage];

        setSaving(true);
        axiosInstance
          .put(`/sessions/${sessionId}`, {
            chat: updatedChat,
            generatedCode: aiResponse,
          })
          .then(() => {
            toast.success("Component and chat saved!");
          })
          .catch((err) => {
            toast.error("Failed to save session.");
            console.error(err);
          })
          .finally(() => setSaving(false));

        return updatedChat;
      });

      setGeneratedCode(aiResponse);
    } catch (err) {
      toast.error(err.message || "AI generation error");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
            <p className="text-gray-600">Loading your session...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow flex flex-col md:flex-row p-4 gap-4">
        {/* Sidebar: Chat */}
        <div className="w-full md:w-1/4 bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              AI Generator
            </h2>
            <p className="text-sm text-gray-500">
              Describe the component you want
            </p>
          </div>
          <ChatSidebar chat={chatHistory} />
          {isGenerating && (
            <div className="p-4">
              <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-2 flex items-center space-x-2">
                <FiLoader className="animate-spin" />
                <span>Generating component...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
          <div className="p-4 border-t border-gray-200">
            <form onSubmit={handleSendPrompt} className="flex space-x-2">
              <input
                name="prompt"
                type="text"
                placeholder="e.g. Create a blue button with rounded corners"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={isGenerating}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                disabled={isGenerating}
              >
                <FiSend />
              </button>
            </form>
          </div>
        </div>

        {/* Main Content: Component Preview + Code Inspector */}
        <div className="w-full md:w-3/4 flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-1/2 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                Component Preview
              </h2>
            </div>
            <div className="p-4 h-full">
              <ComponentPreview
                jsx={generatedCode.jsx}
                css={generatedCode.css}
              />
            </div>
          </div>
          <div className="w-full lg:w-1/2 bg-white rounded-lg shadow-md overflow-hidden">
            <CodeInspector jsx={generatedCode.jsx} css={generatedCode.css} />
          </div>
        </div>
      </main>

      {/* Saving indicator */}
      {saving && (
        <div className="fixed bottom-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
          <FiLoader className="animate-spin" />
          <span>Saving changes...</span>
        </div>
      )}

      <Footer />
    </div>
  );
};

export { SessionPage };
