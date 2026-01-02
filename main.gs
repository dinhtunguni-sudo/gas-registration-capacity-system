/**
 * Main application logic
 *
 * Responsibilities:
 * - Registration validation & scheduling automation
 * - Capacity enforcement & quota rules
 * - Calendar & email integration
 * - Centralized logging for analytics
 * - Embedded machine learning (ML) decision support (offline, log-based)
 *
 * Safe for public GitHub repository.
 * Organization-specific data is injected via config.gs / config.private.gs
 */

/* =========================================================
   ENTRY POINT
   ========================================================= */

/**
 * Primary entry point triggered by Google Form submission.
 * Acts as a controller orchestrating the full pipeline.
 */
function onFormSubmit(e) {
  try {
    const data = parseFormData(e);

    validateSubmission(data);
    checkCapacity(data);

    // === ML / Analytics hook (non-blocking, observational) ===
    if (typeof ENABLE_ML_ANALYTICS !== "undefined" && ENABLE_ML_ANALYTICS) {
      try {
        collectMLFeatures(data);
      } catch (_) {
        // ML must never block production flow
      }
    }

    createCalendarEvent(data);
    sendSuccessEmail(data);
    logSubmission(data, "SUCCESS");

  } catch (err) {
    handleError(e, err);
  }
}

/* =========================================================
   PARSE & VALIDATE
   ========================================================= */

/**
 * Extract normalized submission data from Form event.
 */
function parseFormData(e) {
  const r = e.namedValues || {};

  return {
    team:  r["Team name"]?.[0] || "",
    date:  r["Date"]?.[0] || "",
    slot:  r["Time slot"]?.[0] || "",
    email: r["Email"]?.[0] || "",
    submittedAt: new Date()
  };
}

/**
 * Basic validation of required fields.
 */
function validateSubmission(data) {
  if (!data.team || !data.date || !data.slot) {
    throw new Error("Invalid submission data");
  }
}

/* =========================================================
   CAPACITY & QUOTA
   ========================================================= */

/**
 * Capacity and quota enforcement.
 * Placeholder logic is intentionally minimal for public repo.
 * Real logic can be injected internally.
 */
function checkCapacity(data) {
  const sheet = SpreadsheetApp.getActive()
    .getSheetByName(SHEET_REMAINING);

  if (!sheet) return;

  // Example: capacity enforcement is organization-specific
  // and intentionally omitted from public version.
}

/* =========================================================
   CALENDAR
   ========================================================= */

/**
 * Create calendar event if enabled.
 */
function createCalendarEvent(data) {
  if (!ENABLE_CALENDAR_CREATION) return;

  const cal = CalendarApp.getCalendarById(CALENDAR_ID);
  if (!cal) throw new Error("Calendar not available");

  const title = `${EVENT_TITLE_PREFIX} ${data.team}`;

  const start = new Date(
    `${data.date} ${data.slot.split("-")[0]}`
  );

  const end = new Date(
    start.getTime() + EVENT_DURATION_MINUTES * 60000
  );

  cal.createEvent(title, start, end, {
    location: LOCATION_TXT,
    description: ORG_LABEL
  });
}

/* =========================================================
   EMAIL
   ========================================================= */

/**
 * Notify user of successful registration.
 */
function sendSuccessEmail(data) {
  if (!ENABLE_EMAIL_NOTIFICATION) return;

  const subject = "Registration confirmed";
  const body =
    "Hello,\n\n" +
    "Your group study session has been scheduled successfully.\n\n" +
    `Organization: ${ORG_LABEL}\n` +
    `Date: ${data.date}\n` +
    `Time: ${data.slot}\n\n` +
    `Support: ${SUPPORT_EMAIL}`;

  GmailApp.sendEmail(data.email, subject, body);
}

/* =========================================================
   ERROR HANDLING
   ========================================================= */

/**
 * Graceful error handling with user notification.
 */
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

/* =========================================================
   LOGGING
   ========================================================= */

/**
 * Centralized logging.
 * This dataset is the foundation for analytics & ML.
 */
function logSubmission(data, status) {
  const sheet = SpreadsheetApp.getActive()
    .getSheetByName(SHEET_LOG);

  if (!sheet) return;

  sheet.appendRow([
    new Date(),
    data.team || "",
    data.date || "",
    data.slot || "",
    data.email || "",
    status
  ]);
}

/* =========================================================
   ML / ANALYTICS (EMBEDDED, OFFLINE)
   ========================================================= */

/**
 * Collect lightweight features for downstream ML analysis.
 * ML training & evaluation are executed offline
 * on historical logs to support capacity planning.
 */
function collectMLFeatures(data) {
  const features = {
    submittedHour: data.submittedAt.getHours(),
    dayOfWeek: new Date(data.date).getDay(),
    durationMinutes: EVENT_DURATION_MINUTES
  };

  // Features are implicitly stored via logSubmission().
  // This function documents ML intent and system design.
  return features;
}

/* =========================================================
   ML TRAINING & EVALUATION (LOG-BASED)
   ========================================================= */

/**
 * Train a simple logistic regression model on historical logs.
 * Implemented entirely in Google Apps Script (no external libs).
 *
 * Purpose:
 * - Predict probability of successful registration
 * - Support data-driven capacity optimization
 */
function runMLAnalytics() {
  const sheet = SpreadsheetApp.getActive()
    .getSheetByName(SHEET_LOG);

  if (!sheet || sheet.getLastRow() < 20) return;

  const data = sheet.getDataRange().getValues();
  const rows = data.slice(1);

  const X = [];
  const y = [];

  rows.forEach(r => {
    const status = String(r[5] || "");
    const label = status === "SUCCESS" ? 1 : 0;

    const ts = new Date(r[0]);
    X.push([
      1,
      ts.getHours(),
      ts.getDay()
    ]);
    y.push(label);
  });

  const model = trainLogisticRegression(X, y, 600, 0.05);
  return model;
}

/* =========================
   ML CORE (LOGISTIC REG)
   ========================= */

function trainLogisticRegression(X, y, iters, lr) {
  const d = X[0].length;
  let w = new Array(d).fill(0);

  for (let it = 0; it < iters; it++) {
    const grad = new Array(d).fill(0);

    for (let i = 0; i < X.length; i++) {
      const p
