/* ============================================================
   APOLLO ONCOLOGY DASHBOARD — SOURCE DATA
   All figures transcribed as reported in:
   - Chemo_Scheduling-Phase_I.pptx   (n = 132)
   - Chemo_Scheduling-Phase_II.pptx  (n = 332)
   - Apollo_Oncology_Patient_Experience_Analysis.pptx (n = 150)
   ============================================================ */

const APOLLO_DATA = {

  journeySteps: [
    {
      label: "Wait Time",
      sub: "Arrival → Admission",
      unit: "min",
      desired: 15,
      phase1: 17,
      phase2: 20.48,
      better: "lower"
    },
    {
      label: "Drug Delivery",
      sub: "Pharmacy dispense",
      unit: "min",
      desired: 30,
      phase1: 20,
      phase2: 24.52,
      better: "lower"
    },
    {
      label: "Pre-Meds",
      sub: "Pre-medication",
      unit: "hr",
      desired: 2,
      phase1: 1.36,
      phase2: 1.10,
      better: "lower"
    },
    {
      label: "Chemotherapy",
      sub: "Infusion (varies by cycle)",
      unit: "hr",
      desired: null,
      desiredLabel: "Varies by cycle",
      phase1: 3.52,
      phase2: 3.48,
      better: "lower"
    },
    {
      label: "Discharge — Cash",
      sub: "Chemo end → Discharge",
      unit: "hr",
      desired: 2.5,
      phase1: 3.0,
      phase2: 1.48,
      better: "lower"
    },
    {
      label: "Discharge — Credit",
      sub: "Chemo end → Discharge",
      unit: "hr",
      desired: 4,
      phase1: 3.27,
      phase2: 3.34,
      better: "lower"
    }
  ],

  tat: {
    labels: ["Cash patients", "Credit patients"],
    phase1: [8.1, 8.37],
    phase2: [7.16, 7.12]
  },

  age: { over60: 42.2, under60: 57.8 },
  location: { hyderabad: 40, elsewhere: 60, international: 14.7 },
  doctorFrequency: { topDoctor: 18, others: 82, topDoctorName: "Dr. Vijay Anand Reddy", totalDoctors: 15 },

  costGap: { preVisitConcern: 65.1, actualSwitch: 7.2 },
  hospitalSwitchReasons: { secondOpinion: 60.8, locationFeasibility: 32 },

  careCoordination: { yes: 91, no: 9 },

  detractorAsks: { costTransparency: 12, betterCommunication: 7.6 },

  keyDrivers: [
    { rank: 1, title: "Appointment Process & Navigation", desc: "The single strongest predictor of whether a patient recommends Apollo to someone else." },
    { rank: 2, title: "Staff Behavior & Empathy", desc: "A highly significant operational factor — how people are treated, not just what's delivered." },
    { rank: 3, title: "Billing Clarity", desc: "Transparent financial communication feeds directly into trust and advocacy." },
    { rank: 4, title: "Doctor Referral", desc: "A key influence on whether a patient becomes a recommender." },
    { rank: 5, title: "Hospital Brand & Trust", desc: "Acts as a baseline buffer — it supports and elevates loyalty rather than driving it outright." }
  ],

  insights: [
    {
      tag: "Acquisition",
      title: "Walk-ins dominate, digital assists",
      body: "Up to 63% of footfall arrives as walk-ins. Patients do use digital channels while deciding, but it stays a secondary touchpoint, not the deciding one."
    },
    {
      tag: "Cost",
      title: "The cost perception gap",
      body: "65.1% name cost as a pre-visit concern. Only 7.2% actually leave for it. The fix is clarity, not discounting."
    },
    {
      tag: "Positioning",
      title: "Technology attracts, scheduling promotes",
      body: "Patients pick Apollo for clinical success, brand trust, and technology — but a frictionless appointment process has the single highest impact on whether they recommend it."
    },
    {
      tag: "Switching",
      title: "The second opinion is the real competitor",
      body: "60.8% of patients who considered another hospital did it for a second opinion, not better care. 32% switched purely on location feasibility."
    },
    {
      tag: "Geography",
      title: "Local patients are the unhappiest patients",
      body: "International and out-of-town patients report high satisfaction. Detractors are almost exclusively local — Hyderabad/Telangana, and mostly 45+."
    },
    {
      tag: "Lifecycle",
      title: "First-timers carry a unique burden",
      body: "Everyone dislikes the wait. But only first-time visitors specifically mark down billing clarity — returning patients have already learned the process."
    }
  ],

  bottlenecks: [
    "Initial drug-chart preparation delayed the start of almost every patient's wait clock.",
    "Bed crunch: on an average morning, only 34 of 39 beds were actually workable.",
    "Discharge slowed by delays in PAT and in preparing/receiving the final discharge summary & bill.",
    "Insurance discharges requested after 9 PM routinely became next-day stay-backs — billing staff thinned out by then."
  ],

  suggestions: [
    "Add transit beds and night-shift manpower specifically for evening/overnight discharges.",
    "Get MS Office support looped in to nudge doctor teams and shrink arrival-to-admission time.",
    "Fast-track the discharge-summary workflow so billing isn't the last domino.",
    "Clinical care flagged an equipment gap: infusion pumps & cardiac monitors needed urgently."
  ]
};
