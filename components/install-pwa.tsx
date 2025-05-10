"use client";

import { useState, useEffect } from "react";
import { Download } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      const confirmInstall = window.confirm("Would you like to install this app?");
      if (confirmInstall) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        setDeferredPrompt(null);
        setIsInstallable(false); // Hide the install button after install
      } else {
        console.log("User chose not to install the app.");
      }
    }
  };

  return (
    <>
      {isInstallable && (
        <button
          onClick={handleInstallClick}
          title="Download"
          className="text-[20px] text-black bg-white rounded-full p-2 shadow-md hover:bg-gray-200 transition duration-300 ease-in-out"
        >
          <Download className="h-4 w-4" />
        </button>
      )}
    </>
  );
}
