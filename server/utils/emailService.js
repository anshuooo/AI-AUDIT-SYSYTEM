const nodemailer = require('nodemailer');

/**
 * Email Service Utility
 * Handles sending transactional confirmation emails to leads.
 */

const createTransporter = async () => {
  const hasSmtpCredentials = process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS;

  if (!hasSmtpCredentials) {
    const testAccount = await nodemailer.createTestAccount();
    console.log('📧 Using Ethereal test account for email delivery (development only).');
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true' || Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const buildSavingsHtml = ({ monthlySavings, yearlySavings }) => {
  if (!monthlySavings && !yearlySavings) return '';

  return `
    <section style="margin-top: 16px; padding: 16px; background: #f8fafc; border-radius: 12px;">
      <h3 style="margin: 0 0 12px; color: #0f172a;">Estimated Savings</h3>
      <ul style="margin: 0; padding-left: 20px; color: #334155;">
        ${monthlySavings ? `<li><strong>Monthly Savings:</strong> $${Number(monthlySavings).toFixed(2)}</li>` : ''}
        ${yearlySavings ? `<li><strong>Annual Savings:</strong> $${Number(yearlySavings).toFixed(2)}</li>` : ''}
      </ul>
    </section>
  `;
};

const sendConfirmationEmail = async ({ email, companyName, auditSummary, monthlySavings, yearlySavings, shareUrl }) => {
  try {
    const transporter = await createTransporter();
    const fromAddress = process.env.EMAIL_FROM || '"AI Audit System" <no-reply@aiaudit.com>';
    const normalizedName = companyName ? companyName : 'there';
    const summary = auditSummary || 'We have generated your AI audit report and identified optimization opportunities.';

    const savingsHtml = buildSavingsHtml({ monthlySavings, yearlySavings });
    const savingsText = monthlySavings || yearlySavings
      ? `\nEstimated Savings:\n${monthlySavings ? `- Monthly Savings: $${Number(monthlySavings).toFixed(2)}\n` : ''}${yearlySavings ? `- Annual Savings: $${Number(yearlySavings).toFixed(2)}\n` : ''}`
      : '';

    const textBody = `Hello ${normalizedName},\n\n` +
      `Thank you for submitting your AI audit request. We have recorded your submission and your audit summary is below.\n\n` +
      `${summary}\n` +
      `${savingsText}\n` +
      `Thank you for trusting AI Audit System. We’ll be in touch soon with the next steps.\n\n` +
      `If you’d like to share the report with your team, use: ${shareUrl || 'your report link will be available soon.'}\n\n` +
      `Best regards,\nAI Audit System Team`;

    const htmlBody = `
      <div style="font-family: Arial, Helvetica, sans-serif; color: #0f172a; line-height: 1.6;">
        <h2 style="color: #2563eb; margin-bottom: 8px;">Your AI Audit Confirmation</h2>
        <p>Hello <strong>${normalizedName}</strong>,</p>
        <p>Thank you for submitting your audit request. We successfully captured your lead and generated a summary of the estimated savings below.</p>
        <div style="margin-top: 16px; padding: 18px; background: #f8fafc; border-radius: 14px; border: 1px solid #e2e8f0;">
          <h3 style="margin-top: 0;">Audit Summary</h3>
          <p style="margin: 0; color: #475569;">${summary}</p>
        </div>
        ${savingsHtml}
        ${shareUrl ? `<p style="margin-top: 18px;">Share your report with your stakeholders using the link below:</p>
          <p style="margin: 0; color: #2563eb;"><a href="${shareUrl}" target="_blank" rel="noopener noreferrer">${shareUrl}</a></p>` : ''}
        <div style="margin-top: 24px; padding: 18px; background: #eef2ff; border-radius: 14px;">
          <p style="margin: 0; font-weight: 700; color: #1d4ed8;">Thank you for trusting AI Audit System. We’ll be in touch soon with the next steps.</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: fromAddress,
      to: email,
      subject: 'Your AI Audit Request Confirmation',
      text: textBody,
      html: htmlBody,
      replyTo: process.env.EMAIL_REPLY_TO || process.env.SMTP_USER || fromAddress,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Confirmation email sent to', email, 'messageId:', info.messageId);

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log('📧 Email preview URL (development):', previewUrl);
    }

    return true;
  } catch (error) {
    console.error('❌ Failed to send confirmation email to', email, '-', error.message);
    return false;
  }
};

module.exports = { sendConfirmationEmail };
