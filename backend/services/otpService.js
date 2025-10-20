import nodemailer from "nodemailer";

const otpStore = new Map(); // temporary in-memory store

// Generate 6-digit OTP
export function generateOtp(email) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(email, { otp, expires: Date.now() + 5 * 60 * 1000 }); // valid 5 minutes
  console.log(`✅ OTP for ${email}: ${otp}`); // log for debugging
  return otp;
}

// Verify OTP
export function verifyStoredOtp(email, otp) {
  const record = otpStore.get(email);
  if (!record) return false;
  if (record.otp !== otp) return false;
  if (Date.now() > record.expires) return false;
  otpStore.delete(email); // one-time use
  return true;
}

// Send OTP via Email - ENHANCED GMAIL CONFIG
export async function sendOtpEmail(email, otp) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Use app password, not regular password
      },
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,
      socketTimeout: 10000,
      tls: {
        rejectUnauthorized: false // Might help with certificate issues
      }
    });

    // Verify connection configuration
    await transporter.verify();
    console.log("✅ SMTP connection verified");

    const info = await transporter.sendMail({
      from: `"Notes App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
      html: `<p>Your OTP is <strong>${otp}</strong>. It will expire in 5 minutes.</p>`
    });

    console.log("✅ OTP email sent:", info.response);
    return info;
  } catch (err) {
    console.error("❌ Error sending OTP email:", err.message);
    console.error("❌ Full error:", err);
    throw err;
  }
}