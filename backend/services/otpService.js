import { Resend } from 'resend';

const otpStore = new Map();
const resend = new Resend(process.env.RESEND_API_KEY);

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

// Send OTP via Resend
export async function sendOtpEmail(email, otp) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Notes App <onboarding@resend.dev>',
      to: email,
      subject: 'Your OTP Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Your OTP Code</h2>
          <p>Your One-Time Password for Notes App is:</p>
          <div style="font-size: 32px; font-weight: bold; color: #2563eb; text-align: center; margin: 20px 0;">
            ${otp}
          </div>
          <p>This code will expire in <strong>5 minutes</strong>.</p>
          <p style="color: #6b7280; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
        </div>
      `,
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`
    });

    if (error) {
      console.error('❌ Resend error:', error);
      throw error;
    }

    console.log('✅ OTP email sent via Resend:', data?.id);
    return data;
  } catch (err) {
    console.error('❌ Error sending OTP email:', err.message);
    throw err;
  }
}