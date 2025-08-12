const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function apiRequest<T>(
  endpoint: string,
  method: string = "GET",
  body?: any,
  token?: string
): Promise<T> {
  // Normalize URL concatenation to avoid double slashes
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

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    if (errorData && errorData.message) throw new Error(errorData.message);
    const text = await res.text();
    throw new Error(text || "API request failed");
  }

  return res.json() as Promise<T>;
}
