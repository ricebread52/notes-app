import nodemailer from "nodemailer";

const otpStore = new Map();

export function generateOtp(email) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(email, { otp, expires: Date.now() + 5 * 60 * 1000 });
  console.log(`✅ OTP for ${email}: ${otp}`);
  return otp;
}

export function verifyStoredOtp(email, otp) {
  const record = otpStore.get(email);
  if (!record) return false;
  if (record.otp !== otp) return false;
  if (Date.now() > record.expires) return false;
  otpStore.delete(email);
  return true;
}

export async function sendOtpEmail(email, otp) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465, // Try port 465 with SSL
      secure: true, // Use SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 15000, // Increased timeout
    });

    console.log("🔄 Attempting to send email...");
    
    const info = await transporter.sendMail({
      from: `"Notes App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
      html: `<p>Your OTP is <strong>${otp}</strong>. It will expire in 5 minutes.</p>`
    });

    console.log("✅ OTP email sent successfully:", info.messageId);
    return info;
  } catch (err) {
    console.error("❌ Gmail failed:", err.message);
    
    // FALLBACK: Log OTP and don't throw error
    console.log(`📧 OTP for ${email}: ${otp} - Email failed, but OTP is valid`);
    return { message: "OTP logged due to email failure" };
  }
}