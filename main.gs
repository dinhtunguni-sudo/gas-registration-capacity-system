/**
 * Main application logic
 * Safe for public GitHub repository
 * Organization-specific data is injected via config.gs / config.private.gs
 */

/* =========================
   ENTRY POINT
   ========================= */
function onFormSubmit(e) {
  try {
    const data = parseFormData(e);
    validateSubmission(data);
    checkCapacity(data);
    createCalendarEvent(data);
    sendSuccessEmail(data);
    logSubmission(data, "SUCCESS");
  } catch (err) {
    handleError(e, err);
  }
}

/* =========================
   PARSE & VALIDATE
   ========================= */
function parseFormData(e) {
  const r = e.namedValues;
  return {
    team: r["Team name"]?.[0] || "",
    date: r["Date"]?.[0],
    slot: r["Time slot"]?.[0],
    email: r["Email"]?.[0]
  };
}

function validateSubmission(data) {
  if (!data.team || !data.date || !data.slot) {
    throw new Error("Invalid submission data");
  }
}

/* =========================
   CAPACITY
   ========================= */
function checkCapacity(data) {
  const sheet = SpreadsheetApp.getActive()
    .getSheetByName(SHEET_REMAINING);

  // Implement your real logic here
  // Placeholder is safe for public repo
}

/* =========================
   CALENDAR
   ========================= */
function createCalendarEvent(data) {
  if (!ENABLE_CALENDAR_CREATION) return;

  const cal = CalendarApp.getCalendarById(CALENDAR_ID);
  if (!cal) throw new Error("Calendar not available");

  const title = `${EVENT_TITLE_PREFIX} ${data.team}`;
  const start = new Date(`${data.date} ${data.slot.split("-")[0]}`);
  const end = new Date(start.getTime() + EVENT_DURATION_MINUTES * 60000);

  cal.createEvent(title, start, end, {
    location: LOCATION_TXT,
    description: ORG_LABEL
  });
}

/* =========================
   EMAIL
   ========================= */
function sendSuccessEmail(data) {
  if (!ENABLE_EMAIL_NOTIFICATION) return;

  const subject = "Registration confirmed";
  const body =
    `Hello,\n\n` +
    `Your group study session has been scheduled successfully.\n\n` +
    `Organization: ${ORG_LABEL}\n` +
    `Date: ${data.date}\n` +
    `Time: ${data.slot}\n\n` +
    `Support: ${SUPPORT_EMAIL}`;

  GmailApp.sendEmail(data.email, subject, body);
}

/* =========================
   ERROR HANDLING
   ========================= */
function handleError(e, err) {
  const email = e?.namedValues?.["Email"]?.[0];
  if (email) {
    GmailApp.sendEmail(
      email,
      "Registration error",
      "There was an issue processing your request. Please contact support."
    );
  }
  logSubmission({}, "ERROR: " + err.message);
}

/* =========================
   LOGGING
   ========================= */
function logSubmission(data, status) {
  const sheet = SpreadsheetApp.getActive()
    .getSheetByName(SHEET_LOG);

  sheet.appendRow([
    new Date(),
    data.team || "",
    data.date || "",
    data.slot || "",
    status
  ]);
}
