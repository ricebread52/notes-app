import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import rightImage from "../assets/images/left-column.png";
import { sendOtp, verifyOtp } from "../lib/api/auth";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", dob: "" });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; dob?: string; otp?: string; general?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined, general: undefined }));
  };

  const handleSendOtp = async () => {
    if (!formData.name.trim()) return setErrors({ name: "Name is required." });
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
      return setErrors({ email: "Valid email is required." });
    if (!formData.dob.trim()) return setErrors({ dob: "Date of birth is required." });

    setLoading(true);
    try {
      // ✅ FIX: sendOtp now takes an object
      const result = await sendOtp({ email: formData.email });
      if (result.success) {
        setOtpSent(true);
      } else {
        setErrors({ general: result.message || "Failed to send OTP" });
      }
    } catch (err: any) {
      setErrors({ general: err.message || "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) return setErrors({ otp: "OTP is required." });

    setLoading(true);
    try {
      const result = await verifyOtp({
        name: formData.name,
        email: formData.email,
        dob: formData.dob,
        otp,
      });

      if (result?.success || result?.message?.toLowerCase().includes("success")) {
        alert("Signup successful! Redirecting to login...");
        navigate("/login");
      } else {
        setErrors({ general: result.message || "OTP verification failed" });
      }
    } catch (err: any) {
      setErrors({ general: err.message || "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Left side signup form */}
      <div className="flex-1 flex flex-col justify-center px-6 md:px-16 h-full">
        <div className="mb-6">
          <img src={logo} alt="HD Logo" className="h-10" />
        </div>

        <h1 className="text-2xl font-semibold mb-2">Sign up</h1>
        <p className="text-gray-500 mb-6">Create your account with email OTP</p>

        {errors.general && <p className="text-red-500 text-sm mb-4">{errors.general}</p>}

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-3 text-sm border-gray-300"
              placeholder="Enter your name"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-3 text-sm border-gray-300"
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-700">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-3 text-sm border-gray-300"
            />
            {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
          </div>

          {otpSent && (
            <div>
              <label className="block text-sm text-gray-700">Enter OTP</label>
              <input
                type="text"
                name="otp"
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
              {loading ? "Verifying..." : "Verify & Sign Up"}
            </button>
          )}
        </div>

        <p className="mt-6 text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Sign in
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
