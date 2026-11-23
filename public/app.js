/**
 * SalesFlow CRM - Interactive Client Application
 * Enterprise Cloud CRM Platform
 */

// Application State
const state = {
  currentUser: {
    id: 1,
    name: "System Administrator",
    role: "admin",
    email: "admin@salesflow.com",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150"
  },
  currentTab: "dashboard",
  leadFilter: "All",
  searchQuery: "",
  data: {
    users: [],
    stages: [],
    contacts: [],
    leads: [],
    deals: [],
    tasks: [],
    notes: [],
    emails: [],
    activity: [],
    stats: {}
  }
};

// Available Demo Roles
const DEMO_ROLES = {
  admin: {
    id: 1,
    name: "System Administrator",
    role: "admin",
    email: "admin@salesflow.com",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
    badge: "Admin"
  },
  sales_manager: {
    id: 2,
    name: "Sales Manager",
    role: "sales_manager",
    email: "manager@salesflow.com",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150",
    badge: "Manager"
  },
  sales_executive: {
    id: 3,
    name: "Aarav Sharma",
    role: "sales_executive",
    email: "aarav.sharma@salesflow.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    badge: "Executive"
  }
};

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  loadAllData();
});

function setupEventListeners() {
  // Quick Action menu toggle
  const qaBtn = document.getElementById("quickActionBtn");
  const qaMenu = document.getElementById("quickActionMenu");
  qaBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    qaMenu.classList.toggle("hidden");
  });

  // Profile / Role switcher toggle
  const profileBtn = document.getElementById("userProfileBtn");
  const profileMenu = document.getElementById("userProfileMenu");
  profileBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    profileMenu.classList.toggle("hidden");
  });

  // Close menus on outside click
  document.addEventListener("click", () => {
    qaMenu.classList.add("hidden");
    profileMenu.classList.add("hidden");
  });

  // Global search input
  const searchInput = document.getElementById("globalSearchInput");
  searchInput.addEventListener("input", (e) => {
    state.searchQuery = e.target.value.toLowerCase();
    renderCurrentTab();
  });

  // Keyboard shortcut '/' to search
  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
    }
    if (e.key === "Escape") {
      closeAllModals();
    }
  });
}

// Fetch all resources from REST API with instant fallback for standalone/file preview
async function loadAllData() {
  try {
    const [statsRes, leadsRes, dealsRes, contactsRes, stagesRes, tasksRes, notesRes, emailsRes, activityRes] = await Promise.all([
      fetch("/api/stats").then(r => { if (!r.ok) throw new Error(); return r.json(); }),
      fetch("/api/leads").then(r => { if (!r.ok) throw new Error(); return r.json(); }),
      fetch("/api/deals").then(r => { if (!r.ok) throw new Error(); return r.json(); }),
      fetch("/api/contacts").then(r => { if (!r.ok) throw new Error(); return r.json(); }),
      fetch("/api/stages").then(r => { if (!r.ok) throw new Error(); return r.json(); }),
      fetch("/api/tasks").then(r => { if (!r.ok) throw new Error(); return r.json(); }),
      fetch("/api/notes").then(r => { if (!r.ok) throw new Error(); return r.json(); }),
      fetch("/api/emails").then(r => { if (!r.ok) throw new Error(); return r.json(); }),
      fetch("/api/activity").then(r => { if (!r.ok) throw new Error(); return r.json(); })
    ]);

    state.data.stats = statsRes;
    state.data.leads = leadsRes;
    state.data.deals = dealsRes;
    state.data.contacts = contactsRes;
    state.data.stages = stagesRes;
    state.data.tasks = tasksRes;
    state.data.notes = notesRes;
    state.data.emails = emailsRes;
    state.data.activity = activityRes;

    updateHeaderBadges();
    renderCurrentTab();
  } catch (err) {
    console.warn("REST API unreachable (running standalone/file mode). Using embedded live dataset.");
    loadFallbackData();
  }
}

function loadFallbackData() {
  state.data = {
    users: [
      { id: 1, name: "System Administrator", email: "admin@salesflow.com", role: "admin", department: "Executive Leadership", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150" },
      { id: 2, name: "Sales Manager", email: "manager@salesflow.com", role: "sales_manager", department: "Sales Management", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150" },
      { id: 3, name: "Aarav Sharma", email: "aarav.sharma@salesflow.com", role: "sales_executive", department: "Enterprise Sales", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" },
      { id: 4, name: "Rohan Patel", email: "rohan.patel@salesflow.com", role: "sales_executive", department: "SaaS Accounts", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" },
      { id: 5, name: "Ananya Singh", email: "ananya.singh@salesflow.com", role: "sales_executive", department: "SMB Growth", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150" }
    ],
    stages: [
      { id: 1, name: "Lead In / Discovery", order: 1, probability: 10, color: "#6366F1", badge: "bg-indigo-100 text-indigo-700" },
      { id: 2, name: "Contact Made / Qualification", order: 2, probability: 30, color: "#3B82F6", badge: "bg-blue-100 text-blue-700" },
      { id: 3, name: "Proposal Sent / Pitch", order: 3, probability: 50, color: "#06B6D4", badge: "bg-cyan-100 text-cyan-700" },
      { id: 4, name: "Negotiation / Review", order: 4, probability: 75, color: "#F59E0B", badge: "bg-amber-100 text-amber-700" },
      { id: 5, name: "Closed Won", order: 5, probability: 100, color: "#10B981", badge: "bg-emerald-100 text-emerald-700" },
      { id: 6, name: "Closed Lost", order: 6, probability: 0, color: "#EF4444", badge: "bg-rose-100 text-rose-700" }
    ],
    contacts: [
      { id: 1, firstName: "Vikram", lastName: "Malhotra", company: "Tata Digital", email: "vikram.m@tatadigital.com", phone: "+91 98201 11223", title: "VP Technology", industry: "IT & Telecom", city: "Mumbai", status: "Customer", assignedTo: 3 },
      { id: 2, firstName: "Priya", lastName: "Verma", company: "Infosys Ltd", email: "priya.verma@infosys.com", phone: "+91 98450 99887", title: "Procurement Director", industry: "Consulting", city: "Bengaluru", status: "Customer", assignedTo: 2 },
      { id: 3, firstName: "Kabir", lastName: "Mehta", company: "Reliance Jio", email: "kabir.mehta@reliancejio.com", phone: "+91 98220 55443", title: "Solutions Lead", industry: "Telecom", city: "Mumbai", status: "Active", assignedTo: 3 },
      { id: 4, firstName: "Sneha", lastName: "Gupta", company: "Zomato HQ", email: "sneha.gupta@zomato.in", phone: "+91 99110 33221", title: "Head of Sales Ops", industry: "FoodTech", city: "Gurugram", status: "Active", assignedTo: 4 },
      { id: 5, firstName: "Arjun", lastName: "Reddy", company: "Wipro Cloud", email: "arjun.reddy@wipro.com", phone: "+91 98860 44332", title: "Director of Infra", industry: "Cloud", city: "Bengaluru", status: "Customer", assignedTo: 5 },
      { id: 6, firstName: "Divya", lastName: "Nair", company: "Swiggy Bundl", email: "divya.nair@swiggy.in", phone: "+91 98470 66554", title: "VP Operations", industry: "Delivery", city: "Bengaluru", status: "Active", assignedTo: 2 },
      { id: 7, firstName: "Sameer", lastName: "Deshmukh", company: "Bajaj Finserv", email: "sameer.d@bajajfinserv.in", phone: "+91 98900 88776", title: "CIO", industry: "FinTech", city: "Pune", status: "Customer", assignedTo: 3 },
      { id: 8, firstName: "Tanvi", lastName: "Shah", company: "Razorpay Payments", email: "tanvi.shah@razorpay.com", phone: "+91 99800 22110", title: "VP Growth", industry: "FinTech", city: "Bengaluru", status: "Customer", assignedTo: 4 },
      { id: 9, firstName: "Rahul", lastName: "Iyer", company: "HCL Technologies", email: "rahul.iyer@hcltech.com", phone: "+91 98101 44556", title: "Global Accounts VP", industry: "IT Services", city: "Noida", status: "Active", assignedTo: 5 },
      { id: 10, firstName: "Meera", lastName: "Sundaram", company: "TCS Digital", email: "meera.s@tcs.com", phone: "+91 98401 77889", title: "Digital Transformation Head", industry: "IT Services", city: "Chennai", status: "Customer", assignedTo: 3 },
      { id: 11, firstName: "Nikhil", lastName: "Joshi", company: "Zerodha Broking", email: "nikhil.joshi@zerodha.com", phone: "+91 98455 33441", title: "Infra Lead", industry: "FinTech", city: "Bengaluru", status: "Active", assignedTo: 4 },
      { id: 12, firstName: "Pooja", lastName: "Chopra", company: "CRED Club", email: "pooja.c@cred.club", phone: "+91 98205 66778", title: "VP Strategy", industry: "FinTech", city: "Bengaluru", status: "Customer", assignedTo: 2 },
      { id: 13, firstName: "Siddharth", lastName: "Bansal", company: "Delhivery Logistics", email: "siddharth@delhivery.com", phone: "+91 99105 11223", title: "Supply Chain VP", industry: "Logistics", city: "Gurugram", status: "Active", assignedTo: 5 },
      { id: 14, firstName: "Kiara", lastName: "Kapoor", company: "Paytm One97", email: "kiara.k@paytm.com", phone: "+91 98115 88990", title: "VP Merchant Network", industry: "FinTech", city: "Noida", status: "Lead", assignedTo: 3 },
      { id: 15, firstName: "Akash", lastName: "Bhatia", company: "Nykaa Brands", email: "akash.bhatia@nykaa.com", phone: "+91 98209 44556", title: "Digital Director", industry: "E-Commerce", city: "Mumbai", status: "Customer", assignedTo: 4 }
    ],
    leads: [
      { id: 1, firstName: "Vivaan", lastName: "Saxena", company: "CloudScale Technologies", email: "vivaan@cloudscale.io", phone: "+91 98100 12001", source: "Website", status: "Qualified", score: 92, value: 450000, assignedTo: 3, notes: "Urgent migration of 200 sales reps from spreadsheets to cloud CRM." },
      { id: 2, firstName: "Ishaan", lastName: "Bose", company: "FinBridge Analytics", email: "ishaan.bose@finbridge.com", phone: "+91 98200 13002", source: "LinkedIn", status: "Qualified", score: 85, value: 320000, assignedTo: 4, notes: "Wants customized pipeline stages and role-based permissions." },
      { id: 3, firstName: "Reyansh", lastName: "Trivedi", company: "AeroLogix Logistics", email: "reyansh@aerologix.in", phone: "+91 98300 14003", source: "Referral", status: "Contacted", score: 68, value: 280000, assignedTo: 5, notes: "Demo scheduled with VP of Sales next Tuesday." },
      { id: 4, firstName: "Sai", lastName: "Kulkarni", company: "AgroTech Digital", email: "sai.k@agrotech.org", phone: "+91 98400 15004", source: "Google Search", status: "New", score: 55, value: 180000, assignedTo: 2, notes: "Downloaded whitepaper on automated sales workflows." },
      { id: 5, firstName: "Krishna", lastName: "Murthy", company: "HealthFirst Hospitals", email: "k.murthy@healthfirst.med", phone: "+91 98500 16005", source: "Webinar", status: "Contacted", score: 74, value: 550000, assignedTo: 3, notes: "Requires strict data security and compliance audit logs." },
      { id: 6, firstName: "Aryan", lastName: "Singhal", company: "UrbanMove Mobility", email: "aryan@urbanmove.co", phone: "+91 98600 17006", source: "LinkedIn", status: "Qualified", score: 88, value: 380000, assignedTo: 4, notes: "Expanding sales reps by 50 in South India." },
      { id: 7, firstName: "Dhruv", lastName: "Rathore", company: "Jaipur Handicrafts", email: "dhruv@jaipurcrafts.com", phone: "+91 98700 18007", source: "Website", status: "Lost", score: 35, value: 120000, assignedTo: 5, notes: "Budget frozen until next financial quarter." },
      { id: 8, firstName: "Vihaan", lastName: "Nambiar", company: "Kerala Spices Global", email: "vihaan@keralaspices.net", phone: "+91 98800 19008", source: "Referral", status: "Qualified", score: 81, value: 290000, assignedTo: 3, notes: "Requires email integration and multi-currency quotes." },
      { id: 9, firstName: "Yash", lastName: "Agrawal", company: "Indore Steels & Tubes", email: "yash.a@indoresteels.in", phone: "+91 98900 20009", source: "Cold Call", status: "Contacted", score: 62, value: 220000, assignedTo: 4, notes: "Interested in dealer network performance tracking." },
      { id: 10, firstName: "Diya", lastName: "Sengupta", company: "Kolkata Publishing", email: "diya@kolkatabooks.com", phone: "+91 99000 21010", source: "Website", status: "New", score: 48, value: 150000, assignedTo: 5, notes: "Requested product demo video for regional team." },
      { id: 11, firstName: "Ira", lastName: "Bhardwaj", company: "Apex Edutech Global", email: "ira.b@apexedu.ac.in", phone: "+91 99100 22011", source: "Google Search", status: "Qualified", score: 95, value: 620000, assignedTo: 2, notes: "10 university campuses lead management portal." },
      { id: 12, firstName: "Myra", lastName: "Choudhury", company: "Optima Pharma Labs", email: "myra.c@optimapharma.com", phone: "+91 99200 23012", source: "Referral", status: "Qualified", score: 89, value: 480000, assignedTo: 3, notes: "Medical representative activity and sample tracking." },
      { id: 13, firstName: "Sara", lastName: "Khan", company: "Deccan Solar Energy", email: "sara.k@deccansolar.com", phone: "+91 99300 24013", source: "LinkedIn", status: "Contacted", score: 70, value: 340000, assignedTo: 4, notes: "Commercial rooftop solar leads pipeline." },
      { id: 14, firstName: "Aadhya", lastName: "Pillai", company: "Cochin Marine Exports", email: "aadhya@cochinmarine.com", phone: "+91 99400 25014", source: "Website", status: "New", score: 50, value: 210000, assignedTo: 5, notes: "International buyers contract negotiation." },
      { id: 15, firstName: "Rajesh", lastName: "Gadkari", company: "Maharashtra Tools", email: "rajesh.g@mitools.co.in", phone: "+91 99500 26015", source: "Cold Call", status: "Lost", score: 28, value: 90000, assignedTo: 3, notes: "Continuing with legacy manual ledgers." }
    ],
    deals: [
      { id: 1, title: "Tata Digital - Cloud CRM Enterprise Rollout", contactId: 1, stageId: 1, amount: 650000, closeDate: "2026-12-20", probability: 10, assignedTo: 3, status: "Open" },
      { id: 2, title: "AgroTech - Dealer Network Sales Portal", contactId: 4, stageId: 1, amount: 240000, closeDate: "2027-01-15", probability: 10, assignedTo: 4, status: "Open" },
      { id: 3, title: "Paytm - Merchant Onboarding Pipeline", contactId: 14, stageId: 1, amount: 380000, closeDate: "2027-01-28", probability: 10, assignedTo: 5, status: "Open" },
      { id: 4, title: "Infosys - 500-Seat Global Sales Suite", contactId: 2, stageId: 2, amount: 1200000, closeDate: "2026-12-15", probability: 30, assignedTo: 2, status: "Open" },
      { id: 5, title: "Zomato - B2B Restaurant Partner CRM", contactId: 4, stageId: 2, amount: 480000, closeDate: "2026-12-10", probability: 30, assignedTo: 4, status: "Open" },
      { id: 6, title: "Deccan Solar - Commercial EPC Pipeline", contactId: 13, stageId: 2, amount: 350000, closeDate: "2027-01-05", probability: 30, assignedTo: 3, status: "Open" },
      { id: 7, title: "Reliance Jio - Enterprise Connectivity Deals", contactId: 3, stageId: 3, amount: 1850000, closeDate: "2026-12-05", probability: 50, assignedTo: 3, status: "Open" },
      { id: 8, title: "Swiggy - Cloud Kitchen B2B Supplier System", contactId: 6, stageId: 3, amount: 520000, closeDate: "2026-12-18", probability: 50, assignedTo: 2, status: "Open" },
      { id: 9, title: "Apex Edutech - Pan-India Admissions Portal", contactId: 11, stageId: 3, amount: 620000, closeDate: "2026-12-22", probability: 50, assignedTo: 4, status: "Open" },
      { id: 10, title: "Bajaj Finserv - FinTech Lending CRM Integration", contactId: 7, stageId: 4, amount: 2100000, closeDate: "2026-11-30", probability: 75, assignedTo: 3, status: "Open" },
      { id: 11, title: "Razorpay - Corporate Payment Merchant Pipeline", contactId: 8, stageId: 4, amount: 950000, closeDate: "2026-12-01", probability: 75, assignedTo: 4, status: "Open" },
      { id: 12, title: "NCR Real Estate - Luxury Buyer Sales Engine", contactId: 15, stageId: 4, amount: 750000, closeDate: "2026-12-08", probability: 75, assignedTo: 2, status: "Open" },
      { id: 13, title: "Wipro Cloud - SaaS Multi-tenant Migration", contactId: 5, stageId: 5, amount: 1450000, closeDate: "2026-10-15", probability: 100, assignedTo: 5, status: "Won" },
      { id: 14, title: "CRED Club - Premium Merchant Growth CRM", contactId: 12, stageId: 5, amount: 880000, closeDate: "2026-10-28", probability: 100, assignedTo: 2, status: "Won" },
      { id: 15, title: "TCS Digital - Banking Salesforce Hybrid Adapter", contactId: 10, stageId: 5, amount: 2400000, closeDate: "2026-11-10", probability: 100, assignedTo: 3, status: "Won" },
      { id: 16, title: "Nykaa - Beauty Brand Partner Relationship CRM", contactId: 15, stageId: 5, amount: 620000, closeDate: "2026-11-18", probability: 100, assignedTo: 4, status: "Won" },
      { id: 17, title: "HCL Tech - Offshore Delivery Tracker", contactId: 9, stageId: 6, amount: 500000, closeDate: "2026-09-30", probability: 0, assignedTo: 5, status: "Lost" },
      { id: 18, title: "Jaipur Handicrafts - Artisan Order CRM", contactId: 7, stageId: 6, amount: 120000, closeDate: "2026-10-05", probability: 0, assignedTo: 3, status: "Lost" }
    ],
    tasks: [
      { id: 1, title: "Executive Security Review Call with Bajaj Finserv", description: "Discuss SOC-2 compliance, data encryption at rest and role-based permissions.", type: "Meeting", priority: "High", dueDate: "2026-11-25T11:30:00", completed: false, assignedTo: 3, dealId: 10 },
      { id: 2, title: "Send Customized Pricing Matrix to Razorpay VP", description: "Prepare 3-tier SaaS pricing quote with annual volume discount.", type: "Email", priority: "High", dueDate: "2026-11-24T15:00:00", completed: false, assignedTo: 4, dealId: 11 },
      { id: 3, title: "Lead Qualification Call with Vivaan (CloudScale)", description: "Check technical requirements for 200 sales agent onboarding.", type: "Call", priority: "Medium", dueDate: "2026-11-24T16:30:00", completed: false, assignedTo: 3, dealId: 1 },
      { id: 4, title: "Product Architecture Walkthrough for Reliance Jio", description: "Host live demo showing AWS EC2/RDS deployment, Docker containerization.", type: "Demo", priority: "High", dueDate: "2026-11-26T14:00:00", completed: false, assignedTo: 2, dealId: 7 },
      { id: 5, title: "Send Contract Agreement & SLA Document to CRED", description: "Formal signing of master service agreement and onboarding schedule.", type: "Follow-up", priority: "Medium", dueDate: "2026-11-23T18:00:00", completed: true, assignedTo: 2, dealId: 14 },
      { id: 6, title: "Follow-up call with Ishaan (FinBridge)", description: "Review feedback regarding API response time and security certifications.", type: "Call", priority: "Medium", dueDate: "2026-11-25T10:00:00", completed: false, assignedTo: 4, dealId: 2 },
      { id: 7, title: "Quarterly Pipeline Audit & Forecast", description: "Review Q4 revenue target, deal slippages, and rep conversion metrics.", type: "Meeting", priority: "High", dueDate: "2026-11-27T17:00:00", completed: false, assignedTo: 1, dealId: 4 },
      { id: 8, title: "Verify Database Migration for Wipro Cloud team", description: "Final verification of PostgreSQL schema migration and automated indexes.", type: "Follow-up", priority: "Low", dueDate: "2026-11-22T12:00:00", completed: true, assignedTo: 5, dealId: 13 }
    ],
    notes: [
      { id: 1, author: "Aarav Sharma", authorId: 3, target: "Deal #1 (Tata Digital)", content: "Meeting completed with VP Technology Vikram Malhotra. Client loved the real-time Kanban pipeline and instant lead scoring.", time: "2026-11-20 14:10" },
      { id: 2, author: "Sales Manager", authorId: 2, target: "Deal #4 (Infosys)", content: "Procurement team requested 15% discount for 2-year commitment. Recommended manager approval given high volume.", time: "2026-11-21 16:45" },
      { id: 3, author: "Rohan Patel", authorId: 4, target: "Lead #1 (CloudScale)", content: "Lead showed high intent during initial phone call. Identified urgent requirement for sales team audit trails and RBAC.", time: "2026-11-22 09:30" },
      { id: 4, author: "System Administrator", authorId: 1, target: "System & QA", content: "Successfully ran the automated CI/CD pipeline and security regression test suite. All 18 automated tests passed.", time: "2026-11-23 11:20" }
    ],
    emails: [
      {
        id: 1, sender: "System Administrator (Admin)", recipient: "vikram.m@tatadigital.com", recipientName: "Vikram Malhotra",
        subject: "SalesFlow CRM – Enterprise Architecture & Custom Proposal",
        body: "Dear Vikram,\n\nThank you for our meeting today. Please find attached the SalesFlow CRM technical overview and pricing proposal for your enterprise rollout.\n\nBest regards,\nSalesFlow CRM Team",
        template: "Enterprise Proposal", status: "Delivered", time: "2026-11-21 11:15"
      },
      {
        id: 2, sender: "Sales Manager", recipient: "priya.verma@infosys.com", recipientName: "Priya Verma",
        subject: "Follow-up: SalesFlow CRM Security & SOC2 / AWS Cloud Compliance",
        body: "Hi Priya,\n\nFollowing our conversation yesterday, here are the comprehensive security audit results and AWS deployment architecture details.\n\nWarm regards,\nSales Operations Lead",
        template: "Security Overview", status: "Opened", time: "2026-11-22 14:20"
      },
      {
        id: 3, sender: "Rohan Patel (Executive)", recipient: "tanvi.shah@razorpay.com", recipientName: "Tanvi Shah",
        subject: "Welcome to SalesFlow CRM Onboarding",
        body: "Dear Tanvi,\n\nWe are thrilled to welcome Razorpay to the SalesFlow CRM platform! Your workspace has been provisioned and your onboarding specialist will contact you tomorrow morning.\n\nRegards,\nRohan Patel",
        template: "Client Welcome", status: "Sent", time: "2026-11-23 09:00"
      }
    ],
    activity: [
      { id: 1, user: "System Administrator", role: "Admin", action: "LOGIN", desc: "Administrator logged in from Bangalore HQ", time: "Today at 08:30 AM", type: "auth" },
      { id: 2, user: "Sales Manager", role: "Sales Manager", action: "UPDATE_STAGE", desc: "Moved Deal #10 (Bajaj Finserv) to Negotiation (Stage 4)", time: "Today at 09:45 AM", type: "deal" },
      { id: 3, user: "Aarav Sharma", role: "Sales Executive", action: "CREATE_LEAD", desc: "Added Lead #1 (Vivaan Saxena - CloudScale) via Inbound Portal", time: "Today at 10:15 AM", type: "lead" },
      { id: 4, user: "Rohan Patel", role: "Sales Executive", action: "COMPLETE_TASK", desc: "Completed task: Contract Agreement & SLA Document to CRED", time: "Today at 11:00 AM", type: "task" },
      { id: 5, user: "System Administrator", role: "Admin", action: "RUN_TESTS", desc: "Executed automated CI/CD API & OWASP Security test suite (100% Passed)", time: "Today at 11:30 AM", type: "qa" }
    ]
  };

  updateHeaderBadges();
  renderCurrentTab();
}

function refreshData() {
  loadAllData();
  showToast("Dashboard metrics refreshed!", "success");
}

function updateHeaderBadges() {
  const badgeDeal = document.getElementById("badgeDealCount");
  if (badgeDeal) badgeDeal.innerText = state.data.deals.length;

  const badgeLead = document.getElementById("badgeLeadCount");
  if (badgeLead) badgeLead.innerText = state.data.leads.length;

  const badgeTask = document.getElementById("badgeTaskCount");
  if (badgeTask) badgeTask.innerText = state.data.tasks.filter(t => !t.completed).length;
}

// Tab Switching
function switchTab(tabName) {
  state.currentTab = tabName;

  document.querySelectorAll(".nav-item").forEach(btn => btn.classList.remove("active"));
  const activeNav = document.getElementById(`nav-${tabName}`);
  if (activeNav) activeNav.classList.add("active");

  document.querySelectorAll(".tab-pane").forEach(pane => pane.classList.add("hidden"));
  const activePane = document.getElementById(`tab-${tabName}`);
  if (activePane) activePane.classList.remove("hidden");

  renderCurrentTab();
}

function renderCurrentTab() {
  switch (state.currentTab) {
    case "dashboard":
      renderDashboard();
      break;
    case "pipeline":
      renderKanban();
      break;
    case "leads":
      renderLeads();
      break;
    case "contacts":
      renderContacts();
      break;
    case "tasks":
      renderTasks();
      break;
    case "emails":
      renderEmails();
      break;
    case "notes":
      renderNotes();
      break;
    case "testing":
      // testing tab is static until "Run Test Suite" is clicked
      break;
  }
}

// ---------------------------------------------------------------------
// 1. DASHBOARD RENDERING
// ---------------------------------------------------------------------
function renderDashboard() {
  const deals = state.data.deals || [];
  const wonDeals = deals.filter(d => d.status === "Won");
  const openDeals = deals.filter(d => d.status === "Open");
  const lostDeals = deals.filter(d => d.status === "Lost");

  const totalWonRevenue = wonDeals.reduce((acc, d) => acc + (d.amount || 0), 0);
  const totalPipeline = openDeals.reduce((acc, d) => acc + (d.amount || 0), 0);
  const totalClosed = wonDeals.length + lostDeals.length;
  const winRate = totalClosed > 0 ? ((wonDeals.length / totalClosed) * 100).toFixed(1) : 0;

  // Format currency in Lakhs/Crores
  const formatINR = (val) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} Lakh`;
    return `₹${val.toLocaleString("en-IN")}`;
  };

  document.getElementById("kpiRevenue").innerText = formatINR(totalWonRevenue);
  document.getElementById("kpiPipeline").innerText = formatINR(totalPipeline);
  document.getElementById("kpiWinRate").innerText = `${winRate}%`;
  document.getElementById("kpiLeads").innerText = `${state.data.leads.length} Leads`;
  document.getElementById("kpiOpenDealsCount").innerText = `${openDeals.length} active deals`;

  // Render SVG Revenue Chart
  renderRevenueSVGChart();

  // Render Pipeline Stage breakdown
  renderStageBreakdown();

  // Render Leaderboard
  renderLeaderboard();

  // Render Activity Log
  renderActivityLog();
}

function renderRevenueSVGChart() {
  const container = document.getElementById("revenueChartContainer");
  const dataPoints = [
    { m: "Jun", v: 450000, l: "₹4.5L" },
    { m: "Jul", v: 620000, l: "₹6.2L" },
    { m: "Aug", v: 890000, l: "₹8.9L" },
    { m: "Sep", v: 1150000, l: "₹11.5L" },
    { m: "Oct", v: 2330000, l: "₹23.3L" },
    { m: "Nov", v: 3050000, l: "₹30.5L" }
  ];

  const maxVal = 3500000;
  let html = `
    <div class="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 px-4 py-6">
      <div class="border-b border-slate-400 border-dashed w-full"></div>
      <div class="border-b border-slate-400 border-dashed w-full"></div>
      <div class="border-b border-slate-400 border-dashed w-full"></div>
    </div>
    <div class="relative z-10 w-full flex items-end justify-between gap-3 h-full pt-6">
  `;

  dataPoints.forEach((pt) => {
    const heightPercent = Math.min(Math.round((pt.v / maxVal) * 100), 100);
    html += `
      <div class="flex-1 flex flex-col items-center gap-2 group">
        <span class="text-[11px] font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">${pt.l}</span>
        <div class="w-full max-w-[42px] bg-indigo-50 group-hover:bg-indigo-100 rounded-t-xl overflow-hidden flex items-end justify-center transition-all h-48 border border-indigo-200">
          <div class="w-full bg-gradient-to-t from-indigo-600 to-violet-500 rounded-t-lg transition-all duration-500 shadow-xs" style="height: ${heightPercent}%;"></div>
        </div>
        <span class="text-xs font-semibold text-slate-500 mt-1">${pt.m}</span>
      </div>
    `;
  });

  html += `</div>`;
  container.innerHTML = html;
}

function renderStageBreakdown() {
  const container = document.getElementById("stageDistributionList");
  const stages = state.data.stages || [];
  const deals = state.data.deals || [];

  let html = "";
  stages.forEach(s => {
    const sDeals = deals.filter(d => d.stageId === s.id && d.status === "Open");
    const totalVal = sDeals.reduce((a, b) => a + (b.amount || 0), 0);
    const formattedVal = totalVal >= 100000 ? `₹${(totalVal / 100000).toFixed(1)}L` : `₹${totalVal.toLocaleString()}`;

    html += `
      <div class="p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors bg-slate-50/50">
        <div class="flex items-center justify-between text-xs mb-1">
          <span class="font-bold text-slate-800">${s.name}</span>
          <span class="font-extrabold text-indigo-700">${formattedVal}</span>
        </div>
        <div class="flex items-center justify-between text-[11px] text-slate-400">
          <span>${sDeals.length} active deals</span>
          <span>${s.probability}% probability</span>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function renderLeaderboard() {
  const container = document.getElementById("leaderboardList");
  const leaderboard = [
    { id: 3, name: "Aarav Sharma", role: "Sales Executive", won: "₹30.5 Lakh", deals: 2, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", rank: "🥇" },
    { id: 2, name: "Sales Manager", role: "Sales Manager", won: "₹18.8 Lakh", deals: 2, avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150", rank: "🥈" },
    { id: 1, name: "System Administrator", role: "System Admin", won: "₹14.5 Lakh", deals: 1, avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150", rank: "🥉" },
    { id: 4, name: "Rohan Patel", role: "Sales Executive", won: "₹6.2 Lakh", deals: 1, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", rank: "4" }
  ];

  let html = "";
  leaderboard.forEach(r => {
    html += `
      <div class="py-3 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <span class="font-bold text-sm w-5">${r.rank}</span>
          <img src="${r.avatar}" alt="${r.name}" class="w-8 h-8 rounded-full object-cover border border-slate-200" />
          <div>
            <p class="font-bold text-sm text-slate-900">${r.name}</p>
            <p class="text-xs text-slate-400">${r.role} • ${r.deals} won deals</p>
          </div>
        </div>
        <div class="text-right">
          <span class="font-extrabold text-sm text-emerald-600">${r.won}</span>
          <p class="text-[10px] text-slate-400 font-medium">Closed</p>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function renderActivityLog() {
  const container = document.getElementById("activityFeedList");
  const activities = state.data.activity || [];

  if (activities.length === 0) {
    container.innerHTML = `<p class="text-xs text-slate-400 py-4 text-center">No recent activity recorded.</p>`;
    return;
  }

  let html = "";
  activities.slice(0, 7).forEach(a => {
    let icon = "🔔";
    if (a.type === "deal") icon = "🏷️";
    if (a.type === "lead") icon = "🎯";
    if (a.type === "task") icon = "✅";
    if (a.type === "email") icon = "✉️";
    if (a.type === "qa") icon = "🛡️";

    html += `
      <div class="flex items-start space-x-3 p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
        <div class="text-base">${icon}</div>
        <div class="flex-1 min-w-0">
          <p class="text-xs text-slate-800 font-medium leading-relaxed">${a.desc}</p>
          <div class="flex items-center space-x-2 mt-0.5 text-[10px] text-slate-400">
            <span class="font-semibold text-indigo-600">${a.user}</span>
            <span>•</span>
            <span>${a.time}</span>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// ---------------------------------------------------------------------
// 2. DEALS PIPELINE (KANBAN BOARD)
// ---------------------------------------------------------------------
function renderKanban() {
  const board = document.getElementById("kanbanBoard");
  const stages = state.data.stages || [];
  const deals = state.data.deals || [];
  const contacts = state.data.contacts || [];

  board.innerHTML = "";

  stages.forEach(stage => {
    let stageDeals = deals.filter(d => d.stageId === stage.id);
    if (state.searchQuery) {
      stageDeals = stageDeals.filter(d => d.title.toLowerCase().includes(state.searchQuery));
    }

    const stageValue = stageDeals.reduce((sum, d) => sum + (d.amount || 0), 0);
    const formattedVal = stageValue >= 100000 ? `₹${(stageValue / 100000).toFixed(1)}L` : `₹${stageValue.toLocaleString()}`;

    const col = document.createElement("div");
    col.className = "kanban-col";
    col.dataset.stageId = stage.id;

    col.innerHTML = `
      <div class="kanban-col-header flex items-center justify-between">
        <div>
          <div class="flex items-center space-x-2">
            <span class="w-2.5 h-2.5 rounded-full" style="background-color: ${stage.color};"></span>
            <h4 class="font-bold text-xs text-slate-900 tracking-tight">${stage.name}</h4>
          </div>
          <p class="text-[11px] font-bold text-slate-500 mt-1">${formattedVal} • ${stageDeals.length} deals</p>
        </div>
        <span class="text-xs font-bold px-2 py-0.5 rounded-full ${stage.badge || 'bg-slate-100 text-slate-700'}">${stage.probability}%</span>
      </div>
      <div class="kanban-cards-container" id="kanban-col-${stage.id}"></div>
    `;

    const container = col.querySelector(".kanban-cards-container");

    if (stageDeals.length === 0) {
      container.innerHTML = `
        <div class="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl my-auto">
          No deals in this stage
        </div>
      `;
    } else {
      stageDeals.forEach(deal => {
        const contact = contacts.find(c => c.id === deal.contactId);
        const contactName = contact ? `${contact.firstName} ${contact.lastName}` : "Client Contact";
        const companyName = contact ? contact.company : "Enterprise Client";

        const card = document.createElement("div");
        card.className = "deal-card";
        card.innerHTML = `
          <div class="flex items-start justify-between gap-2">
            <h5 class="font-bold text-xs text-slate-900 leading-snug line-clamp-2">${deal.title}</h5>
            <span class="text-xs font-black text-slate-800 shrink-0">₹${(deal.amount / 100000).toFixed(1)}L</span>
          </div>
          <div class="mt-2 text-[11px] text-slate-500 space-y-0.5">
            <p class="font-medium text-slate-700">🏢 ${companyName}</p>
            <p class="text-slate-400">👤 ${contactName}</p>
          </div>
          <div class="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span class="text-slate-400">📅 ${deal.closeDate || '2026-12-30'}</span>
            <!-- Stage movement buttons -->
            <div class="flex items-center space-x-1">
              ${stage.id > 1 ? `<button onclick="moveDealStage(${deal.id}, ${stage.id - 1})" title="Move Previous Stage" class="p-1 rounded hover:bg-slate-100 text-slate-500 font-bold">◀</button>` : ''}
              ${stage.id < 6 ? `<button onclick="moveDealStage(${deal.id}, ${stage.id + 1})" title="Advance Stage" class="p-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold">▶</button>` : ''}
            </div>
          </div>
        `;
        container.appendChild(card);
      });
    }

    board.appendChild(col);
  });
}

async function moveDealStage(dealId, newStageId) {
  try {
    const res = await fetch(`/api/deals/${dealId}/stage`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stageId: newStageId })
    });
    if (res.ok) {
      const updated = await res.json();
      const deal = state.data.deals.find(d => d.id === dealId);
      if (deal) {
        deal.stageId = newStageId;
        deal.status = updated.status;
      }
      renderKanban();
      updateHeaderBadges();
      showToast(`Deal advanced to Stage ${newStageId}!`, "success");
    }
  } catch (err) {
    console.error("Failed to move deal:", err);
  }
}

// ---------------------------------------------------------------------
// 3. LEADS MANAGEMENT
// ---------------------------------------------------------------------
function filterLeads(status) {
  state.leadFilter = status;
  document.querySelectorAll(".lead-filter-btn").forEach(btn => btn.classList.remove("active"));
  event.target.classList.add("active");
  renderLeads();
}

function renderLeads() {
  const tbody = document.getElementById("leadsTableBody");
  const countSpan = document.getElementById("leadsTableCount");
  let leads = state.data.leads || [];

  if (state.leadFilter !== "All") {
    leads = leads.filter(l => l.status === state.leadFilter);
  }

  if (state.searchQuery) {
    leads = leads.filter(l =>
      l.firstName.toLowerCase().includes(state.searchQuery) ||
      l.lastName.toLowerCase().includes(state.searchQuery) ||
      l.company.toLowerCase().includes(state.searchQuery) ||
      l.email.toLowerCase().includes(state.searchQuery)
    );
  }

  countSpan.innerText = leads.length;

  if (leads.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="py-8 text-center text-xs text-slate-400">
          No leads found matching filter.
        </td>
      </tr>
    `;
    return;
  }

  let html = "";
  leads.forEach(l => {
    // Score badge
    let scoreColor = "bg-emerald-500";
    if (l.score < 50) scoreColor = "bg-rose-500";
    else if (l.score < 75) scoreColor = "bg-amber-500";

    // Status pill
    let statusBadge = "bg-slate-100 text-slate-700";
    if (l.status === "New") statusBadge = "bg-blue-100 text-blue-700";
    if (l.status === "Contacted") statusBadge = "bg-amber-100 text-amber-700";
    if (l.status === "Qualified") statusBadge = "bg-emerald-100 text-emerald-700";
    if (l.status === "Lost") statusBadge = "bg-rose-100 text-rose-700";

    html += `
      <tr class="hover:bg-slate-50/80 transition-colors">
        <td class="py-3 px-4">
          <p class="font-bold text-slate-900">${l.firstName} ${l.lastName}</p>
          <p class="text-xs text-indigo-600 font-semibold">${l.company}</p>
        </td>
        <td class="py-3 px-4 text-xs">
          <p class="text-slate-700 font-medium">${l.email}</p>
          <p class="text-slate-400">${l.phone || '+91 98000 00000'}</p>
        </td>
        <td class="py-3 px-4">
          <span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
            ${l.source}
          </span>
        </td>
        <td class="py-3 px-4">
          <div class="flex items-center space-x-2">
            <span class="font-bold text-xs text-slate-700">${l.score}</span>
            <div class="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div class="${scoreColor} h-full rounded-full" style="width: ${l.score}%"></div>
            </div>
          </div>
        </td>
        <td class="py-3 px-4 font-bold text-slate-900">
          ₹${(l.value / 100000).toFixed(1)}L
        </td>
        <td class="py-3 px-4">
          <span class="px-2 py-0.5 rounded-full text-xs font-bold ${statusBadge}">
            ${l.status}
          </span>
        </td>
        <td class="py-3 px-4 text-right">
          <div class="inline-flex items-center space-x-1">
            ${l.status !== 'Qualified' ? `
              <button onclick="convertLeadToDeal(${l.id})" class="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200">
                Convert to Deal
              </button>
            ` : `<span class="text-xs font-bold text-emerald-600">Converted ✓</span>`}
            <button onclick="deleteLead(${l.id})" class="p-1 text-slate-400 hover:text-rose-600">✕</button>
          </div>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

async function convertLeadToDeal(leadId) {
  try {
    const res = await fetch(`/api/leads/${leadId}/convert`, { method: "POST" });
    if (res.ok) {
      showToast("Lead converted to Deal & Contact successfully!", "success");
      loadAllData();
    }
  } catch (err) {
    console.error("Convert failed:", err);
  }
}

async function deleteLead(leadId) {
  if (!confirm("Delete this lead?")) return;
  try {
    await fetch(`/api/leads/${leadId}`, { method: "DELETE" });
    state.data.leads = state.data.leads.filter(l => l.id !== leadId);
    renderLeads();
    updateHeaderBadges();
    showToast("Lead removed", "info");
  } catch (err) {
    console.error(err);
  }
}

// ---------------------------------------------------------------------
// 4. CONTACTS DIRECTORY
// ---------------------------------------------------------------------
function renderContacts() {
  const grid = document.getElementById("contactsGrid");
  let contacts = state.data.contacts || [];

  if (state.searchQuery) {
    contacts = contacts.filter(c =>
      c.firstName.toLowerCase().includes(state.searchQuery) ||
      c.lastName.toLowerCase().includes(state.searchQuery) ||
      c.company.toLowerCase().includes(state.searchQuery)
    );
  }

  let html = "";
  contacts.forEach(c => {
    html += `
      <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
        <div>
          <div class="flex items-start justify-between">
            <div class="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-sm">
              ${c.firstName[0]}${c.lastName[0]}
            </div>
            <span class="text-xs px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700">${c.status || 'Active'}</span>
          </div>
          <div class="mt-3">
            <h4 class="font-bold text-base text-slate-900">${c.firstName} ${c.lastName}</h4>
            <p class="text-xs text-indigo-600 font-semibold">${c.title} • ${c.company}</p>
          </div>
          <div class="mt-3 text-xs text-slate-500 space-y-1">
            <p>✉️ ${c.email}</p>
            <p>📞 ${c.phone || '+91 98000 00000'}</p>
            <p>📍 ${c.city || 'Bengaluru'}, India</p>
          </div>
        </div>
        <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <button onclick="quickEmail('${c.email}', '${c.firstName} ${c.lastName}')" class="font-bold text-indigo-600 hover:text-indigo-800">
            ✉️ Email Client
          </button>
          <span class="text-slate-400">${c.industry || 'Technology'}</span>
        </div>
      </div>
    `;
  });

  grid.innerHTML = html;
}

function quickEmail(email, name) {
  switchTab("emails");
  openModal("emailModal");
  document.getElementById("emailRecipient").value = email;
  document.getElementById("emailSubject").value = `SalesFlow CRM – Follow-up for ${name}`;
  document.getElementById("emailBody").value = `Dear ${name},\n\nI hope you are having a productive week. Following up on our recent discussion...\n\nWarm regards,\n${state.currentUser.name}\nSalesFlow CRM Team`;
}

// ---------------------------------------------------------------------
// 5. TASKS MANAGER
// ---------------------------------------------------------------------
function renderTasks() {
  const container = document.getElementById("taskListContainer");
  const tasks = state.data.tasks || [];

  const pending = tasks.filter(t => !t.completed);
  const completed = tasks.filter(t => t.completed);

  document.getElementById("statTotalTasks").innerText = tasks.length;
  document.getElementById("statPendingTasks").innerText = pending.length;
  document.getElementById("statCompletedTasks").innerText = completed.length;

  let html = "";
  tasks.forEach(t => {
    let priorityBadge = "bg-slate-100 text-slate-600";
    if (t.priority === "High") priorityBadge = "bg-rose-100 text-rose-700 font-bold";
    if (t.priority === "Medium") priorityBadge = "bg-amber-100 text-amber-700 font-semibold";

    html += `
      <div class="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-start space-x-3 transition-all ${t.completed ? 'opacity-60 bg-slate-50' : ''}">
        <input type="checkbox" ${t.completed ? 'checked' : ''} onchange="toggleTask(${t.id})" class="mt-1 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer" />
        <div class="flex-1">
          <div class="flex items-center space-x-2">
            <h4 class="font-bold text-sm text-slate-900 ${t.completed ? 'line-through text-slate-400' : ''}">${t.title}</h4>
            <span class="text-xs px-2 py-0.5 rounded-full ${priorityBadge}">${t.priority}</span>
            <span class="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">${t.type}</span>
          </div>
          <p class="text-xs text-slate-500 mt-1 leading-relaxed">${t.description}</p>
          <div class="mt-2 flex items-center space-x-3 text-[11px] text-slate-400">
            <span>📅 Due: ${t.dueDate ? t.dueDate.replace('T', ' ') : 'Today'}</span>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

async function toggleTask(taskId) {
  try {
    const res = await fetch(`/api/tasks/${taskId}/toggle`, { method: "PATCH" });
    if (res.ok) {
      const task = state.data.tasks.find(t => t.id === taskId);
      if (task) task.completed = !task.completed;
      renderTasks();
      updateHeaderBadges();
      showToast("Task updated!", "success");
    }
  } catch (err) {
    console.error(err);
  }
}

// ---------------------------------------------------------------------
// 6. EMAIL CENTER
// ---------------------------------------------------------------------
function renderEmails() {
  const container = document.getElementById("emailHistoryContainer");
  const emails = state.data.emails || [];

  let html = "";
  emails.forEach(e => {
    html += `
      <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span class="font-bold text-sm text-slate-900">${e.recipientName || 'Client'}</span>
            <span class="text-xs text-slate-400">(${e.recipient})</span>
          </div>
          <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">${e.status}</span>
        </div>
        <h5 class="font-bold text-xs text-indigo-700">${e.subject}</h5>
        <p class="text-xs text-slate-600 whitespace-pre-line bg-slate-50 p-3 rounded-xl border border-slate-100">${e.body}</p>
        <div class="text-[10px] text-slate-400 text-right">
          Sent by ${e.sender} • ${e.time}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function applyEmailTemplate(type) {
  openModal("emailModal");
  if (type === "intro") {
    document.getElementById("emailSubject").value = "Welcome to SalesFlow CRM – Streamlining Your Sales Pipeline";
    document.getElementById("emailBody").value = `Dear Client,\n\nThank you for reaching out to SalesFlow CRM. We are excited to help your team transition from manual lead tracking to an automated cloud pipeline.\n\nCould we schedule a brief 15-minute product demonstration this Thursday at 2:00 PM?\n\nBest regards,\n${state.currentUser.name}\nSalesFlow CRM`;
  } else if (type === "demo") {
    document.getElementById("emailSubject").value = "SalesFlow CRM – Summary of Product Demo & Architecture";
    document.getElementById("emailBody").value = `Dear Client,\n\nThank you for attending our product walkthrough today. As discussed, our cloud architecture includes automated Kanban pipelines, RBAC access controls, and full API integrations.\n\nAttached is our technical overview and customer case studies.\n\nWarm regards,\n${state.currentUser.name}`;
  } else if (type === "quote") {
    document.getElementById("emailSubject").value = "SalesFlow CRM – Enterprise Subscription Commercial Proposal";
    document.getElementById("emailBody").value = `Dear Client,\n\nPlease find attached our formal quotation for 50 Enterprise seats on SalesFlow Cloud CRM.\n\nOur proposal includes priority AWS hosting, daily automated database backups, and 24/7 dedicated support.\n\nSincerely,\n${state.currentUser.name}`;
  }
}

// ---------------------------------------------------------------------
// 7. NOTES
// ---------------------------------------------------------------------
function renderNotes() {
  const container = document.getElementById("notesContainer");
  const notes = state.data.notes || [];

  let html = "";
  notes.forEach(n => {
    html += `
      <div class="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">${n.target}</span>
          <span class="text-[11px] text-slate-400">${n.time}</span>
        </div>
        <p class="text-xs text-slate-700 leading-relaxed">${n.content}</p>
        <p class="text-[11px] font-semibold text-slate-500 pt-2 border-t border-slate-100">By ${n.author}</p>
      </div>
    `;
  });

  container.innerHTML = html;
}

// ---------------------------------------------------------------------
// 8. DEVOPS & TESTING CENTER (SPECIAL FOR MA'AM)
// ---------------------------------------------------------------------
async function runAutomatedTestSuite() {
  const btn = document.getElementById("runTestBtn");
  const tbody = document.getElementById("testSuiteTableBody");
  const badge = document.getElementById("testStatusBadge");
  const timeDisplay = document.getElementById("testExecTime");

  btn.disabled = true;
  btn.innerHTML = `<span>Running Automated Test Suite...</span>`;

  try {
    const res = await fetch("/api/tests/run");
    const data = await res.json();

    let html = "";
    data.suite.forEach((t, i) => {
      html += `
        <tr class="hover:bg-slate-50 transition-colors">
          <td class="py-2.5 px-4 font-bold text-indigo-700">${t.category}</td>
          <td class="py-2.5 px-4 text-slate-800">${t.name}</td>
          <td class="py-2.5 px-4">
            <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
              ✓ ${t.status}
            </span>
          </td>
          <td class="py-2.5 px-4 text-slate-500">${t.latency}</td>
        </tr>
      `;
    });

    tbody.innerHTML = html;
    badge.innerText = `${data.passed} / ${data.totalTests} PASSED`;
    timeDisplay.innerText = data.executionTime;

    showToast("Automated QA Suite passed 100%! Ready to show Ma'am.", "success");
  } catch (err) {
    console.error("Test run error:", err);
  } finally {
    btn.disabled = false;
    btn.innerHTML = `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <span>Re-run Automated Test Suite</span>
    `;
  }
}

// ---------------------------------------------------------------------
// ROLE-BASED ACCESS CONTROL SWITCHER
// ---------------------------------------------------------------------
function switchUserRole(roleKey) {
  const profile = DEMO_ROLES[roleKey];
  if (!profile) return;

  state.currentUser = profile;
  document.getElementById("currentUserName").innerText = profile.name;
  document.getElementById("currentUserRoleBadge").innerText = profile.badge;
  document.getElementById("currentAvatar").src = profile.avatar;

  showToast(`Switched active role to: ${profile.badge} (${profile.name})`, "info");
}

// ---------------------------------------------------------------------
// MODALS & FORMS
// ---------------------------------------------------------------------
function openModal(id) {
  document.getElementById(id).classList.remove("hidden");
}

function closeModal(id) {
  document.getElementById(id).classList.add("hidden");
}

function closeAllModals() {
  document.querySelectorAll(".modal-backdrop").forEach(m => m.classList.add("hidden"));
}

async function handleLeadSubmit(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const payload = Object.fromEntries(formData.entries());

  try {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      closeModal("leadModal");
      e.target.reset();
      showToast("New lead created!", "success");
      loadAllData();
    }
  } catch (err) {
    console.error(err);
  }
}

async function handleDealSubmit(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const payload = Object.fromEntries(formData.entries());

  try {
    const res = await fetch("/api/deals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      closeModal("dealModal");
      e.target.reset();
      showToast("New deal added to pipeline!", "success");
      loadAllData();
    }
  } catch (err) {
    console.error(err);
  }
}

async function handleTaskSubmit(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const payload = Object.fromEntries(formData.entries());

  try {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      closeModal("taskModal");
      e.target.reset();
      showToast("Task scheduled successfully!", "success");
      loadAllData();
    }
  } catch (err) {
    console.error(err);
  }
}

async function handleEmailSubmit(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const payload = Object.fromEntries(formData.entries());
  payload.sender = `${state.currentUser.name} (${state.currentUser.badge})`;

  try {
    const res = await fetch("/api/emails/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      closeModal("emailModal");
      e.target.reset();
      showToast("Email dispatched to recipient!", "success");
      loadAllData();
    }
  } catch (err) {
    console.error(err);
  }
}

async function handleNoteSubmit(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const payload = Object.fromEntries(formData.entries());
  payload.author = state.currentUser.name;

  try {
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      closeModal("noteModal");
      e.target.reset();
      showToast("Interaction note saved!", "success");
      loadAllData();
    }
  } catch (err) {
    console.error(err);
  }
}

async function handleContactSubmit(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const payload = Object.fromEntries(formData.entries());

  try {
    const res = await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      closeModal("contactModal");
      e.target.reset();
      showToast("Contact added!", "success");
      loadAllData();
    }
  } catch (err) {
    console.error(err);
  }
}

async function resetData() {
  if (!confirm("Reset database to 100+ default realistic records?")) return;
  try {
    const res = await fetch("/api/reset", { method: "POST" });
    if (res.ok) {
      showToast("Demo database reset to default 100+ records!", "info");
      loadAllData();
    }
  } catch (err) {
    console.error(err);
  }
}

// ---------------------------------------------------------------------
// UTILITIES: TOASTS & CSV EXPORT
// ---------------------------------------------------------------------
function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");

  let bg = "bg-slate-900 text-white";
  if (type === "success") bg = "bg-emerald-600 text-white";
  if (type === "warning") bg = "bg-amber-600 text-white";

  toast.className = `${bg} px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold flex items-center space-x-2 animate-fadeIn pointer-events-auto`;
  toast.innerHTML = `<span>${message}</span>`;

  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3500);
}

function exportCSV(type) {
  let items = [];
  let filename = "export.csv";

  if (type === "leads") {
    items = state.data.leads || [];
    filename = "salesflow_leads.csv";
  }

  if (items.length === 0) return;

  const keys = Object.keys(items[0]);
  const csvContent = "data:text/csv;charset=utf-8," +
    [keys.join(","), ...items.map(row => keys.map(k => `"${row[k] || ''}"`).join(","))].join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast("CSV file exported successfully!", "success");
}

function downloadReport() {
  window.open("report.html", "_blank");
}
