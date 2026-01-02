/**
 * PUBLIC CONFIGURATION FILE
 * Organization-specific values are injected via config.private.gs
 * This file is safe to publish on GitHub.
 */

/* =========================
   ORGANIZATION & CONTACT
   ========================= */
const ORG_LABEL = typeof REAL_ORG_NAME !== "undefined"
  ? REAL_ORG_NAME
  : "Internal Training Center";

const SUPPORT_EMAIL = typeof REAL_SUPPORT_EMAIL !== "undefined"
  ? REAL_SUPPORT_EMAIL
  : "support@example.com";

const LOCATION_TXT = typeof REAL_LOCATION !== "undefined"
  ? REAL_LOCATION
  : "Internal Location";

/* =========================
   CALENDAR & FILE IDS
   ========================= */
const CALENDAR_ID = typeof REAL_CALENDAR_ID !== "undefined"
  ? REAL_CALENDAR_ID
  : "REDACTED_CALENDAR_ID";

const PUBLIC_FILE_ID = typeof REAL_PUBLIC_FILE_ID !== "undefined"
  ? REAL_PUBLIC_FILE_ID
  : "";

/* =========================
   EVENT & FORM SETTINGS
   ========================= */
const EVENT_TITLE_PREFIX = "Group Study Session - Team:";
const EVENT_DURATION_MINUTES = 120;

const REGISTRATION_OPEN_DAY = 1;   // Monday
const REGISTRATION_CLOSE_DAY = 5;  // Friday
const REGISTRATION_CLOSE_HOUR = 17;

/* =========================
   CAPACITY RULES
   ========================= */
const DEFAULT_SLOT_CAPACITY = 8;
const MAX_WEEKLY_REGISTRATION = 2;

/* =========================
   STAFF / DUTY
   ========================= */
const DUTY_STAFFS = typeof REAL_DUTY_STAFFS !== "undefined"
  ? REAL_DUTY_STAFFS
  : {};

/* =========================
   SHEET NAMES (GENERIC)
   ========================= */
const SHEET_FORM_RESPONSES = "Form Responses 1";
const SHEET_CAPACITY = "Capacity";
const SHEET_REMAINING = "Remaining";
const SHEET_LOG = "Log";
const SHEET_PUBLIC = "Public";
const SHEET_ANALYTICS = "Analytics";

/* =========================
   FLAGS
   ========================= */
const ENABLE_EMAIL_NOTIFICATION = true;
const ENABLE_CALENDAR_CREATION = true;
/* =========================
   ML / ANALYTICS
   ========================= */

// Enable embedded ML analytics (logistic regression, demand analysis)
const ENABLE_ML_ANALYTICS = true;

// Minimum samples required before training ML models
const ML_MIN_SAMPLES = 20;

// Lookback window (days) for ML / demand analysis
const ML_LOOKBACK_DAYS = 120;
