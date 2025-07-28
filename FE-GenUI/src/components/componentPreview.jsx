import { useEffect, useRef, useState } from "react";

const ComponentPreview = ({ jsx = "", css = "" }) => {
  const iframeRef = useRef();
  const [error, setError] = useState(null);
  const [iframeKey, setIframeKey] = useState(0);

  useEffect(() => {
    if (!iframeRef.current) return;

    setError(null);
    setIframeKey((prev) => prev + 1); // Force iframe recreation

    if (!jsx.trim()) {
      setError("No component code to preview");
      return;
    }

    try {
      // Create a clean HTML document
      const srcDoc = `<!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              margin: 0;
              padding: 20px;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              background: #f8fafc;
            }
            ${css}
          </style>
          <script crossorigin src="https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.development.js"></script>
          <script crossorigin src="https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.development.js"></script>
          <script src="https://cdn.jsdelivr.net/npm/@babel/standalone@7.22.15/babel.min.js"></script>
        </head>
        <body>
          <div id="root"></div>
          <script type="text/babel">
            // Error boundary
            class ErrorBoundary extends React.Component {
              constructor(props) {
                super(props);
                this.state = { hasError: false };
              }
              
              static getDerivedStateFromError(error) {
                return { hasError: true };
              }
              
              componentDidCatch(error, errorInfo) {
                console.error("Component error:", error, errorInfo);
              }
              
              render() {
                if (this.state.hasError) {
                  return (
                    <div style={{
                      color: 'red',
                      padding: '16px',
                      border: '1px solid red',
                      backgroundColor: '#fff0f0'
                    }}>
                      Error rendering component
                    </div>
                  );
                }
                return this.props.children;
              }
            }
            
            // Your component
            ${jsx}
            
            // Render the component
            const root = ReactDOM.createRoot(document.getElementById('root'));
            root.render(
              <ErrorBoundary>
                <BlueButton onClick={() => alert('Button clicked!')}>
                  Click Me
                </BlueButton>
              </ErrorBoundary>
            );
          </script>
        </body>
        </html>`;

      // Create a new iframe each time
      const newIframe = document.createElement("iframe");
      newIframe.srcdoc = srcDoc;
      newIframe.title = "Component Preview";
      newIframe.sandbox = "allow-scripts allow-same-origin";
      newIframe.style.width = "100%";
      newIframe.style.height = "100%";
      newIframe.style.minHeight = "300px";
      newIframe.onload = () => console.log("Preview loaded successfully");
      newIframe.onerror = () => setError("Failed to load preview");

      // Replace the iframe
      const container = iframeRef.current.parentNode;
      container.replaceChild(newIframe, iframeRef.current);
      iframeRef.current = newIframe;
    } catch (err) {
      setError(err.message);
      console.error("Preview setup error:", err);
    }
  }, [jsx, css]);

  return (
    <div className="h-full flex flex-col border border-gray-200 rounded-lg bg-white">
      <div className="p-3 border-b border-gray-200 bg-gray-50">
        <h3 className="font-medium text-gray-800">Component Preview</h3>
      </div>

      <div className="flex-1 relative" key={`preview-${iframeKey}`}>
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 w-full">
              <h4 className="text-red-600 font-medium mb-2">Error</h4>
              <pre className="text-sm text-red-800 whitespace-pre-wrap">
                {error}
              </pre>
            </div>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            title="Component Preview"
            sandbox="allow-scripts allow-same-origin"
            className="w-full h-full"
            style={{ minHeight: "300px", border: "none" }}
          />
        )}
      </div>
    </div>
  );
};

export default ComponentPreview;
