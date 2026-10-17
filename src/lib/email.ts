/**
 * email.ts — SMTP / Nodemailer email dispatch helper.
 * Supports:
 *  - Gmail (with App Password)
 *  - Brevo / SendGrid / Mailgun / Amazon SES
 *  - Custom SMTP Server
 */

import nodemailer from 'nodemailer';
import { config } from './config';

export interface SendEmailOptions {
  to: string;
  replyTo?: string;
  subject: string;
  text?: string;
  html?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  if (transporter) return transporter;

  const { host, port, user, pass } = config.smtp;
  if (!host || !user || !pass) {
    return null;
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for 587 / other ports
    auth: {
      user,
      pass,
    },
  });

  return transporter;
}

export async function sendEmail({ to, replyTo, subject, text, html }: SendEmailOptions): Promise<SendEmailResult> {
  const mailer = getTransporter();

  if (!mailer) {
    console.log(`\n========================================`);
    console.log(`[SMTP DEV EMAIL DISPATCH] (No SMTP configured)`);
    console.log(`To: ${to}`);
    if (replyTo) console.log(`Reply-To: ${replyTo}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content:\n${text || html}`);
    console.log(`========================================\n`);
    return {
      success: true,
      messageId: 'dev-console-email',
    };
  }

  try {
    const info = await mailer.sendMail({
      from: config.smtp.from || 'Find2Stay <noreply@find2stay.in>',
      to,
      replyTo,
      subject,
      text: text || '',
      html: html || text,
    });

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (err: any) {
    console.error('[SMTP Send Error]:', err?.message || err);
    return {
      success: false,
      error: err?.message || 'Failed to dispatch email via SMTP',
    };
  }
}
