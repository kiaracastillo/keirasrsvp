const SHEET_NAME = "RSVPs";

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Event Name",
        "Asistirá",
        "Family Name",
        "Guest Name",
        "Sent At",
        "User Agent"
      ]);
    }

    const data = e.parameter;

    sheet.appendRow([
      new Date(),
      data.eventName || "",
      data.attending || "",
      data.familyName || "",
      data.guestName || "",
      data.sentAt || "",
      data.userAgent || ""
    ]);

    return ContentService
      .createTextOutput("OK")
      .setMimeType(ContentService.MimeType.TEXT);

  } catch (error) {
    return ContentService
      .createTextOutput("ERROR: " + error)
      .setMimeType(ContentService.MimeType.TEXT);

  } finally {
    lock.releaseLock();
  }
}