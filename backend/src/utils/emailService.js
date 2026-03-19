const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

/**
 * Send a password reset email with a clickable link.
 * @param {string} toEmail - Recipient email
 * @param {string} resetToken - Unhashed reset token
 */
const sendResetEmail = async (toEmail, resetToken) => {
  const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

  const mailOptions = {
    from: `"Athiva Hack" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: 'Password Reset – Athiva Hack',
    html: `
      <div style="font-family:'Inter',Arial,sans-serif;max-width:520px;margin:0 auto;background:#0a0a0a;border:1px solid #1f1f1f;border-radius:16px;overflow:hidden;">
        <div style="padding:32px 32px 0;text-align:center;">
          <div style="display:inline-block;background:#A3FF12;width:48px;height:48px;border-radius:12px;line-height:48px;font-size:22px;font-weight:900;color:#000;margin-bottom:16px;">A</div>
          <h1 style="color:#fff;font-size:22px;font-weight:800;margin:0 0 8px;">Password Reset Approved</h1>
          <p style="color:#888;font-size:14px;margin:0;">An administrator has approved your recovery request.</p>
        </div>
        <div style="padding:24px 32px 32px;">
          <p style="color:#aaa;font-size:13px;line-height:1.6;">Click the button below to set a new password. This link expires in <strong style="color:#A3FF12;">10 minutes</strong>.</p>
          <div style="text-align:center;margin:24px 0;">
            <a href="${resetUrl}" style="display:inline-block;background:#A3FF12;color:#000;font-weight:800;padding:14px 36px;border-radius:999px;text-decoration:none;font-size:14px;">Reset Password</a>
          </div>
          <p style="color:#555;font-size:11px;text-align:center;">If the button doesn't work, copy this URL:<br/><a href="${resetUrl}" style="color:#A3FF12;word-break:break-all;">${resetUrl}</a></p>
        </div>
        <div style="background:#050505;padding:16px 32px;text-align:center;border-top:1px solid #1f1f1f;">
          <p style="color:#444;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin:0;">Athiva Hack &bull; Secure Access Recovery</p>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
  console.log(`Reset email sent to ${toEmail}`);
};

/**
 * Send an email to the judge when their request is accepted or rejected.
 */
const sendJudgeStatusEmail = async (toEmail, hackathonTitle, status) => {
  const isApproved = status === 'approved';
  const mailOptions = {
    from: `"Athiva Hack" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: `Judge Request ${status === 'approved' ? 'Approved' : 'Update'} – ${hackathonTitle}`,
    html: `
      <div style="font-family:'Inter',Arial,sans-serif;max-width:520px;margin:0 auto;background:#0a0a0a;border:1px solid #1f1f1f;border-radius:16px;overflow:hidden;">
        <div style="padding:32px;text-align:center;">
          <div style="display:inline-block;background:${isApproved ? '#A3FF12' : '#EF4444'};width:48px;height:48px;border-radius:12px;line-height:48px;font-size:22px;font-weight:900;color:#000;margin-bottom:16px;">${isApproved ? '✓' : '!'}</div>
          <h1 style="color:#fff;font-size:22px;font-weight:800;margin:0 0 8px;">Request ${isApproved ? 'Approved' : 'Rejected'}</h1>
          <p style="color:#888;font-size:14px;">Event: <strong style="color:#fff">${hackathonTitle}</strong></p>
        </div>
        <div style="padding:0 32px 32px;">
          <p style="color:#aaa;font-size:14px;line-height:1.6;text-align:center;">
            ${isApproved 
              ? `Congratulations! You have been selected as a judge for the <strong>${hackathonTitle}</strong>. You can now access the evaluation dashboard.`
              : `Thank you for your interest in judging <strong>${hackathonTitle}</strong>. Unfortunately, we cannot accommodate your request at this time.`
            }
          </p>
          ${isApproved ? `
          <div style="text-align:center;margin:24px 0;">
            <a href="http://localhost:5173/dashboard" style="display:inline-block;background:#A3FF12;color:#000;font-weight:800;padding:14px 36px;border-radius:999px;text-decoration:none;font-size:14px;">Go to Dashboard</a>
          </div>
          ` : ''}
        </div>
        <div style="background:#050505;padding:16px 32px;text-align:center;border-top:1px solid #1f1f1f;">
          <p style="color:#444;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin:0;">Athiva Hack &bull; Internal Hackathon Platform</p>
        </div>
      </div>
    `
  };
  await transporter.sendMail(mailOptions);
};

/**
 * Send an email to participants when the event starts.
 */
const sendHackathonStartEmail = async (toEmail, hackathonTitle) => {
  const mailOptions = {
    from: `"Athiva Hack" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: `🚀 The Event has Started: ${hackathonTitle}`,
    html: `
      <div style="font-family:'Inter',Arial,sans-serif;max-width:520px;margin:0 auto;background:#0a0a0a;border:1px solid #1f1f1f;border-radius:16px;overflow:hidden;">
        <div style="padding:32px;text-align:center;">
          <div style="font-size:40px;margin-bottom:16px;">🚀</div>
          <h1 style="color:#fff;font-size:22px;font-weight:800;margin:0 0 8px;">It's Go Time!</h1>
          <p style="color:#888;font-size:14px;">Hackathon: <strong style="color:#A3FF12">${hackathonTitle}</strong> is now live.</p>
        </div>
        <div style="padding:0 32px 32px;">
          <p style="color:#aaa;font-size:14px;line-height:1.6;text-align:center;">The submission portal is now open. Put your skills to the test and build something amazing. Good luck!</p>
          <div style="text-align:center;margin:24px 0;">
            <a href="http://localhost:5173/dashboard" style="display:inline-block;background:#A3FF12;color:#000;font-weight:800;padding:14px 36px;border-radius:999px;text-decoration:none;font-size:14px;">Participate Now</a>
          </div>
        </div>
        <div style="background:#050505;padding:16px 32px;text-align:center;border-top:1px solid #1f1f1f;">
          <p style="color:#444;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin:0;">Athiva Hack &bull; Innovation Starts Here</p>
        </div>
      </div>
    `
  };
  await transporter.sendMail(mailOptions);
};

/**
 * Send an email alert for upcoming submission deadlines.
 */
const sendDeadlineAlertEmail = async (toEmail, hackathonTitle, hoursRemaining) => {
  const mailOptions = {
    from: `"Athiva Hack" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: `⏰ Deadline Alert: ${hoursRemaining} Hours Left for ${hackathonTitle}`,
    html: `
      <div style="font-family:'Inter',Arial,sans-serif;max-width:520px;margin:0 auto;background:#0a0a0a;border:1px solid #1f1f1f;border-radius:16px;overflow:hidden;">
        <div style="padding:32px;text-align:center;">
          <div style="display:inline-block;background:#FFB800;width:48px;height:48px;border-radius:12px;line-height:48px;font-size:22px;color:#000;margin-bottom:16px;">⏰</div>
          <h1 style="color:#fff;font-size:22px;font-weight:800;margin:0 0 8px;">Hurry Up!</h1>
          <p style="color:#888;font-size:14px;">The <strong>${hackathonTitle}</strong> deadline is approaching.</p>
        </div>
        <div style="padding:0 32px 32px;">
          <p style="color:#aaa;font-size:14px;line-height:1.6;text-align:center;">Only <strong style="color:#FFB800;">${hoursRemaining} hours</strong> remain until the submission portal closes. Make sure to submit your project on time!</p>
          <div style="text-align:center;margin:24px 0;">
            <a href="http://localhost:5173/dashboard" style="display:inline-block;background:#FFB800;color:#000;font-weight:800;padding:14px 36px;border-radius:999px;text-decoration:none;font-size:14px;">Submit Now</a>
          </div>
        </div>
        <div style="background:#050505;padding:16px 32px;text-align:center;border-top:1px solid #1f1f1f;">
          <p style="color:#444;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin:0;">Athiva Hack &bull; Don't Miss Out</p>
        </div>
      </div>
    `
  };
  await transporter.sendMail(mailOptions);
};

/**
 * Send an email to the winners of the hackathon.
 */
const sendWinnerEmail = async (toEmail, hackathonTitle, rank) => {
  const mailOptions = {
    from: `"Athiva Hack" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: `🏆 Congratulations! You Ranked #${rank} in ${hackathonTitle}`,
    html: `
      <div style="font-family:'Inter',Arial,sans-serif;max-width:520px;margin:0 auto;background:#0a0a0a;border:1px solid #1f1f1f;border-radius:16px;overflow:hidden;">
        <div style="padding:32px;text-align:center;">
          <div style="font-size:40px;margin-bottom:16px;">🏆</div>
          <h1 style="color:#fff;font-size:22px;font-weight:800;margin:0 0 8px;">A Great Achievement!</h1>
          <p style="color:#888;font-size:14px;">You secured <strong style="color:#A3FF12">Rank #${rank}</strong> in the <strong>${hackathonTitle}</strong>.</p>
        </div>
        <div style="padding:0 32px 32px;">
          <p style="color:#aaa;font-size:14px;line-height:1.6;text-align:center;">Your hard work and innovation have paid off. Check the final leaderboard to see the full results.</p>
          <div style="text-align:center;margin:24px 0;">
            <a href="http://localhost:5173/dashboard" style="display:inline-block;background:#A3FF12;color:#000;font-weight:800;padding:14px 36px;border-radius:999px;text-decoration:none;font-size:14px;">View Results</a>
          </div>
        </div>
        <div style="background:#050505;padding:16px 32px;text-align:center;border-top:1px solid #1f1f1f;">
          <p style="color:#444;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin:0;">Athiva Hack &bull; Champion's Circle</p>
        </div>
      </div>
    `
  };
  await transporter.sendMail(mailOptions);
};

/**
 * Send a thank you email to all participants and judges after the event.
 */
const sendThankYouEmail = async (toEmail, hackathonTitle, role) => {
  const mailOptions = {
    from: `"Athiva Hack" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: `Thank You for a Great Event – ${hackathonTitle}`,
    html: `
      <div style="font-family:'Inter',Arial,sans-serif;max-width:520px;margin:0 auto;background:#0a0a0a;border:1px solid #1f1f1f;border-radius:16px;overflow:hidden;">
        <div style="padding:32px;text-align:center;">
          <div style="font-size:32px;margin-bottom:16px;">✨</div>
          <h1 style="color:#fff;font-size:22px;font-weight:800;margin:0 0 8px;">Thank You!</h1>
          <p style="color:#888;font-size:14px;">The <strong>${hackathonTitle}</strong> has officially concluded.</p>
        </div>
        <div style="padding:0 32px 32px;">
          <p style="color:#aaa;font-size:14px;line-height:1.6;text-align:center;">
            Thank you for participating as a <strong>${role}</strong>. Your contribution made this event a success. We hope to see you in the next one!
          </p>
        </div>
        <div style="background:#050505;padding:16px 32px;text-align:center;border-top:1px solid #1f1f1f;">
          <p style="color:#444;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;margin:0;">Athiva Hack &bull; See You Next Time</p>
        </div>
      </div>
    `
  };
  await transporter.sendMail(mailOptions);
};

module.exports = { 
  sendResetEmail, 
  sendJudgeStatusEmail, 
  sendHackathonStartEmail, 
  sendDeadlineAlertEmail, 
  sendWinnerEmail, 
  sendThankYouEmail 
};
