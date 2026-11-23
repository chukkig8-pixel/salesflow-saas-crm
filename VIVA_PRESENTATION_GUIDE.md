# SalesFlow CRM – Viva Presentation & Evaluation Guide
**Project Viva & Evaluation Walkthrough**

This guide contains the exact questions, architectural concepts, and live demonstration steps your evaluator ("ma'am") might ask during the project review.

---

## 1. Quick 2-Minute Demonstration Flow

1. **Open the Web Application:**
   - Double-click `start_salesflow.bat` or run `python server.py`.
   - The browser opens automatically at `http://localhost:5000`.
2. **Introduce the Project:**
   - *"Good morning/afternoon Ma'am. Our project is **SalesFlow CRM**, an enterprise cloud-based SaaS Customer Relationship Management system."*
3. **Showcase the Role-Based Access Control (RBAC):**
   - Click the profile button in the top-right corner.
   - Show how you can switch between **Admin (System Administrator)**, **Sales Manager (Sales Manager)**, and **Sales Executive (Aarav Sharma)**.
4. **Demonstrate Deals Pipeline (Kanban Board):**
   - Click on the **Deals Pipeline** tab.
   - Point out the **6 fixed pipeline stages** (Discovery, Qualification, Proposal, Negotiation, Closed Won, Closed Lost) and show the total deal amounts in each column.
   - Click the `▶` button on any deal (e.g., *Tata Digital* or *Infosys*) to advance it to the next stage.
   - Show how the stage metrics and total revenue update instantly in real time!
5. **Demonstrate Lead Conversion:**
   - Go to the **Leads** tab.
   - Click **"Convert to Deal"** on a lead (e.g., *Vivaan Saxena - CloudScale*).
   - Point out that it converts the lead into an active customer contact and moves it into the pipeline!
6. **Showcase the "DevOps & QA Center" (Most Impressive for Evaluators):**
   - Click on the **DevOps & QA Center** tab.
   - Click the green **"Run Automated Test Suite"** button.
   - Watch the live test suite execute 10 automated test cases (RBAC security, REST API validation, Database foreign keys, SQL injection defense) with **100% Pass Rate**.
   - Show the **GitHub Actions CI/CD Pipeline** diagram and the **AWS Cloud Architecture** topology.
7. **Showcase the MySQL Database in MySQL Workbench:**
   - Show `salesflow_crm_database_setup.sql` in MySQL Workbench with all 8 normalized tables, views (`vw_sales_rep_performance`), and stored procedures (`sp_convert_lead_to_deal`).

---

## 2. Frequently Asked Viva Questions & Answers

### Q1: What is the architecture of your CRM system?
**Answer:**
> *"Ma'am, SalesFlow CRM follows a 3-tier client-server architecture:
> 1. **Presentation Layer:** A responsive web frontend with an interactive Kanban board, real-time KPI charts, and role switching.
> 2. **Application / REST API Layer:** A RESTful backend managing authentication, lead conversion logic, and CRUD operations.
> 3. **Data Layer:** A normalized relational database (MySQL/PostgreSQL) with 8 tables, foreign key constraints, stored procedures, and analytical views."*

---

### Q2: Why are there exactly 6 pipeline stages?
**Answer:**
> *"Our project requirements specify a standardized 6-stage sales cycle used in modern B2B SaaS organizations:
> 1. **Lead In / Discovery (10%):** Requirements gathering and initial qualification.
> 2. **Contact Made / Qualification (30%):** Validating budget, authority, need, and timeline (BANT).
> 3. **Proposal Sent / Pitch (50%):** Formal quote, demo, and solution architecture submitted.
> 4. **Negotiation / Review (75%):** Legal terms, pricing adjustments, and SLA sign-off.
> 5. **Closed Won (100%):** Deal completed and contract signed.
> 6. **Closed Lost (0%):** Deal rejected or postponed."*

---

### Q3: How did you implement software testing and DevOps in this project?
**Answer:**
> *"The project was designed specifically to showcase quality assurance and DevOps practices:
> - **Automated Testing:** We built an automated test suite (`test_salesflow_crm.py`) covering REST API endpoints, RBAC permission checks, database constraints, and OWASP security (SQL injection and XSS prevention).
> - **Containerization:** We configured a multi-stage `Dockerfile` and `docker-compose.yml` to run the app and database in isolated containers.
> - **CI/CD Pipeline:** We created GitHub Actions workflow files (`.github/workflows/ci-cd.yml`) that automatically run linting and unit tests on git push, build the Docker image, and simulate deployment to AWS EC2."*

---

### Q4: How is Role-Based Access Control (RBAC) enforced?
**Answer:**
> *"We defined three hierarchical roles:
> - **Admin (System Administrator):** Full system configuration, user management, audit trails, and automated test execution.
> - **Sales Manager (Sales Manager):** Team quotas, pipeline visibility, deal stage approvals, and performance metrics.
> - **Sales Executive (Aarav Sharma):** Personal leads, assigned deals, tasks, and customer interaction notes."*

---

### Q5: If Ma'am asks to see the database directly in MySQL Workbench:
**Answer:**
> 1. Open MySQL Workbench.
> 2. Open `salesflow_crm_database_setup.sql` (located in `sales_flow_crm/salesflow_crm_database_setup.sql`).
> 3. Click the lightning bolt ⚡ to execute.
> 4. Run `SELECT * FROM vw_pipeline_stage_summary;` or `SELECT * FROM deals;` to show all the seeded records matching the names in your Workbench screenshot!

