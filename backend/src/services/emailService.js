import nodemailer from 'nodemailer';

/**
 * Create Nodemailer Transporter instance from environment variables
 */
const createTransporter = () => {
  const host = process.env.MAIL_HOST || 'smtp.gmail.com';
  const port = Number(process.env.MAIL_PORT) || 587;
  const user = process.env.MAIL_USER || 'milindpatel1432@gmail.com';
  const pass = process.env.MAIL_PASSWORD || '';

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

/**
 * Generate a professional, dark-mode themed HTML template for form submissions
 */
const generateFormSubmissionHtml = ({
  formName = 'Website Form Submission',
  name = 'N/A',
  email = 'N/A',
  phone = 'N/A',
  subject = 'N/A',
  message = '',
  pageUrl = '',
  userIp = '',
  userAgent = '',
  createdAt = new Date().toLocaleString(),
}) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${formName} - GameHub Notification</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #050811;
      color: #e2e8f0;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 650px;
      margin: 0 auto;
      background-color: #0b0f1d;
      border: 1px solid #1e293b;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }
    .header {
      background: linear-gradient(135deg, #0b0f1d 0%, #1e1b4b 100%);
      border-bottom: 2px solid #00e5ff;
      padding: 24px 32px;
      text-align: left;
    }
    .header h1 {
      margin: 0;
      color: #00e5ff;
      font-size: 22px;
      font-weight: 800;
      letter-spacing: 0.5px;
    }
    .header p {
      margin: 4px 0 0 0;
      color: #94a3b8;
      font-size: 13px;
    }
    .badge {
      display: inline-block;
      background-color: rgba(0, 229, 255, 0.15);
      border: 1px solid rgba(0, 229, 255, 0.4);
      color: #00e5ff;
      font-size: 11px;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 20px;
      text-transform: uppercase;
      margin-bottom: 10px;
    }
    .body {
      padding: 32px;
      text-align: left;
    }
    .field-group {
      margin-bottom: 20px;
    }
    .label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #64748b;
      font-weight: 700;
      margin-bottom: 4px;
    }
    .value {
      font-size: 15px;
      color: #f8fafc;
      font-weight: 600;
    }
    .message-box {
      background-color: #050811;
      border: 1px solid #1e293b;
      border-left: 4px solid #00e5ff;
      border-radius: 8px;
      padding: 16px;
      font-size: 14px;
      line-height: 1.6;
      color: #cbd5e1;
      white-space: pre-wrap;
      margin-top: 6px;
    }
    .meta-table {
      width: 100%;
      margin-top: 28px;
      border-top: 1px solid #1e293b;
      padding-top: 20px;
      font-size: 12px;
      color: #64748b;
    }
    .meta-table td {
      padding: 4px 0;
    }
    .footer {
      background-color: #050811;
      border-top: 1px solid #1e293b;
      padding: 16px 32px;
      text-align: center;
      font-size: 12px;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge">${formName}</div>
      <h1>New Message Received</h1>
      <p>GameHub Automated Notification System</p>
    </div>
    
    <div class="body">
      <div style="display: flex; gap: 20px; flex-wrap: wrap;">
        <div class="field-group" style="flex: 1; min-width: 200px;">
          <div class="label">Sender Name</div>
          <div class="value">${name}</div>
        </div>
        <div class="field-group" style="flex: 1; min-width: 200px;">
          <div class="label">Sender Email</div>
          <div class="value"><a href="mailto:${email}" style="color: #00e5ff; text-decoration: none;">${email}</a></div>
        </div>
      </div>

      <div style="display: flex; gap: 20px; flex-wrap: wrap;">
        <div class="field-group" style="flex: 1; min-width: 200px;">
          <div class="label">Phone Number</div>
          <div class="value">${phone || 'Not Provided'}</div>
        </div>
        <div class="field-group" style="flex: 1; min-width: 200px;">
          <div class="label">Subject / Topic</div>
          <div class="value">${subject || 'N/A'}</div>
        </div>
      </div>

      <div class="field-group" style="margin-top: 10px;">
        <div class="label">Message Content</div>
        <div class="message-box">${message || 'No message provided.'}</div>
      </div>

      <table class="meta-table">
        <tr>
          <td><strong>Submission Time:</strong> ${createdAt}</td>
          <td><strong>Form Page:</strong> ${pageUrl || '/'}</td>
        </tr>
        ${userIp ? `<tr><td><strong>IP Address:</strong> ${userIp}</td><td><strong>User Agent:</strong> ${userAgent.substring(0, 40)}...</td></tr>` : ''}
      </table>
    </div>

    <div class="footer">
      This notification was automatically sent by <strong>GameHub Platform</strong> to <a href="mailto:milindpatel1432@gmail.com" style="color: #00e5ff;">milindpatel1432@gmail.com</a>.
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * Send Form Submission Email Notification to Admin (milindpatel1432@gmail.com)
 */
export const sendFormSubmissionEmail = async (formData) => {
  const recipient = process.env.MAIL_TO || 'milindpatel1432@gmail.com';
  const senderFrom = process.env.MAIL_FROM || `"GameHub Support" <${process.env.MAIL_USER || 'milindpatel1432@gmail.com'}>`;
  
  const formName = formData.formName || 'Website Form Submission';
  const subject = `[GameHub ${formName}] ${formData.subject || formData.name || 'New Submission'}`;

  const htmlContent = generateFormSubmissionHtml(formData);

  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: senderFrom,
      to: recipient,
      replyTo: formData.email && formData.email !== 'N/A' ? formData.email : undefined,
      subject,
      html: htmlContent,
      text: `[${formName}]\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nSubject: ${formData.subject}\nMessage: ${formData.message}`,
    };

    console.log(`[EmailService] Sending ${formName} notification email to ${recipient}...`);
    const info = await transporter.sendMail(mailOptions);
    console.log(`[EmailService] Email sent successfully! MessageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[EmailService] Failed to send email via SMTP:`, error.message);
    // Non-blocking return so the application/API does not crash if SMTP is not configured or fails
    return { success: false, error: error.message };
  }
};

/**
 * Helper signature for future automated emails (e.g., Welcome Email)
 */
export const sendWelcomeEmail = async (user) => {
  console.log(`[EmailService] Placeholder: sendWelcomeEmail for ${user?.email}`);
  return { success: true };
};

/**
 * Helper signature for future order confirmation emails
 */
export const sendOrderConfirmationEmail = async (order, user) => {
  console.log(`[EmailService] Placeholder: sendOrderConfirmationEmail for order ${order?.orderNumber}`);
  return { success: true };
};

export default {
  sendFormSubmissionEmail,
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
};
