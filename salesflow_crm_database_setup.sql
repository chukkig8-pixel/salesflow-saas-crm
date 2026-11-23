-- =====================================================================
-- SalesFlow CRM - Complete Database Schema & Realistic Seed Script
-- Project: Cloud-Based SaaS Customer Relationship Management System
-- Enterprise Cloud Architecture
-- Target RDBMS: MySQL 8.0+ / MariaDB / PostgreSQL compatible syntax
-- =====================================================================

DROP DATABASE IF EXISTS salesflow_crm;
CREATE DATABASE salesflow_crm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE salesflow_crm;

-- ---------------------------------------------------------------------
-- 1. Table: users (System Users with Role-Based Access Control)
-- ---------------------------------------------------------------------
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL DEFAULT 'pbkdf2_sha256$hashed_demo_pw',
    role ENUM('admin', 'sales_manager', 'sales_executive') NOT NULL DEFAULT 'sales_executive',
    department VARCHAR(50) DEFAULT 'Sales',
    phone VARCHAR(20),
    avatar_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_role (role),
    INDEX idx_user_email (email)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 2. Table: pipeline_stages (Fixed 6 Pipeline Stages)
-- ---------------------------------------------------------------------
CREATE TABLE pipeline_stages (
    id INT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    stage_order INT NOT NULL UNIQUE,
    probability INT NOT NULL COMMENT 'Default probability percentage 0-100',
    color_hex VARCHAR(10) NOT NULL,
    description TEXT
) ENGINE=InnoDB;

INSERT INTO pipeline_stages (id, name, stage_order, probability, color_hex, description) VALUES
(1, 'Lead In / Discovery', 1, 10, '#6366F1', 'Initial contact identified, requirements gathering'),
(2, 'Contact Made / Qualification', 2, 30, '#3B82F6', 'Need, budget, timeline, and decision-maker verified'),
(3, 'Proposal Sent / Pitch', 3, 50, '#06B6D4', 'Formal proposal, quote, or demo presented'),
(4, 'Negotiation / Review', 4, 75, '#F59E0B', 'Contract terms, pricing, and SLA under review'),
(5, 'Closed Won', 5, 100, '#10B981', 'Contract signed, deal converted to paying client'),
(6, 'Closed Lost', 6, 0, '#EF4444', 'Deal did not proceed or lost to competitor');

-- ---------------------------------------------------------------------
-- 3. Table: contacts (Customer Accounts & Stakeholders)
-- ---------------------------------------------------------------------
CREATE TABLE contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(120) NOT NULL,
    phone VARCHAR(25),
    company VARCHAR(100) NOT NULL,
    title VARCHAR(80),
    industry VARCHAR(50),
    city VARCHAR(50),
    state VARCHAR(50),
    country VARCHAR(50) DEFAULT 'India',
    assigned_to_user_id INT,
    status ENUM('Active', 'Inactive', 'Lead', 'Customer') DEFAULT 'Lead',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to_user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_contacts_company (company),
    INDEX idx_contacts_email (email)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 4. Table: leads (Inbound & Outbound Prospective Customers)
-- ---------------------------------------------------------------------
CREATE TABLE leads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    company VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL,
    phone VARCHAR(25),
    lead_source ENUM('Website', 'LinkedIn', 'Referral', 'Cold Call', 'Google Search', 'Webinar') DEFAULT 'Website',
    lead_status ENUM('New', 'Contacted', 'Qualified', 'Lost') DEFAULT 'New',
    lead_score INT DEFAULT 50 COMMENT 'AI/Rule-based qualification score 0-100',
    estimated_value DECIMAL(12, 2) DEFAULT 0.00,
    assigned_to_user_id INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to_user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_leads_status (lead_status),
    INDEX idx_leads_source (lead_source),
    INDEX idx_leads_score (lead_score)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 5. Table: deals (Sales Deals Monitored on Kanban Pipeline)
-- ---------------------------------------------------------------------
CREATE TABLE deals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    contact_id INT,
    stage_id INT NOT NULL,
    amount DECIMAL(14, 2) NOT NULL DEFAULT 0.00,
    expected_close_date DATE,
    probability INT DEFAULT 10,
    assigned_to_user_id INT,
    deal_status ENUM('Open', 'Won', 'Lost') DEFAULT 'Open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE SET NULL,
    FOREIGN KEY (stage_id) REFERENCES pipeline_stages(id),
    FOREIGN KEY (assigned_to_user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_deals_stage (stage_id),
    INDEX idx_deals_status (deal_status),
    INDEX idx_deals_amount (amount)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 6. Table: tasks (Activities, Follow-ups, and Call Logs)
-- ---------------------------------------------------------------------
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    task_type ENUM('Call', 'Meeting', 'Email', 'Follow-up', 'Demo') DEFAULT 'Follow-up',
    priority ENUM('High', 'Medium', 'Low') DEFAULT 'Medium',
    due_date DATETIME NOT NULL,
    status ENUM('Pending', 'Completed', 'Cancelled') DEFAULT 'Pending',
    assigned_to_user_id INT,
    related_to_type ENUM('Lead', 'Contact', 'Deal') DEFAULT 'Lead',
    related_to_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to_user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_tasks_status (status),
    INDEX idx_tasks_priority (priority),
    INDEX idx_tasks_due (due_date)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 7. Table: notes (Customer Interaction Notes & Timelines)
-- ---------------------------------------------------------------------
CREATE TABLE notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    author_id INT,
    related_to_type ENUM('Lead', 'Contact', 'Deal') NOT NULL,
    related_to_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_notes_target (related_to_type, related_to_id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 8. Table: email_logs (Integrated Email Communications)
-- ---------------------------------------------------------------------
CREATE TABLE email_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT,
    recipient_email VARCHAR(120) NOT NULL,
    recipient_name VARCHAR(100),
    subject VARCHAR(200) NOT NULL,
    body TEXT NOT NULL,
    template_name VARCHAR(50),
    status ENUM('Sent', 'Delivered', 'Opened', 'Failed') DEFAULT 'Sent',
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 9. Table: audit_activity_logs (Compliance & Security Audit Trail)
-- ---------------------------------------------------------------------
CREATE TABLE audit_activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INT,
    description TEXT,
    ip_address VARCHAR(45) DEFAULT '127.0.0.1',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_audit_created (created_at)
) ENGINE=InnoDB;

-- =====================================================================
-- DATABASE VIEWS (For Analytics & Ma'am Viva Demonstration)
-- =====================================================================

-- View 1: Rep Performance Analytics
CREATE OR REPLACE VIEW vw_sales_rep_performance AS
SELECT 
    u.id AS rep_id,
    u.full_name AS rep_name,
    u.role,
    COUNT(DISTINCT l.id) AS total_leads_assigned,
    COUNT(DISTINCT d.id) AS total_deals_managed,
    SUM(CASE WHEN d.deal_status = 'Won' THEN d.amount ELSE 0 END) AS total_revenue_won,
    SUM(CASE WHEN d.deal_status = 'Open' THEN d.amount ELSE 0 END) AS active_pipeline_value,
    COUNT(CASE WHEN d.deal_status = 'Won' THEN 1 END) AS won_deals_count
FROM users u
LEFT JOIN leads l ON u.id = l.assigned_to_user_id
LEFT JOIN deals d ON u.id = d.assigned_to_user_id
GROUP BY u.id, u.full_name, u.role;

-- View 2: Pipeline Stage Summary
CREATE OR REPLACE VIEW vw_pipeline_stage_summary AS
SELECT 
    ps.id AS stage_id,
    ps.name AS stage_name,
    ps.stage_order,
    COUNT(d.id) AS deals_count,
    COALESCE(SUM(d.amount), 0.00) AS total_value,
    COALESCE(AVG(d.amount), 0.00) AS average_deal_value
FROM pipeline_stages ps
LEFT JOIN deals d ON ps.id = d.stage_id AND d.deal_status = 'Open'
GROUP BY ps.id, ps.name, ps.stage_order
ORDER BY ps.stage_order;

-- =====================================================================
-- STORED PROCEDURES (For Database & Backend Validation)
-- =====================================================================
DELIMITER //

CREATE PROCEDURE sp_convert_lead_to_deal(
    IN p_lead_id INT,
    IN p_deal_title VARCHAR(150),
    IN p_amount DECIMAL(14,2),
    IN p_user_id INT,
    OUT p_new_deal_id INT
)
BEGIN
    DECLARE v_first_name VARCHAR(50);
    DECLARE v_last_name VARCHAR(50);
    DECLARE v_email VARCHAR(120);
    DECLARE v_phone VARCHAR(25);
    DECLARE v_company VARCHAR(100);
    DECLARE v_contact_id INT;

    -- Fetch lead details
    SELECT first_name, last_name, email, phone, company
    INTO v_first_name, v_last_name, v_email, v_phone, v_company
    FROM leads WHERE id = p_lead_id;

    -- Create or find contact
    INSERT INTO contacts (first_name, last_name, email, phone, company, assigned_to_user_id, status)
    VALUES (v_first_name, v_last_name, v_email, v_phone, v_company, p_user_id, 'Customer');
    SET v_contact_id = LAST_INSERT_ID();

    -- Create deal in Stage 2 (Qualification)
    INSERT INTO deals (title, contact_id, stage_id, amount, expected_close_date, probability, assigned_to_user_id, deal_status)
    VALUES (p_deal_title, v_contact_id, 2, p_amount, DATE_ADD(CURRENT_DATE, INTERVAL 30 DAY), 30, p_user_id, 'Open');
    SET p_new_deal_id = LAST_INSERT_ID();

    -- Update lead status to Qualified
    UPDATE leads SET lead_status = 'Qualified' WHERE id = p_lead_id;

    -- Log audit trail
    INSERT INTO audit_activity_logs (user_id, action, entity_type, entity_id, description)
    VALUES (p_user_id, 'CONVERT_LEAD', 'Lead', p_lead_id, CONCAT('Converted lead #', p_lead_id, ' to Deal #', p_new_deal_id));
END //

DELIMITER ;

-- =====================================================================
-- REALISTIC SEED DATA (100+ Rows matching user's Workbench pools)
-- Pool names: Aarav, Vikram, Priya, Rohan, Ananya, Kabir...
-- =====================================================================

-- 1. Insert System Users (System Leadership and Team)
INSERT INTO users (id, full_name, email, role, department, phone, avatar_url) VALUES
(1, 'System Administrator', 'admin@salesflow.com', 'admin', 'Executive Leadership', '+91 98765 43210', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'),
(2, 'Sales Manager', 'manager@salesflow.com', 'sales_manager', 'Sales Management', '+91 98450 12345', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'),
(3, 'Aarav Sharma', 'aarav.sharma@salesflow.com', 'sales_executive', 'Enterprise Sales', '+91 98111 22334', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
(4, 'Rohan Patel', 'rohan.patel@salesflow.com', 'sales_executive', 'SaaS Accounts', '+91 97222 33445', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'),
(5, 'Ananya Singh', 'ananya.singh@salesflow.com', 'sales_executive', 'SMB Sales', '+91 99333 44556', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150');

-- 2. Insert Contacts (Realistic Enterprise and Tech clients in India & Global)
INSERT INTO contacts (id, first_name, last_name, email, phone, company, title, industry, city, state, assigned_to_user_id, status) VALUES
(1, 'Vikram', 'Malhotra', 'vikram.m@tatadigital.com', '+91 98201 11223', 'Tata Digital', 'VP Technology', 'Information Technology', 'Mumbai', 'Maharashtra', 3, 'Customer'),
(2, 'Priya', 'Verma', 'priya.verma@infosys.com', '+91 98450 99887', 'Infosys Ltd', 'Procurement Director', 'Consulting & IT', 'Bengaluru', 'Karnataka', 2, 'Customer'),
(3, 'Kabir', 'Mehta', 'kabir.mehta@reliancejio.com', '+91 98220 55443', 'Reliance Jio', 'Enterprise Solutions Lead', 'Telecommunications', 'Mumbai', 'Maharashtra', 3, 'Active'),
(4, 'Sneha', 'Gupta', 'sneha.gupta@zomato.in', '+91 99110 33221', 'Zomato HQ', 'Head of Sales Ops', 'Food Tech', 'Gurugram', 'Haryana', 4, 'Active'),
(5, 'Arjun', 'Reddy', 'arjun.reddy@wipro.com', '+91 98860 44332', 'Wipro Cloud Solutions', 'Director of Infrastructure', 'Cloud & IT Services', 'Bengaluru', 'Karnataka', 5, 'Customer'),
(6, 'Divya', 'Nair', 'divya.nair@swiggy.in', '+91 98470 66554', 'Bundl Technologies (Swiggy)', 'Product Operations VP', 'Hyperlocal Delivery', 'Bengaluru', 'Karnataka', 2, 'Active'),
(7, 'Sameer', 'Deshmukh', 'sameer.d@bajajfinserv.in', '+91 98900 88776', 'Bajaj Finserv', 'Chief Information Officer', 'FinTech & Banking', 'Pune', 'Maharashtra', 3, 'Customer'),
(8, 'Tanvi', 'Shah', 'tanvi.shah@razorpay.com', '+91 99800 22110', 'Razorpay Payments', 'VP Growth & Partnerships', 'FinTech', 'Bengaluru', 'Karnataka', 4, 'Customer'),
(9, 'Rahul', 'Iyer', 'rahul.iyer@hcltech.com', '+91 98101 44556', 'HCL Technologies', 'Global Accounts VP', 'Information Technology', 'Noida', 'Uttar Pradesh', 5, 'Active'),
(10, 'Meera', 'Sundaram', 'meera.s@tcs.com', '+91 98401 77889', 'Tata Consultancy Services', 'Digital Transformation Head', 'IT Services', 'Chennai', 'Tamil Nadu', 3, 'Customer'),
(11, 'Nikhil', 'Joshi', 'nikhil.joshi@zerodha.com', '+91 98455 33441', 'Zerodha Broking', 'Infrastructure Lead', 'FinTech', 'Bengaluru', 'Karnataka', 4, 'Active'),
(12, 'Pooja', 'Chopra', 'pooja.c@cred.club', '+91 98205 66778', 'CRED Club', 'Head of Business Strategy', 'Consumer FinTech', 'Bengaluru', 'Karnataka', 2, 'Customer'),
(13, 'Siddharth', 'Bansal', 'siddharth@delhivery.com', '+91 99105 11223', 'Delhivery Logistics', 'Supply Chain Director', 'Logistics & Supply Chain', 'Gurugram', 'Haryana', 5, 'Active'),
(14, 'Kiara', 'Kapoor', 'kiara.k@paytm.com', '+91 98115 88990', 'One97 Communications (Paytm)', 'VP Merchant Ecosystem', 'Digital Payments', 'Noida', 'Uttar Pradesh', 3, 'Lead'),
(15, 'Akash', 'Bhatia', 'akash.bhatia@nykaa.com', '+91 98209 44556', 'FSN E-Commerce (Nykaa)', 'Director of Digital Products', 'E-Commerce Retail', 'Mumbai', 'Maharashtra', 4, 'Customer');

-- 3. Insert Leads (Pool of 20+ Realistic Qualified and Inbound Leads)
INSERT INTO leads (id, first_name, last_name, company, email, phone, lead_source, lead_status, lead_score, estimated_value, assigned_to_user_id, notes) VALUES
(1, 'Vivaan', 'Saxena', 'CloudScale Technologies', 'vivaan@cloudscale.io', '+91 98100 12001', 'Website', 'Qualified', 92, 450000.00, 3, 'Urgent need to migrate 200 sales reps from Excel to SaaS CRM'),
(2, 'Ishaan', 'Bose', 'FinBridge Analytics', 'ishaan.bose@finbridge.com', '+91 98200 13002', 'LinkedIn', 'Qualified', 85, 320000.00, 4, 'Evaluated competitor but prefers custom pipeline stages'),
(3, 'Reyansh', 'Trivedi', 'AeroLogix Logistics', 'reyansh@aerologix.in', '+91 98300 14003', 'Referral', 'Contacted', 68, 280000.00, 5, 'Demo scheduled with VP of Sales next Tuesday'),
(4, 'Sai', 'Kulkarni', 'AgroTech Digital Solutions', 'sai.k@agrotech.org', '+91 98400 15004', 'Google Search', 'New', 55, 180000.00, 2, 'Downloaded product whitepaper on cloud CRM benefits'),
(5, 'Krishna', 'Murthy', 'HealthFirst Hospital Group', 'k.murthy@healthfirst.med', '+91 98500 16005', 'Webinar', 'Contacted', 74, 550000.00, 3, 'Attended cloud security webinar; needs HIPAA/data sovereignty compliance'),
(6, 'Aryan', 'Singhal', 'UrbanMove EV Mobility', 'aryan@urbanmove.co', '+91 98600 17006', 'LinkedIn', 'Qualified', 88, 380000.00, 4, 'Fast growing EV startup scaling 50 new field sales agents'),
(7, 'Dhruv', 'Rathore', 'Jaipur Royal Handicrafts', 'dhruv@jaipurcrafts.com', '+91 98700 18007', 'Website', 'Lost', 35, 120000.00, 5, 'Budget constraint; postponed to next fiscal year'),
(8, 'Vihaan', 'Nambiar', 'Kerala Spices Global Export', 'vihaan@keralaspices.net', '+91 98800 19008', 'Referral', 'Qualified', 81, 290000.00, 3, 'Wants multilingual email integration and automated follow-ups'),
(9, 'Yash', 'Agrawal', 'Indore Steels & Tubes', 'yash.a@indoresteels.in', '+91 98900 20009', 'Cold Call', 'Contacted', 62, 220000.00, 4, 'Interested in tracking dealer network orders via CRM'),
(10, 'Diya', 'Sengupta', 'Kolkata Publishing House', 'diya@kolkatabooks.com', '+91 99000 21010', 'Website', 'New', 48, 150000.00, 5, 'Requested trial access for marketing team'),
(11, 'Ira', 'Bhardwaj', 'Apex Edutech Global', 'ira.b@apexedu.ac.in', '+91 99100 22011', 'Google Search', 'Qualified', 95, 620000.00, 2, 'College admissions counselling CRM requirement for 10 campuses'),
(12, 'Myra', 'Choudhury', 'Optima Pharma Laboratories', 'myra.c@optimapharma.com', '+91 99200 23012', 'Referral', 'Qualified', 89, 480000.00, 3, 'Medical rep route tracking and doctor interaction logging'),
(13, 'Sara', 'Khan', 'Deccan Solar Energy Ltd', 'sara.k@deccansolar.com', '+91 99300 24013', 'LinkedIn', 'Contacted', 70, 340000.00, 4, 'Needs sales quotation PDF generation module'),
(14, 'Aadhya', 'Pillai', 'Cochin Marine Exports', 'aadhya@cochinmarine.com', '+91 99400 25014', 'Website', 'New', 50, 210000.00, 5, 'Inquiry regarding export customs documentation integration'),
(15, 'Rajesh', 'Gadkari', 'Maharashtra Industrial Tools', 'rajesh.g@mitools.co.in', '+91 99500 26015', 'Cold Call', 'Lost', 28, 90000.00, 3, 'Decided to keep legacy offline software for now'),
(16, 'Suresh', 'Bhat', 'Karnataka Coffee Plantations', 'suresh.bhat@coorgcoffee.in', '+91 99600 27016', 'Referral', 'Contacted', 65, 260000.00, 4, 'Exploring B2B corporate gift subscription tracking'),
(17, 'Manoj', 'Tiwari', 'Ganga Clean Water Systems', 'manoj.tiwari@gangawater.org', '+91 99700 28017', 'Website', 'Qualified', 84, 390000.00, 2, 'CSR and municipal tender lead tracking system'),
(18, 'Lakshmi', 'Narayanan', 'Chennai Textile Mills', 'lakshmi@chennaitextiles.com', '+91 99800 29018', 'LinkedIn', 'Qualified', 79, 310000.00, 5, 'Bulk garment order sales pipeline management'),
(19, 'Karan', 'Chawla', 'Delhi NCR Real Estate Hub', 'karan.c@ncrhomes.in', '+91 99900 30019', 'Website', 'Qualified', 90, 750000.00, 3, 'Managing high-value luxury apartment buyer leads and site visits'),
(20, 'Varun', 'Kohli', 'SpeedyFleet Logistics', 'varun.k@speedyfleet.in', '+91 98111 31020', 'Referral', 'Contacted', 72, 360000.00, 4, 'Fleet telematics tracking and enterprise client contracts');

-- 4. Insert Deals across the 6 Kanban Pipeline Stages
INSERT INTO deals (id, title, contact_id, stage_id, amount, expected_close_date, probability, assigned_to_user_id, deal_status) VALUES
-- Stage 1: Lead In / Discovery (10%)
(1, 'Tata Digital - Cloud CRM Enterprise Rollout', 1, 1, 650000.00, '2026-12-20', 10, 3, 'Open'),
(2, 'AgroTech - Dealer Network Sales Portal', 4, 1, 240000.00, '2027-01-15', 10, 4, 'Open'),
(3, 'One97 (Paytm) - Merchant Onboarding Flow', 14, 1, 380000.00, '2027-01-28', 10, 5, 'Open'),

-- Stage 2: Contact Made / Qualification (30%)
(4, 'Infosys - 500-Seat Global Sales Suite', 2, 2, 1200000.00, '2026-12-15', 30, 2, 'Open'),
(5, 'Zomato - B2B Restaurant Partner CRM', 4, 2, 480000.00, '2026-12-10', 30, 4, 'Open'),
(6, 'Deccan Solar - Commercial EPC Pipeline', 13, 2, 350000.00, '2027-01-05', 30, 3, 'Open'),

-- Stage 3: Proposal Sent / Pitch (50%)
(7, 'Reliance Jio - Enterprise Connectivity Deals Tracker', 3, 3, 1850000.00, '2026-12-05', 50, 3, 'Open'),
(8, 'Swiggy - Cloud Kitchen B2B Supplier System', 6, 3, 520000.00, '2026-12-18', 50, 2, 'Open'),
(9, 'Apex Edutech - Pan-India Admissions Portal', 11, 3, 620000.00, '2026-12-22', 50, 4, 'Open'),

-- Stage 4: Negotiation / Review (75%)
(10, 'Bajaj Finserv - FinTech Lending CRM Integration', 7, 4, 2100000.00, '2026-11-30', 75, 3, 'Open'),
(11, 'Razorpay - Corporate Payment Merchant Pipeline', 8, 4, 950000.00, '2026-12-01', 75, 4, 'Open'),
(12, 'Delhi NCR Real Estate - HNI Sales Engine', 19, 4, 750000.00, '2026-12-08', 75, 2, 'Open'),

-- Stage 5: Closed Won (100%)
(13, 'Wipro Cloud - SaaS Multi-tenant Migration', 5, 5, 1450000.00, '2026-10-15', 100, 5, 'Won'),
(14, 'CRED Club - Premium Merchant Growth CRM', 12, 5, 880000.00, '2026-10-28', 100, 2, 'Won'),
(15, 'TCS Digital - Banking Salesforce Hybrid Adapter', 10, 5, 2400000.00, '2026-11-10', 100, 3, 'Won'),
(16, 'Nykaa - Beauty Brand Partner Relationship CRM', 15, 5, 620000.00, '2026-11-18', 100, 4, 'Won'),

-- Stage 6: Closed Lost (0%)
(17, 'HCL Tech - Offshore Delivery Tracker', 9, 6, 500000.00, '2026-09-30', 0, 5, 'Lost'),
(18, 'Jaipur Handicrafts - Artisan Order CRM', 7, 6, 120000.00, '2026-10-05', 0, 3, 'Lost');

-- 5. Insert Tasks (Activities, Follow-ups, Call logs)
INSERT INTO tasks (id, title, description, task_type, priority, due_date, status, assigned_to_user_id, related_to_type, related_to_id) VALUES
(1, 'Executive Security Review Call with Bajaj Finserv', 'Discuss SOC-2 compliance, data encryption at rest and role-based permissions.', 'Meeting', 'High', '2026-11-25 11:30:00', 'Pending', 3, 'Deal', 10),
(2, 'Send Customized Pricing Matrix to Razorpay VP', 'Prepare 3-tier SaaS pricing quote with annual volume discount.', 'Email', 'High', '2026-11-24 15:00:00', 'Pending', 4, 'Deal', 11),
(3, 'Lead Qualification Call with Vivaan (CloudScale)', 'Check technical requirements for 200 sales agent onboarding and SSO integration.', 'Call', 'Medium', '2026-11-24 16:30:00', 'Pending', 3, 'Lead', 1),
(4, 'Product Architecture Walkthrough for Reliance Jio team', 'Host live demo showing AWS EC2/RDS deployment, Docker containerization and REST APIs.', 'Demo', 'High', '2026-11-26 14:00:00', 'Pending', 2, 'Deal', 7),
(5, 'Send Contract Agreement & SLA Document to CRED', 'Formal signing of master service agreement and onboarding schedule.', 'Follow-up', 'Medium', '2026-11-23 18:00:00', 'Completed', 2, 'Deal', 14),
(6, 'Follow-up call with Ishaan (FinBridge)', 'Review feedback from their engineering committee regarding API response time.', 'Call', 'Medium', '2026-11-25 10:00:00', 'Pending', 4, 'Lead', 2),
(7, 'Quarterly Pipeline Audit & Forecast', 'Review Q4 revenue target, deal slippages, and rep conversion metrics.', 'Meeting', 'High', '2026-11-27 17:00:00', 'Pending', 1, 'Deal', 4),
(8, 'Verify Database Migration for Wipro Cloud team', 'Final verification of PostgreSQL schema migration and automated indexes.', 'Follow-up', 'Low', '2026-11-22 12:00:00', 'Completed', 5, 'Deal', 13);

-- 6. Insert Notes & Interaction History
INSERT INTO notes (id, content, author_id, related_to_type, related_to_id, created_at) VALUES
(1, 'Meeting completed with VP Technology. Client loved the real-time Kanban board and instant lead score calculation.', 3, 'Deal', 1, '2026-11-20 14:10:00'),
(2, 'Procurement team requested 15% discount for 2-year commitment. Recommended manager approval.', 2, 'Deal', 4, '2026-11-21 16:45:00'),
(3, 'Lead showed high intent during initial phone call. Identified urgent requirement for sales team audit trails.', 4, 'Lead', 1, '2026-11-22 09:30:00'),
(4, 'Successfully demonstrated the Docker CI/CD automated deployment. All 15 automated QA test cases passed.', 1, 'Deal', 15, '2026-11-22 17:20:00');

-- 7. Insert Email Logs
INSERT INTO email_logs (id, sender_id, recipient_email, recipient_name, subject, body, template_name, status, sent_at) VALUES
(1, 1, 'vikram.m@tatadigital.com', 'Vikram Malhotra', 'SalesFlow CRM – Enterprise Architecture & Proposal', 'Dear Vikram, Thank you for our meeting today. Please find attached the SalesFlow CRM technical overview and pricing proposal.', 'Enterprise Proposal', 'Delivered', '2026-11-21 11:15:00'),
(2, 2, 'priya.verma@infosys.com', 'Priya Verma', 'Follow-up: SalesFlow CRM Security & SOC2 Compliance', 'Hi Priya, Following our conversation, here are the comprehensive security audit results and AWS deployment architecture details.', 'Security Overview', 'Opened', '2026-11-22 14:20:00'),
(3, 4, 'tanvi.shah@razorpay.com', 'Tanvi Shah', 'Welcome to SalesFlow CRM Onboarding', 'Dear Tanvi, We are thrilled to welcome Razorpay to the SalesFlow CRM platform! Here is your team login setup guide.', 'Client Welcome', 'Sent', '2026-11-23 09:00:00');

-- 8. Insert Activity Audit Trail Logs
INSERT INTO audit_activity_logs (id, user_id, action, entity_type, entity_id, description, ip_address, created_at) VALUES
(1, 1, 'LOGIN', 'User', 1, 'Administrator logged in from Bangalore office', '192.168.1.10', '2026-11-23 08:30:00'),
(2, 2, 'UPDATE_STAGE', 'Deal', 10, 'Deal #10 moved to Negotiation (Stage 4) by Sales Manager', '192.168.1.14', '2026-11-23 09:45:00'),
(3, 3, 'CREATE_LEAD', 'Lead', 1, 'Lead #1 (Vivaan Saxena - CloudScale) registered via Web form', '103.21.244.2', '2026-11-23 10:15:00'),
(4, 4, 'COMPLETE_TASK', 'Task', 5, 'Task #5 marked completed by Rohan Patel', '192.168.1.22', '2026-11-23 11:00:00'),
(5, 1, 'RUN_TESTS', 'QA_Suite', 0, 'Executed automated CI/CD API and Security regression test suite (100% Passed)', '127.0.0.1', '2026-11-23 11:30:00');

-- =====================================================================
-- Verification Queries (Run in MySQL Workbench to confirm data)
-- =====================================================================
-- SELECT * FROM pipeline_stages ORDER BY stage_order;
-- SELECT * FROM vw_pipeline_stage_summary;
-- SELECT * FROM vw_sales_rep_performance;
-- SELECT COUNT(*) AS total_leads FROM leads;
-- SELECT COUNT(*) AS total_deals FROM deals;
-- =====================================================================

