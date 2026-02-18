function createTimeDrivenTriggers() {
  // Run daily at 9 AM
  ScriptApp.newTrigger('checkOverdueLeads')
      .timeBased()
      .atHour(9)
      .everyDays(1)
      .create();
}

function checkOverdueLeads() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  // Assuming columns: 
  // 0: id, 1: name, 2: email, 3: phone, 4: course, 
  // 5: college, 6: year, 7: status, 8: created_at, 9: reminder_sent
  
  // Find column indexes
  const statusCol = 7; 
  const createdAtCol = 8;
  const reminderSentCol = 9;
  const emailCol = 2;
  const nameCol = 1;
  const adminEmail = 'admin@launchedglobal.in'; // valid admin email

  const now = new Date();
  const oneDay = 24 * 60 * 60 * 1000;

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const status = row[statusCol];
    const createdAt = new Date(row[createdAtCol]);
    const reminderSent = row[reminderSentCol];
    const email = row[emailCol];
    const name = row[nameCol];

    // Check if status is 'new', older than 24 hours, and reminder not sent
    if (status && status.toLowerCase() === 'new' && 
        (now.getTime() - createdAt.getTime() > oneDay) && 
        reminderSent !== 'Yes') {
      
      sendReminderEmail(email, name, adminEmail);
      
      // Mark as Reminder Sent in Sheet
      sheet.getRange(i + 1, reminderSentCol + 1).setValue('Yes');
    }
  }
}

function sendReminderEmail(leadEmail, leadName, adminEmail) {
  const subject = 'Action Required: Complete your Enrollment';
  const body = `Hi ${leadName},\n\nWe noticed you haven't completed your enrollment yet. Please get in touch with us.\n\nBest,\nLaunchED Team`;
  
  try {
    MailApp.sendEmail({
      to: leadEmail,
      cc: adminEmail,
      subject: subject,
      body: body
    });
    Logger.log('Email sent to ' + leadEmail);
  } catch (e) {
    Logger.log('Error sending email: ' + e.toString());
  }
}
