"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface User {
  id: number
  name: string
  email: string
  avatar: string
}

export function UserList() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fromCache, setFromCache] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        setError(null)

        // Try to fetch from network first
        try {
          const response = await fetch("https://jsonplaceholder.typicode.com/users")

          if (response.ok) {
            const data = await response.json()
            // Transform the data to include avatars
            const usersWithAvatars = data.map((user: any) => ({
              id: user.id,
              name: user.name,
              email: user.email,
              avatar: `/placeholder.svg?height=40&width=40&query=${encodeURIComponent(user.name)}`,
            }))

            setUsers(usersWithAvatars)
            setFromCache(false)

            // Store in cache for offline use
            if ("caches" in window) {
              const cache = await caches.open("api-cache")
              await cache.put(
                "https://jsonplaceholder.typicode.com/users",
                new Response(JSON.stringify(usersWithAvatars), {
                  headers: { "Content-Type": "application/json" },
                }),
              )
            }
          } else {
            throw new Error("Failed to fetch users")
          }
        } catch (networkError) {
          // If network request fails, try to get from cache
          if ("caches" in window) {
            const cache = await caches.open("api-cache")
            const cachedResponse = await cache.match("https://jsonplaceholder.typicode.com/users")

            if (cachedResponse) {
              const cachedData = await cachedResponse.json()
              setUsers(cachedData)
              setFromCache(true)
            } else {
              throw new Error("No cached data available")
            }
          } else {
            throw networkError
          }
        }
      } catch (err) {
        setError("Failed to load users. Please check your connection and try again.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Users</span>
          {fromCache && (
            <Badge variant="outline" className="text-amber-500 border-amber-500">
              Loaded from cache
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading
            ? Array(5)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[150px]" />
                    </div>
                  </div>
                ))
            : users.map((user) => (
                <div key={user.id} className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              ))}
        </div>
      </CardContent>
    </Card>
  )
}

function Badge({
  variant,
  className,
  children,
}: {
  variant: "default" | "destructive" | "outline"
  className?: string
  children: React.ReactNode
}) {
  const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
  const variantClasses = {
    default: "bg-primary text-primary-foreground",
    destructive: "bg-destructive text-destructive-foreground",
    outline: "border border-input",
  }

  return <span className={`${baseClasses} ${variantClasses[variant]} ${className || ""}`}>{children}</span>
}
