/* Idea Check, Investor diligence mode. Fifth option in the Idea Check switch
   (#check .x-fp-switch [data-mode="diligence"]), panel #dil-panel.
   Saves answers to localStorage (nsdd-v1).
   Adapted from Startup Science's Startup Due Diligence Checklist for Investors
   (Gregory Shepard, May 20, 2026). Styles: .x-dd-* in index.html, plus .x-inv-*. */
(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var e = function (x) { return String(x == null ? "" : x).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var check = $("check");
  var sw = check && check.querySelector(".x-fp-switch");
  var panel = $("dil-panel");
  if (!check || !sw || !panel) return;

  var KEY = "nsdd-v1";
  var STAGES = [
    ["vision", "Idea, no product yet (Vision)", { team: "P", market: "P", product: "B", financial: "B", legal: "B", ops: "B" }],
    ["build", "Building the product", { team: "P", product: "P", market: "S", legal: "S", financial: "B", ops: "B" }],
    ["gtm", "First customers / go-to-market", { product: "P", team: "S", market: "S", financial: "S", legal: "S", ops: "S" }],
    ["std", "Repeatable sales, raising seed or Series A (Standardization)", { financial: "P", ops: "P", team: "S", product: "S", legal: "S", market: "B" }]
  ];
  var EMPH = { P: "Primary", S: "Secondary", B: "Baseline" };
  var ORDER = { P: 0, S: 1, B: 2 };
  var CHOICES = [["ready", "Ready"], ["partly", "Partly"], ["notyet", "Not yet"], ["later", "Not needed yet"]];

  // Items: [text, common red flag]
  var SECTIONS = [
    { id: "team", name: "Team", items: [
      ["Founder backgrounds you can back up (LinkedIn, references, past company records)"],
      ["Vesting schedules for all founders, with cliff and acceleration terms"],
      ["IP assignment signed by everyone who contributed to the product", 1],
      ["Key person plan: what happens if the CEO or CTO is out for 90 days"],
      ["Org chart with open roles and a hiring plan"],
      ["Any co-founder departure and what happened to their equity, documented", 1],
      ["Advisor agreements and compensation"],
      ["References ready: former colleagues, co-investors, customers"]
    ], flags: [
      "Founder vesting not started or backdated.",
      "Core tech built by contractors with no transition plan.",
      "A co-founder left in the last 12 months and equity wasn't clawed back.",
      "No one on the team has worked in this market."
    ] },
    { id: "market", name: "Market", items: [
      ["Bottom-up market size, not only an analyst number"],
      ["Competitors named, including \"do nothing\"", 1],
      ["Customer interview notes with dates, sample size and method"],
      ["Why now: what changed in the last 2 years"],
      ["Regulations, current and pending"],
      ["Distribution channels with evidence"]
    ], flags: [
      "Market size from one analyst report with no bottom-up check.",
      "\"No direct competitors.\"",
      "Customer interviews over 12 months old."
    ] },
    { id: "product", name: "Product", items: [
      ["Live demo, not a recording"],
      ["Usage numbers: daily or weekly active users, retention cohorts, feature adoption", 1],
      ["Architecture overview: scale, security, third-party dependencies"],
      ["Roadmap with how you prioritize"],
      ["Customer feedback: NPS, support tickets, feature requests"],
      ["Platform dependency risk: API terms, vendor lock-in", 1],
      ["Code quality (usually Series A+): tech debt, test coverage, deploy frequency"]
    ], flags: [
      "Live 6+ months with no usage data.",
      "Roadmap is a feature list with no prioritization.",
      "Core product sits on a third-party platform that could change terms.",
      "A single technical founder with no engineering hires after 18+ months."
    ] },
    { id: "financial", name: "Financial", items: [
      ["Revenue that matches bank or payment processor records", 1],
      ["Unit economics: CAC, LTV, gross margin, payback period"],
      ["Customer concentration: no single customer above 30% of revenue", 1],
      ["Burn and runway from your actual bank balance"],
      ["Full cap table including every SAFE, note and option"],
      ["Projections stress-tested at 50% of planned growth"],
      ["Historical P&L, balance sheet and cash flow"],
      ["Any debt, liens or obligations"]
    ], flags: [
      "Revenue up but gross margin down.",
      "Burn doubled last quarter with no matching milestone.",
      "One customer above 40% of revenue.",
      "SAFEs or notes from 3+ rounds with no priced round."
    ] },
    { id: "legal", name: "Legal", items: [
      ["Formation documents (articles, bylaws)"],
      ["All IP assignments collected: founders, employees, contractors", 1],
      ["Any pending or threatened litigation disclosed", 1],
      ["Material contracts: customers, vendors, leases"],
      ["Workers classified correctly (1099 vs W-2)"],
      ["Option pool size and authorized shares"],
      ["Data privacy (GDPR, CCPA, SOC 2 if it applies)"],
      ["Insurance (D&O, E&O, cyber)"]
    ], flags: [
      "Missing IP assignments for early employees or contractors, the most common legal issue.",
      "An unusual jurisdiction with no clear reason. Delaware C-Corp is the US venture standard.",
      "Undisclosed litigation.",
      "Unclear 1099 vs W-2 classification."
    ] },
    { id: "ops", name: "Operations", items: [
      ["Core workflows written down: onboarding, support, billing, incident response"],
      ["Churn and a retention analysis", 1],
      ["Written contracts with key vendors and partners, not handshakes"],
      ["Security basics: access controls, encryption, backups"],
      ["Compliance needs identified and current"],
      ["Infrastructure that scales with your plan"]
    ], flags: [
      "No written processes as customers grow.",
      "Churn above 5% a month with no analysis.",
      "Key vendors on handshake deals."
    ] }
  ];
  var DATAROOM = [
    "Articles of incorporation",
    "Cap table",
    "All SAFEs or notes",
    "IP assignments for every contributor",
    "Financial statements or management accounts",
    "Material customer contracts",
    "Employment agreements",
    "Org chart"
  ];
  var DATAROOM_PRODUCT = ["Usage metrics", "An architecture overview", "Security docs"];

  var blank = function () { return { stage: "vision", a: {} }; };
  var st = blank();
  try { var sv = JSON.parse(localStorage.getItem(KEY)); if (sv && typeof sv === "object") st = Object.assign(blank(), sv); if (!st.a || typeof st.a !== "object") st.a = {}; } catch (x) {}
  var save = function () { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (x) {} };

  var stage = function () { return STAGES.filter(function (s) { return s[0] === st.stage; })[0] || STAGES[0]; };
  var ordered = function () {
    var m = stage()[2];
    return SECTIONS.map(function (s, i) { return { s: s, em: m[s.id] || "B", i: i }; })
      .sort(function (a, b) { return ORDER[a.em] - ORDER[b.em] || a.i - b.i; });
  };
  var key = function (s, k) { return s.id + "." + k; };
  var count = function (secs) {
    var c = { ready: 0, partly: 0, notyet: 0, later: 0, total: 0 };
    secs.forEach(function (s) { s.items.forEach(function (it, k) { c.total++; var v = st.a[key(s, k)]; if (c[v] != null) c[v]++; }); });
    c.need = c.total - c.later;
    return c;
  };
  var countText = function (c) { return c.ready + " of " + c.need + " ready" + (c.later ? " · " + c.later + " not needed yet" : ""); };

  var itemHTML = function (s, it, k) {
    var nm = "dd-" + s.id + "-" + k, v = st.a[key(s, k)] || "", lid = nm + "-l";
    return '<li class="x-dd-item"><p class="x-dd-q" id="' + lid + '">' + e(it[0]) + (it[1] ? ' <span class="pill x-dd-flag">Common red flag</span>' : "") + "</p>" +
      '<div class="x-inv-opts x-dd-opts" role="radiogroup" aria-labelledby="' + lid + '">' +
      CHOICES.map(function (c) { return '<label><input type="radio" name="' + nm + '" value="' + c[0] + '" data-dd="' + key(s, k) + '"' + (v === c[0] ? " checked" : "") + " />" + c[1] + "</label>"; }).join("") +
      "</div></li>";
  };
  var secHTML = function (o) {
    var s = o.s, c = count([s]);
    return '<section class="x-dd-sec" aria-labelledby="dd-h-' + s.id + '"><div class="x-dd-sec__head"><h3 id="dd-h-' + s.id + '">' + e(s.name) + "</h3>" +
      '<span class="chip' + (o.em === "P" ? " chip--solid" : "") + '">' + EMPH[o.em] + "</span>" +
      '<span class="x-dd-count" data-dd-count="' + s.id + '">' + e(countText(c)) + "</span></div>" +
      '<ul class="x-dd-items">' + s.items.map(function (it, k) { return itemHTML(s, it, k); }).join("") + "</ul>" +
      '<details class="x-dd-flags"><summary>Red flags investors look for</summary><ul>' + s.flags.map(function (f) { return "<li>" + e(f) + "</li>"; }).join("") + "</ul></details></section>";
  };
  var notYetHTML = function () {
    var groups = ordered().map(function (o) {
      var l = o.s.items.filter(function (it, k) { return st.a[key(o.s, k)] === "notyet"; });
      return l.length ? "<div><h4>" + e(o.s.name) + ' <small>' + EMPH[o.em] + "</small></h4><ul>" + l.map(function (it) { return "<li>" + e(it[0]) + "</li>"; }).join("") + "</ul></div>" : "";
    }).filter(Boolean);
    return '<div class="x-dd-box" id="dd-notyet"><h3>Your "Not yet" list</h3>' +
      (groups.length ? '<p class="x-hint">Grouped by section, ' + e(stage()[1].replace(/ \(.*\)$/, "")) + " priorities first.</p>" + groups.join("")
        : '<p class="x-hint">Nothing marked Not yet. Mark items above and they\'ll collect here.</p>') + "</div>";
  };
  var prepHTML = function () {
    return '<div class="x-dd-box"><h3>What to prepare</h3><p class="x-hint">A data room investors expect to see. At minimum:</p><ul>' +
      DATAROOM.map(function (x) { return "<li>" + e(x) + "</li>"; }).join("") + "</ul>" +
      "<p><strong>Product companies, add:</strong> " + e(DATAROOM_PRODUCT.join(", ").toLowerCase().replace(/^./, function (c) { return c.toUpperCase(); })) + ".</p>" +
      '<p><strong>Typical timing:</strong> seed diligence 2-4 weeks, Series A 4-8 weeks.</p></div>';
  };

  var out = $("dil-out");
  var paintSummary = function () {
    var c = count(SECTIONS), tot = $("dd-total");
    if (tot) tot.innerHTML = "<strong>" + e(countText(c)) + "</strong>" + (c.partly || c.notyet ? " · " + c.partly + " partly · " + c.notyet + " not yet" : "");
    SECTIONS.forEach(function (s) { var el = panel.querySelector('[data-dd-count="' + s.id + '"]'); if (el) el.textContent = countText(count([s])); });
    var ny = $("dd-notyet"); if (ny) ny.outerHTML = notYetHTML();
  };
  var paint = function () {
    out.innerHTML =
      '<p class="x-dd-total" id="dd-total" aria-live="polite"></p>' +
      '<div class="x-dd-secs">' + ordered().map(secHTML).join("") + "</div>" +
      notYetHTML() + prepHTML() +
      '<div class="links x-noprint"><button type="button" class="btn" id="dd-copy">Copy my checklist</button><button type="button" class="btn" id="dd-print">Print</button><button type="button" class="btn" id="dd-reset">Start over</button></div>' +
      '<textarea class="x-in x-noprint" id="dd-copy-out" readonly hidden aria-label="Checklist as text" style="min-height:160px"></textarea>';
    paintSummary();
  };

  var asText = function () {
    var c = count(SECTIONS), lab = {};
    CHOICES.forEach(function (x) { lab[x[0]] = x[1]; });
    var L = ["Investor diligence checklist", "Stage: " + stage()[1], "All sections: " + countText(c), ""];
    ordered().forEach(function (o) {
      L.push(o.s.name + " (" + EMPH[o.em] + "): " + countText(count([o.s])));
      o.s.items.forEach(function (it, k) { L.push("- [" + (lab[st.a[key(o.s, k)]] || "Not answered") + "] " + it[0] + (it[1] ? " (common red flag)" : "")); });
      L.push("");
    });
    var ny = [];
    ordered().forEach(function (o) { o.s.items.forEach(function (it, k) { if (st.a[key(o.s, k)] === "notyet") ny.push("- " + o.s.name + ": " + it[0]); }); });
    L.push("Not yet:"); L = L.concat(ny.length ? ny : ["- Nothing marked Not yet"]); L.push("");
    L.push("What to prepare: " + DATAROOM.join("; ") + ". Product companies add: " + DATAROOM_PRODUCT.join("; ").toLowerCase() + ".");
    L.push("Typical timing: seed diligence 2-4 weeks, Series A 4-8 weeks.");
    L.push("", "Adapted from Startup Science's Startup Due Diligence Checklist for Investors (Gregory Shepard, May 20, 2026). Not affiliated.");
    return L.join("\n");
  };

  $("dil-form").innerHTML =
    '<div class="x-field"><label for="dd-stage">Your stage</label><small>Sets which sections investors weigh most. Primary sections come first.</small>' +
    '<select class="x-in" id="dd-stage">' + STAGES.map(function (s) { return '<option value="' + s[0] + '"' + (st.stage === s[0] ? " selected" : "") + ">" + e(s[1]) + "</option>"; }).join("") + "</select></div>";

  panel.addEventListener("change", function (ev) {
    var i = ev.target;
    if (i.id === "dd-stage") { st.stage = i.value; save(); paint(); return; }
    var k = i.getAttribute("data-dd");
    if (k && i.checked) { st.a[k] = i.value; save(); paintSummary(); }
  });
  panel.addEventListener("click", function (ev) {
    var b = ev.target.closest("button"); if (!b) return;
    if (b.id === "dd-print") window.print();
    else if (b.id === "dd-reset") {
      if (confirm("Clear every Investor diligence answer?")) { st = blank(); save(); var s = $("dd-stage"); if (s) s.value = st.stage; paint(); }
    } else if (b.id === "dd-copy") {
      var txt = asText(), ta = $("dd-copy-out");
      var fall = function () { ta.value = txt; ta.hidden = false; ta.focus(); ta.select(); b.textContent = "Select and copy the text below"; };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(function () { b.textContent = "Copied"; setTimeout(function () { b.textContent = "Copy my checklist"; }, 2000); }, fall);
      else fall();
    }
  });
  // Print every red-flag list, then put them back as they were.
  var opened = [];
  window.addEventListener("beforeprint", function () {
    if (panel.hidden) return;
    opened = [].slice.call(panel.querySelectorAll("details:not([open])"));
    opened.forEach(function (d) { d.open = true; });
  });
  window.addEventListener("afterprint", function () { opened.forEach(function (d) { d.open = false; }); opened = []; });

  var btn = sw.querySelector('[data-mode="diligence"]');
  var setMode = function () {
    [].slice.call(check.querySelectorAll("[data-fp-mode]")).forEach(function (el) { el.hidden = el.getAttribute("data-fp-mode") !== "diligence"; });
    [].slice.call(sw.querySelectorAll("button")).forEach(function (b) { b.setAttribute("aria-pressed", b === btn ? "true" : "false"); });
    paint();
  };
  // The other options run their own switch; keep this one in step with them.
  sw.addEventListener("click", function (ev) {
    var b = ev.target.closest("button"); if (!b) return;
    if (b === btn) setMode();
    else if (btn) btn.setAttribute("aria-pressed", "false");
  });
  paint();
})();
