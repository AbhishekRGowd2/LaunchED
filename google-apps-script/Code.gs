/**
 * LaunchED - Google Apps Script
 * Runs in the context of your Google Sheet (bound to the same spreadsheet
 * that the backend syncs leads to). Sets up a daily trigger to check
 * overdue leads and send reminder emails.
 */

const CONFIG = {
  SHEET_NAME: 'Sheet1',
  // Column indexes (0-based): id, name, email, phone, course, college, year, status, created_at, reminder_sent
  COL: {
    ID: 0,
    NAME: 1,
    EMAIL: 2,
    PHONE: 3,
    COURSE: 4,
    COLLEGE: 5,
    YEAR: 6,
    STATUS: 7,
    CREATED_AT: 8,
    REMINDER_SENT: 9
  },
  ADMIN_EMAIL: 'admin@launchedglobal.in',
  REMINDER_AFTER_HOURS: 24,
  TRIGGER_FUNCTION: 'checkOverdueLeads',
  TRIGGER_HOUR_UTC: 9 // 9 AM in the script's timezone (see File > Project properties > Time zone)
};

/**
 * Run this function ONCE from the Apps Script editor to create the daily trigger.
 * (Run > Run function > installDailyTrigger)
 * After running, the trigger will appear under Edit > Current project's triggers.
 */
function installDailyTrigger() {
  removeDailyTriggers();
  ScriptApp.newTrigger(CONFIG.TRIGGER_FUNCTION)
    .timeBased()
    .everyDays(1)
    .atHour(CONFIG.TRIGGER_HOUR_UTC)
    .create();
  Logger.log('Daily trigger installed. It will run every day at ' + CONFIG.TRIGGER_HOUR_UTC + ':00 in the project time zone.');
}

/**
 * Removes any existing time-driven triggers for checkOverdueLeads.
 * Call this if you want to change the schedule or stop daily runs.
 */
function removeDailyTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function (trigger) {
    if (trigger.getHandlerFunction() === CONFIG.TRIGGER_FUNCTION && trigger.getTriggerSource() === ScriptApp.TriggerSource.CLOCK) {
      ScriptApp.deleteTrigger(trigger);
      Logger.log('Removed existing daily trigger.');
    }
  });
}

/**
 * Legacy name – calls installDailyTrigger for backwards compatibility.
 */
function createTimeDrivenTriggers() {
  installDailyTrigger();
}

/**
 * Daily job: find leads that are still "new", older than REMINDER_AFTER_HOURS,
 * and haven't been sent a reminder; send them an email and mark reminder_sent.
 */
function checkOverdueLeads() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) {
    Logger.log('Sheet "' + CONFIG.SHEET_NAME + '" not found.');
    return;
  }

  const data = sheet.getDataRange().getValues();
  if (!data.length) return;

  ensureReminderSentColumn(sheet, data[0]);

  const now = new Date();
  const minAgeMs = CONFIG.REMINDER_AFTER_HOURS * 60 * 60 * 1000;

  for (var i = 1; i < data.length; i++) {
    const row = data[i];
    const status = (row[CONFIG.COL.STATUS] || '').toString().toLowerCase();
    const reminderSent = (row[CONFIG.COL.REMINDER_SENT] || '').toString();
    const email = (row[CONFIG.COL.EMAIL] || '').toString().trim();
    const name = (row[CONFIG.COL.NAME] || '').toString().trim();

    if (status !== 'new' || reminderSent === 'Yes' || !email) continue;

    var createdAt;
    try {
      createdAt = row[CONFIG.COL.CREATED_AT] ? new Date(row[CONFIG.COL.CREATED_AT]) : null;
    } catch (e) {
      continue;
    }
    if (!createdAt || isNaN(createdAt.getTime())) continue;
    if (now.getTime() - createdAt.getTime() < minAgeMs) continue;

    sendReminderEmail(email, name, CONFIG.ADMIN_EMAIL);
    sheet.getRange(i + 1, CONFIG.COL.REMINDER_SENT + 1).setValue('Yes');
  }
}

function ensureReminderSentColumn(sheet, headerRow) {
  if (headerRow.length < 10) {
    sheet.getRange(1, 10).setValue('Reminder Sent');
  }
}

function sendReminderEmail(leadEmail, leadName, adminEmail) {
  const subject = 'Action Required: Complete your Enrollment';
  const body = 'Hi ' + leadName + ',\n\nWe noticed you haven\'t completed your enrollment yet. Please get in touch with us.\n\nBest,\nLaunchED Team';

  try {
    MailApp.sendEmail({
      to: leadEmail,
      cc: adminEmail,
      subject: subject,
      body: body
    });
    Logger.log('Reminder sent to ' + leadEmail);
  } catch (e) {
    Logger.log('Error sending email to ' + leadEmail + ': ' + e.toString());
  }
}
