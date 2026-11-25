/* Idea Check, Find programs mode. Fourth option in the Idea Check switch
   (#check .x-fp-switch [data-mode="programs"]), panel #prog-panel.
   Deadline status is worked out against today's date.
   Styles: idea-check.css (.x-inv-*) plus .x-pg-* in index.html. */
(function () {
  "use strict";

  // Checked 2026-11-22. Fields as in programs-page.csv, minus checked.
  var PROGRAMS = [
    {"name": "Nebraska Innovation Fellowship (Nebraska Innovation Studio)", "type": "Fellowship", "for": "Nebraska residents 18+ building a prototype", "stage": "Idea / prototype", "offer": "20 weeks; $2,500 materials allowance, makerspace, mentors; free", "location": "Nebraska", "deadline": "2026-11-30", "women_focused": "no", "ai": "no", "url": "https://innovationstudio.unl.edu/fellowships"},
    {"name": "Nebraska Innovation Fund Prototype Grant (DED)", "type": "Grant", "for": "Nebraska businesses developing a new product", "stage": "Prototype / early product", "offer": "Up to $150K matching grant (50% cash match; reimbursed); rolling until funds run out", "location": "Nebraska", "deadline": "2027-06-30", "women_focused": "no", "ai": "no", "url": "https://opportunity.nebraska.gov/programs/business/nif-prototype-grants/"},
    {"name": "Nebraska SBIR/STTR Matching Grant (DED Business Innovation Act)", "type": "Grant", "for": "Nebraska small businesses pursuing federal SBIR/STTR", "stage": "R&D", "offer": "Phase 0 up to $5K for proposal prep; matches Phase I up to $150K, Phase II up to $300K", "location": "Nebraska", "deadline": "2027-06-30", "women_focused": "no", "ai": "no", "url": "https://opportunity.nebraska.gov/programs/business/sbir-sttr/"},
    {"name": "LaunchLNK Grant (StartupLNK)", "type": "Grant", "for": "Startups based in (or moving to) Lincoln", "stage": "Early-stage", "offer": "$20K non-dilutive grant + $23K+ in-kind services; 6 per year", "location": "Nebraska", "deadline": "Check site", "women_focused": "no", "ai": "no", "url": "https://www.startuplnk.com/launch-lnk-grant"},
    {"name": "NMotion powered by gener8tor", "type": "Accelerator", "for": "High-growth Great Plains startups, any industry", "stage": "Early-stage", "offer": "12 weeks; $100K for 7.5% equity (SAFE)", "location": "Nebraska", "deadline": "Check site", "women_focused": "no", "ai": "no", "url": "https://nmotion.co"},
    {"name": "Techstars Founder Catalyst (Omaha community, via Open Range)", "type": "Accelerator", "for": "Nebraska founders past idea stage; raised under $400K", "stage": "Pre-seed", "offer": "10-week virtual pre-accelerator; free, no equity", "location": "Nebraska", "deadline": "Check site", "women_focused": "no", "ai": "no", "url": "https://www.techstars.com/location/omaha"},
    {"name": "Nebraska I-Corps (NUtech Ventures)", "type": "Support", "for": "UNL/UNK innovators; community teams by referral", "stage": "Idea / validation", "offer": "Free virtual customer-discovery course; Spring 2027 starts Mar 4", "location": "Nebraska", "deadline": "Check site", "women_focused": "no", "ai": "no", "url": "https://nutechventures.org/apply-to-nebraska-i-corps"},
    {"name": "UNO Regional I-Corps (Great Plains I-Corps Hub)", "type": "Support", "for": "University and community startup teams", "stage": "Idea / validation", "offer": "Free 5-week customer discovery; $1,000 on completion", "location": "Nebraska", "deadline": "Check site", "women_focused": "no", "ai": "no", "url": "https://www.unomaha.edu/college-of-business-administration/centers-programs/i-corps.php"},
    {"name": "Nebraska Business Development Center (NBDC)", "type": "Support", "for": "Any Nebraska startup or small business", "stage": "All stages", "offer": "Free 1:1 consulting, market research, SBIR/STTR help", "location": "Nebraska", "deadline": "Rolling", "women_focused": "no", "ai": "no", "url": "https://www.unomaha.edu/nebraska-business-development-center/"},
    {"name": "GROW Nebraska Women's Business Center: Snap & Boost", "type": "Support", "for": "New and early women entrepreneurs", "stage": "Idea / early", "offer": "7-week business-plan cohort, evenings; nominal fee", "location": "Nebraska", "deadline": "Check site", "women_focused": "yes", "ai": "no", "url": "https://grownebraska.org/gnwbc/snap-and-boost"},
    {"name": "Center for Rural Affairs Women's Business Center", "type": "Support", "for": "Entrepreneurs statewide except Omaha metro", "stage": "Idea to growth", "offer": "Free 1:1 coaching; CFRA loans $1K-$250K", "location": "Nebraska", "deadline": "Rolling", "women_focused": "yes", "ai": "no", "url": "https://www.cfra.org/womens-business-center"},
    {"name": "UNeTech Institute", "type": "Incubator", "for": "Founders building on UNMC/UNO inventions (mostly medtech)", "stage": "Idea / early", "offer": "University-affiliated incubation, customer discovery, investor access", "location": "Nebraska", "deadline": "Check site", "women_focused": "no", "ai": "no", "url": "https://www.unetech.org/"},
    {"name": "Steel Works Health Accelerator (CQuence Health, UNeMed, UNeTech)", "type": "Accelerator", "for": "Early-stage medtech/health founders", "stage": "MVP / validation", "offer": "16-week mentorship program to investor-ready pitch", "location": "Nebraska", "deadline": "Check site", "women_focused": "no", "ai": "no", "url": "https://www.cquencehealth.com/steel-works"},
    {"name": "The Combine", "type": "Incubator", "for": "Agtech startups", "stage": "Early-stage", "offer": "Incubator, farmer Insights Network, Nebraska Innovation Campus space", "location": "Nebraska", "deadline": "Check site", "women_focused": "no", "ai": "no", "url": "https://nebraskacombine.com/"},
    {"name": "JumpStart Challenge (StartupLNK / Open Range)", "type": "Competition", "for": "Anyone with an idea; solo or team", "stage": "Idea", "offer": "Reverse pitch: $2,500 (corporate) or $1,000 prize + Startup Weekend 2027 spot", "location": "Nebraska", "deadline": "Check site", "women_focused": "no", "ai": "no", "url": "https://www.startuplnk.com/jumpstart-challenge"},
    {"name": "Nebraska Ag Expo Startup Showcase (Innovation After Hours)", "type": "Competition", "for": "Agtech, sustainability, bioscience startups", "stage": "Prototype+", "offer": "$5,000 judges' award + $1,000 People's Choice", "location": "Nebraska", "deadline": "Check site", "women_focused": "no", "ai": "no", "url": "https://nebraskaagexpo.com/event/startup-showcase/"},
    {"name": "Big Idea Pitch Competition (Central Community College)", "type": "Competition", "for": "Residents of Columbus, Grand Island, Kearney", "stage": "Idea", "offer": "Cash prizes + professional resources", "location": "Nebraska", "deadline": "Check site", "women_focused": "no", "ai": "no", "url": "https://cccneb.edu/business-partners/entrepreneurship-center/"},
    {"name": "Pipeline Fellowship", "type": "Fellowship", "for": "Full-time growth-stage founders in NE, KS, MO", "stage": "Past idea stage", "offer": "Yearlong, 4 in-person modules; no equity; $2,500 logistics fee", "location": "Midwest", "deadline": "Check site", "women_focused": "no", "ai": "no", "url": "https://www.pipelineentrepreneurs.com/fellows"},
    {"name": "Pipeline Pathfinder", "type": "Fellowship", "for": "Early or part-time founders: women, minority, rural", "stage": "Early-stage", "offer": "Yearlong cohort, 4 in-person modules; free, no equity", "location": "Midwest", "deadline": "Check site", "women_focused": "yes", "ai": "no", "url": "https://www.applypipeline.com/"},
    {"name": "Pitch Black (MAC Chamber)", "type": "Competition", "for": "Underrepresented founders, immigrants, refugees in NE/IA/MO/MN/KS", "stage": "Startup / new business", "offer": "5 finalists; 2026 grand prize package $91K+ cash and services", "location": "Midwest", "deadline": "2026-11-23", "women_focused": "no", "ai": "no", "url": "https://wepitchblack.com/"},
    {"name": "NSF SBIR/STTR (America's Seed Fund)", "type": "Grant", "for": "US deep-tech startups", "stage": "R&D / prototype", "offer": "Up to $2M non-dilutive, zero equity", "location": "Remote", "deadline": "Check site", "women_focused": "no", "ai": "no", "url": "https://seedfund.nsf.gov/"},
    {"name": "Amber Grant (WomensNet)", "type": "Grant", "for": "Women-owned businesses, including startups", "stage": "Any", "offer": "Three $15K grants monthly; $75K year-end grants", "location": "Remote", "deadline": "2026-11-30", "women_focused": "yes", "ai": "no", "url": "https://ambergrantsforwomen.com/get-an-amber-grant/"},
    {"name": "IFundWomen Startup Accelerator Grant", "type": "Grant", "for": "US owners of 50%+ of business; idea stage OK", "stage": "Idea / pre-revenue", "offer": "$5,000 unrestricted grant", "location": "Remote", "deadline": "2026-11-30", "women_focused": "no", "ai": "no", "url": "https://ifundwomen.com/grants"},
    {"name": "Tory Burch Foundation Fellows", "type": "Fellowship", "for": "Women owning 51%+ of a business with $75K+ revenue", "stage": "Early growth", "offer": "Yearlong fellowship; free to apply", "location": "Remote", "deadline": "Check site", "women_focused": "yes", "ai": "no", "url": "https://www.toryburchfoundation.org/fellows/"},
    {"name": "Cartier Women's Initiative", "type": "Fellowship", "for": "Women-run impact businesses, $50K-$5M revenue, 5+ staff", "stage": "Growth", "offer": "$100K / $60K / $30K grants to top 3 per region", "location": "Remote", "deadline": "Check site", "women_focused": "yes", "ai": "no", "url": "https://www.cartierwomensinitiative.com/regional-awards"},
    {"name": "Women Founders Network Fast Pitch", "type": "Competition", "for": "Woman-led US startups that raised under $750K", "stage": "Early-stage", "offer": "$25K per track + $5K; finals in Los Angeles", "location": "Remote", "deadline": "Opens April 2027", "women_focused": "yes", "ai": "no", "url": "https://www.womenfoundersnetwork.org/about-fast-pitch"},
    {"name": "Techstars Anywhere Accelerator", "type": "Accelerator", "for": "Startups in American time zones, any industry", "stage": "Pre-seed / seed", "offer": "3-month remote accelerator; $220K capital (per Techstars)", "location": "Remote", "deadline": "Check site", "women_focused": "no", "ai": "no", "url": "https://www.techstars.com/accelerators/anywhere"},
    {"name": "Founder University (LAUNCH)", "type": "Accelerator", "for": "Builder founders shipping product", "stage": "Early-stage", "offer": "12 weeks on Zoom; $500 refundable tuition; may invest $25K (2.5%) or $125K (7%)", "location": "Remote", "deadline": "Check site", "women_focused": "no", "ai": "no", "url": "https://founder.university/"},
    {"name": "EforAll Business Accelerator", "type": "Accelerator", "for": "US adults 18+, idea stage OK", "stage": "Idea / early", "offer": "Free 12-week online program with mentors (EN/ES)", "location": "Remote", "deadline": "2026-12-02", "women_focused": "no", "ai": "no", "url": "https://eforall.org/business-accelerator-apply-now/"},
    {"name": "Theanna Accelerator", "type": "Accelerator", "for": "Non-technical women building tech with a rough prototype", "stage": "Prototype", "offer": "6 weeks, 8 founders; $2,999; 0% equity", "location": "Remote", "deadline": "Check site", "women_focused": "yes", "ai": "no", "url": "https://www.theanna.io/accelerator"},
    {"name": "YC Startup School + Co-Founder Matching", "type": "Support", "for": "Anyone starting a startup", "stage": "Idea", "offer": "Free online course, weekly accountability, cofounder matching", "location": "Remote", "deadline": "Rolling", "women_focused": "no", "ai": "no", "url": "https://www.startupschool.org/"},
    {"name": "DreamBuilder", "type": "Support", "for": "Women starting or growing a business", "stage": "Idea / early", "offer": "Free online courses in English and Spanish", "location": "Remote", "deadline": "Rolling", "women_focused": "yes", "ai": "no", "url": "https://dreambuilder.org/"},
    // AI-focused programs: Failory, Top 164 AI Accelerators and Incubators (2026), checked 2026-11-25.
    {"name": "Y Combinator", "type": "Accelerator", "for": "Early-stage startups, any industry; large AI share", "stage": "Idea to seed", "offer": "$500K ($125K for 7% + $375K uncapped MFN SAFE); 11 weeks, on-site", "location": "Mountain View, CA", "deadline": "Check site", "women_focused": "no", "ai": "yes", "url": "https://www.ycombinator.com/"},
    {"name": "Techstars accelerators", "type": "Accelerator", "for": "Early-stage startups, many industry programs", "stage": "Pre-seed", "offer": "$220K ($200K uncapped MFN SAFE + $20K for 5%); 13 weeks", "location": "Boulder, CO + programs worldwide", "deadline": "Check site", "women_focused": "no", "ai": "yes", "url": "https://www.techstars.com/"},
    {"name": "500 Global", "type": "Accelerator", "for": "Fast-growing tech startups", "stage": "Early-stage", "offer": "$150K for 6% (less $37.5K program fee); 16 weeks", "location": "San Francisco, CA", "deadline": "Check site", "women_focused": "no", "ai": "yes", "url": "https://500.co/"},
    {"name": "Innovation Works (AlphaLab, AlphaLab Gear, Robotics Factory)", "type": "Accelerator", "for": "Software, hardware and robotics startups", "stage": "Early-stage", "offer": "AlphaLab: $100K convertible note + 2% common; Robotics Factory: up to $100K", "location": "Pittsburgh, PA", "deadline": "Check site", "women_focused": "no", "ai": "yes", "url": "https://www.innovationworks.org/"},
    {"name": "Forum Ventures Pre-Seed Accelerator", "type": "Accelerator", "for": "B2B SaaS founders", "stage": "Pre-seed", "offer": "$100K for 7.5% (post-money SAFE); 24 weeks, online", "location": "Remote", "deadline": "Check site", "women_focused": "no", "ai": "yes", "url": "https://www.forumvc.com/"},
    {"name": "Entrepreneurs First", "type": "Accelerator", "for": "Individuals before a team or idea, deep tech", "stage": "Pre-team / idea", "offer": "$250K for 8% (US and Europe); 24 weeks", "location": "London + US", "deadline": "Check site", "women_focused": "no", "ai": "yes", "url": "https://www.joinef.com/"},
    {"name": "Startupbootcamp", "type": "Accelerator", "for": "Industry-focused programs incl. AI, fintech, health", "stage": "Early-stage", "offer": "€15K-€100K depending on program, 6-8% avg; 13 weeks", "location": "London + programs worldwide", "deadline": "Check site", "women_focused": "no", "ai": "yes", "url": "https://www.startupbootcamp.org/"},
    {"name": "South Park Commons", "type": "Support", "for": "Builders exploring what to work on next", "stage": "Pre-idea / idea", "offer": "See site for terms", "location": "San Francisco, CA + New York", "deadline": "Check site", "women_focused": "no", "ai": "yes", "url": "https://www.southparkcommons.com/"},
    {"name": "AI Grant", "type": "Grant", "for": "AI-native product founders", "stage": "Early-stage", "offer": "See site for terms", "location": "Remote", "deadline": "Check site", "women_focused": "no", "ai": "yes", "url": "https://aigrant.org/"},
    {"name": "AI2 Incubator", "type": "Incubator", "for": "AI-first startups", "stage": "Pre-seed", "offer": "See site for terms", "location": "Seattle, WA", "deadline": "Check site", "women_focused": "no", "ai": "yes", "url": "https://ai2incubator.com/"},
    {"name": "AI Fund (Andrew Ng)", "type": "Incubator", "for": "AI companies co-built with the studio", "stage": "Idea / pre-seed", "offer": "See site for terms", "location": "Palo Alto, CA", "deadline": "Check site", "women_focused": "no", "ai": "yes", "url": "https://aifund.ai/"},
    {"name": "NVIDIA Inception", "type": "Support", "for": "AI and data science startups", "stage": "Any", "offer": "Free program; see site for benefits", "location": "Remote", "deadline": "Rolling", "women_focused": "no", "ai": "yes", "url": "https://www.nvidia.com/en-us/deep-learning-ai/startups/"},
    {"name": "Microsoft for Startups", "type": "Support", "for": "Software and AI startups", "stage": "Any", "offer": "Free program; see site for credits and benefits", "location": "Remote", "deadline": "Rolling", "women_focused": "no", "ai": "yes", "url": "https://startups.microsoft.com/"},
    {"name": "GitHub Accelerator", "type": "Accelerator", "for": "Open-source maintainers and startups", "stage": "Early-stage", "offer": "See site for terms", "location": "Remote", "deadline": "Check site", "women_focused": "no", "ai": "yes", "url": "https://accelerator.github.com/"},
    {"name": "Founders, Inc.", "type": "Accelerator", "for": "Software, AI and hardware startups", "stage": "Pre-seed", "offer": "See site for terms", "location": "San Francisco, CA", "deadline": "Check site", "women_focused": "no", "ai": "yes", "url": "https://f.inc/"},
    {"name": "Sputnik ATX", "type": "Accelerator", "for": "Early-stage startups", "stage": "Pre-seed", "offer": "See site for terms", "location": "Austin, TX", "deadline": "Check site", "women_focused": "no", "ai": "yes", "url": "https://www.sputnikatx.com/"},
    {"name": "Innosphere Ventures", "type": "Incubator", "for": "Science and technology startups", "stage": "Early-stage", "offer": "See site for terms", "location": "Fort Collins, CO", "deadline": "Check site", "women_focused": "no", "ai": "yes", "url": "https://innosphereventures.org/"}
  ];

  var TYPES = ["All", "Fellowship", "Grant", "Accelerator", "Incubator", "Support", "Competition"];
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  var $ = function (id) { return document.getElementById(id); };
  var e = function (x) { return String(x == null ? "" : x).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var check = $("check");
  var sw = check && check.querySelector(".x-fp-switch");
  var panel = $("prog-panel");
  if (!check || !sw || !panel) return;

  var DEADLINES = [["all", "All"], ["d30", "Next 30 days"], ["d90", "Next 90 days"], ["rolling", "Rolling or open now"], ["open", "Hide closed"]];
  var SORTS = [["soon", "Deadline, soonest first", "soonest deadline first"], ["late", "Deadline, latest first", "latest deadline first"], ["name", "Name A–Z", "by name, A to Z"]];
  var has = function (arr, v) { return arr.some(function (a) { return a[0] === v; }); };

  // Choices stay in localStorage, like the other Idea Check modes.
  var KEY = "nspg-v1";
  var st = { type: "All", focus: "all", women: false, ne: false, deadline: "all", sort: "soon" };
  try {
    var sv = JSON.parse(localStorage.getItem(KEY));
    if (sv && typeof sv === "object") {
      if (TYPES.indexOf(sv.type) > -1) st.type = sv.type;
      if (sv.focus === "all" || sv.focus === "ai") st.focus = sv.focus;
      st.women = sv.women === true; st.ne = sv.ne === true;
      if (has(DEADLINES, sv.deadline)) st.deadline = sv.deadline;
      if (has(SORTS, sv.sort)) st.sort = sv.sort;
    }
  } catch (x) {}
  var save = function () { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (x) {} };

  // Deadline status against today's local date.
  var DATED = /^(\d{4})-(\d{2})-(\d{2})$/;
  var todayUTC = function () { var t = new Date(); return Date.UTC(t.getFullYear(), t.getMonth(), t.getDate()); };
  var status = function (p) {
    var m = DATED.exec(p.deadline);
    if (m) {
      var y = +m[1], mo = +m[2], d = +m[3];
      var when = MONTHS[mo - 1] + " " + d + ", " + y;
      var days = Math.round((Date.UTC(y, mo - 1, d) - todayUTC()) / 864e5);
      if (days < 0) return { tier: 3, key: -days, text: "Closed (" + when + ")", closed: true };
      var soon = days === 0 ? "Closes today" : days <= 30 ? days + (days === 1 ? " day left" : " days left") : "";
      return { tier: 0, key: days, text: when, soon: soon, open: true };
    }
    if (/^(opens|rolling)/i.test(p.deadline)) return { tier: 1, key: 0, text: p.deadline, open: /^rolling/i.test(p.deadline) };
    return { tier: 2, key: 0, text: p.deadline || "Check site" };
  };

  var list = function () {
    return PROGRAMS.map(function (p, i) { return { p: p, s: status(p), i: i }; })
      .filter(function (x) {
        if (st.type !== "All" && x.p.type !== st.type) return false;
        if (st.focus === "ai" && x.p.ai !== "yes") return false;
        if (st.women && x.p.women_focused !== "yes") return false;
        if (st.ne && x.p.location !== "Nebraska") return false;
        if (st.deadline === "d30" && !(x.s.tier === 0 && x.s.key <= 30)) return false;
        if (st.deadline === "d90" && !(x.s.tier === 0 && x.s.key <= 90)) return false;
        if (st.deadline === "rolling" && !/^rolling/i.test(x.p.deadline)) return false;
        if (st.deadline === "open" && x.s.closed) return false;
        return true;
      })
      .sort(st.sort === "name"
        ? function (a, b) { return a.p.name.localeCompare(b.p.name, "en", { sensitivity: "base" }) || a.i - b.i; }
        : st.sort === "late"
        ? function (a, b) { return a.s.tier - b.s.tier || (a.s.tier === 0 ? b.s.key - a.s.key : a.s.key - b.s.key) || a.i - b.i; }
        : function (a, b) { return a.s.tier - b.s.tier || a.s.key - b.s.key || a.i - b.i; });
  };
  var sortHint = function () { for (var k = 0; k < SORTS.length; k++) if (SORTS[k][0] === st.sort) return SORTS[k][2]; return SORTS[0][2]; };

  var card = function (x) {
    var p = x.p, s = x.s, tags = [];
    if (s.soon) tags.push('<span class="chip chip--solid">' + e(s.soon) + "</span>");
    var meta = [p.type, p.location];
    if (p.women_focused === "yes") meta.push("Women-focused");
    if (p.ai === "yes") meta.push("AI-focused");
    return '<div' + (s.closed ? ' class="x-pg-closed"' : "") + ">" +
      (tags.length ? '<p class="x-inv-tags">' + tags.join("") + "</p>" : "") +
      "<h3>" + e(p.name) + "</h3>" +
      '<p class="x-inv-meta">' + e(meta.join(" · ")) + "</p>" +
      "<ul>" +
      "<li><small>Who it's for</small>" + e(p.for) + "</li>" +
      "<li><small>What you get</small>" + e(p.offer) + "</li>" +
      '<li><small>Deadline</small><span' + (s.closed ? ' class="x-pg-muted"' : "") + ">" + e(s.text) + "</span></li>" +
      "</ul>" +
      '<p class="x-inv-go"><a class="link" href="' + e(p.url) + '" target="_blank" rel="noopener">' + (s.open ? "Apply" : "Visit site") + "</a></p>" +
      "</div>";
  };

  var out = $("prog-out");
  var paint = function () {
    var l = list();
    if (!l.length) { out.innerHTML = '<p class="x-inv-empty">No programs match. Turn off a filter or pick All.</p>'; return; }
    out.innerHTML = '<div class="x-inv-group"><p class="x-hint">' + l.length + (l.length === 1 ? " program" : " programs") + ", " + sortHint() + '.</p><div class="cards x-inv-res">' + l.map(card).join("") + "</div>" +
      (l.some(function (x) { return x.p.ai === "yes"; }) ? '<p class="fineprint">AI programs from <a class="link" href="https://www.failory.com/startups/ai-accelerators-incubators" target="_blank" rel="noopener">Failory\'s Top 164 AI Accelerators and Incubators (2026)</a>, checked Nov 25, 2026. Terms change, so confirm on each site.</p>' : "") +
      "</div>";
  };

  var pill = function (type, name, val, label, on) {
    return '<label><input type="' + type + '" name="' + name + '" value="' + val + '"' + (on ? " checked" : "") + " />" + e(label) + "</label>";
  };
  $("prog-form").innerHTML =
    '<fieldset class="x-inv-opts"><legend>Type</legend>' + TYPES.map(function (t) { return pill("radio", "prog-type", t, t, st.type === t); }).join("") + "</fieldset>" +
    '<fieldset class="x-inv-opts"><legend>Focus</legend>' + pill("radio", "prog-focus", "all", "All", st.focus === "all") + pill("radio", "prog-focus", "ai", "AI-focused", st.focus === "ai") + "</fieldset>" +
    '<fieldset class="x-inv-opts"><legend>Show only</legend>' + pill("checkbox", "prog-flag", "women", "Women-focused", st.women) + pill("checkbox", "prog-flag", "ne", "Nebraska only", st.ne) + "</fieldset>" +
    '<fieldset class="x-inv-opts"><legend>Deadline</legend>' + DEADLINES.map(function (d) { return pill("radio", "prog-deadline", d[0], d[1], st.deadline === d[0]); }).join("") + "</fieldset>" +
    '<fieldset class="x-inv-opts"><legend>Sort by</legend>' + SORTS.map(function (s) { return pill("radio", "prog-sort", s[0], s[1], st.sort === s[0]); }).join("") + "</fieldset>";

  panel.addEventListener("change", function (ev) {
    var i = ev.target; if (!i.name) return;
    if (i.name === "prog-type") st.type = i.value;
    else if (i.name === "prog-focus") st.focus = i.value;
    else if (i.name === "prog-flag") st[i.value] = i.checked;
    else if (i.name === "prog-deadline") st.deadline = i.value;
    else if (i.name === "prog-sort") st.sort = i.value;
    else return;
    save();
    paint();
  });

  var btn = sw.querySelector('[data-mode="programs"]');
  var setMode = function () {
    [].slice.call(check.querySelectorAll("[data-fp-mode]")).forEach(function (el) { el.hidden = el.getAttribute("data-fp-mode") !== "programs"; });
    [].slice.call(sw.querySelectorAll("button")).forEach(function (b) { b.setAttribute("aria-pressed", b === btn ? "true" : "false"); });
    paint();
  };
  // The other three options run their own switch; keep this one in step with them.
  sw.addEventListener("click", function (ev) {
    var b = ev.target.closest("button"); if (!b) return;
    if (b === btn) setMode();
    else if (btn) btn.setAttribute("aria-pressed", "false");
  });
  paint();
})();
