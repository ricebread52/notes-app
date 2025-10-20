const API_URL = "https://notes-app-gzsq.onrender.com/api/auth";

interface SendOtpData {
  email: string;
}

interface VerifyOtpData {
  email: string;
  otp: string;
  name?: string; // Optional for signup
  dob?: string;  // Optional for signup
}

// ✅ FIX: sendOtp now accepts { email }
export async function sendOtp({ email }: SendOtpData) {
  const response = await fetch(`${API_URL}/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return response.json();
}

export async function verifyOtp({ email, otp, name, dob }: VerifyOtpData) {
  const response = await fetch(`${API_URL}/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp, name, dob }),
  });
  return response.json();
}

export async function verifyOtpLogin({ email, otp }: VerifyOtpData) {
  const response = await fetch(`${API_URL}/verify-login-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });
  return response.json();
}

export async function getProfile(token: string) {
  const response = await fetch(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }

  return response.json();
}
