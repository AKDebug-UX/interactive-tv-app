import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This middleware runs on every request
export function middleware(request: NextRequest) {
    const response = NextResponse.next()

    // Get the current path
    const pathname = request.nextUrl.pathname

    // Add a custom header to track the page that was accessed
    response.headers.set("x-page-accessed", pathname)

    // Get or set a session cookie
    const sessionId =
        request.cookies.get("quiz-session-id")?.value ||
        Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

    // Set the session cookie if it doesn't exist
    if (!request.cookies.has("quiz-session-id")) {
        response.cookies.set("quiz-session-id", sessionId, {
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/",
        })
    }

    // Add the session ID to a header for logging/tracking
    response.headers.set("x-session-id", sessionId)

    return response
}

// Configure the middleware to run on specific paths
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        "/((?!_next/static|_next/image|favicon.ico|public).*)",
    ],
}
