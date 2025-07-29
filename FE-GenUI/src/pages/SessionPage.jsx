import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import { axiosInstance } from "../axios/axiosInstance";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { toast } from "react-toastify";
import { ChatSidebar } from "../components/chatSideBar";
import ComponentPreview from "../components/componentPreview";
import CodeInspector from "../components/codeInspector";
import { FiSend, FiLoader, FiCheckCircle } from "react-icons/fi";

const SessionPage = () => {
  const { id: sessionId } = useParams();
  const messagesEndRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [chatHistory, setChatHistory] = useState([]);
  const [generatedCode, setGeneratedCode] = useState({ jsx: "", css: "" });
  const [isGenerating, setIsGenerating] = useState(false);
  const [saving, setSaving] = useState(false);

  // Scroll to bottom of chat when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // Load session data with chat history + code
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

  // Function to send prompt to AI backend and update chat + code
  const handleSendPrompt = async (promptText) => {
    if (!promptText.trim()) return;

    // Add user message
    const userMessage = { text: promptText, isUser: true };
    setChatHistory((prev) => [...prev, userMessage]);
    setIsGenerating(true);

    try {
      // Call your AI generate endpoint
      const res = await axiosInstance.post("/ai/generate-component", {
        prompt: promptText,
        sessionId,
      });

      if (!res.data.isSuccess) {
        throw new Error(res.data.message || "AI generation failed");
      }

      const aiResponse = res.data.data;

      // Add AI response to chat
      const aiMessage = {
        text: `Generated component with:\nJSX: ${aiResponse.jsx.length} chars\nCSS: ${aiResponse.css.length} chars`,
        isUser: false,
      };

      setChatHistory((prev) => [...prev, aiMessage]);
      setGeneratedCode(aiResponse);

      // Persist updated chat and code to the session
      setSaving(true);
      await axiosInstance.put(`/sessions/${sessionId}`, {
        chat: [...chatHistory, userMessage, aiMessage],
        generatedCode: aiResponse,
      });
      toast.success("Component saved successfully!");
    } catch (err) {
      toast.error(err.message || "AI generation error");
      console.error(err);
    } finally {
      setIsGenerating(false);
      setSaving(false);
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
        {/* Chat Sidebar - 1/4 width on desktop, full width on mobile */}
        <div className="w-full md:w-1/4 bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              AI Generator
            </h2>
            <p className="text-sm text-gray-500">
              Describe the component you want
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                    msg.isUser
                      ? "bg-indigo-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
            {isGenerating && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <FiLoader className="animate-spin" />
                    <span>Generating component...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-gray-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const prompt = e.target.prompt.value;
                handleSendPrompt(prompt);
                e.target.prompt.value = "";
              }}
              className="flex space-x-2"
            >
              <input
                name="prompt"
                type="text"
                placeholder="e.g. Create a blue button with rounded corners"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={isGenerating}
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

        {/* Main Content Area - 3/4 width on desktop, full width on mobile */}
        <div className="w-full md:w-3/4 flex flex-col lg:flex-row gap-4">
          {/* Component Preview - 1/2 width on desktop, full width on mobile */}
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

          {/* Code Inspector - 1/2 width on desktop, full width on mobile */}
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
