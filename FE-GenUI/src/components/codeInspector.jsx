import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { saveAs } from "file-saver";
import { FiCopy, FiDownload, FiCheck } from "react-icons/fi";

const CodeInspector = ({ jsx = "", css = "" }) => {
  const [tab, setTab] = useState("jsx");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const code = tab === "jsx" ? jsx : css;
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    const blob = new Blob(
      [
        `// Component.jsx\n${jsx}\n\n/* styles.css */\n${css}\n\n` +
          `/* Generated by GenUI - ${new Date().toLocaleString()} */`,
      ],
      { type: "text/plain;charset=utf-8" }
    );
    saveAs(blob, `component-${new Date().toISOString().slice(0, 10)}.txt`);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Generated Code</h2>
      </div>

      <div className="p-4 border-b border-gray-200 flex justify-between">
        <div className="flex space-x-2">
          <button
            onClick={() => setTab("jsx")}
            className={`px-3 py-1 text-sm rounded-md ${
              tab === "jsx"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            JSX/TSX
          </button>
          <button
            onClick={() => setTab("css")}
            className={`px-3 py-1 text-sm rounded-md ${
              tab === "css"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            CSS
          </button>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-md text-sm"
          >
            {copied ? <FiCheck className="text-green-500" /> : <FiCopy />}
            <span>{copied ? "Copied!" : "Copy"}</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md text-sm"
          >
            <FiDownload />
            <span>Download</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <SyntaxHighlighter
          language={tab === "jsx" ? "jsx" : "css"}
          style={darcula}
          customStyle={{
            margin: 0,
            height: "100%",
            borderRadius: 0,
            fontSize: "0.9rem",
          }}
          showLineNumbers
          wrapLines
        >
          {tab === "jsx"
            ? jsx || "// No JSX code generated yet"
            : css || "/* No CSS generated yet */"}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeInspector;
