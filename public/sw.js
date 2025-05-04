// Service Worker for offline functionality

const CACHE_NAME = "offline-cache-v1"
const OFFLINE_URL = "/offline.html"

const urlsToCache = ["/", "/offline.html", "/manifest.json", "/icon-192x192.png", "/icon-512x512.png"]

// Install event - cache essential files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache")
      return cache.addAll(urlsToCache)
    }),
  )
  // Force the waiting service worker to become the active service worker
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
  // Take control of all clients as soon as it activates
  self.clients.claim()
})

// Fetch event - serve from cache or network
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return
  }

  // Handle API requests specially
  if (event.request.url.includes("/api/") || event.request.url.includes("jsonplaceholder.typicode.com")) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone the response to store in cache
          const responseToCache = response.clone()

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })

          return response
        })
        .catch(() => {
          // If network fetch fails, try to get from cache
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse
            }
            // If not in cache, return a generic offline response
            return new Response(
              JSON.stringify({
                error: "You are offline and this data is not cached.",
              }),
              {
                headers: { "Content-Type": "application/json" },
              },
            )
          })
        }),
    )
    return
  }

  // For non-API requests, use a "stale-while-revalidate" strategy
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          // Update the cache
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone())
          })
          return networkResponse
        })
        .catch((error) => {
          console.error("Fetch failed:", error)
          // If it's a navigation request and we're offline, show the offline page
          if (event.request.mode === "navigate") {
            return caches.match(OFFLINE_URL)
          }
          return new Response("Network error", { status: 408, headers: { "Content-Type": "text/plain" } })
        })

      // Return the cached response immediately, or wait for network response
      return cachedResponse || fetchPromise
    }),
  )
})
