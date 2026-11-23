# SalesFlow CRM
**A Cloud-Based Customer Relationship Management System (SaaS CRM)**

Enterprise Multi-Tier Architecture &amp; DevOps Showcase

---

## 🚀 Quick Start (Running the Website)

### Option 1: One-Click Launch (Windows)
Double-click:
```
start_salesflow.bat
```
Your default web browser will automatically open:
```
http://localhost:5000
```

### Option 2: Using Python Terminal
```bash
python server.py
```
Then open `http://localhost:5000` in Chrome/Edge/Firefox.

### Option 3: Using Node.js Terminal
```bash
node server.js
```
Then open `http://localhost:5000`.

---

## 🧪 Running the Automated QA & Regression Test Suite
In your terminal, execute:
```bash
python test_salesflow_crm.py
```
This runs 10 automated test cases (Unit tests, REST API endpoints, RBAC permissions, database foreign keys, and OWASP security checks) with a 100% Pass Rate.

---

## 🗄️ MySQL Database Setup (For MySQL Workbench)
If your teacher/evaluator asks to see the database in MySQL Workbench:
1. Open **MySQL Workbench**.
2. Open file: `salesflow_crm_database_setup.sql`.
3. Click the **Execute** button (⚡).
4. All 8 normalized tables, views (`vw_sales_rep_performance`, `vw_pipeline_stage_summary`), stored procedures (`sp_convert_lead_to_deal`), and 100+ realistic rows will be loaded into the `salesflow_crm` schema!

---

## 📁 Repository Structure
```
sales_flow_crm/
├── public/
│   ├── index.html                  # Responsive SaaS UI with Dashboard, Kanban, Leads, Tasks
│   ├── styles.css                  # Modern Tailwind-inspired stylesheet & animations
│   └── app.js                      # Client application logic, real-time KPI calculations
├── server.py                       # Zero-dependency Python REST API server
├── server.js                       # Companion Node.js REST API server
├── salesflow_crm_database_setup.sql# Complete MySQL Workbench schema & 100+ seed records
├── test_salesflow_crm.py           # Automated QA & Regression Test Suite
├── Dockerfile                      # Containerization configuration
├── docker-compose.yml              # Multi-container orchestration (App + MySQL)
├── .github/workflows/ci-cd.yml     # Automated CI/CD pipeline using GitHub Actions
├── start_salesflow.bat             # One-click Windows application launcher
├── PROJECT_DOCUMENTATION.md        # Full project documentation & architectural report
├── VIVA_PRESENTATION_GUIDE.md      # Comprehensive Viva Q&A guide for evaluation
└── salesflow_data.json             # Persistent CRM data store
```

