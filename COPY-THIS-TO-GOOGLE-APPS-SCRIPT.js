// ===================================
// RHYDLE WAITLIST - GOOGLE APPS SCRIPT
// Clean Black & White Email Templates (No Gradients, No Shadows)
// Matches Landing Page Design
// ===================================

// CONFIGURATION - EDIT THESE VALUES
const CONFIG = {
  // Your Google Drive APK file link (make sure it's set to "Anyone with link can view")
  APK_DOWNLOAD_LINK: 'https://drive.google.com/file/d/126DLwSrHfJlTxX26rj1E5sqdwzdInfbS/view?usp=drive_link',

  // Beta test launch date (format: YYYY-MM-DD)
  BETA_LAUNCH_DATE: '2026-02-21',

  // Your reply-to email
  REPLY_TO_EMAIL: 'frank.builds08@gmail.com',

  // Column indexes
  COLUMNS: {
    TIMESTAMP: 0,
    EMAIL: 1,
    PROJECTS: 2,
    PAGE: 3,
    DATE_ADDED: 4,
    WELCOME_SENT: 5,
    BETA_SENT: 6
  }
};

// ===================================
// HANDLE FORM SUBMISSIONS
// ===================================
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Create headers if first row
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp',
        'Email',
        'Projects',
        'Page',
        'Date Added',
        'Welcome Email Sent',
        'Beta Email Sent'
      ]);

      // Format header row
      const headerRange = sheet.getRange(1, 1, 1, 7);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#FF6B2C');
      headerRange.setFontColor('#FFFFFF');
    }

    // Parse incoming data
    const data = JSON.parse(e.postData.contents);

    // Check if email already exists
    const emailColumn = sheet.getRange(2, CONFIG.COLUMNS.EMAIL + 1, Math.max(sheet.getLastRow() - 1, 1), 1).getValues();
    const emailExists = emailColumn.some(row => row[0] === data.email);

    if (emailExists) {
      return ContentService.createTextOutput(JSON.stringify({
        'status': 'duplicate',
        'message': 'Email already registered'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Add new row
    sheet.appendRow([
      data.timestamp,
      data.email,
      data.projects,
      data.page,
      new Date(),
      'No',
      'No'
    ]);

    // Send welcome email immediately
    const rowNumber = sheet.getLastRow();
    sendWelcomeEmail(data.email, sheet, rowNumber);

    return ContentService.createTextOutput(JSON.stringify({
      'status': 'success',
      'message': 'User added and welcome email sent'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ===================================
// SEND WELCOME EMAIL
// ===================================
function sendWelcomeEmail(email, sheet, rowNumber) {
  try {
    // Validate email parameter
    if (!email || email === '') {
      Logger.log('❌ Error: No email address provided');
      return;
    }

    Logger.log('📧 Preparing to send welcome email to: ' + email);

    const subject = "🎉 Welcome to RHYDLE Beta - You're In!";
    const htmlBody = getWelcomeEmailTemplate();

    MailApp.sendEmail({
      to: email,
      subject: subject,
      htmlBody: htmlBody,
      replyTo: CONFIG.REPLY_TO_EMAIL,
      name: 'RHYDLE Team'
    });

    if (sheet && rowNumber) {
      sheet.getRange(rowNumber, CONFIG.COLUMNS.WELCOME_SENT + 1).setValue('Yes');
      sheet.getRange(rowNumber, CONFIG.COLUMNS.WELCOME_SENT + 1).setNote('Sent: ' + new Date());
    }

    Logger.log('✅ Welcome email sent successfully to: ' + email);

  } catch (error) {
    Logger.log('❌ Error sending welcome email: ' + error);
    throw error;
  }
}

// ===================================
// SEND BETA APK EMAIL
// ===================================
function sendBetaAPKEmail(email, sheet, rowNumber) {
  try {
    // Validate email parameter
    if (!email || email === '') {
      Logger.log('❌ Error: No email address provided');
      return;
    }

    Logger.log('📧 Preparing to send beta APK email to: ' + email);

    const subject = "🚀 Your RHYDLE Beta APK is Ready - Download Now!";
    const htmlBody = getBetaAPKEmailTemplate();

    MailApp.sendEmail({
      to: email,
      subject: subject,
      htmlBody: htmlBody,
      replyTo: CONFIG.REPLY_TO_EMAIL,
      name: 'RHYDLE Team'
    });

    if (sheet && rowNumber) {
      sheet.getRange(rowNumber, CONFIG.COLUMNS.BETA_SENT + 1).setValue('Yes');
      sheet.getRange(rowNumber, CONFIG.COLUMNS.BETA_SENT + 1).setNote('Sent: ' + new Date());
    }

    Logger.log('✅ Beta APK email sent successfully to: ' + email);

  } catch (error) {
    Logger.log('❌ Error sending beta email: ' + error);
    throw error;
  }
}

// ===================================
// WELCOME EMAIL TEMPLATE (Responsive, Clean Design)
// ===================================
function getWelcomeEmailTemplate() {
  const launchDate = formatDate(CONFIG.BETA_LAUNCH_DATE);

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet"><style>@media only screen and (max-width:600px){.main-container{width:100%!important}.content-padding{padding:32px 24px!important}.header-title{font-size:36px!important}.date-box{font-size:22px!important}}</style></head>
<body style="margin:0;padding:0;background:#F5F5F5;font-family:'JetBrains Mono','Courier New',monospace">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#F5F5F5;padding:40px 20px"><tr><td align="center">
<table class="main-container" width="600" cellpadding="0" cellspacing="0" role="presentation" style="background:#FFFFFF;max-width:600px;border:1px solid #E5E5E5">
<tr><td style="padding:0;background:#0A0A0A">
<div style="width:100%;height:4px;background:#FF6B2C"></div>
<div class="content-padding" style="padding:48px 40px">
<div style="font-size:11px;font-weight:600;color:#FF6B2C;letter-spacing:0.15em;margin-bottom:24px;text-transform:uppercase">SYSTEM_MSG_001</div>
<div style="font-family:'JetBrains Mono',monospace;font-size:24px;font-weight:700;color:#FFFFFF;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:32px">RHYDLE</div>
<h1 class="header-title" style="font-family:'Instrument Serif',Georgia,serif;font-size:48px;font-weight:700;color:#FFC107;margin:0 0 24px 0;line-height:1.1;letter-spacing:-0.02em">You're In</h1>
<div style="width:80px;height:3px;background:#FF6B2C;margin-bottom:32px"></div>
<p style="font-size:16px;line-height:1.7;color:#FFFFFF;margin:0 0 32px 0;letter-spacing:0.01em">Thanks for joining the RHYDLE beta waitlist. You're one of the first <span style="color:#FF6B2C;font-weight:700">100 people</span> who will get early access to our revenue tracking platform.</p>
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:0">
<tr><td style="padding-bottom:16px"><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr><td style="width:24px;vertical-align:top"><span style="color:#FF6B2C;font-size:16px;font-weight:700">▸</span></td><td style="font-size:15px;color:#FFFFFF;line-height:1.6;letter-spacing:0.01em">Track revenue across all your projects in one dashboard</td></tr></table></td></tr>
<tr><td style="padding-bottom:16px"><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr><td style="width:24px;vertical-align:top"><span style="color:#FF6B2C;font-size:16px;font-weight:700">▸</span></td><td style="font-size:15px;color:#FFFFFF;line-height:1.6;letter-spacing:0.01em">Know which platforms actually drive profit—not just traffic</td></tr></table></td></tr>
<tr><td><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr><td style="width:24px;vertical-align:top"><span style="color:#FF6B2C;font-size:16px;font-weight:700">▸</span></td><td style="font-size:15px;color:#FFFFFF;line-height:1.6;letter-spacing:0.01em">Stop guessing. Start knowing.</td></tr></table></td></tr>
</table></div></td></tr>
<tr><td class="content-padding" style="padding:48px 40px;background:#FFFFFF">
<div style="background:#F5F5F5;padding:28px;margin-bottom:32px;border-top:3px solid #FF6B2C">
<div style="font-family:'Instrument Serif',Georgia,serif;font-size:22px;font-weight:600;color:#0A0A0A;margin-bottom:12px;letter-spacing:-0.01em">What is RHYDLE?</div>
<p style="font-size:15px;line-height:1.7;color:#1A1A1A;margin:0;letter-spacing:0.01em">RHYDLE helps solopreneurs track revenue across all projects in one dashboard. No more juggling spreadsheets—see which platforms actually drive profit at a glance.</p>
</div>
<div style="background:#0A0A0A;padding:36px 32px;margin-bottom:32px">
<div style="font-size:11px;font-weight:600;color:#FF6B2C;letter-spacing:0.1em;margin-bottom:12px;text-transform:uppercase">Beta Launch</div>
<div class="date-box" style="font-family:'Instrument Serif',Georgia,serif;font-size:32px;font-weight:600;color:#FFC107;margin-bottom:16px;letter-spacing:-0.01em">${launchDate}</div>
<p style="font-size:15px;line-height:1.7;color:#FFFFFF;margin:0;letter-spacing:0.01em">You'll receive an email with a download link to test the Android app (APK file).</p>
</div>
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:40px"><tr><td align="center">
<a href="${CONFIG.APK_DOWNLOAD_LINK}" style="display:inline-block;background:#FF6B2C;color:#FFFFFF;font-family:'JetBrains Mono',monospace;font-size:14px;font-weight:700;text-decoration:none;padding:18px 48px;text-transform:uppercase;letter-spacing:0.08em;border:none">View Beta Preview</a>
</td></tr></table>
<p style="font-size:15px;line-height:1.7;color:#1A1A1A;margin:0 0 8px 0;letter-spacing:0.01em">Questions? Just reply to this email—we'd love to hear from you.</p>
<p style="font-size:15px;font-weight:700;color:#0A0A0A;margin:24px 0 0 0">— The RHYDLE Team</p>
</td></tr>
<tr><td class="content-padding" style="padding:32px 40px;background:#F5F5F5;border-top:1px solid #E5E5E5">
<div style="width:100%;height:1px;background:#D0D0D0;margin-bottom:20px"></div>
<p style="font-size:11px;color:#666666;text-align:center;margin:0 0 8px 0;letter-spacing:0.06em;text-transform:uppercase;font-weight:600">RHYDLE | Track. Analyze. Optimize.</p>
<p style="font-size:11px;color:#999999;text-align:center;margin:0;line-height:1.6">You received this email because you signed up for the RHYDLE beta waitlist.</p>
</td></tr>
</table></td></tr></table>
</body></html>`;
}

// ===================================
// BETA APK EMAIL TEMPLATE (Responsive, Clean Design)
// ===================================
function getBetaAPKEmailTemplate() {
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet"><style>@media only screen and (max-width:600px){.main-container{width:100%!important}.content-padding{padding:32px 24px!important}.header-title{font-size:36px!important}.step-number{width:28px!important;height:28px!important;line-height:28px!important;font-size:14px!important}}</style></head>
<body style="margin:0;padding:0;background:#F5F5F5;font-family:'JetBrains Mono','Courier New',monospace">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#F5F5F5;padding:40px 20px"><tr><td align="center">
<table class="main-container" width="600" cellpadding="0" cellspacing="0" role="presentation" style="background:#FFFFFF;max-width:600px;border:1px solid #E5E5E5">
<tr><td style="padding:0;background:#0A0A0A">
<div style="width:100%;height:4px;background:#FFC107"></div>
<div class="content-padding" style="padding:48px 40px">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:24px"><tr><td>
<div style="font-size:11px;font-weight:600;color:#FFC107;letter-spacing:0.15em;text-transform:uppercase">BETA_RELEASE_001</div>
</td><td align="right">
<table cellpadding="0" cellspacing="0" role="presentation"><tr>
<td style="width:8px;height:8px;background:#FFC107;border-radius:50%"></td>
<td style="padding-left:8px;font-size:11px;color:#FFC107;letter-spacing:0.08em;text-transform:uppercase;font-weight:700">Live</td>
</tr></table>
</td></tr></table>
<div style="font-family:'JetBrains Mono',monospace;font-size:24px;font-weight:700;color:#FFFFFF;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:32px">RHYDLE</div>
<h1 class="header-title" style="font-family:'Instrument Serif',Georgia,serif;font-size:48px;font-weight:700;color:#FFC107;margin:0 0 24px 0;line-height:1.1;letter-spacing:-0.02em">The Wait is Over</h1>
<div style="width:100px;height:3px;background:#FFC107;margin-bottom:32px"></div>
<p style="font-size:16px;line-height:1.7;color:#FFFFFF;margin:0;letter-spacing:0.01em">Your RHYDLE beta access is ready. Download the APK below and start tracking your revenue like a pro.</p>
</div></td></tr>
<tr><td class="content-padding" style="padding:48px 40px;background:#FFFFFF">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:48px"><tr><td align="center">
<a href="${CONFIG.APK_DOWNLOAD_LINK}" style="display:inline-block;background:#FFC107;color:#0A0A0A;font-family:'JetBrains Mono',monospace;font-size:14px;font-weight:700;text-decoration:none;padding:20px 48px;text-transform:uppercase;letter-spacing:0.1em;border:none">⬇ Download RHYDLE APK</a>
</td></tr></table>
<div style="background:#F5F5F5;padding:36px 32px;margin-bottom:32px;border-top:3px solid #FF6B2C">
<div style="font-family:'Instrument Serif',Georgia,serif;font-size:24px;font-weight:600;color:#0A0A0A;margin-bottom:28px;letter-spacing:-0.01em">Installation Steps</div>
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:24px"><tr>
<td style="width:48px;vertical-align:top"><div class="step-number" style="width:36px;height:36px;background:#FF6B2C;color:#FFFFFF;text-align:center;font-weight:700;font-size:16px;line-height:36px">1</div></td>
<td style="vertical-align:top"><div style="font-weight:700;color:#0A0A0A;margin-bottom:6px;font-size:15px">Download the APK</div><div style="font-size:14px;color:#1A1A1A;line-height:1.6">Click the download button above to save the APK file to your device</div></td>
</tr></table>
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:24px"><tr>
<td style="width:48px;vertical-align:top"><div class="step-number" style="width:36px;height:36px;background:#FF6B2C;color:#FFFFFF;text-align:center;font-weight:700;font-size:16px;line-height:36px">2</div></td>
<td style="vertical-align:top"><div style="font-weight:700;color:#0A0A0A;margin-bottom:6px;font-size:15px">Enable "Install Unknown Apps"</div><div style="font-size:14px;color:#1A1A1A;line-height:1.6">Settings → Security → Allow installation from unknown sources</div></td>
</tr></table>
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:24px"><tr>
<td style="width:48px;vertical-align:top"><div class="step-number" style="width:36px;height:36px;background:#FF6B2C;color:#FFFFFF;text-align:center;font-weight:700;font-size:16px;line-height:36px">3</div></td>
<td style="vertical-align:top"><div style="font-weight:700;color:#0A0A0A;margin-bottom:6px;font-size:15px">Install the app</div><div style="font-size:14px;color:#1A1A1A;line-height:1.6">Tap the downloaded APK file and follow the prompts to install</div></td>
</tr></table>
<table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr>
<td style="width:48px;vertical-align:top"><div class="step-number" style="width:36px;height:36px;background:#FFC107;color:#0A0A0A;text-align:center;font-weight:700;font-size:16px;line-height:36px">4</div></td>
<td style="vertical-align:top"><div style="font-weight:700;color:#FFC107;margin-bottom:6px;font-size:15px">Start tracking revenue!</div><div style="font-size:14px;color:#1A1A1A;line-height:1.6">Open RHYDLE, create your account, and add your first project</div></td>
</tr></table>
</div>
<div style="background:#FFF9E6;padding:24px;margin-bottom:40px;border-top:3px solid #FFC107">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr>
<td style="width:36px;vertical-align:top;font-size:20px">⚠️</td>
<td><div style="font-weight:700;color:#0A0A0A;margin-bottom:8px;font-size:14px">Beta APK Installation</div>
<p style="font-size:13px;line-height:1.7;color:#1A1A1A;margin:0">Since this is a beta APK (not from Google Play Store), you'll need to enable "Install from Unknown Sources" in your Android settings. This is completely normal for beta testing apps.</p></td>
</tr></table>
</div>
<div style="border-top:2px solid #E5E5E5;padding-top:36px;margin-bottom:32px">
<div style="font-family:'Instrument Serif',Georgia,serif;font-size:24px;font-weight:600;color:#0A0A0A;margin-bottom:16px;letter-spacing:-0.01em">We Need Your Feedback</div>
<p style="font-size:15px;line-height:1.7;color:#1A1A1A;margin:0 0 24px 0">As a beta tester, your feedback is invaluable. Please report any bugs, suggest features, or share your experience by replying to this email.</p>
<table width="100%" cellpadding="0" cellspacing="0" role="presentation">
<tr><td style="padding-bottom:14px"><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr><td style="width:24px;vertical-align:top"><span style="color:#FFC107;font-size:16px;font-weight:700">▸</span></td><td style="font-size:14px;color:#1A1A1A;line-height:1.6">Found a bug? Report it immediately</td></tr></table></td></tr>
<tr><td style="padding-bottom:14px"><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr><td style="width:24px;vertical-align:top"><span style="color:#FFC107;font-size:16px;font-weight:700">▸</span></td><td style="font-size:14px;color:#1A1A1A;line-height:1.6">Have a feature idea? We want to hear it</td></tr></table></td></tr>
<tr><td><table width="100%" cellpadding="0" cellspacing="0" role="presentation"><tr><td style="width:24px;vertical-align:top"><span style="color:#FFC107;font-size:16px;font-weight:700">▸</span></td><td style="font-size:14px;color:#1A1A1A;line-height:1.6">Need help? Reply to this email within 24 hours</td></tr></table></td></tr>
</table>
</div>
<div style="width:100%;height:1px;background:#E5E5E5;margin:32px 0"></div>
<p style="font-size:15px;line-height:1.7;color:#1A1A1A;margin:0 0 8px 0">Thanks for being an early supporter! 🚀</p>
<p style="font-size:15px;font-weight:700;color:#0A0A0A;margin:24px 0 0 0">— The RHYDLE Team</p>
</td></tr>
<tr><td class="content-padding" style="padding:32px 40px;background:#F5F5F5;border-top:1px solid #E5E5E5">
<div style="width:100%;height:1px;background:#D0D0D0;margin-bottom:20px"></div>
<p style="font-size:11px;color:#666666;text-align:center;margin:0 0 8px 0;letter-spacing:0.06em;text-transform:uppercase;font-weight:600">RHYDLE | Track. Analyze. Optimize.</p>
<p style="font-size:11px;color:#999999;text-align:center;margin:0;line-height:1.6">You received this email because you signed up for the RHYDLE beta waitlist.</p>
</td></tr>
</table></td></tr></table>
</body></html>`;
}

// ===================================
// SEND BETA EMAILS TO ALL
// ===================================
function sendBetaEmailsToAll() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    Logger.log('No users to send emails to');
    return;
  }

  const data = sheet.getRange(2, 1, lastRow - 1, 7).getValues();
  let sentCount = 0;

  for (let i = 0; i < data.length; i++) {
    const email = data[i][CONFIG.COLUMNS.EMAIL];
    const betaSent = data[i][CONFIG.COLUMNS.BETA_SENT];

    if (betaSent !== 'Yes' && email) {
      sendBetaAPKEmail(email, sheet, i + 2);
      sentCount++;
      Utilities.sleep(1000);
    }
  }

  Logger.log('Beta emails sent to ' + sentCount + ' users');
}

// ===================================
// HELPER FUNCTIONS
// ===================================
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

function setupScheduledTrigger() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));

  const launchDate = new Date(CONFIG.BETA_LAUNCH_DATE);

  ScriptApp.newTrigger('sendBetaEmailsToAll')
    .timeBased()
    .at(launchDate)
    .create();

  Logger.log('Scheduled trigger created for: ' + launchDate);
}

// ===================================
// SETUP FUNCTION - RUN THIS FIRST!
// ===================================
function setupSpreadsheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // Check if headers already exist
  if (sheet.getLastRow() > 0) {
    Logger.log('⚠️ Spreadsheet already has data. Headers exist.');
    return;
  }

  // Create headers
  sheet.appendRow([
    'Timestamp',
    'Email',
    'Projects',
    'Page',
    'Date Added',
    'Welcome Email Sent',
    'Beta Email Sent'
  ]);

  // Format header row
  const headerRange = sheet.getRange(1, 1, 1, 7);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#FF6B2C');
  headerRange.setFontColor('#FFFFFF');

  // Auto-resize columns
  sheet.autoResizeColumns(1, 7);

  Logger.log('✅ Spreadsheet setup complete! Headers created.');
}

// ===================================
// TEST FUNCTIONS
// ===================================
function testWelcomeEmail() {
  // IMPORTANT: Replace with YOUR email address before running!
  const testEmail = 'frank.builds08@gmail.com';

  Logger.log('📧 Sending test welcome email to: ' + testEmail);
  sendWelcomeEmail(testEmail, null, null);
  Logger.log('✅ Welcome email sent! Check your inbox.');
}

function testBetaEmail() {
  // IMPORTANT: Replace with YOUR email address before running!
  const testEmail = 'frank.builds08@gmail.com';

  Logger.log('📧 Sending test beta email to: ' + testEmail);
  sendBetaAPKEmail(testEmail, null, null);
  Logger.log('✅ Beta email sent! Check your inbox.');
}
