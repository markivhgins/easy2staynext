/**
 * sms.ts — Multi-provider SMS dispatch helper.
 * Supports:
 *  1. Fast2SMS (Standard Indian quick OTP & SMS)
 *  2. Twilio (Global SMS)
 *  3. MSG91 (Indian DLT & OTP flow)
 *  4. Console / Localhost (Fallback when no keys are provided)
 */

import { config } from './config';

export interface SendSmsResult {
  success: boolean;
  provider: string;
  messageId?: string;
  error?: string;
}

export async function sendOtpSms(phone: string, otp: string): Promise<SendSmsResult> {
  const provider = (config.otpProvider || 'console').toLowerCase();
  const clean10Digits = phone.replace(/\D/g, '').slice(-10);

  // 1. Fast2SMS (Instant & Most Popular in India)
  if (provider === 'fast2sms' || (!provider.includes('twilio') && !provider.includes('msg91') && config.otpApiKey)) {
    try {
      const apiKey = config.otpApiKey;
      if (!apiKey) {
        throw new Error('FAST2SMS_API_KEY is not configured in .env.local');
      }

      // Fast2SMS Quick OTP route
      const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          authorization: apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          variables_values: otp,
          route: 'otp',
          numbers: clean10Digits,
        }),
      });

      const data = await response.json();
      if (data && data.return === true) {
        return {
          success: true,
          provider: 'fast2sms',
          messageId: data.request_id || 'sent',
        };
      } else {
        console.warn('[Fast2SMS Warning]:', data?.message || 'Failed to dispatch SMS');
        return {
          success: false,
          provider: 'fast2sms',
          error: data?.message || 'SMS delivery failed',
        };
      }
    } catch (err: any) {
      console.error('[Fast2SMS Error]:', err?.message || err);
      return { success: false, provider: 'fast2sms', error: err?.message };
    }
  }

  // 2. Twilio (Worldwide SMS)
  if (provider === 'twilio' || config.twilio.accountSid) {
    try {
      const { accountSid, authToken, phoneNumber } = config.twilio;
      if (!accountSid || !authToken || !phoneNumber) {
        throw new Error('Twilio credentials (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER) are incomplete.');
      }

      const formattedTo = phone.startsWith('+') ? phone : `+91${clean10Digits}`;
      const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
      const authHeader = 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64');

      const params = new URLSearchParams();
      params.append('To', formattedTo);
      params.append('From', phoneNumber);
      params.append('Body', `Your Find2Stay verification code is: ${otp}. Valid for 5 minutes. Do not share this OTP with anyone.`);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      const data = await response.json();
      if (response.ok && data.sid) {
        return {
          success: true,
          provider: 'twilio',
          messageId: data.sid,
        };
      } else {
        console.warn('[Twilio Warning]:', data.message);
        return {
          success: false,
          provider: 'twilio',
          error: data.message || 'Twilio send failed',
        };
      }
    } catch (err: any) {
      console.error('[Twilio Error]:', err?.message || err);
      return { success: false, provider: 'twilio', error: err?.message };
    }
  }

  // 3. MSG91
  if (provider === 'msg91' && config.otpApiKey) {
    try {
      const authKey = config.otpApiKey;
      const templateId = config.otpTemplateId;
      const formattedTo = `91${clean10Digits}`;

      let url = `https://control.msg91.com/api/v5/otp?mobile=${formattedTo}&authkey=${authKey}&otp=${otp}`;
      if (templateId) {
        url += `&template_id=${templateId}`;
      }

      const response = await fetch(url, { method: 'POST' });
      const data = await response.json();

      if (data && (data.type === 'success' || data.message === 'OTP sent successfully')) {
        return { success: true, provider: 'msg91', messageId: data.message };
      } else {
        return { success: false, provider: 'msg91', error: data.message };
      }
    } catch (err: any) {
      return { success: false, provider: 'msg91', error: err?.message };
    }
  }

  // 4. Default Local / Console Dispatch
  return {
    success: true,
    provider: 'console',
    messageId: 'local-console-debug',
  };
}
