# Google Apps Script – Daily trigger setup

This folder contains the script that runs **inside your Google Sheet** to send reminder emails for overdue leads. The trigger is **not** created automatically; you must run the installer once from the Apps Script editor.

## What the script does

- **Daily run**: At the time you configure (default 9 AM in the project time zone), it runs `checkOverdueLeads`.
- **Logic**: Finds rows where:
  - Status is `new`
  - `created_at` is older than 24 hours
  - `Reminder Sent` is not `Yes`
- **Action**: Sends one reminder email to the lead (and CCs the admin), then sets `Reminder Sent` to `Yes` in the sheet.

## Prerequisites

1. **Use the same Google Sheet** that your LaunchED backend syncs to (the one with `GOOGLE_SHEETS_ID`).
2. **Sheet name**: The script expects a sheet named `Sheet1`. If your sheet has another name, change `CONFIG.SHEET_NAME` in `Code.gs`.
3. **Columns**: The script expects these columns (in order):  
   `id`, `name`, `email`, `phone`, `course`, `college`, `year`, `status`, `created_at`.  
   It will add a 10th column **Reminder Sent** if it’s missing.
4. **Gmail / MailApp**: Reminder emails are sent with `MailApp.sendEmail()`. The script runs as **your** Google account, so:
   - The Sheet must be in a Google account that can send email (e.g. a workspace or Gmail account).
   - If you use a Google Workspace domain, admins may need to allow “less secure” or Apps Script mail sending as per your org’s policy.

## Step-by-step: set up the daily trigger

### 1. Open the script from your Google Sheet

1. Open the Google Sheet that receives leads from LaunchED.
2. In the menu: **Extensions** → **Apps Script**.
3. If you see a default `Code.gs`, replace its contents with the contents of `Code.gs` from this folder (`google-apps-script/Code.gs`).  
   Or create a new script file and paste the code there (and keep the default function name that runs the trigger installer; see below).

### 2. Save and set the time zone (recommended)

1. **File** → **Project properties** → **Time zone**  
   Set the time zone where you want “9 AM” to be (e.g. your local time).
2. In `Code.gs`, the default run time is 9 AM. You can change `CONFIG.TRIGGER_HOUR_UTC` (it’s actually “hour in project time zone”, not strictly UTC) if you want a different hour.
3. **File** → **Save** (or Ctrl+S).

### 3. Run the trigger installer once

1. In the Apps Script editor, open the function dropdown at the top (it usually shows `Select function`).
2. Select **`installDailyTrigger`**.
3. Click **Run** (▶).
4. The first time you run a script that uses `ScriptApp` or `MailApp`, Google will ask for permissions:
   - Click **Review permissions**.
   - Choose your Google account.
   - If you see “Google hasn’t verified this app”, click **Advanced** → **Go to &lt;your project name&gt; (unsafe)** (this is your own script).
   - Click **Allow**.
5. When the run finishes, check the **Execution log** (View → Logs or Ctrl+Enter). You should see a message like:  
   `Daily trigger installed. It will run every day at 9:00 in the project time zone.`

### 4. Confirm the trigger exists

1. In the Apps Script editor: **Edit** → **Current project’s triggers** (or the clock icon in the left sidebar).
2. You should see a trigger:
   - Function: `checkOverdueLeads`
   - Event: Time-driven
   - Type: Day timer (e.g. 9am–10am or similar, depending on time zone)

After this, the trigger is set up. It will run automatically every day at the configured hour.

## Optional: run the check manually

To test without waiting for the trigger:

1. In the function dropdown, select **`checkOverdueLeads`**.
2. Click **Run**.
3. Check **View** → **Logs** and the Google Sheet to see if any reminders were sent and if **Reminder Sent** was set to `Yes`.

## Changing or removing the daily trigger

- **Change schedule**: Edit `CONFIG.TRIGGER_HOUR_UTC` and/or the trigger type in `Code.gs` if needed, then run **`installDailyTrigger`** again. You may want to run **`removeDailyTriggers`** once first to avoid duplicate triggers.
- **Remove trigger**: Run the function **`removeDailyTriggers`** once from the editor, or delete the trigger from **Edit** → **Current project’s triggers**.

## Summary

| Step | Action |
|------|--------|
| 1 | Open your Sheet → **Extensions** → **Apps Script**; paste `Code.gs`. |
| 2 | Set **Project properties** → **Time zone**; save. |
| 3 | Select **`installDailyTrigger`** → **Run**; grant permissions if asked. |
| 4 | Check **Edit** → **Current project’s triggers** to see the daily trigger. |

After this, the everyday trigger is set and will run at the configured time.
