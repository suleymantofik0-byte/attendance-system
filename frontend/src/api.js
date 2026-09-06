import axios from "axios"

// In development this is the local server.
// In production Vite replaces VITE_API_URL at build time.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4444/api"
})

// Attach the login token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")

  if (token) {
    config.headers.Authorization = "Bearer " + token
  }

  return config
})

export default api

// ---- login helpers ----

export function saveToken(token) {
  localStorage.setItem("token", token)
}

export function logout() {
  localStorage.removeItem("token")
}

// A JWT is 3 parts: header.payload.signature
// The middle part holds our data (userId + role), base64 encoded.
export function getUser() {
  const token = localStorage.getItem("token")
  if (!token) return null

  try {
    return JSON.parse(atob(token.split(".")[1]))
  } catch (error) {
    return null
  }
}
