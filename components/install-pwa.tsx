"use client";

import { useState, useEffect } from "react";
import { Download } from "lucide-react";

export default function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstallable, setIsInstallable] = useState(false)

  useEffect(() => {
    // Listen for the beforeinstallprompt event
    window.addEventListener("beforeinstallprompt", (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Stash the event so it can be triggered later
      setDeferredPrompt(e)
      // Update UI to notify the user they can install the PWA
      setIsInstallable(true)
    })

    window.addEventListener("appinstalled", () => {
      // Log install to analytics
      console.log("PWA was installed")
      setIsInstallable(false)
    })
  }, [])

  const handleInstallClick = () => {
    // Hide the app provided install promotion
    setIsInstallable(false)
    // Show the install prompt
    deferredPrompt.prompt()
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt")
      } else {
        console.log("User dismissed the install prompt")
      }
      setDeferredPrompt(null)
    })
  }

  if (!isInstallable) {
    return null
  }

  return (
        <button
          onClick={handleInstallClick}
          title="Download"
          className="text-[20px] text-black bg-white rounded-full p-2 shadow-md hover:bg-gray-200 transition duration-300 ease-in-out"
        >
          <Download className="h-4 w-4" />
        </button>
  );
}
