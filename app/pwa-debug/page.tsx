"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, X, AlertCircle } from "lucide-react"

export default function PWADebugPage() {
  const [checks, setChecks] = useState({
    https: false,
    manifest: false,
    serviceWorker: false,
    installable: false,
    standalone: false,
  })
  const [manifestData, setManifestData] = useState<any>(null)
  const [manifestError, setManifestError] = useState<string | null>(null)
  const [swRegistration, setSwRegistration] = useState<any>(null)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  // Function to check if a URL is accessible
  const checkUrl = async (url: string, description: string) => {
    try {
      const response = await fetch(url, { method: "HEAD" })
      addLog(`${description} (${url}): ${response.ok ? "Accessible" : "Not accessible"} (Status: ${response.status})`)
      return response.ok
    } catch (error) {
      addLog(`Error checking ${description} (${url}): ${error instanceof Error ? error.message : String(error)}`)
      return false
    }
  }

  useEffect(() => {
    // Check if using HTTPS
    const isHttps = window.location.protocol === "https:" || window.location.hostname === "localhost"
    setChecks((prev) => ({ ...prev, https: isHttps }))
    addLog(`HTTPS check: ${isHttps ? "Passed" : "Failed"}`)

    // Check if in standalone mode (installed PWA)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes("android-app://")
    setChecks((prev) => ({ ...prev, standalone: isStandalone }))
    addLog(`Standalone mode: ${isStandalone ? "Yes" : "No"}`)

    // Check various manifest locations
    const manifestUrls = ["/manifest.json", "/manifest.webmanifest", "/site.webmanifest", "/app/manifest"]

    // Check all possible manifest URLs
    Promise.all(manifestUrls.map((url) => checkUrl(url, "Manifest URL")))

    // Try to fetch the manifest
    fetch("/manifest.json")
      .then(async (response) => {
        addLog(`Manifest fetch status: ${response.status} ${response.statusText}`)

        if (response.ok) {
          const contentType = response.headers.get("content-type")
          addLog(`Manifest content type: ${contentType || "not specified"}`)

          if (contentType && !contentType.includes("application/json")) {
            addLog(`WARNING: Manifest has incorrect content type: ${contentType}`)
          }

          const text = await response.text()
          try {
            const data = JSON.parse(text)
            setManifestData(data)
            setChecks((prev) => ({ ...prev, manifest: true }))
            addLog("Manifest parsed successfully")

            // Check icons
            if (data.icons && data.icons.length > 0) {
              data.icons.forEach((icon: any) => {
                checkUrl(icon.src, `Icon`)
              })
            }
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error)
            setManifestError(errorMessage)
            addLog(`Manifest parse error: ${errorMessage}`)

            // Log the first 100 characters of the response to debug
            addLog(`Manifest content (first 100 chars): ${text.substring(0, 100)}...`)
          }
        } else {
          throw new Error(`Failed to fetch manifest: ${response.status} ${response.statusText}`)
        }
      })
      .catch((error) => {
        const errorMessage = error instanceof Error ? error.message : String(error)
        setManifestError(errorMessage)
        addLog(`Manifest fetch error: ${errorMessage}`)
      })

    // Check service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .getRegistrations()
        .then((registrations) => {
          const hasRegistration = registrations.length > 0
          if (hasRegistration) {
            setSwRegistration(registrations[0])
          }
          setChecks((prev) => ({ ...prev, serviceWorker: hasRegistration }))
          addLog(`Service Worker registrations: ${registrations.length}`)
          registrations.forEach((reg, i) => {
            addLog(`SW ${i + 1} scope: ${reg.scope}`)
          })
        })
        .catch((error) => {
          addLog(`Service Worker error: ${error.message}`)
        })
    } else {
      addLog("Service Worker API not supported")
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()
      // Stash the event so it can be triggered later
      setDeferredPrompt(e)
      setChecks((prev) => ({ ...prev, installable: true }))
      addLog("Install prompt captured (beforeinstallprompt fired)")
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    // Listen for app installed event
    window.addEventListener("appinstalled", () => {
      addLog("PWA was installed successfully")
      setDeferredPrompt(null)
    })

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = () => {
    if (!deferredPrompt) {
      addLog("No install prompt available")

      // For iOS, show instructions
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
      if (isIOS) {
        addLog("iOS detected: Please use 'Add to Home Screen' from the share menu")
      }
      return
    }

    addLog("Showing install prompt...")
    deferredPrompt.prompt()

    deferredPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === "accepted") {
        addLog("User accepted the install prompt")
      } else {
        addLog("User dismissed the install prompt")
      }
      setDeferredPrompt(null)
    })
  }

  const handleManualServiceWorkerRegister = () => {
    if ("serviceWorker" in navigator) {
      addLog("Attempting manual service worker registration...")
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          addLog(`Service worker registered with scope: ${registration.scope}`)
          setSwRegistration(registration)
          setChecks((prev) => ({ ...prev, serviceWorker: true }))
        })
        .catch((error) => {
          addLog(`Service worker registration failed: ${error.message}`)
        })
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">PWA Debug Page</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">PWA Requirements</h2>
          <ul className="space-y-2">
            <li className="flex items-center">
              {checks.https ? <Check className="text-green-500 mr-2" /> : <X className="text-red-500 mr-2" />}
              HTTPS Connection
            </li>
            <li className="flex items-center">
              {checks.manifest ? <Check className="text-green-500 mr-2" /> : <X className="text-red-500 mr-2" />}
              Web App Manifest
              {manifestError && <span className="text-xs text-red-500 ml-2">Error: {manifestError}</span>}
            </li>
            <li className="flex items-center">
              {checks.serviceWorker ? <Check className="text-green-500 mr-2" /> : <X className="text-red-500 mr-2" />}
              Service Worker
            </li>
            <li className="flex items-center">
              {checks.installable ? <Check className="text-green-500 mr-2" /> : <X className="text-red-500 mr-2" />}
              Installable (beforeinstallprompt fired)
            </li>
            <li className="flex items-center">
              {checks.standalone ? <Check className="text-green-500 mr-2" /> : <X className="text-red-500 mr-2" />}
              Running in Standalone Mode
            </li>
          </ul>
        </Card>

        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="space-y-4">
            <Button
              onClick={handleInstallClick}
              className="w-full"
              disabled={!deferredPrompt && !/iPad|iPhone|iPod/.test(navigator.userAgent)}
            >
              Install PWA
            </Button>

            <Button
              onClick={handleManualServiceWorkerRegister}
              variant="outline"
              className="w-full"
              disabled={checks.serviceWorker}
            >
              Register Service Worker Manually
            </Button>

            <div className="text-sm mt-4">
              <p className="font-medium">iOS Users:</p>
              <p>Tap the share icon and select "Add to Home Screen"</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-4 mb-8">
        <h2 className="text-xl font-semibold mb-4">Debug Logs</h2>
        <div className="bg-gray-100 p-3 rounded-md h-60 overflow-y-auto font-mono text-sm">
          {logs.map((log, index) => (
            <div key={index} className="mb-1">
              {log}
            </div>
          ))}
          {logs.length === 0 && <div className="text-gray-500">No logs yet...</div>}
        </div>
      </Card>

      {manifestData && (
        <Card className="p-4 mb-8">
          <h2 className="text-xl font-semibold mb-4">Manifest Data</h2>
          <pre className="bg-gray-100 p-3 rounded-md overflow-x-auto text-sm">
            {JSON.stringify(manifestData, null, 2)}
          </pre>
        </Card>
      )}

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
        <div className="flex">
          <AlertCircle className="text-yellow-400 mr-2" />
          <div>
            <p className="font-medium">Browser-specific notes:</p>
            <ul className="list-disc ml-5 mt-2 text-sm">
              <li>Chrome/Edge: Requires user interaction before showing install prompt</li>
              <li>Safari (iOS): Use "Add to Home Screen" from the share menu</li>
              <li>Firefox: Limited PWA support, varies by version</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
