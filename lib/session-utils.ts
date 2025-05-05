"use client"

// Function to restore session state after a refresh
export function restoreSessionState() {
    if (typeof window === "undefined") return null

    const wasRefreshed = localStorage.getItem("quizRefreshed") === "true"
    if (!wasRefreshed) return null

    // Clear the refresh flag
    localStorage.setItem("quizRefreshed", "false")

    return {
        currentQuestionId: localStorage.getItem("currentQuestionId"),
        timeLeft: Number.parseInt(localStorage.getItem("timeLeft") || "30"),
        category: localStorage.getItem("category"),
        lastPage: localStorage.getItem("lastQuizPage"),
    }
}

// Function to save session state before a refresh
export function saveSessionState(data: {
    currentQuestionId?: string
    timeLeft?: number
    category?: string
}) {
    if (typeof window === "undefined") return

    if (data.currentQuestionId) {
        localStorage.setItem("currentQuestionId", data.currentQuestionId)
    }

    if (data.timeLeft) {
        localStorage.setItem("timeLeft", data.timeLeft.toString())
    }

    if (data.category) {
        localStorage.setItem("category", data.category)
    }

    // Record the current page URL
    localStorage.setItem("lastQuizPage", window.location.href)
}

// Function to track page refreshes
export function setupRefreshTracking() {
    if (typeof window === "undefined") return

    const handleBeforeUnload = () => {
        localStorage.setItem("quizRefreshed", "true")
        localStorage.setItem("quizRefreshTime", Date.now().toString())
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload)
    }
}
