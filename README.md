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
- Enforces configurable business rules (quota, capacity, time window)
- Automatic email notifications (success / error)
- Calendar event creation with standardized titles and metadata

### Capacity & Operations Management
- Slot-level capacity tracking
- Remaining-capacity enforcement before scheduling
- Centralized control via configuration flags
- Designed to support both rule-based and data-driven decisions

---

## 2. Data Engineering

### Event & Form Logging
All submissions are logged into a structured **system log** containing:
- Timestamp
- Outcome (SUCCESS / ERROR)
- Requested date & time slot
- Submission metadata (anonymizable)

This log serves as the **single source of truth** for analytics and
machine learning.

### Derived Signals
From historical logs, the system can derive:
- Temporal demand patterns (day of week, hour)
- Success / failure frequency by time slot
- Capacity pressure indicators

---

## 3. Machine Learning (Embedded, Applied)

This system includes a **lightweight embedded ML layer**
implemented directly in Google Apps Script (no external libraries).

### ML Objective
Estimate the probability of a successful registration attempt
based on historical operational data.

### Model
- Binary Logistic Regression
- Implemented from scratch using gradient descent
- Trained offline on historical system logs

### Features
- Submission hour
- Day-of-week
- Session duration (configuration-driven)

### Training & Evaluation
- Gradient descent optimization
- Offline evaluation on historical logs
- Feature weight inspection for interpretability

### Outputs
- Learned feature weights
- Success probability estimation (offline, log-based)
- Summary indicators for operational review

> Note: The ML component is designed for **decision support and
> capacity planning**, not for large-scale or deep learning research.

---

## 4. Capacity Optimization Strategy

Two complementary approaches are supported:

1. **Rule-based**
   - Deterministic constraints (quota, capacity, time windows)
   - Fast and predictable enforcement

2. **ML-informed**
   - Uses learned patterns from historical logs
   - Highlights high-risk or high-demand time slots
   - Supports evidence-based capacity adjustment

---

## 5. System Design Highlights

- Clear separation of concerns (validation, capacity, scheduling, logging)
- Public-safe configuration with private value injection
- Fault-tolerant execution (ML never blocks core workflow)
- Designed for real operational usage, not demo-only scripts
- Suitable for constrained execution environments (Google Apps Script)

---

## 6. Project Scope

This project demonstrates:
- Applied machine learning in production-like settings
- Data engineering from operational logs
- End-to-end automation on Google Workspace
- Decision-support system design

It is **not** intended as a machine learning research benchmark,
but as a practical, data-driven operational system.
