import axios from "axios"

// In production, /api is proxied to the backend by vercel.json, so the browser
// sees one domain and the auth cookies are first-party (Safari blocks them otherwise).
const api = axios.create({
  baseURL: import.meta.env.DEV ? "http://localhost:4444/api" : "/api",
  withCredentials: true
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    // Never try to refresh when the refresh call itself is what failed -
    // otherwise a dead session recurses into itself forever, each retry
    // spawning a brand new request with no _retry flag to stop it.
    const isRefreshCall = original?.url?.includes("/auth/refresh")

    if (error.response?.status === 401 && !original._retry && !isRefreshCall) {
      original._retry = true
      try {
        await api.post("/auth/refresh")
        return api(original)
      } catch {
        // On the login page a failed refresh just means "not logged in".
        // Redirecting there would reload, re-check, fail again and loop forever.
        if (window.location.pathname !== "/") {
          window.location.href = "/"
        }
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  }
)

export default api
