# GAS Registration & Capacity Optimization System

A production-grade Google Apps Script system for managing group registrations,
time-slot capacity, scheduling automation, and data-driven capacity optimization.

This project combines **system engineering**, **data processing**, and
**applied machine learning** to support operational decision-making
in a real-world educational environment.

---

## 1. Core Capabilities

### Registration & Scheduling
- Google Form → Apps Script → Google Calendar automation
- Enforces:
  - Per-student weekly limits
  - Session-based capacity constraints
  - Consecutive time-slot validation
- Automatic email notifications (success / failure)
- Calendar event creation with reminders and ICS export

### Capacity & Operations Management
- Slot-level capacity tracking (60-minute granularity)
- Real-time remaining-capacity computation
- Automatic open / close of Google Form based on:
  - Time window
  - Remaining capacity
  - Planned schedules
- Public read-only schedule synchronization

---

## 2. Data Engineering

### Event & Form Logging
All submissions are logged into a structured dataset (`MedSim_Log`) containing:
- Timestamp
- Outcome (SUCCESS / FAIL)
- Failure reason (if any)
- Requested date & time slots
- Merged session duration
- User metadata (anonymizable)

This log serves as the **single source of truth** for analytics and ML.

### Derived Datasets
- Slot-level remaining capacity snapshots
- Historical capacity utilization
- Demand statistics by:
  - Day of week
  - Session (morning / afternoon / evening)
  - Time slot

---

## 3. Machine Learning (Embedded, Applied)

This system includes a **lightweight machine learning layer**
implemented directly in Google Apps Script (no external libraries).

### ML Objective
Predict the probability that a registration attempt will succeed,
given temporal and duration-based features.

### Model
- Binary Logistic Regression
- Trained from historical system logs

### Features
- Submission hour
- Day-of-week (one-hot encoded)
- Requested session duration (hours)

### Training & Evaluation
- Stratified train/test split
- Gradient descent optimization
- Evaluation metrics:
  - AUROC
  - AUPRC
  - F1-score (threshold tuned)
  - Confusion matrix

### Outputs
- Per-request success probability
- Feature weight inspection
- Summary metrics for operational review

> Note: The goal is **decision support and capacity planning**,
> not large-scale or deep learning research.

---

## 4. Capacity Optimization

Two complementary approaches are implemented:

1. **Rule-based (Fast)**
   - Uses historical fail rates and demand frequency
   - Produces quick capacity suggestions per slot

2. **ML-informed**
   - Uses ML-derived success probabilities
   - Identifies high-risk time slots
   - Supports evidence-based capacity adjustment

---

## 5. System Design Highlights

- Concurrency-safe (script locks)
- Idempotent calendar operations
- Fault-tolerant logging & fallback paths
- Separation of:
  - Public configuration
  - Private organization-specific settings
- Designed for real ensured usage, not demo-only code

---

## 6. Project Scope

This project demonstrates:
- Applied Machine Learning
- Data engineering in constrained environments
- End-to-end automation
- Decision-support system design

It is **not** intended as a machine learning research benchmark,
but as a real-world, data-driven operational system.
