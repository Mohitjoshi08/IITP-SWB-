import { google } from 'googleapis';

export async function getSheetData(range: string) {
  try {
    // Format the private key correctly (Vercel sometimes messes up the newlines)
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'], // Read-only is safer!
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: range,
    });

    return response.data.values || [];
  } catch (error) {
    console.error("Google Sheets Error:", error);
    return [];
  }
}