const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api"; // Adjust for production later

// Signup
export const signup = async (data: { name: string; dob: string; email: string; password?: string }) => {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

// Login
export const login = async (data: { email: string; password: string }) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};
