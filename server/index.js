import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import rateLimit from 'express-rate-limit';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:4173'],
}));
app.use(express.json());

// Rate limit: max 5 messages per 15 minutes per IP
const messageLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many messages sent. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify SMTP connection on startup
transporter.verify()
  .then(() => console.log('✅ SMTP connection verified'))
  .catch((err) => console.error('❌ SMTP connection failed:', err.message));

// POST /api/send-message
app.post('/api/send-message', messageLimiter, async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  if (message.length > 2000) {
    return res.status(400).json({ error: 'Message is too long (max 2000 characters).' });
  }

  try {
    await transporter.sendMail({
      from: `"Portfolio Anonymous" <${process.env.SMTP_USER}>`,
      to: process.env.RECEIVER_EMAIL || process.env.SMTP_USER,
      subject: '💬 New Anonymous Message from Portfolio',
      text: message.trim(),
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0f172a; border-radius: 12px; color: #e2e8f0;">
          <h2 style="color: #60a5fa; margin-bottom: 16px;">💬 New Anonymous Message</h2>
          <div style="background: #1e293b; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;">
            <p style="white-space: pre-wrap; line-height: 1.6; margin: 0; color: #cbd5e1;">${message.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
          </div>
          <p style="margin-top: 20px; font-size: 12px; color: #64748b;">
            Sent from your portfolio website • ${new Date().toLocaleString()}
          </p>
        </div>
      `,
    });

    return res.json({ success: true, message: 'Message sent successfully!' });
  } catch (err) {
    console.error('Email send error:', err);
    return res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
