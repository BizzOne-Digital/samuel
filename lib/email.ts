import nodemailer from 'nodemailer';

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}

function getSmtpConfig() {
  return {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
  };
}

export function isEmailConfigured(): boolean {
  const { user, pass } = getSmtpConfig();
  return Boolean(user && pass);
}

function createTransporter() {
  const config = getSmtpConfig();

  if (!config.user || !config.pass) {
    throw new Error('SMTP is not configured. Set SMTP_USER and SMTP_PASS in environment variables.');
  }

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });
}

export async function sendEmail({ to, subject, text, html, replyTo }: SendEmailOptions) {
  const config = getSmtpConfig();
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"Samuel Louis-Jean Publications" <${config.from}>`,
    to: Array.isArray(to) ? to.join(', ') : to,
    subject,
    text,
    html: html || text.replace(/\n/g, '<br>'),
    replyTo,
  });
}

export function getAdminEmail(): string {
  return process.env.SMTP_TO || process.env.SMTP_USER || 'dr.louisjean@gmail.com';
}
