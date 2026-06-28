/* ============================================================
   APOLLO ONCOLOGY DASHBOARD — CHARTS
   ============================================================ */

(function () {
  "use strict";

  const COLORS = {
    ink: "#0F2733",
    paper: "#F7F7F4",
    terracotta: "#C1542F",
    terracottaDim: "#E3B79E",
    teal: "#2F7A68",
    tealDim: "#BFDBD2",
    gold: "#B98A3D",
    muted: "#9FB4B1",
    line: "rgba(15,39,51,0.08)",
    lineOnDark: "rgba(247,247,244,0.12)"
  };

  const FONT = {
    family: "'Inter', system-ui, sans-serif",
    size: 12
  };

  Chart.defaults.font.family = FONT.family;
  Chart.defaults.font.size = FONT.size;
  Chart.defaults.color = "#5B6B6E";

  function baseGridOptions(onDark) {
    return {
      color: onDark ? COLORS.lineOnDark : COLORS.line,
      drawTicks: false
    };
  }

  function commonTooltip() {
    return {
      backgroundColor: "#0F2733",
      titleFont: { family: FONT.family, weight: "600" },
      bodyFont: { family: "'IBM Plex Mono', monospace" },
      padding: 10,
      cornerRadius: 6,
      displayColors: false
    };
  }

  /* ---------- Render the journey timeline (custom CSS bars, not Chart.js) ---------- */
  function renderJourneyTimeline() {
    const wrap = document.getElementById("journeyTimeline");
    if (!wrap) return;

    const maxByUnit = { min: 35, hr: 4.5 };

    APOLLO_DATA.journeySteps.forEach((step, i) => {
      const max = maxByUnit[step.unit];
      const pct = v => Math.min(100, (v / max) * 100);

      const delta = step.phase2 - step.phase1;
      const improved = (step.better === "lower" && delta < 0) || (step.better === "higher" && delta > 0);
      const deltaAbs = Math.abs(delta).toFixed(2).replace(/\.00$/, "").replace(/0$/, m => m === "0" ? "0" : m);
      const deltaPct = Math.abs((delta / step.phase1) * 100).toFixed(0);

      const card = document.createElement("div");
      card.className = "journey-step";
      card.innerHTML = `
        <div class="journey-step__num">${i + 1}</div>
        <div class="journey-step__body">
          <div class="journey-step__title">
            <h4>${step.label}</h4>
            <span>${step.sub}</span>
          </div>
          <div class="journey-step__bars">
            <div class="jbar jbar--target">
              <span class="jbar__label">Target</span>
              <div class="jbar__track"><div class="jbar__fill jbar__fill--target" style="width:${step.desired ? pct(step.desired) : 0}%"></div></div>
              <span class="jbar__value">${step.desired ? step.desired + " " + step.unit : step.desiredLabel}</span>
            </div>
            <div class="jbar jbar--p1">
              <span class="jbar__label">Phase I</span>
              <div class="jbar__track"><div class="jbar__fill jbar__fill--p1" style="width:${pct(step.phase1)}%"></div></div>
              <span class="jbar__value">${step.phase1} ${step.unit}</span>
            </div>
            <div class="jbar jbar--p2">
              <span class="jbar__label">Phase II</span>
              <div class="jbar__track"><div class="jbar__fill jbar__fill--p2" style="width:${pct(step.phase2)}%"></div></div>
              <span class="jbar__value">${step.phase2} ${step.unit}</span>
            </div>
          </div>
        </div>
        <div class="journey-step__delta ${improved ? "is-good" : "is-watch"}">
          <span>${improved ? "▼" : "▲"} ${deltaPct}%</span>
          <small>${improved ? "improved" : "slower"}</small>
        </div>
      `;
      wrap.appendChild(card);
    });
  }

  /* ---------- TAT Phase I vs Phase II ---------- */
  function renderTatChart() {
    const el = document.getElementById("tatChart");
    if (!el) return;
    new Chart(el, {
      type: "bar",
      data: {
        labels: APOLLO_DATA.tat.labels,
        datasets: [
          { label: "Phase I (n=132)", data: APOLLO_DATA.tat.phase1, backgroundColor: COLORS.gold, borderRadius: 6, maxBarThickness: 56 },
          { label: "Phase II (n=332)", data: APOLLO_DATA.tat.phase2, backgroundColor: COLORS.teal, borderRadius: 6, maxBarThickness: 56 }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "bottom", labels: { boxWidth: 12, boxHeight: 12, usePointStyle: true, pointStyle: "circle" } },
          tooltip: { ...commonTooltip(), callbacks: { label: c => `${c.dataset.label}: ${c.parsed.y}h` } }
        },
        scales: {
          y: { beginAtZero: true, title: { display: true, text: "Total turnaround time (hours)" }, grid: baseGridOptions(false) },
          x: { grid: { display: false } }
        }
      }
    });
  }

  /* ---------- Age donut ---------- */
  function renderAgeChart() {
    const el = document.getElementById("ageChart");
    if (!el) return;
    new Chart(el, {
      type: "doughnut",
      data: {
        labels: ["60+ years", "Under 60"],
        datasets: [{ data: [APOLLO_DATA.age.over60, APOLLO_DATA.age.under60], backgroundColor: [COLORS.terracotta, "#E7ECEA"], borderWidth: 0 }]
      },
      options: donutOptions("42.2%", "are 60+")
    });
  }

  /* ---------- Location donut ---------- */
  function renderLocationChart() {
    const el = document.getElementById("locationChart");
    if (!el) return;
    new Chart(el, {
      type: "doughnut",
      data: {
        labels: ["Hyderabad", "Elsewhere"],
        datasets: [{ data: [APOLLO_DATA.location.hyderabad, APOLLO_DATA.location.elsewhere], backgroundColor: [COLORS.teal, "#E7ECEA"], borderWidth: 0 }]
      },
      options: donutOptions("40%", "from Hyderabad")
    });
  }

  function donutOptions(centerNum, centerLabel) {
    return {
      responsive: true,
      cutout: "72%",
      plugins: {
        legend: { position: "bottom", labels: { boxWidth: 10, boxHeight: 10, usePointStyle: true, pointStyle: "circle" } },
        tooltip: { ...commonTooltip(), callbacks: { label: c => `${c.label}: ${c.parsed}%` } },
        centerText: { num: centerNum, label: centerLabel }
      }
    };
  }

  // small plugin to draw center text on donuts
  const centerTextPlugin = {
    id: "centerText",
    afterDraw(chart, args, opts) {
      if (!opts || !opts.num) return;
      const { ctx, chartArea } = chart;
      const cx = (chartArea.left + chartArea.right) / 2;
      const cy = (chartArea.top + chartArea.bottom) / 2;
      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "700 22px 'IBM Plex Mono', monospace";
      ctx.fillStyle = "#0F2733";
      ctx.fillText(opts.num, cx, cy - 8);
      ctx.font = "500 11px 'Inter', sans-serif";
      ctx.fillStyle = "#5B6B6E";
      ctx.fillText(opts.label, cx, cy + 12);
      ctx.restore();
    }
  };
  if (typeof Chart !== "undefined") Chart.register(centerTextPlugin);

  /* ---------- Doctor frequency bar ---------- */
  function renderDoctorChart() {
    const el = document.getElementById("doctorChart");
    if (!el) return;
    new Chart(el, {
      type: "bar",
      data: {
        labels: [APOLLO_DATA.doctorFrequency.topDoctorName, "Other 14 doctors"],
        datasets: [{
          data: [APOLLO_DATA.doctorFrequency.topDoctor, APOLLO_DATA.doctorFrequency.others],
          backgroundColor: [COLORS.terracotta, "#E7ECEA"],
          borderRadius: 6,
          maxBarThickness: 46
        }]
      },
      options: {
        indexAxis: "y",
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { ...commonTooltip(), callbacks: { label: c => `${c.parsed.x}% of patients` } }
        },
        scales: {
          x: { beginAtZero: true, max: 100, title: { display: true, text: "% of patients" }, grid: baseGridOptions(false) },
          y: { grid: { display: false } }
        }
      }
    });
  }

  /* ---------- Cost perception gap ---------- */
  function renderCostGapChart() {
    const el = document.getElementById("costGapChart");
    if (!el) return;
    new Chart(el, {
      type: "bar",
      data: {
        labels: ["Flag cost as a\npre-visit concern", "Actually switch\nhospitals over price"],
        datasets: [{
          data: [APOLLO_DATA.costGap.preVisitConcern, APOLLO_DATA.costGap.actualSwitch],
          backgroundColor: [COLORS.gold, COLORS.teal],
          borderRadius: 6,
          maxBarThickness: 80
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { ...commonTooltip(), callbacks: { label: c => `${c.parsed.y}% of patients` } }
        },
        scales: {
          y: { beginAtZero: true, max: 100, title: { display: true, text: "% of patients" }, grid: baseGridOptions(false) },
          x: { grid: { display: false } }
        }
      }
    });
  }

  /* ---------- Hospital switch reasons ---------- */
  function renderSwitchChart() {
    const el = document.getElementById("switchChart");
    if (!el) return;
    new Chart(el, {
      type: "bar",
      data: {
        labels: ["Second opinion", "Location feasibility"],
        datasets: [{
          data: [APOLLO_DATA.hospitalSwitchReasons.secondOpinion, APOLLO_DATA.hospitalSwitchReasons.locationFeasibility],
          backgroundColor: [COLORS.terracotta, COLORS.teal],
          borderRadius: 6,
          maxBarThickness: 50
        }]
      },
      options: {
        indexAxis: "y",
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { ...commonTooltip(), callbacks: { label: c => `${c.parsed.x}%` } }
        },
        scales: {
          x: { beginAtZero: true, max: 70, title: { display: true, text: "% of patients who considered switching" }, grid: baseGridOptions(false) },
          y: { grid: { display: false } }
        }
      }
    });
  }

  /* ---------- Care coordination donut ---------- */
  function renderCoordChart() {
    const el = document.getElementById("coordChart");
    if (!el) return;
    new Chart(el, {
      type: "doughnut",
      data: {
        labels: ["Yes, coordinated", "No, gaps reported"],
        datasets: [{ data: [APOLLO_DATA.careCoordination.yes, APOLLO_DATA.careCoordination.no], backgroundColor: [COLORS.teal, COLORS.terracotta], borderWidth: 0 }]
      },
      options: donutOptions("91%", "say yes")
    });
  }

  /* ---------- Detractor asks ---------- */
  function renderDetractorChart() {
    const el = document.getElementById("detractorChart");
    if (!el) return;
    new Chart(el, {
      type: "bar",
      data: {
        labels: ["Cost transparency", "Better communication"],
        datasets: [{
          data: [APOLLO_DATA.detractorAsks.costTransparency, APOLLO_DATA.detractorAsks.betterCommunication],
          backgroundColor: [COLORS.terracotta, COLORS.gold],
          borderRadius: 6,
          maxBarThickness: 40
        }]
      },
      options: {
        indexAxis: "y",
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { ...commonTooltip(), callbacks: { label: c => `${c.parsed.x}% of suggestions` } }
        },
        scales: {
          x: {
            beginAtZero: true, max: 20,
            title: { display: true, text: "% of suggestions", color: COLORS.muted },
            grid: baseGridOptions(true), ticks: { color: COLORS.muted }
          },
          y: { grid: { display: false }, ticks: { color: "#F2F4F3" } }
        }
      }
    });
  }

  /* ---------- NPS gauge (hand-built SVG, not Chart.js) ---------- */
  function renderNpsGauge() {
    const svg = document.getElementById("npsGauge");
    if (!svg) return;

    const cx = 160, cy = 170, r = 130;
    const valueToAngle = v => 180 - ((v + 100) / 200) * 180; // -100..100 -> 180..0 degrees

    function arcPath(startVal, endVal, radius) {
      const a0 = valueToAngle(startVal) * Math.PI / 180;
      const a1 = valueToAngle(endVal) * Math.PI / 180;
      const x0 = cx - radius * Math.cos(a0), y0 = cy - radius * Math.sin(a0);
      const x1 = cx - radius * Math.cos(a1), y1 = cy - radius * Math.sin(a1);
      const largeArc = Math.abs(a1 - a0) > Math.PI ? 1 : 0;
      return `M ${x0} ${y0} A ${radius} ${radius} 0 ${largeArc} 1 ${x1} ${y1}`;
    }

    const ns = "http://www.w3.org/2000/svg";
    function el(tag, attrs) {
      const e = document.createElementNS(ns, tag);
      Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
      return e;
    }

    // base track
    svg.appendChild(el("path", { d: arcPath(-100, 100, r), fill: "none", stroke: "rgba(246,247,245,0.12)", "stroke-width": 18, "stroke-linecap": "round" }));
    // benchmark band 30-50
    svg.appendChild(el("path", { d: arcPath(30, 50, r), fill: "none", stroke: "#D9A23B", "stroke-width": 18, "stroke-linecap": "butt", opacity: 0.85 }));
    // excellent band 50-100
    svg.appendChild(el("path", { d: arcPath(50, 100, r), fill: "none", stroke: "#4F9D86", "stroke-width": 18, "stroke-linecap": "round", opacity: 0.55 }));
    // value arc up to 49.3
    svg.appendChild(el("path", { d: arcPath(-100, 49.3, r), fill: "none", stroke: "#E2603D", "stroke-width": 6, "stroke-linecap": "round" }));

    // needle
    const angle = valueToAngle(49.3) * Math.PI / 180;
    const nx = cx - (r - 6) * Math.cos(angle);
    const ny = cy - (r - 6) * Math.sin(angle);
    svg.appendChild(el("line", { x1: cx, y1: cy, x2: nx, y2: ny, stroke: "#F6F7F5", "stroke-width": 3, "stroke-linecap": "round" }));
    svg.appendChild(el("circle", { cx: cx, cy: cy, r: 6, fill: "#F6F7F5" }));

    // tick labels
    [-100, 0, 30, 50, 100].forEach(v => {
      const a = valueToAngle(v) * Math.PI / 180;
      const tx = cx - (r + 22) * Math.cos(a);
      const ty = cy - (r + 22) * Math.sin(a);
      const t = el("text", { x: tx, y: ty, "text-anchor": "middle", fill: "#9FB3B8", "font-size": "11", "font-family": "IBM Plex Mono, monospace" });
      t.textContent = v;
      svg.appendChild(t);
    });
  }

  /* ---------- Quick stats strip for the journey section ---------- */
  function renderJourneyStats() {
    const wrap = document.getElementById("journeyStats");
    if (!wrap) return;
    APOLLO_DATA.journeyStats.forEach(s => {
      const card = document.createElement("div");
      card.className = "stat-strip__item";
      card.innerHTML = `
        <span class="stat-strip__value">${s.value}</span>
        <span class="stat-strip__label">${s.label}</span>
        <span class="stat-strip__note">${s.note}</span>
      `;
      wrap.appendChild(card);
    });
  }

  /* ---------- Process-flow diagram ---------- */
  function renderProcessFlow() {
    const wrap = document.getElementById("processFlow");
    if (!wrap) return;
    APOLLO_DATA.processFlow.forEach((step, i) => {
      const node = document.createElement("div");
      node.className = "flow-node";
      node.innerHTML = `
        <div class="flow-node__dot">${i + 1}</div>
        <div class="flow-node__body">
          <h5>${step.stage}</h5>
          <p>${step.detail}</p>
        </div>
      `;
      wrap.appendChild(node);
      if (i < APOLLO_DATA.processFlow.length - 1) {
        const arrow = document.createElement("div");
        arrow.className = "flow-arrow";
        arrow.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        wrap.appendChild(arrow);
      }
    });
  }

  /* ---------- Build journey timeline, rank list, insight grid (DOM, not charts) ---------- */
  function renderRankList() {
    const list = document.getElementById("rankList");
    if (!list) return;
    APOLLO_DATA.keyDrivers.forEach(d => {
      const li = document.createElement("li");
      li.className = "rank-item";
      li.innerHTML = `
        <span class="rank-item__num">${String(d.rank).padStart(2, "0")}</span>
        <div class="rank-item__bar"><div class="rank-item__bar-fill" style="width:${100 - (d.rank - 1) * 16}%"></div></div>
        <div class="rank-item__body">
          <h4>${d.title}</h4>
          <p>${d.desc}</p>
        </div>
      `;
      list.appendChild(li);
    });
  }

  function renderInsightGrid() {
    const grid = document.getElementById("insightGrid");
    if (!grid) return;
    APOLLO_DATA.insights.forEach(ins => {
      const card = document.createElement("div");
      card.className = "info-card info-card--insight";
      card.innerHTML = `
        <span class="insight-tag">${ins.tag}</span>
        <h3>${ins.title}</h3>
        <p>${ins.body}</p>
      `;
      grid.appendChild(card);
    });
  }

  /* ---------- init ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    renderJourneyStats();
    renderProcessFlow();
    renderJourneyTimeline();
    renderRankList();
    renderInsightGrid();

    renderTatChart();
    renderAgeChart();
    renderLocationChart();
    renderDoctorChart();
    renderCostGapChart();
    renderSwitchChart();
    renderCoordChart();
    renderDetractorChart();
    renderNpsGauge();
  });
})();
