# SalesFlow CRM – Project Documentation & Academic Report
**A Cloud-Based Customer Relationship Management System (SaaS CRM)**

- **Project Title:** SalesFlow CRM – Cloud-Based Customer Relationship Management System
- **Engineering Track:** Full-Stack Web Development, Cloud Computing &amp; QA Engineering
- **Architecture:** Client-Server Multi-tier (React UI + RESTful Backend + Relational Database)
- **Deployment & Cloud:** Docker, AWS (EC2, RDS, S3), GitHub Actions CI/CD Pipeline

---

## 1. Executive Summary & Problem Statement
Modern businesses struggle with disconnected spreadsheets, untracked leads, delayed sales cycles, and lack of real-time visibility into pipeline stages. Sales representatives often lose deals due to missing follow-ups, and sales managers lack actionable data to forecast monthly revenue.

**SalesFlow CRM** resolves these challenges by providing:
1. **Centralized Lead & Contact Management:** Capturing prospective customer accounts, lead scoring (0–100), and one-click conversion into active sales deals.
2. **Interactive 6-Stage Kanban Pipeline:** Visualizing deals across fixed lifecycle stages (Discovery → Qualification → Proposal → Negotiation → Closed Won → Closed Lost).
3. **Role-Based Access Control (RBAC):** Providing differentiated privilege levels for Administrator, Sales Manager, and Sales Executives.
4. **Integrated Communication & Tasks:** Scheduling phone calls, demos, follow-ups, and dispatching templated emails directly within the CRM.
5. **Demonstration of Software Testing & DevOps:** Automated API tests, Database integrity validation, Docker containerization, and GitHub Actions CI/CD pipeline.

---

## 2. System Architecture
```
  +-------------------------------------------------------------+
  |              Client Layer (Modern React UI)                |
  |   Dashboard | Kanban Pipeline | Leads | Contacts | Tasks    |
  |     Email Composer | DevOps & QA Center | Role Switcher     |
  +-------------------------------------------------------------+
                               |
                        HTTP / REST APIs
                               |
  +-------------------------------------------------------------+
  |                 Backend REST API Service                    |
  |   Authentication & RBAC Middleware | Lead Conversion Engine  |
  |     Pipeline Stage Logic | Analytics & Aggregate Engine     |
  +-------------------------------------------------------------+
                               |
                         SQL / Database
                               |
  +-------------------------------------------------------------+
  |             Relational Database (MySQL / PostgreSQL)        |
  |   8 Normalized Tables: users, leads, contacts, deals,       |
  |   pipeline_stages, tasks, notes, email_logs, audit_logs     |
  |   Stored Procedures & Views: vw_sales_rep_performance, etc.  |
  +-------------------------------------------------------------+
```

---

## 3. Database Schema Design (8 Normalized Tables)

1. **`users`**: System accounts with role enforcement (`admin`, `sales_manager`, `sales_executive`).
2. **`pipeline_stages`**: Exactly **6 fixed stages**:
   - `Stage 1: Lead In / Discovery` (10% default probability)
   - `Stage 2: Contact Made / Qualification` (30% default probability)
   - `Stage 3: Proposal Sent / Pitch` (50% default probability)
   - `Stage 4: Negotiation / Review` (75% default probability)
   - `Stage 5: Closed Won` (100% win)
   - `Stage 6: Closed Lost` (0% lost)
3. **`contacts`**: Verified company decision-makers and accounts.
4. **`leads`**: Inbound/outbound prospective clients with source tracking (`Website`, `LinkedIn`, `Referral`, `Google Search`, `Cold Call`, `Webinar`) and lead score (0–100).
5. **`deals`**: Commercial opportunities tracking monetary value (in INR), close date, stage ID, and assigned representative.
6. **`tasks`**: Action items (`Call`, `Meeting`, `Demo`, `Email`, `Follow-up`) with priority tags (`High`, `Medium`, `Low`) and completion status.
7. **`notes`**: Interaction history with audit timestamps.
8. **`email_logs`**: Outbound emails sent via built-in business templates.
9. **`audit_activity_logs`**: System audit trail logging all actions with user ID and IP address.

---

## 4. Key Functional Modules

### 1. Executive Dashboard & Analytics
- **KPI Metrics:** Closed Won Revenue (₹53.5+ Lakhs), Total Active Pipeline (₹84.4+ Lakhs), Win Rate (66.7%), Active Leads (20+).
- **Revenue Growth Chart:** Visualizing monthly revenue progression.
- **Pipeline Breakdown:** Funnel chart detailing deal distribution across the 6 stages.
- **Sales Rep Leaderboard:** Tracking individual quota attainment and closed deals.

### 2. Interactive Kanban Pipeline
- Visual board showing all 6 columns.
- Move deals between stages with 1-click stage advancement buttons or drag-and-drop.
- Real-time recalculation of total stage revenue and probability weights.

### 3. Lead Conversion Engine
- Click **"Convert to Deal"** on any qualified lead.
- The system automatically creates a Contact account and spawns a Deal in Stage 2 (Qualification), updating the lead status to "Qualified".

### 4. Integrated Email Center
- Pre-loaded with ready-to-use SaaS templates:
  - Welcome & Introduction
  - Product Demo Follow-up
  - Commercial Quotation Proposal
- Dispatches emails and appends to the delivery history log.

---

## 5. Software Quality Assurance & Testing Suite
The project includes an automated test suite (`test_salesflow_crm.py`) validating:
- **Unit & Schema Tests:** Exact count of 6 pipeline stages and lead scoring bounds (0–100).
- **RBAC Security Tests:** Permission boundary tests between Admin, Sales Manager, and Sales Executives.
- **Database Integrity:** Foreign key integrity linking deals to contacts and reps.
- **OWASP Top 10 Security:** SQL injection sanitization and cross-site scripting (XSS) input filtering.
- **Performance Benchmarks:** Simulated k6/JMeter concurrent load latency under 50ms.

---

## 6. DevOps & Cloud Deployment (Docker & AWS)
- **Containerization:** Multi-stage `Dockerfile` and `docker-compose.yml` orchestrating the application and database container.
- **CI/CD Pipeline:** GitHub Actions workflow (`.github/workflows/ci-cd.yml`) executing linting, unit tests, Docker build, and AWS deployment triggers on git push.
- **Cloud Architecture:**
  - **AWS EC2:** Containerized web application host.
  - **AWS RDS:** Managed MySQL / PostgreSQL relational database.
  - **AWS S3:** Storage bucket for static assets and attachments.
  - **AWS Route 53 / CloudFront:** DNS routing and CDN caching.

