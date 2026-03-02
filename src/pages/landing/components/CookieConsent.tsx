import { useState, useEffect } from "react";
import Button from "@/components/custom/Button";
import { BffAuthBaseUrl, cookieText } from "@/lib/env";
import { convertToTimestamp } from "@/lib/utils";

const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);

  const handleAccept = async () => {
    try {
      document.cookie = `CookieConsents=true; path=/; max-age=${
        60 * 60 * 24 * 31 // 1 month
      }; SameSite=Lax${
        window.location.protocol === "https:" ? "; Secure" : ""
      }`;
      setShowBanner(false);
      const response = await fetch(`${BffAuthBaseUrl}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ clientId: "SSSC" }),
      });
      if (response.ok) {
        const content = await response.text();
        const data = JSON.parse(content);
        if (data?.succeeded) {
          const expiredTime = data?.data?.expiresAt;
          localStorage.setItem(
            "expiredTime",
            convertToTimestamp(expiredTime).toString()
          );
        }
      }
    } catch (err) {
      console.error("Failed to send consent:", err);
    }
  };

  const grantConsent = async () => {
    await fetch(`${BffAuthBaseUrl}/consent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(true),
    });
  };

  useEffect(() => {
    const hasConsented = document.cookie
      .split("; ")
      .find((row) => row.startsWith("CookieConsents="));
    if (!hasConsented) {
      grantConsent();
      setShowBanner(true);
    }
  }, []);

  if (!showBanner) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-60"></div>

      <div className="fixed top-[45%] left-0 right-0 z-70 bg-gray-800 text-white px-6 py-4 flex justify-between items-center shadow-lg">
        <span className="text-sm">{cookieText}</span>
        <Button onClick={handleAccept} size="lg" className="ml-4">
          Accept
        </Button>
      </div>
    </>
  );
};

export default CookieConsent;
