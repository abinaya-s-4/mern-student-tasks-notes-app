// src/api.ts
const API_BASE_URL = "https://mern-student-tasks-notes-app.vercel.app/api";

export async function apiRequest<T>(
  endpoint: string,
  method: string = "GET",
  body?: any,
  token?: string
): Promise<T> {
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
    credentials: "include",
  });

  // Read body once
  const contentType = res.headers.get("content-type") || "";
  let data: any;

  if (contentType.includes("application/json")) {
    try {
      data = await res.json();
    } catch {
      data = null;
    }
  } else {
    data = await res.text();
  }

  if (!res.ok) {
    const message =
      data && typeof data === "object"
        ? data.message || JSON.stringify(data)
        : data;
    throw new Error(message || "API request failed");
  }

  return data as T;
}
