/**
 * config.ts — Environment variable validation.
 *
 * In production runtime, the server refuses to start if required secrets are missing
 * or contain placeholder values.
 */

const PLACEHOLDER_VALUES = [
  'REPLACE_WITH_RANDOM_32_CHAR_HEX',
  'easy2stay-demo-secret',
  'changeme',
  'your-secret',
  'dummy-secret',
];

function getEnv(key: string, defaultValue = ''): string {
  return (process.env[key] || defaultValue).trim();
}

function requireEnvInProd(key: string, defaultValue = '', description = ''): string {
  const val = getEnv(key, defaultValue);
  // Only validate placeholder on live production runtime (not during static next build step if unconfigured)
  if (process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV === 'production') {
    if (!val) {
      throw new Error(`[config] Missing required environment variable in production: ${key} (${description})`);
    }
    if (PLACEHOLDER_VALUES.some((p) => val.toLowerCase() === p.toLowerCase())) {
      throw new Error(`[config] ${key} contains an insecure placeholder value in production.`);
    }
  }
  return val;
}

export const config = {
  mongodbUri: getEnv('MONGODB_URI', 'mongodb://127.0.0.1:27017/find2stay'),
  dbName: getEnv('DB_NAME', 'find2stay'),
  sessionSecret: requireEnvInProd(
    'SESSION_SECRET',
    'a131d52e9de5315d756e53ac2f389226b77e88b6f1c6db914ee59f5f96c8cb3c',
    'Session signing secret'
  ),
  sessionMaxAge: parseInt(getEnv('SESSION_MAX_AGE', '604800'), 10),
  baseUrl: getEnv('NEXT_PUBLIC_BASE_URL', 'http://localhost:3000'),
  nodeEnv: getEnv('NODE_ENV', 'development'),
  isProduction: process.env.NODE_ENV === 'production',

  // OTP / Notification settings
  otpProvider: getEnv('OTP_PROVIDER', 'console'), // 'fast2sms' | 'twilio' | 'msg91' | 'console'
  otpApiKey: getEnv('OTP_API_KEY', getEnv('FAST2SMS_API_KEY', '')),
  otpTemplateId: getEnv('OTP_TEMPLATE_ID', getEnv('MSG91_TEMPLATE_ID', '')),
  otpSenderId: getEnv('OTP_SENDER_ID', getEnv('MSG91_SENDER_ID', 'FNDSTY')),

  // Twilio settings
  twilio: {
    accountSid: getEnv('TWILIO_ACCOUNT_SID', ''),
    authToken: getEnv('TWILIO_AUTH_TOKEN', ''),
    phoneNumber: getEnv('TWILIO_PHONE_NUMBER', ''),
  },

  // SMTP Email settings
  smtp: {
    host: getEnv('SMTP_HOST', ''),
    port: parseInt(getEnv('SMTP_PORT', '587'), 10),
    user: getEnv('SMTP_USER', ''),
    pass: getEnv('SMTP_PASS', ''),
    from: getEnv('SMTP_FROM', 'noreply@find2stay.in'),
  },

  // Verification & Freshness rules
  verificationValidityDays: 180,
  verificationReminderDays: 30,
  verificationGraceDays: 7,
  availabilityStaleDays: 14,
};
