const { google } = require("googleapis");
const dotenv = require("dotenv");

dotenv.config();

// Load credentials from environment variables or file
// For this assessment, we'll assume credentials are in a file or env vars
// In a real app, we might use a service account key file path
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

// const auth = new google.auth.GoogleAuth({
//   keyFile: "credentials.json", // User needs to provide this
//   scopes: SCOPES,
// });

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
  scopes: SCOPES,
});

const sheets = google.sheets({ version: "v4", auth });
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID;

const appendToSheet = async (lead) => {
  try {
    const resource = {
      values: [
        [
          lead.id,
          lead.name,
          lead.email,
          lead.phone,
          lead.course,
          lead.college,
          lead.year,
          lead.status,
          lead.created_at,
        ],
      ],
    };

    const result = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "Sheet1!A:I", // Adjust sheet name as needed
      valueInputOption: "USER_ENTERED",
      resource,
    });

    // The response includes the range typically like 'Sheet1!A10:I10'
    const updatedRange = result.data.updates.updatedRange;
    // Extract row number. Example: 'Sheet1!A10:I10' -> 10
    const match = updatedRange.match(/!A(\d+):/);
    if (match && match[1]) {
      return parseInt(match[1]);
    }
    return null;
  } catch (error) {
    console.error("Error appending to sheet:", error);
    return null;
  }
};

const updateSheetRow = async (rowId, status) => {
  // This requires knowing the EXACT row number (rowId stored in DB)
  // If we don't store it, we have to search. The requirement says "using sheet_row_id".
  // So we assume we have it.
  if (!rowId) return;

  try {
    const resource = {
      values: [[status]],
    };
    // Assuming status is in column H (8th column)
    const range = `Sheet1!H${rowId}`;

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: range,
      valueInputOption: "USER_ENTERED",
      resource,
    });
  } catch (error) {
    console.error("Error updating sheet:", error);
  }
};

module.exports = { appendToSheet, updateSheetRow };
