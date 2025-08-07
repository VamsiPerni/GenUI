import { useState, useEffect } from "react";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookiesAccepted");
    if (!accepted) setVisible(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 text-center z-50">
      This website uses cookies to enhance your experience. Please accept to
      avoid any login issues or errors.
      <button
        onClick={handleAccept}
        className="ml-4 px-4 py-2 bg-green-500 rounded hover:bg-green-600 transition-colors duration-200"
      >
        Accept
      </button>
    </div>
  );
};

export { CookieConsent };
