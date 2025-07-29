import { LiveProvider, LivePreview, LiveError } from "react-live";
import React, { useEffect, useState } from "react";

const ComponentPreview = ({ jsx = "", css = "" }) => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!jsx.trim()) {
      setCode("");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const componentName = extractComponentName(jsx);

      const renderCode = `
        ${jsx}

        const styles = \`${css}\`;

        function PreviewWrapper() {
          return (
            <>
              <style>{styles}</style>
              <${componentName}>
                ${getDefaultChildrenJSX(componentName)}
              </${componentName}>
            </>
          );
        }

        render(<PreviewWrapper />);
      `;

      setCode(renderCode);
    } catch (error) {
      console.error("Error preparing preview:", error);
      setCode("");
    } finally {
      setIsLoading(false);
    }
  }, [jsx, css]);

  const scope = {
    React,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!code.trim()) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No component code to preview
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col border rounded-lg overflow-hidden bg-white">
      <div className="p-3 border-b bg-gray-50">
        <h3 className="font-medium">Component Preview</h3>
      </div>
      <div className="flex-1 p-4">
        <LiveProvider code={code} scope={scope} noInline>
          <div className="flex justify-center items-center h-full">
            <LivePreview className="w-full" />
          </div>
          <LiveError className="bg-red-50 text-red-800 p-3 mt-2 rounded text-sm" />
        </LiveProvider>
      </div>
    </div>
  );
};

// 🔹 Extract component name from function or arrow declaration
function extractComponentName(jsx) {
  const funcMatch = jsx.match(/function\s+([A-Z][A-Za-z0-9]*)\s*\(/);
  const arrowMatch = jsx.match(
    /const\s+([A-Z][A-Za-z0-9]*)\s*=\s*(\([^)]*\)|[a-zA-Z0-9]+)?\s*=>/
  );

  if (funcMatch) return funcMatch[1];
  if (arrowMatch) return arrowMatch[1];
  return "GeneratedComponent";
}

// 🔹 Returns raw JSX, not a string
function getDefaultChildrenJSX(componentName) {
  if (componentName.toLowerCase().includes("button")) {
    return `Click Me`;
  }
  if (componentName.toLowerCase().includes("card")) {
    return `<div style={{ padding: '20px' }}>Card Content</div>`;
  }
  return `Preview Content`;
}

export default ComponentPreview;
