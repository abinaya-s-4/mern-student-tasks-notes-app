// src/api.ts

// 🔹 Directly use your deployed backend API URL — no localhost or ENV fallback
const API_BASE_URL = "https://mern-student-tasks-notes-nckm6lver-abinaya-s-4s-projects.vercel.app/api";

export async function apiRequest<T>(
  endpoint: string,
  method: string = "GET",
  body?: any,
  token?: string
): Promise<T> {
  // Prevent double slashes in final URL
  const separator = API_BASE_URL.endsWith('/') ? '' : '/';
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  const url = `${API_BASE_URL}${separator}${cleanEndpoint}`;

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include", // allow cookies/auth if used
  });

  // ✅ Read the body only once
  const contentType = res.headers.get("content-type") || "";
  let data: any;

  if (contentType.includes("application/json")) {
    // Try to parse JSON
    try {
      data = await res.json();
    } catch {
      data = null;
    }
  } else {
    // Fallback to text for non-JSON responses
    data = await res.text();
  }

  // If HTTP status is an error, throw with parsed message if possible
  if (!res.ok) {
    const message =
      data && typeof data === "object"
        ? data.message || JSON.stringify(data)
        : data;
    throw new Error(message || "API request failed");
  }

  return data as T;
}
