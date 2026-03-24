// c:\Athiva\Hackathon\backend\src\utils\emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const BRAND_PRIMARY = '#2563EB';
const BRAND_BG = '#F8FAFC';
const BRAND_DARK = '#0F172A';
const BRAND_SECONDARY = '#64748B';
const BRAND_BORDER = '#E5E7EB';

const getBaseTemplate = (content, title, accentColor = BRAND_PRIMARY) => `
  <div style="font-family:'Inter','Segoe UI',Tahoma,Geneva,Verdana,sans-serif; max-width:600px; margin:0 auto; background-color:${BRAND_BG}; padding:40px 20px;">
    <div style="background-color:#ffffff; border:1px solid ${BRAND_BORDER}; border-radius:24px; overflow:hidden; box-shadow:0 4px 6px -1px rgba(0,0,0,0.05);">
      <div style="padding:40px 40px 0; text-align:center;">
        <div style="display:inline-block; background-color:${accentColor}; width:56px; height:56px; border-radius:16px; line-height:56px; font-size:24px; font-weight:900; color:#ffffff; margin-bottom:24px; box-shadow:0 10px 15px -3px rgba(37,99,235,0.2);">A</div>
        <h1 style="color:${BRAND_DARK}; font-size:24px; font-weight:800; margin:0 0 12px; tracking-tight:-0.02em;">${title}</h1>
      </div>
      <div style="padding:0 40px 40px;">
        ${content}
      </div>
      <div style="background-color:#F1F5F9; padding:24px 40px; text-align:center; border-top:1px solid ${BRAND_BORDER};">
        <p style="color:${BRAND_SECONDARY}; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; margin:0;">Athiva Corporate Innovation Hub &bull; Confidential Protocol</p>
      </div>
    </div>
    <div style="text-align:center; margin-top:24px;">
       <p style="color:${BRAND_SECONDARY}; font-size:12px;">&copy; 2026 Athiva Technology and Management Services. All rights reserved.</p>
    </div>
  </div>
`;

/**
 * Send a password reset email with a clickable link.
 */
const sendResetEmail = async (toEmail, resetToken) => {
  const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

  const content = `
    <p style="color:${BRAND_SECONDARY}; font-size:14px; line-height:1.6; text-align:center; margin-bottom:32px;">
      An administrative override has been authorized for your corporate account. Use the secure channel below to synchronize your new security key.
    </p>
    <div style="text-align:center; margin-bottom:32px;">
      <a href="${resetUrl}" style="display:inline-block; background-color:${BRAND_PRIMARY}; color:#ffffff; font-weight:700; padding:16px 40px; border-radius:14px; text-decoration:none; font-size:14px; box-shadow:0 4px 6px rgba(37,99,235,0.2);">Reset Identity Key</a>
    </div>
    <p style="color:${BRAND_SECONDARY}; font-size:12px; text-align:center; margin:0;">
      This secondary authentication link will expire in <strong style="color:${BRAND_DARK};">10 minutes</strong> for security compliance.
    </p>
  `;

  const mailOptions = {
    from: `"Athiva Security" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: 'Identity Restoration Protocol – Athiva',
    html: getBaseTemplate(content, 'Authentication Recalibration')
  };

  await transporter.sendMail(mailOptions);
};

/**
 * Send an email to the judge when they are invited to an event.
 */
const sendJudgeInviteEmail = async (toEmail, hackathonTitle) => {
  const content = `
    <p style="color:${BRAND_SECONDARY}; font-size:15px; line-height:1.7; text-align:center; margin-bottom:32px;">
      You have been formally invited to the <strong style="color:${BRAND_DARK}; text-decoration:underline; decoration-color:${BRAND_PRIMARY}20;">Evaluation Committee</strong> for the upcoming <strong>${hackathonTitle}</strong> innovation cycle.
    </p>
    <div style="background-color:${BRAND_BG}; border:1px solid ${BRAND_BORDER}; border-radius:16px; padding:20px; margin-bottom:32px; text-align:center;">
       <div style="color:${BRAND_SECONDARY}; font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:4px;">Assigned Track</div>
       <div style="color:${BRAND_DARK}; font-size:18px; font-weight:800;">${hackathonTitle}</div>
    </div>
    <div style="text-align:center;">
      <a href="http://localhost:5173/dashboard" style="display:inline-block; background-color:${BRAND_PRIMARY}; color:#ffffff; font-weight:700; padding:16px 40px; border-radius:14px; text-decoration:none; font-size:14px;">Access Committee Dashboard</a>
    </div>
  `;

  const mailOptions = {
    from: `"Athiva Registry" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: `Panel Appointment Notice – ${hackathonTitle}`,
    html: getBaseTemplate(content, 'Operational Engagement Invite')
  };
  await transporter.sendMail(mailOptions);
};

/**
 * Send an email to participants when the event starts.
 */
const sendHackathonStartEmail = async (toEmail, hackathonTitle) => {
  const content = `
    <p style="color:${BRAND_SECONDARY}; font-size:15px; line-height:1.7; text-align:center; margin-bottom:32px;">
      Innovation protocols for <strong>${hackathonTitle}</strong> have been officially activated. The submission registry is now accepting project transmissions.
    </p>
    <div style="text-align:center;">
      <a href="http://localhost:5173/dashboard" style="display:inline-block; background-color:${BRAND_PRIMARY}; color:#ffffff; font-weight:700; padding:16px 40px; border-radius:14px; text-decoration:none; font-size:14px;">Initiate Project Build</a>
    </div>
  `;

  const mailOptions = {
    from: `"Athiva Pulse" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: `Protocol Activated: ${hackathonTitle} is Live`,
    html: getBaseTemplate(content, 'Event Cycle Commencement')
  };
  await transporter.sendMail(mailOptions);
};

/**
 * Send an email alert for upcoming submission deadlines.
 */
const sendDeadlineAlertEmail = async (toEmail, hackathonTitle, hoursRemaining) => {
  const content = `
    <p style="color:${BRAND_SECONDARY}; font-size:15px; line-height:1.7; text-align:center; margin-bottom:32px;">
      Attention: The submission window for <strong>${hackathonTitle}</strong> is reaching sunset. Final project commits must be synchronized within the next <strong style="color:#EF4444;">${hoursRemaining} hours</strong>.
    </p>
    <div style="text-align:center;">
      <a href="http://localhost:5173/dashboard" style="display:inline-block; background-color:#EF4444; color:#ffffff; font-weight:700; padding:16px 40px; border-radius:14px; text-decoration:none; font-size:14px;">Synchronize Final Commit</a>
    </div>
  `;

  const mailOptions = {
    from: `"Athiva Vigil" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: `URGENT: ${hoursRemaining} Hours to Protocol Sunset`,
    html: getBaseTemplate(content, 'Submission Window Warning', '#EF4444')
  };
  await transporter.sendMail(mailOptions);
};

/**
 * Send an email to the winners of the hackathon.
 */
const sendWinnerEmail = async (toEmail, hackathonTitle, rank) => {
  const content = `
    <p style="color:${BRAND_SECONDARY}; font-size:15px; line-height:1.7; text-align:center; margin-bottom:32px;">
      Excellence recognized. Your submission for <strong>${hackathonTitle}</strong> has secured a distinguished position in the global rankings.
    </p>
    <div style="background-color:#F0FDF4; border:1px solid #BBF7D0; border-radius:16px; padding:24px; margin-bottom:32px; text-align:center;">
       <div style="color:#16A34A; font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:4px;">Official Standing</div>
       <div style="color:#166534; font-size:32px; font-weight:900;">Rank #${rank}</div>
    </div>
    <div style="text-align:center;">
      <a href="http://localhost:5173/dashboard" style="display:inline-block; background-color:#10B981; color:#ffffff; font-weight:700; padding:16px 40px; border-radius:14px; text-decoration:none; font-size:14px;">View Official Results</a>
    </div>
  `;

  const mailOptions = {
    from: `"Athiva Excellence" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: `Achievement Unlocked: Rank #${rank} Verified`,
    html: getBaseTemplate(content, 'Innovation Excellence Award', '#10B981')
  };
  await transporter.sendMail(mailOptions);
};

/**
 * Send a thank you email after the event.
 */
const sendThankYouEmail = async (toEmail, hackathonTitle, role) => {
  const content = `
    <p style="color:${BRAND_SECONDARY}; font-size:15px; line-height:1.7; text-align:center; margin-bottom:32px;">
      The <strong>${hackathonTitle}</strong> cycle has concluded. On behalf of the administration, we appreciate your engagement as a <strong>${role}</strong>.
    </p>
    <p style="color:${BRAND_SECONDARY}; font-size:13px; text-align:center;">
      Your contribution strengthens the corporate innovation index. We look forward to your participation in the next module.
    </p>
  `;

  const mailOptions = {
    from: `"Athiva Registry" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: `Cycle Conclusion: ${hackathonTitle}`,
    html: getBaseTemplate(content, 'Engagement Appreciation')
  };
  await transporter.sendMail(mailOptions);
};

/**
 * Send a welcome email indicating successful registration.
 */
const sendWelcomeEmail = async (toEmail, userName, systemRole) => {
  const content = `
    <p style="color:${BRAND_SECONDARY}; font-size:15px; line-height:1.7; text-align:center; margin-bottom:32px;">
      Welcome to the network, <strong style="color:${BRAND_DARK};">${userName}</strong>. Your account has been provisioned with <strong style="color:${BRAND_PRIMARY};">${systemRole.toUpperCase()}</strong> authority.
    </p>
    <div style="text-align:center;">
      <a href="http://localhost:5173/login" style="display:inline-block; background-color:${BRAND_PRIMARY}; color:#ffffff; font-weight:700; padding:16px 40px; border-radius:14px; text-decoration:none; font-size:14px;">Establish Connection</a>
    </div>
  `;

  const mailOptions = {
    from: `"Athiva Security" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: `Identity Provisioned: ${systemRole.toUpperCase()} Level`,
    html: getBaseTemplate(content, 'Clearance Authorized')
  };
  await transporter.sendMail(mailOptions);
};

module.exports = { 
  sendResetEmail, 
  sendJudgeInviteEmail, 
  sendHackathonStartEmail, 
  sendDeadlineAlertEmail, 
  sendWinnerEmail, 
  sendThankYouEmail,
  sendWelcomeEmail
};
