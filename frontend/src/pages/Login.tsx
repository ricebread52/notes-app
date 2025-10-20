import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import rightImage from "../assets/images/left-column.png";
import { sendOtp, verifyOtpLogin } from "../lib/api/auth";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; otp?: string; general?: string }>({});

  const handleSendOtp = async () => {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      return setErrors({ email: "Valid email is required." });
    }

    setLoading(true);
    try {
      const result = await sendOtp({ email });
      if (result.success) {
        setOtpSent(true);
      } else {
        setErrors({ general: result.message || "Failed to send OTP" });
      }
    } catch (err: unknown) {
      setErrors({ general: err instanceof Error ? err.message : "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) return setErrors({ otp: "OTP is required." });

    setLoading(true);
    try {
      const result = await verifyOtpLogin({ email, otp });
      if (result.success && result.token) {
        localStorage.setItem("token", result.token);
        alert("Login successful!");
        navigate("/dashboard");
      } else {
        setErrors({ general: result.message || "OTP verification failed" });
      }
    } catch (err: unknown) {
      setErrors({ general: err instanceof Error ? err.message : "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Left side form */}
      <div className="flex-1 flex flex-col justify-center px-6 md:px-16 h-full">
        <div className="mb-6">
          <img src={logo} alt="HD Logo" className="h-10" />
        </div>

        <h1 className="text-2xl font-semibold mb-2">Sign in</h1>
        <p className="text-gray-500 mb-6">Login with email OTP</p>

        {errors.general && <p className="text-red-500 text-sm mb-4">{errors.general}</p>}

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors({});
              }}
              className="w-full rounded-lg border px-3 py-3 text-sm border-gray-300"
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {otpSent && (
            <div>
              <label className="block text-sm text-gray-700">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full rounded-lg border px-3 py-3 text-sm border-gray-300"
                placeholder="Enter OTP"
              />
              {errors.otp && <p className="text-red-500 text-xs mt-1">{errors.otp}</p>}
            </div>
          )}

          {!otpSent ? (
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 text-white py-3 font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full rounded-lg bg-green-600 text-white py-3 font-medium hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify & Login"}
            </button>
          )}
        </div>

        <p className="mt-6 text-sm text-gray-600">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>

      {/* Right side image */}
      <div className="hidden md:flex md:w-1/2 bg-gray-50 items-center justify-center h-full">
        <img src={rightImage} alt="Illustration" className="h-full w-full object-cover" />
      </div>
    </div>
  );
}
