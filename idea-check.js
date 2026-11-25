
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var e = function (x) { return String(x == null ? "" : x).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var KEY = "nsic-v2";
  var s = { a: {}, fu: {}, ev: [], phrase: null, step: 0 };
  try { var saved = JSON.parse(localStorage.getItem(KEY)); if (saved) s = Object.assign(s, saved); } catch (x) {}
  var save = function () { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (x) {} };
  var v = function (id) { return String(s.a[id] || "").trim(); };
  var n = function (id) { return parseFloat(v(id).replace(/[^0-9.]/g, "")) || 0; };
  var has = function (id, re) { return re.test(v(id).toLowerCase()); };
  var THESES = [];
  var TJ = {"checked": "2026-11-14", "theses": [{"src": "Y Combinator RFS, Winter 2027", "title": "Startups in a world of abundant space access", "by": "Ankit Gupta", "summary": "Business models that work when launch costs fall 100x.", "tags": ["space", "aerospace", "satellite", "orbital", "launch"], "url": "https://www.ycombinator.com/rfs"}, {"src": "Y Combinator RFS, Winter 2027", "title": "The $15-an-hour expert", "by": "Brad Flora", "summary": "AI that turns ordinary workers into experts where credentials are the bottleneck: benefits, taxes, insurance claims, medical billing, immigration paperwork.", "tags": ["services", "insurance", "claims", "billing", "medical billing", "tax", "benefits", "immigration", "workforce", "customer service", "ai", "paperwork", "credential"], "url": "https://www.ycombinator.com/rfs"}, {"src": "Y Combinator RFS, Winter 2027", "title": "Robots made in America", "by": "Diana Hu", "summary": "Robots and their US supply chain: magnets, motors, gears, encoders, sensors, grippers, chips, batteries.", "tags": ["robotics", "robot", "hardware", "manufacturing", "supply chain", "motors", "sensors", "automation", "factory"], "url": "https://www.ycombinator.com/rfs"}, {"src": "Y Combinator RFS, Winter 2027", "title": "LLMs that write well", "by": "Jared Friedman", "summary": "Models people like talking to, with real voice and style.", "tags": ["writing", "llm", "model", "content", "language", "ai"], "url": "https://www.ycombinator.com/rfs"}, {"src": "Y Combinator RFS, Winter 2027", "title": "Plaid for government benefits", "by": "Gustaf Alströmer", "summary": "Verify income, tax, and residency once and apply everywhere; Medicaid re-checks every six months from 2027.", "tags": ["government", "benefits", "medicaid", "fintech", "identity", "verification", "fraud", "public sector", "social services"], "url": "https://www.ycombinator.com/rfs"}, {"src": "Y Combinator RFS, Winter 2027", "title": "Wall Street for the physical buildout", "by": "Brad Flora", "summary": "Lenders, leasing, securitization, and hedges for robots, GPUs, and data centers.", "tags": ["fintech", "lending", "leasing", "finance", "equipment", "robots", "insurance", "credit", "underwriting"], "url": "https://www.ycombinator.com/rfs"}, {"src": "Y Combinator RFS, Winter 2027", "title": "Vertical foundation models", "by": "Diana Hu", "summary": "Specialized models for manufacturing, energy, and biology that beat general models at far less compute.", "tags": ["ai", "model", "manufacturing", "energy", "biology", "forecasting", "data", "industrial"], "url": "https://www.ycombinator.com/rfs"}, {"src": "Y Combinator RFS, Winter 2027", "title": "AI for City Hall", "by": "Gustaf Alströmer", "summary": "Permits first, then 311, public records, licensing, and inspections across 19,000 US cities.", "tags": ["government", "city", "permits", "construction", "zoning", "inspections", "public sector", "licensing", "housing"], "url": "https://www.ycombinator.com/rfs"}, {"src": "Y Combinator RFS, Winter 2027", "title": "Data center supply chain", "by": "Jared Friedman", "summary": "Transformers, switchgear, cooling, electrical steel, and other buildout bottlenecks.", "tags": ["data center", "energy", "power", "electrical", "supply chain", "construction", "manufacturing", "cooling", "utilities"], "url": "https://www.ycombinator.com/rfs"}, {"src": "Y Combinator RFS, Winter 2027", "title": "AI for the air-gapped economy", "by": "Brad Flora", "summary": "On-prem AI for defense, banks, hospitals, and nuclear plants.", "tags": ["security", "defense", "banking", "healthcare", "hospital", "on-prem", "compliance", "enterprise", "regulated"], "url": "https://www.ycombinator.com/rfs"}, {"src": "Y Combinator RFS, Winter 2027", "title": "Own your intelligence", "by": "Jon Xu", "summary": "Help companies own and improve specialized models on their own data, especially in regulated industries.", "tags": ["ai", "model", "enterprise", "data", "regulated", "evals", "training"], "url": "https://www.ycombinator.com/rfs"}, {"src": "a16z Big Ideas 2026", "title": "Startups tame the chaos of multimodal data", "by": "Jennifer Li", "summary": "Clean, structure, and govern PDFs, emails, video, and logs so AI workflows work: contracts, claims, onboarding, compliance, procurement.", "tags": ["data", "documents", "enterprise", "claims", "contracts", "compliance", "onboarding", "procurement", "ai"], "url": "https://a16z.com/newsletter/big-ideas-2026-part-1"}, {"src": "a16z Big Ideas 2026", "title": "AI revives cybersecurity hiring", "by": "Joel de la Garza", "summary": "Automate repetitive security work to close the talent gap.", "tags": ["security", "cybersecurity", "workforce", "hiring", "enterprise"], "url": "https://a16z.com/newsletter/big-ideas-2026-part-1"}, {"src": "a16z Big Ideas 2026", "title": "Physical AI and the industrial stack", "by": "a16z American Dynamism", "summary": "AI in factories, construction sites, supply chains, and critical infrastructure; data, not compute, decides who wins.", "tags": ["manufacturing", "factory", "construction", "logistics", "supply chain", "energy", "industrial", "robotics", "infrastructure", "hardware"], "url": "https://a16z.com/podcast/big-ideas-2026-physical-ai-and-the-industrial-stack"}, {"src": "a16z Big Ideas 2026", "title": "The enterprise orchestration layer", "by": "a16z Apps / Fintech", "summary": "Coordinated multi-agent systems that plan and execute work across teams and tools.", "tags": ["enterprise", "agents", "workflow", "saas", "operations", "automation", "ai"], "url": "https://a16z.com/podcast/big-ideas-2026-the-enterprise-orchestration-layer/"}, {"src": "a16z Big Ideas 2026", "title": "Voice agents in high-stakes work", "by": "a16z", "summary": "Voice agents replacing phone workflows in regulated settings where accuracy matters.", "tags": ["voice", "phone", "call center", "healthcare", "insurance", "finance", "customer service", "regulated", "agents"], "url": "https://a16z.com/podcast/big-ideas-2026-voice-agents-and-high-stakes-trust/"}, {"src": "a16z speedrun (2026)", "title": "Come for the agent, stay for the network", "by": "Troy Kirwin", "summary": "AI procurement agents that become marketplaces: freight, ag inputs, field services, food service, construction subcontracting.", "tags": ["procurement", "marketplace", "agriculture", "farm", "freight", "logistics", "field services", "construction", "hvac", "food service", "trades"], "url": "https://www.vccafe.com/2026/04/28/requests-for-startups-summer-2026-edition"}, {"src": "a16z speedrun (2026)", "title": "Consumer AI renaissance", "by": "a16z speedrun", "summary": "AI-native education, multiplayer AI, hyper-personalized experiences, creation tools, and world models.", "tags": ["consumer", "education", "learning", "games", "creator", "personalization", "social", "entertainment"], "url": "https://www.vccafe.com/2026/02/03/requests-for-startups-2026-edition"}, {"src": "NFX (2026)", "title": "Women's health", "by": "Anastasia Budinskaya", "summary": "Category-defining women's health companies with rigorous science and scalable models; not another cycle tracker.", "tags": ["womens health", "women", "healthcare", "femtech", "maternal", "menopause", "fertility", "diagnostics", "insurtech"], "url": "https://www.linkedin.com/posts/abudinskaya_nfx-fast-pre-seed-and-seed-funding-activity-7432508441480347648-xO8l"}, {"src": "Pathlight Ventures RFS 2026", "title": "B2B for SMBs, government, and healthcare", "by": "Pathlight Ventures", "summary": "AI-native systems integrators, voice AI, and state and local government modernization for SMB and mid-market.", "tags": ["smb", "small business", "government", "healthcare", "services", "voice", "integration", "b2b"], "url": "https://questd.ai/landscape/pathlight-2026"}, {"src": "CRV Security RFS (2026)", "title": "Agent and software supply-chain security", "by": "James Green", "summary": "MCP and agent security as agents get real credentials; attestation for internal software.", "tags": ["security", "agents", "developer tools", "software", "identity", "compliance"], "url": "https://www.linkedin.com/posts/crvvc_activity-7432889096840036352-L4qW"}, {"src": "Primary Ventures (Nov 2026)", "title": "Call for compute startups", "by": "Primary Ventures", "summary": "Make AI compute more capable and efficient: chips, power, fabs.", "tags": ["compute", "chips", "semiconductor", "energy", "power", "data center", "hardware"], "url": "https://www.primary.vc/articles/primarys-call-for-compute-startups"}, {"src": "Bison Ventures (Oct 2026)", "title": "Real World Intelligence", "by": "Bison Ventures", "summary": "Where AI meets the physical economy: how we build, move, and heal, plus energy and compute.", "tags": ["physical", "manufacturing", "logistics", "transportation", "healthcare", "energy", "construction", "industrial", "robotics"], "url": "https://www.bison.vc/thesis"}, {"src": "Boost VC (2026)", "title": "Longevity and bio", "by": "Adam Draper", "summary": "AI-decoded biology, at-home health, and cheaper bio methods.", "tags": ["bio", "biotech", "longevity", "health", "diagnostics", "wellness"], "url": "https://www.adamdraper.vc/p/request-for-startups-longevitybio"}]};
  try { var el = $("theses"), raw = el && el.textContent.trim(); var tj = raw ? JSON.parse(raw) : TJ; if (!(tj.theses || []).length) tj = TJ; THESES = tj.theses || []; if (tj.checked && $("checked")) $("checked").textContent = tj.checked; } catch (x) { THESES = TJ.theses || []; }

  var YN = [["yes", "Yes", 1], ["wip", "In progress", 0.5], ["no", "No", 0]];
  var STATUS = [["hyp", "Hypothesis", 0.3], ["int", "Tested in interviews", 0.7], ["money", "Validated with money", 1]];
  var viralLevel = function () {
    var y = function (id) { return v(id) === "yes"; };
    if (!(y("v_team") && y("v_build") && y("v_agree"))) return 0;
    return (y("v_prob") && y("v_seg") && y("v_proto")) ? 2 : 1;
  };
  var VIRALTXT = ["Level 0 · Founding team not yet established", "Level 1 · Founding team established", "Level 2 · Vision set: problem, segments, low-fi prototype"];
  // Who's tried this: company rows live in s.comp (saved with the answers). Older saves only have the free-text s.a.past.
  var CT = [["direct", "Direct competitor", "Direct competitor"], ["approach", "Different approach to the same problem", "Different approach"], ["stopped", "Tried and stopped", "Tried and stopped"], ["workaround", "Workaround people use today (spreadsheets, an agency, doing nothing)", "Workaround"]];
  var CS = [["funded", "Active and funded"], ["active", "Active, bootstrapped or unknown"], ["acquired", "Acquired"], ["shutdown", "Shut down"], ["unknown", "Unknown"]];
  var CORDER = { direct: 0, approach: 1, stopped: 2, workaround: 3 };
  var CMAX = 8;
  var lab = function (L, k, j) { for (var x = 0; x < L.length; x++) if (L[x][0] === k) return L[x][j || 1]; return ""; };
  var blank = function () { return { name: "", type: "", what: "", status: "", url: "", short: "" }; };
  var row = function (r) { r = r || {}; var o = blank(); Object.keys(o).forEach(function (k) { o[k] = String(r[k] == null ? "" : r[k]); }); if (!lab(CT, o.type)) o.type = ""; if (!lab(CS, o.status)) o.status = ""; return o; };
  if (Array.isArray(s.comp)) s.comp = s.comp.filter(function (r) { return r && typeof r === "object"; }).slice(0, CMAX).map(row);
  var rows = function () { if (!Array.isArray(s.comp)) s.comp = [blank(), blank(), blank()]; return s.comp; };
  var filled = function () { return rows().filter(function (r) { return String(r.name || "").trim() || String(r.what || "").trim(); }); };
  var pastLines = function () { return v("past").split(/\n|;/).filter(function (l) { return l.trim().length > 3; }).length; };
  var attempts = function () { return filled().length + pastLines(); };
  var href = function (u) { u = String(u || "").trim(); if (!u) return ""; if (/^https?:\/\/\S+$/i.test(u)) return u; return /^[\w-]+(\.[\w-]+)+(\/\S*)?$/.test(u) ? "https://" + u : ""; };
  var WEAKWIN = /\b(first[- ]mover|first to market|(be|being|are|were) (the )?first|better|nicer|easier|simpler|cheaper|price|pricing|ux|user experience|design|ui|interface|passion(ate)?)\b/i;
  var STRONGWIN = /\b(access|data|dataset|expert|expertise|insider|years|channel|distribution|partner(ship)?s?|relationships?|contracts?|network|patents?|licen[cs]e[sd]?|regulat\w*|certif\w*|integrations?|proprietary|pilots?|signed|lois?|exclusive|community|audience)\b/i;
  var weakWin = function () { var x = v("whywin"); return x.length < 30 || (WEAKWIN.test(x) && !STRONGWIN.test(x)); };

  // The idea and seven named frameworks; the Techstars step (TECH) sits later in the order. t: t=textarea, i=input, n=number, s=select (o: [value, label, credit])
  var F = [
    { name: "Your idea", fw: "Start here", sub: "Name it and say it in one sentence.", w: 0, qs: [
      { id: "name", l: "Name", t: "i", min: 2 },
      { id: "one", l: "One-line pitch", t: "t", h: "What it does, for whom, and the result.", min: 40 },
      { id: "kw", l: "Keywords", t: "i", h: "Industry and problem words, used to match investor theses and search links.", min: 8 }] },
    { name: "YC idea evaluation", fw: "Y Combinator Startup School: How to evaluate startup ideas", sub: "The questions YC partners ask first: why you, how big, how urgent, why now.", w: 0.15, qs: [
      { id: "problem", l: "Who has what problem? Describe the last time it happened.", t: "t", h: "Mom Test rule: facts about past behavior, not opinions about the future.", min: 60 },
      { id: "fmf", l: "Founder-market fit: your connection to the problem", t: "s", o: [["inside", "I've done this job or been this customer for years", 1], ["adjacent", "I've done related work or sold to these customers", 0.8], ["studied", "I've studied it closely", 0.6], ["noticed", "I just noticed it", 0.2]] },
      { id: "yrs", l: "Years in this industry", t: "n" },
      { id: "size", l: "Market size", t: "s", o: [["big", "Big now", 1], ["growing", "Small now, growing fast", 0.9], ["small", "Small and steady", 0.3]] },
      { id: "acute", l: "How acute is the problem?", t: "s", o: [["fire", "Hair on fire: they'd pay today", 1], ["nice", "Nice to have", 0.3], ["unclear", "Unclear", 0.1]] },
      { id: "comp", l: "Competition", t: "s", after: "List them in Who's tried this.", o: [["insight", "Competitors exist, and I have a fresh insight", 1], ["none", "No competitors I know of", 0.4], ["crowded", "Crowded, no clear new insight", 0.2]] },
      { id: "want", l: "Would you, or people you know, want this?", t: "s", o: [["yes", "Yes, personally", 1], ["maybe", "People I know would", 0.6], ["no", "Not really", 0.2]] },
      { id: "whynow", l: "Why now? What changed recently?", t: "t", h: "A new technology, rule, cost curve or behavior.", min: 40 },
      { id: "proxy", l: "Proxy: a similar company that works elsewhere", t: "i", min: 3 }] },
    { name: "Thiel's 7 questions", fw: "Peter Thiel, Zero to One", sub: "Engineering, timing, monopoly, people, distribution, durability, secret.", w: 0.1, qs: [
      { id: "eng", l: "Engineering: is it 10x better, not incremental?", t: "s", o: [["10x", "10x better on something that matters", 1], ["better", "Noticeably better", 0.5], ["same", "About the same, cheaper or nicer", 0.1]] },
      { id: "timing", l: "Timing", t: "s", o: [["now", "Right moment", 1], ["early", "Possibly early", 0.5], ["late", "Possibly late", 0.3]] },
      { id: "mono", l: "Monopoly: will you start with a big share of a small market?", t: "s", o: [["small", "Yes, a narrow market I can own", 1], ["bigshare", "Small share of a big market", 0.3], ["unclear", "Unclear", 0.1]] },
      { id: "people", l: "People: does the team cover building and selling?", t: "s", o: [["both", "Yes, both", 1], ["one", "One of the two", 0.5], ["solo", "Solo, with gaps", 0.2]] },
      { id: "first10", l: "Distribution: how do you reach the first 10 customers?", t: "t", h: "Names or places, not tactics.", min: 30 },
      { id: "dur", l: "Durability: what gets stronger as you grow?", t: "s", o: [["moat", "Proprietary data, network effects or switching costs", 1], ["speed", "Brand or speed only", 0.4], ["none", "Nothing yet", 0.1]] },
      { id: "secret", l: "Secret: what important truth do few people agree with you on?", t: "t", min: 30 }] },
    { name: "Beachhead & TAM", fw: "Bill Aulet, Disciplined Entrepreneurship (MIT)", sub: "Pick one narrow first market you can win, then size it bottom-up.", w: 0.15, qs: [
      { id: "segs", l: "Market segments you considered", t: "t", h: "List three or more.", min: 40 },
      { id: "beach", l: "Beachhead: the one market you'll win first", t: "t", h: "Customers with money, reachable, a compelling reason to buy, and a market you can dominate.", min: 30 },
      { id: "persona", l: "End-user profile", t: "t", h: "One real person: role, day, what they're measured on.", min: 40 },
      { id: "cust", l: "Customers in the beachhead", t: "n" },
      { id: "price", l: "Revenue per customer per year ($)", t: "n" },
      { id: "follow", l: "Follow-on markets after the beachhead", t: "t", min: 20 }] },
    { name: "Business Model Canvas", fw: "Alexander Osterwalder; used in NSF I-Corps", sub: "Nine boxes. I-Corps teams test each one with 100+ customer interviews.", w: 0.1, qs: [
      { id: "b_seg", l: "Customer segments", t: "t", min: 20 },
      { id: "s_seg", l: "Customer segments: status", t: "s", o: STATUS },
      { id: "b_vp", l: "Value proposition", t: "t", min: 20 },
      { id: "s_vp", l: "Value proposition: status", t: "s", o: STATUS },
      { id: "b_ch", l: "Channels", t: "t", min: 15 },
      { id: "b_rel", l: "Customer relationships", t: "t", min: 15 },
      { id: "b_rev", l: "Revenue streams", t: "t", min: 15 },
      { id: "s_rev", l: "Revenue streams: status", t: "s", o: STATUS },
      { id: "b_res", l: "Key resources", t: "t", min: 15 },
      { id: "b_act", l: "Key activities", t: "t", min: 15 },
      { id: "b_part", l: "Key partners", t: "t", min: 15 },
      { id: "b_cost", l: "Cost structure", t: "t", min: 15 }] },
    { name: "Lean Canvas", fw: "Ash Maurya, Running Lean", sub: "The startup version of the canvas: problem first, plus what makes you hard to copy.", w: 0.1, qs: [
      { id: "l_prob", l: "Top 3 problems", t: "t", h: "One per line, most painful first.", min: 15 },
      { id: "l_alt", l: "Existing alternatives (how they solve it today)", t: "t", min: 15 },
      { id: "l_early", l: "Early adopters", t: "t", min: 15 },
      { id: "l_sol", l: "Solution: top 3 features", t: "t", min: 15 },
      { id: "l_uvp", l: "Unique value proposition, one sentence", t: "t", min: 15 },
      { id: "l_unfair", l: "Unfair advantage (can't be easily copied or bought)", t: "t", min: 15 },
      { id: "l_metrics", l: "Key metrics you'll track", t: "t", min: 15 }] },
    { name: "Who's tried this", fw: "Competition and the idea maze (Balaji Srinivasan)", sub: "Find who's solving this today, who tried and stopped, and why you'll win.", w: 0.1, qs: [
      { id: "diff", l: "What's different now?", t: "t", h: "Why your path through the maze works where theirs didn't.", min: 30 },
      { id: "trap", l: "The biggest trap you'll avoid", t: "t", min: 20 },
      { id: "whywin", l: "Why you'll win against the strongest one", t: "t", h: "Name the strongest company on your list, then what you can do that they can't copy in a year.", min: 30 }] },
    { name: "VIRAL Levels 1-2", fw: "Village Capital, Venture Investment Readiness and Awareness Levels", sub: "Level 1: a founding team. Level 2: a clear vision with a low-fi prototype.", w: 0.1, qs: [
      { id: "v_team", l: "L1: Two or more founders with different skills", t: "s", o: YN },
      { id: "v_build", l: "L1: Someone on the team can build the product", t: "s", o: YN },
      { id: "v_agree", l: "L1: Founder agreement on roles and equity", t: "s", o: YN },
      { id: "v_prob", l: "L2: A large, solvable problem is stated", t: "s", o: YN },
      { id: "v_seg", l: "L2: Initial market segmentation done", t: "s", o: YN },
      { id: "v_proto", l: "L2: Low-fi prototype or mockup that shows the solution", t: "s", o: YN }] }
  ];
  var TECH = { name: "Techstars team lens", fw: "Techstars: team, team, team, then market, progress, idea", sub: "Techstars ranks team first and looks for obsession, founder-market fit, a builder plus a seller, resilience and coachability.", w: 0.1, qs: [
      { id: "t_plain", l: "One plain sentence: what you do and who it's for", t: "t", min: 20 },
      { id: "t_obs", l: "Obsession: how deep have you gone into this problem?", t: "t", min: 20 },
      { id: "t_team", l: "Builder and seller covered?", t: "s", o: [["Both covered", "Both covered", 1], ["Builder only", "Builder only", 0.6], ["Seller only", "Seller only", 0.6], ["Solo, doing both", "Solo, doing both", 0.4]] },
      { id: "t_attract", l: "Who have you attracted so far (cofounder, advisors, early hires, partners)?", t: "t", min: 15 },
      { id: "t_res", l: "A time you kept going when it got hard", t: "t", min: 20 },
      { id: "t_coach", l: "Feedback you got and what you changed because of it", t: "t", min: 20 }] };
  var INV = { name: "Investors", fw: "Investor theses", sub: "Who is already asking for this." };
  var VAL = { name: "Validate", fw: "Validate online", sub: "Search for proof, then log what you find." };
  var SCO = { name: "Scorecard", fw: "Your scorecard", sub: "The score, the gaps, and what to do next." };
  var WHY = { name: "Why you", fw: "Founder fit and pitch", sub: "Fit is earned, not credentialed. Turn your experience, access and learning into a story investors remember." };
  // Step order. Every step number below is derived from this order.
  var ALL = F.concat([INV, VAL, TECH, SCO, WHY]);
  var at = function (nm) { for (var k = 0; k < ALL.length; k++) if (ALL[k].name === nm) return k; return -1; };
  var S_YC = at("YC idea evaluation"), S_THIEL = at("Thiel's 7 questions"), S_BEACH = at("Beachhead & TAM"), S_BMC = at("Business Model Canvas");
  var S_LEAN = at("Lean Canvas"), S_MAZE = at("Who's tried this"), S_VIRAL = at("VIRAL Levels 1-2"), S_TECH = ALL.indexOf(TECH);
  var S_INV = ALL.indexOf(INV), S_VAL = ALL.indexOf(VAL), S_SC = ALL.indexOf(SCO), S_WHY = ALL.indexOf(WHY), LAST = ALL.length - 1;
  // Scored framework steps (every step with questions, after step 0), in step order.
  var FW = ALL.map(function (f, i) { return i && f.qs ? i : -1; }).filter(function (i) { return i > 0; });
  var isForm = function (i) { return !!(ALL[i] && ALL[i].qs); };
  var WQ = [
    { id: "w_story", l: "The moment you saw this problem", t: "t", h: "Where you were, what happened, what it cost someone. One or two sentences." },
    { id: "w_skills", l: "Related work that carries over", t: "t", h: "Count adjacent experience: a job next to this one, selling to these buyers, running the process, researching it, living it as a customer or caregiver." },
    { id: "w_insight", l: "What you know that most people don't", t: "t", h: "Leave blank to use your Thiel secret from step " + S_THIEL + "." },
    { id: "w_access", l: "Who you can reach", t: "t", h: "Customers, insiders and advisors you can get on the phone this month." },
    { id: "w_ins", l: "An insider (5+ years in the job) on your team or advising", t: "s", o: [["yes", "Yes", 1], ["working", "Talking to one", 0.5], ["no", "Not yet", 0]] },
    { id: "w_convo", l: "Customer conversations so far", t: "n" },
    { id: "w_learn", l: "What those conversations taught you or changed your mind on", t: "t" },
    { id: "w_ask", l: "What you're asking for", t: "i", h: "A pilot, an intro, a check size. Example: 10 pilot clinics, or a $250K pre-seed." }
  ];

  // Gap rules: st = step, sev = high | med | low
  var T = function () { return n("cust") * n("price"); };
  var G = [
    { id: "vague", st: S_YC, sev: "high", t: function () { return v("problem").length < 60; }, m: "The problem is vague.", q: "Describe the last time a specific person hit this problem. What happened, and what did it cost them?" },
    { id: "fmf", st: S_YC, sev: "high", t: function () { return v("fmf") !== "inside" && n("yrs") < 3 && n("w_convo") < 20 && v("s_rev") !== "money"; }, m: "Your why-you story isn't written yet.", q: "What gives you an edge here: related work, a direct line to customers, or what you learned from 20+ conversations? Step " + S_WHY + " helps you write it." },
    { id: "acute", st: S_YC, sev: "high", t: function () { return v("acute") === "unclear" || v("acute") === ""; }, m: "Not clear the problem is urgent.", q: "What do people do today when this happens, and what does it cost them?" },
    { id: "nice", st: S_YC, sev: "med", t: function () { return v("acute") === "nice"; }, m: "Nice-to-have problems are hard to sell.", q: "Who has this problem worst, badly enough to pay this month?" },
    { id: "nocomp", st: S_YC, sev: "med", t: function () { return v("comp") === "none" && !filled().length; }, m: "No competition: find out why.", q: "Who tried this before, and why isn't it solved yet?" },
    { id: "compnone", st: S_YC, sev: "low", t: function () { return v("comp") === "none" && filled().length > 0; }, m: "Your Competition answer conflicts with your list.", q: "You chose “No competitors I know of” but listed companies in Who's tried this. Change the answer, or say why those companies don't count." },
    { id: "crowded", st: S_YC, sev: "high", t: function () { return v("comp") === "crowded"; }, m: "Crowded market with no new insight.", q: "What do you know about this customer that the incumbents don't?" },
    { id: "whynow", st: S_YC, sev: "high", t: function () { return v("whynow").length < 30; }, m: "No why-now.", q: "What changed in the last two years that makes this possible or urgent?" },
    { id: "small", st: S_YC, sev: "med", t: function () { return v("size") === "small"; }, m: "Could be a great small business rather than a venture one.", q: "What would make this market grow 10x? If nothing, Night Shift routes you to small-business resources." },
    { id: "proxy", st: S_YC, sev: "low", t: function () { return v("proxy").length < 3; }, m: "No proxy company named.", q: "Name a company that does something similar in another market or country." },
    { id: "eng", st: S_THIEL, sev: "med", t: function () { return v("eng") === "better" || v("eng") === "same"; }, m: "Not 10x better yet.", q: "On what one measure could you be 10x better: speed, cost, accuracy, or something new?" },
    { id: "mono", st: S_THIEL, sev: "med", t: function () { return v("mono") === "bigshare" || v("mono") === "unclear"; }, m: "No small market to own first.", q: "Which narrow group could you serve so well you'd own most of it?" },
    { id: "solo", st: S_THIEL, sev: "high", t: function () { return v("people") === "solo" || v("people") === "one"; }, m: "The team doesn't cover building and selling.", q: "Who would you add, and where will you find them (YC co-founder matching, Night Shift Build Nights)?" },
    { id: "first10", st: S_THIEL, sev: "high", t: function () { return v("first10").length < 20; }, m: "No plan for the first 10 customers.", q: "Name the first ten customers, or the exact place you'll find them." },
    { id: "dur", st: S_THIEL, sev: "med", t: function () { return v("dur") === "none" || v("dur") === "speed"; }, m: "Nothing compounds as you grow.", q: "What could get stronger with every customer: data, network, or switching costs?" },
    { id: "aidata", st: S_THIEL, sev: "low", t: function () { return /\b(ai|llm|model|agent)\b/i.test(v("one")) && v("dur") !== "moat"; }, m: "AI idea without a data advantage.", q: "What data will you have that a bigger company can't easily get?" },
    { id: "secret", st: S_THIEL, sev: "low", t: function () { return v("secret").length < 20; }, m: "No secret named.", q: "What have you seen up close that outsiders get wrong about this market?" },
    { id: "segs", st: S_BEACH, sev: "med", t: function () { return v("segs").length < 30; }, m: "Only one market considered.", q: "List three segments that could use this and why you'd rank them." },
    { id: "nobeach", st: S_BEACH, sev: "high", t: function () { return v("beach").length < 20; }, m: "No beachhead chosen.", q: "Which one narrow market will you win first, and why them?" },
    { id: "notam", st: S_BEACH, sev: "high", t: function () { return !T(); }, m: "The beachhead is not sized.", q: "How many customers are in your beachhead, and what would each pay a year? Say where the numbers come from." },
    { id: "tiny", st: S_BEACH, sev: "high", t: function () { return T() > 0 && T() < 5e6; }, m: "Beachhead under $5M: too small to attract venture.", q: "Which adjacent customers could you add without changing the product?" },
    { id: "under", st: S_BEACH, sev: "low", t: function () { return T() >= 5e6 && T() < 2e7; }, m: "Below the $20M-$100M beachhead sweet spot.", q: "Can you widen the beachhead slightly, or raise price with more value?" },
    { id: "broad", st: S_BEACH, sev: "med", t: function () { return T() > 1e9; }, m: "Over $1B: the beachhead is too broad.", q: "Narrow it: which sub-segment shares the same need and talks to each other?" },
    { id: "follow", st: S_BEACH, sev: "med", t: function () { return v("follow") === ""; }, m: "No follow-on market.", q: "Name the second market you'd enter and why your beachhead wins it for you." },
    { id: "persona", st: S_BEACH, sev: "low", t: function () { return v("persona").length < 30; }, m: "No end-user profile.", q: "Describe one real person who would use this daily." },
    { id: "rev", st: S_BMC, sev: "high", t: function () { return v("b_rev").length < 10; }, m: "No revenue stream.", q: "How exactly does money come in, from whom, and when?" },
    { id: "hyp", st: S_BMC, sev: "med", t: function () { return ["s_seg", "s_vp", "s_rev"].every(function (k) { return v(k) === "" || v(k) === "hyp"; }); }, m: "The canvas is all hypotheses.", q: "Test your riskiest box first, usually customer segment or revenue. Who will you interview this week?" },
    { id: "ch", st: S_BMC, sev: "med", t: function () { return v("b_ch").length < 10; }, m: "No channel on the canvas.", q: "Pick the one channel you'll test first and how you'll measure it." },
    { id: "unfair", st: S_LEAN, sev: "high", t: function () { var x = v("l_unfair"); return x.length < 15 || /\b(first[- ]mover|first to market|better (ux|user experience|design|ui)|passion(ate)?)\b/i.test(x); }, m: "No unfair advantage yet.", q: "What do you have that a funded competitor can't buy in a year: access, data, expertise, a channel?" },
    { id: "metrics", st: S_LEAN, sev: "med", t: function () { return v("l_metrics") === ""; }, m: "No key metric.", q: "Pick the one number that shows customers get value." },
    { id: "comp0", st: S_MAZE, sev: "med", t: function () { return attempts() === 0; }, m: "No competitors listed.", q: "Every problem has a workaround. Who or what do customers use today?" },
    { id: "compwork", st: S_MAZE, sev: "low", t: function () { var f = filled(); return f.length > 0 && f.every(function (r) { return r.type === "workaround"; }); }, m: "Only workarounds listed.", q: "Search the funded and tried-and-stopped lists. If nobody's tried, find out why." },
    { id: "compfail", st: S_MAZE, sev: "low", t: function () { var f = filled(); return f.length >= 3 && !f.some(function (r) { return r.type === "stopped" || r.status === "shutdown"; }); }, m: "No failed attempts studied.", q: "Who tried this and stopped, and what killed it?" },
    { id: "whywin", st: S_MAZE, sev: "high", t: weakWin, m: "No clear edge over the strongest competitor.", q: "What can you do that they can't copy in a year: access, data, expertise, a channel?" },
    { id: "diff", st: S_MAZE, sev: "med", t: function () { return v("diff").length < 20; }, m: "Not clear what's different now.", q: "Why will your path through the maze work where theirs didn't?" },
    { id: "nobuild", st: S_VIRAL, sev: "high", t: function () { return v("v_build") !== "yes"; }, m: "No one on the team can build the product.", q: "Who could be your technical cofounder? Try YC co-founder matching or Night Shift Build Nights." },
    { id: "team", st: S_VIRAL, sev: "med", t: function () { return v("v_team") !== "yes"; }, m: "Not yet a founding team.", q: "What skill is missing, and who in your network has it?" },
    { id: "proto", st: S_VIRAL, sev: "med", t: function () { return v("v_proto") !== "yes"; }, m: "No low-fi prototype.", q: "What's the simplest mockup that shows the solution? A clickable Figma is enough for Level 2." },
    { id: "agree", st: S_VIRAL, sev: "low", t: function () { return v("v_team") === "yes" && v("v_agree") !== "yes"; }, m: "No founder agreement.", q: "When will you put roles, equity and vesting in writing?" },
    { id: "t_team", st: S_TECH, sev: "high", t: function () { return v("t_team") !== "Both covered" && v("t_attract") === ""; }, m: "Missing a builder or a seller.", q: "Name who'll build or sell with you, even an advisor, before you apply." },
    { id: "t_plain", st: S_TECH, sev: "med", t: function () { return v("t_plain") === "" || /ai-powered|platform|revolutionize|leverage|disrupt/i.test(v("t_plain")); }, m: "Pitch sentence is vague.", q: "Say what it does and who it's for, no buzzwords." },
    { id: "t_coach", st: S_TECH, sev: "med", t: function () { return v("t_coach") === ""; }, m: "No coachability evidence.", q: "Share one piece of feedback and what you changed." }
  ];
  var PEN = { high: 10, med: 6, low: 2 };
  var SEV = { high: "High", med: "Medium", low: "Low" };
  var touched = function (i) { return ALL[i].qs.some(function (q) { return v(q.id) !== ""; }) || (i === S_MAZE && attempts() > 0); };
  // Listed companies count as two questions' worth on the Who's tried this step; three or more give full credit.
  var compCredit = function () { return Math.min(1, attempts() / 3); };
  var resolved = function (g) { return String(s.fu[g.id] || "").trim().length >= 20; };
  var gaps = function (st) { return G.filter(function (g) { return (st == null || g.st === st) && touched(g.st) && g.t(); }); };
  var open = function (st) { return gaps(st).filter(function (g) { return !resolved(g); }); };
  var credit = function (q) {
    var x = v(q.id); if (!x) return 0;
    if (q.t === "n") return n(q.id) > 0 ? 1 : 0;
    if (q.t === "s") { var o = q.o.filter(function (p) { return p[0] === x; })[0]; return o && o.length > 2 ? o[2] : 1; }
    return x.length >= (q.min || 20) ? 1 : 0.5;
  };
  var stepScore = function (i) {
    var qs = ALL[i].qs, x = i === S_MAZE ? 2 : 0, b = (qs.reduce(function (a, q) { return a + credit(q); }, 0) + (x ? x * compCredit() : 0)) / (qs.length + x) * 100;
    var r = b - open(i).reduce(function (a, g) { return a + PEN[g.sev]; }, 0) + gaps(i).filter(resolved).length * 3;
    return Math.max(0, Math.min(100, Math.round(r)));
  };
  var evScore = function () {
    var sup = s.ev.filter(function (x) { return x.k === "s"; }).length, con = s.ev.length - sup;
    if (!s.ev.length) return 0;
    return Math.round(100 * (sup / (sup + con)) * Math.min(1, s.ev.length / 5));
  };
  var overall = function () {
    var t = FW.reduce(function (a, i) { return a + ALL[i].w * stepScore(i); }, 0) + 0.1 * evScore();
    return Math.round(t);
  };
  var answered = function () {
    var a = [];
    FW.forEach(function (i) { ALL[i].qs.forEach(function (q) { if (v(q.id) !== "") a.push(credit(q)); }); });
    if (attempts()) a.push(compCredit());
    return a.length ? Math.round(100 * a.reduce(function (x, y) { return x + y; }, 0) / a.length) : 0;
  };
  var coverage = function () {
    var tot = 0, got = 0;
    FW.forEach(function (i) { ALL[i].qs.forEach(function (q) { tot++; if (v(q.id) !== "") got++; }); });
    tot++; if (attempts()) got++;
    return Math.round(100 * got / tot);
  };
  var tam = function () { return n("cust") * n("price"); };
  var money = function (x) { return !x ? "Not sized" : x >= 1e9 ? "$" + (x / 1e9).toFixed(1).replace(/\.0$/, "") + "B" : x >= 1e6 ? "$" + Math.round(x / 1e6) + "M" : x >= 1e3 ? "$" + Math.round(x / 1e3) + "k" : "$" + x; };
  var verdict = function (o) {
    return o >= 75 ? ["Build it.", "The idea holds up. Go sell it before you build much more."] :
      o >= 55 ? ["Promising, with gaps.", "Close the high-severity gaps below before writing code."] :
      o >= 35 ? ["Shaky.", "The core problem or customer is not proven yet. Talk to ten buyers first."] :
      ["Not yet.", "Too much is unanswered to judge. Finish the steps and come back."];
  };

  // Thesis matching
  var corpus = function () { return " " + Object.keys(s.a).map(function (k) { return s.a[k]; }).concat(Object.keys(s.fu).map(function (k) { return s.fu[k]; })).join(" ").toLowerCase().replace(/[^a-z0-9$ ]+/g, " ") + " "; };
  var STOP = /^(about|their|there|these|those|which|where|while|with|from|that|this|startups?|companies|plus|other|every|more|less|build|work|make|help|across|world)$/;
  var matches = function () {
    var c = corpus();
    return THESES.map(function (t, i) {
      var hit = [], sc = 0;
      t.tags.forEach(function (tag) { if (c.indexOf(" " + tag.toLowerCase() + " ") > -1 || c.indexOf(" " + tag.toLowerCase() + "s ") > -1) { hit.push(tag); sc += tag === "ai" ? 1 : tag.indexOf(" ") > -1 ? 4 : 3; } });
      (t.title + " " + t.summary).toLowerCase().replace(/[^a-z ]+/g, " ").split(/\s+/).forEach(function (w) { if (w.length > 4 && !STOP.test(w) && c.indexOf(" " + w + " ") > -1) sc += 1; });
      return { t: t, i: i, sc: sc, hit: hit };
    }).filter(function (m) { return m.hit.length; }).sort(function (a, b) { return b.sc - a.sc; });
  };

  // Rendering
  var field = function (q) {
    var id = "f-" + q.id, val = e(s.a[q.id] || ""), h = q.h ? "<small>" + e(q.h) + "</small>" : "", inp;
    if (q.t === "t") inp = '<textarea class="x-in" id="' + id + '" data-k="' + q.id + '">' + val + "</textarea>";
    else if (q.t === "s") inp = '<select class="x-in" id="' + id + '" data-k="' + q.id + '"><option value="">Choose…</option>' + q.o.map(function (o) { return '<option value="' + o[0] + '"' + (String(s.a[q.id]) === o[0] ? " selected" : "") + ">" + e(o[1]) + "</option>"; }).join("") + "</select>";
    else inp = '<input class="x-in" id="' + id + '" data-k="' + q.id + '" ' + (q.t === "n" ? 'inputmode="decimal"' : 'type="text"') + ' value="' + val + '" />';
    return '<div class="x-field"><label for="' + id + '">' + e(q.l) + "</label>" + h + inp + (q.after ? "<small>" + e(q.after) + "</small>" : "") + "</div>";
  };
  // Who's tried this: prefilled searches, built in the browser; nothing is fetched.
  var compPhrase = function () {
    if (s.cphrase != null) return s.cphrase;
    var k = v("kw").split(/[,;\n]/).map(function (x) { return x.trim(); }).filter(Boolean).slice(0, 3).join(" ");
    return k || v("one").replace(/[^\w\s'&-]+/g, " ").split(/\s+/).filter(Boolean).slice(0, 6).join(" ");
  };
  var gq = function (q) { return "https://www.google.com/search?q=" + encodeURIComponent(q); };
  var CG = [
    ["Funded companies doing this", "Startups and products already selling to your customer.", [
      ["YC directory", function (p) { return "https://www.ycombinator.com/companies?query=" + encodeURIComponent(p); }],
      ["Crunchbase", function (p) { return gq("site:crunchbase.com/organization " + p); }],
      ["Product Hunt", function (p) { return "https://www.producthunt.com/search?q=" + encodeURIComponent(p); }],
      ["G2", function (p) { return "https://www.g2.com/search?query=" + encodeURIComponent(p); }],
      ["Capterra", function (p) { return gq("site:capterra.com " + p); }],
      ["Google: startups", function (p) { return gq(p + " startup"); }]]],
    ["Who tried and stopped", "Shutdowns, post-mortems and old threads on the same problem.", [
      ["Google: shutdowns", function (p) { return gq(p + ' startup "shut down" OR "post-mortem" OR "lessons learned"'); }],
      ["Failory", function (p) { return gq("site:failory.com " + p); }],
      ["Hacker News", function (p) { return "https://hn.algolia.com/?q=" + encodeURIComponent(p); }],
      ["Reddit", function (p) { return "https://www.reddit.com/search/?q=" + encodeURIComponent(p); }]]],
    ["Research, patents and grants", "Labs and inventors who worked on it, often years before any startup.", [
      ["Google Patents", function (p) { return "https://patents.google.com/?q=" + encodeURIComponent(p); }],
      ["Google Scholar", function (p) { return "https://scholar.google.com/scholar?q=" + encodeURIComponent(p); }],
      ["SBIR/STTR awards", function (p) { return gq("site:sbir.gov " + p); }]]]
  ];
  var compLinks = function (ph) {
    return CG.map(function (g) {
      return '<div class="x-comp-group"><h4>' + e(g[0]) + '</h4><p class="x-hint">' + e(g[1]) + '</p><div class="links">' + g[2].map(function (l) { return '<a class="btn" href="' + e(l[1](ph)) + '" target="_blank" rel="noopener">' + e(l[0]) + "</a>"; }).join("") + "</div></div>";
    }).join("");
  };
  var cfield = function (k, r, f, label, opts, wide) {
    var id = "c-" + k + "-" + f, val = r[f] || "", inp;
    if (opts) inp = '<select class="x-in" id="' + id + '" data-ci="' + k + '" data-cf="' + f + '"><option value="">Choose…</option>' + opts.map(function (o) { return '<option value="' + o[0] + '"' + (val === o[0] ? " selected" : "") + ">" + e(o[1]) + "</option>"; }).join("") + "</select>";
    else inp = '<input class="x-in" id="' + id + '" data-ci="' + k + '" data-cf="' + f + '" type="' + (f === "url" ? "url" : "text") + '"' + (f === "url" ? ' inputmode="url" placeholder="https://"' : "") + ' value="' + e(val) + '" />';
    return '<div class="x-field' + (wide ? " x-wide" : "") + '"><label for="' + id + '">' + e(label) + "</label>" + inp + "</div>";
  };
  var crow = function (r, k) {
    return '<div class="x-crow"><div class="x-crow__head"><h4>Company ' + (k + 1) + '</h4><button type="button" class="btn" data-cdel="' + k + '" aria-label="Remove company ' + (k + 1) + '">Remove</button></div>' +
      cfield(k, r, "name", "Name") + cfield(k, r, "type", "Type", CT) + cfield(k, r, "what", "What they do", null, true) +
      cfield(k, r, "status", "Status", CS) + cfield(k, r, "url", "Link (optional)") + cfield(k, r, "short", "Where they fall short for your customer", null, true) + "</div>";
  };
  var compRowsHTML = function () {
    var R = rows();
    return R.map(crow).join("") + (R.length < CMAX ? '<div class="links"><button type="button" class="btn" id="c-add">Add a company</button></div>' : '<p class="x-hint">That\'s the limit of ' + CMAX + '. Keep the ones that matter most.</p>');
  };
  var compBlock = function () {
    var notes = v("past") && !filled().length ? '<div class="aside x-comp-notes"><h3>Your earlier notes</h3><p class="x-hint">From the old free-text field. Move each company into a row below.</p><p class="x-comp-past">' + e(v("past")) + "</p></div>" : "";
    return '<div class="x-comp">' +
      '<div class="x-comp-part"><h3>Find them</h3><div class="x-field"><label for="cphrase">Search phrase</label><small>Built from your keywords. Edit it; every search opens in a new tab.</small><input class="x-in" id="cphrase" type="text" value="' + e(compPhrase()) + '" /></div><div class="x-comp-groups" id="clinks">' + compLinks(compPhrase()) + "</div></div>" +
      '<div class="x-comp-part"><h3>List them</h3><p class="x-hint">Up to ' + CMAX + ' companies, workarounds included. These print on your scorecard.</p>' + notes + '<div class="x-crows" id="c-rows">' + compRowsHTML() + "</div></div>" +
      "<h3>Your path through</h3></div>";
  };
  // The scorecard's Competitive landscape block.
  var landscape = function () {
    var R = filled().slice().sort(function (a, b) { return (CORDER[a.type] != null ? CORDER[a.type] : 4) - (CORDER[b.type] != null ? CORDER[b.type] : 4); });
    var out = '<div class="x-comp-sc" id="landscape" style="margin-top:28px"><h3 style="font:var(--type-heading);margin-bottom:10px">Competitive landscape</h3>';
    if (!R.length) return out + '<p class="x-hint" style="margin-bottom:12px">No companies listed yet. Step ' + S_MAZE + " has searches to find them.</p>" + '<div class="links x-noprint"><button type="button" class="btn" data-go="' + S_MAZE + '">Open Who\'s tried this</button></div></div>';
    var body = R.map(function (r) {
      var nm = String(r.name).trim() || "Unnamed", u = href(r.url);
      return '<tr><th scope="row">' + (u ? '<a class="link" href="' + e(u) + '" target="_blank" rel="noopener">' + e(nm) + "</a>" : e(nm)) + (String(r.what).trim() ? "<small>" + e(r.what) + "</small>" : "") + '</th><td data-label="Type">' + e(lab(CT, r.type, 2) || "Not set") + '</td><td data-label="Status">' + e(lab(CS, r.status) || "Not set") + '</td><td data-label="Where they fall short"' + (String(r.short).trim() ? ">" + e(r.short) : ' class="muted">Not noted') + "</td></tr>";
    }).join("");
    return out + '<div class="table-wrap"><table><thead><tr><th scope="col">Name</th><th scope="col">Type</th><th scope="col">Status</th><th scope="col">Where they fall short</th></tr></thead><tbody>' + body + "</tbody></table></div>" +
      (v("whywin") ? '<div class="prose" style="margin-top:14px"><p><strong>Why you\'ll win:</strong> ' + e(v("whywin")) + "</p></div>" : '<p class="x-hint" style="margin-top:14px">Why you\'ll win isn\'t written yet. Add it in step ' + S_MAZE + ".</p>") + "</div>";
  };
  var gapHTML = function (st) {
    var gs = gaps(st);
    if (!touched(st)) return '<p class="x-hint">Gaps show up here as you answer.</p>';
    if (!gs.length) return '<p class="x-hint">No gaps in this step.</p>';
    return "<h3>Gaps to close (" + open(st).length + " open)</h3>" + gs.map(function (g) {
      var ok = resolved(g);
      return '<div class="x-gap' + (ok ? " is-ok" : "") + '" id="gap-' + g.id + '"><span class="chip' + (ok ? "" : g.sev === "high" ? " chip--solid" : "") + '">' + (ok ? "Resolved" : SEV[g.sev] + " severity") + "</span><p>" + e(g.m) + "</p><p>" + e(g.q) + '</p><textarea class="x-in" aria-label="Your answer: ' + e(g.q) + '" data-fu="' + g.id + '" placeholder="Answer in a sentence or two to resolve this gap">' + e(s.fu[g.id] || "") + "</textarea></div>";
    }).join("");
  };
  var meter = function (sc, label) { return '<div class="x-meter" id="meter">' + label + " " + sc + "/100<span><i style=\"width:" + sc + '%"></i></span></div>'; };
  var stepper = function () {
    $("stepper").innerHTML = ALL.map(function (f, i) {
      var sc = FW.indexOf(i) > -1 ? " <b>" + (touched(i) ? stepScore(i) : "–") + "</b>" : i === S_VAL ? " <b>" + evScore() + "</b>" : i === S_SC ? " <b>" + overall() + "</b>" : "";
      return '<li><button type="button" data-go="' + i + '"' + (s.step === i ? ' aria-current="step"' : "") + ">" + i + " · " + e(f.name) + sc + "</button></li>";
    }).join("");
  };
  var nav = function (i) {
    return '<div class="x-wiznav">' + (i > 0 ? '<button type="button" class="btn" data-go="' + (i - 1) + '">← ' + e(ALL[i - 1].name) + "</button>" : "<span></span>") + (i < LAST ? '<button type="button" class="btn" data-go="' + (i + 1) + '">' + e(ALL[i + 1].name) + " →</button>" : "") + "</div>";
  };
  var head = function (i, extra) { var f = ALL[i]; return '<div class="head"><p class="head__eyebrow">Step ' + i + " of " + LAST + " · " + e(f.fw) + "</p><h2>" + e(f.name) + '</h2><p class="head__sub">' + e(f.sub) + "</p></div>" + (extra || ""); };

  var views = {
    form: function (i) {
      var top = i === 0 ? "" : meter(touched(i) ? stepScore(i) : 0, "Step score");
      var tamLine = i === S_BEACH ? '<p class="x-hint" id="tam">Bottom-up TAM: ' + money(tam()) + "</p>" : "";
      return head(i, top) + (i === S_MAZE ? compBlock() : "") + '<div class="x-form">' + ALL[i].qs.map(field).join("") + tamLine + "</div>" + (i ? '<div class="x-gaps" id="gaps">' + gapHTML(i) + "</div>" : "");
    },
    inv: function () {
      var m = matches(), top = m.slice(0, 5), ids = {};
      m.forEach(function (x) { ids[x.i] = x; });
      var cards = top.length ? '<div class="cards">' + top.map(function (x) { return "<div><h3>" + e(x.t.title) + '</h3><p class="x-hint">' + e(x.t.src) + " · " + e(x.t.by) + "</p><p>" + e(x.t.summary) + '</p><p class="x-hint">Matched on: ' + e(x.hit.join(", ")) + '</p><p style="margin-top:12px"><a class="link" href="' + e(x.t.url) + '" target="_blank" rel="noopener">Read the thesis</a></p></div>'; }).join("") + "</div>" : '<p class="x-hint">No matches yet. Add industry words to your keywords in step 0.</p>';
      var rows = THESES.map(function (t, i) { return '<tr><th scope="row">' + e(t.title) + "<small>" + e(t.by) + "</small>" + (ids[i] ? '<span class="dot">Match</span>' : "") + '</th><td data-label="Source">' + e(t.src) + '</td><td data-label="Thesis">' + e(t.summary) + '</td><td data-label="Link"><a class="link" href="' + e(t.url) + '" target="_blank" rel="noopener">Open</a></td></tr>'; }).join("");
      return head(S_INV, '<p class="x-hint" style="margin-bottom:20px">' + m.length + " of " + THESES.length + " theses overlap your idea. Top " + top.length + " shown.</p>") + cards +
        '<details style="margin-top:32px"><summary class="btn">Browse all ' + THESES.length + ' theses</summary><div class="table-wrap" style="margin-top:16px"><table><thead><tr><th scope="col">Thesis</th><th scope="col">Source</th><th scope="col">What they want</th><th scope="col">Link</th></tr></thead><tbody>' + rows + "</tbody></table></div></details>";
    },
    val: function () {
      var ph = s.phrase != null ? s.phrase : (v("kw") || v("one").split(/\s+/).slice(0, 5).join(" "));
      var log = s.ev.length ? '<div class="table-wrap"><table><thead><tr><th scope="col">Source</th><th scope="col">Note</th><th scope="col">Says</th><th scope="col"></th></tr></thead><tbody>' + s.ev.map(function (x, i) { return '<tr><th scope="row">' + e(x.src) + '</th><td data-label="Note">' + e(x.note) + '</td><td data-label="Says"><span class="chip' + (x.k === "s" ? " chip--solid" : "") + '">' + (x.k === "s" ? "Supports" : "Contradicts") + '</span></td><td><button type="button" class="btn" data-del="' + i + '">Remove</button></td></tr>'; }).join("") + "</tbody></table></div>" : '<p class="x-hint">No evidence logged yet. Five or more entries give full weight.</p>';
      return head(S_VAL, meter(evScore(), "Evidence score")) +
        '<div class="x-form"><div class="x-field"><label for="phrase">Search phrase</label><small>Edit it, then open each search in a new tab.</small><input class="x-in" id="phrase" type="text" value="' + e(ph) + '" /></div><div class="links" id="slinks">' + links(ph) + "</div></div>" +
        '<div class="x-gaps"><h3>Evidence log</h3><div class="x-ev"><div class="x-field"><label for="ev-src">Source</label><input class="x-in" id="ev-src" type="text" placeholder="r/medicalbilling thread" /></div><div class="x-field"><label for="ev-note">What it says</label><input class="x-in" id="ev-note" type="text" /></div><div class="x-field"><label for="ev-k">Verdict</label><select class="x-in" id="ev-k"><option value="s">Supports</option><option value="c">Contradicts</option></select></div><button type="button" class="btn" id="ev-add">Add</button></div></div><div id="evlog" style="margin-top:20px">' + log + "</div>";
    },
    sc: function () {
      var o = overall(), vd = verdict(o), og = open(), m = matches().slice(0, 5), lv = viralLevel(), adj = adjacent();
      var W = 600, rows = FW.map(function (i) { return [ALL[i].name, stepScore(i)]; }).concat([["Evidence", evScore()]]);
      var svg = '<svg class="x-bars" viewBox="0 0 ' + W + " " + rows.length * 34 + '" width="100%" role="img" aria-label="Scores by framework: ' + e(rows.map(function (r) { return r[0] + " " + r[1]; }).join(", ")) + '">' + rows.map(function (r, k) { var y = k * 34; return '<text x="0" y="' + (y + 20) + '">' + e(r[0]) + '</text><rect class="x-tr" x="190" y="' + (y + 8) + '" width="350" height="16" rx="4"/><rect class="x-b" x="190" y="' + (y + 8) + '" width="' + 3.5 * r[1] + '" height="16" rx="4"/><text class="x-v" x="' + W + '" y="' + (y + 20) + '" text-anchor="end">' + r[1] + "</text>"; }).join("") + "</svg>";
      var gl = og.length ? '<ul class="checklist">' + og.sort(function (a, b) { return PEN[b.sev] - PEN[a.sev]; }).map(function (g) { return '<li><span class="checklist__item">' + e(g.m) + "<small>" + e(ALL[g.st].name) + '</small></span><span class="chip' + (g.sev === "high" ? " chip--solid" : "") + '">' + SEV[g.sev] + "</span></li>"; }).join("") + "</ul>" : '<p class="x-hint">No open gaps.</p>';
      var untouched = FW.filter(function (i) { return !touched(i); }).map(function (i) { return ALL[i].name; });
      var next = og.filter(function (g) { return g.sev !== "low"; }).slice(0, 4).map(function (g) { return g.q; });
      if (untouched.length) next.unshift("Answer the steps you skipped: " + untouched.join(", ") + ".");
      if (s.ev.length < 5) next.push("Log at least " + (5 - s.ev.length) + " more pieces of evidence from the step " + S_VAL + " searches.");
      if (m.length) next.push("Read the " + m[0].t.title + " thesis (" + m[0].t.src + ") and shape your pitch to it.");
      next.push("Book five Mom Test interviews this week and ask about the last time the problem happened.");
      next.push("Go to step " + S_WHY + ", Why you, to draft your founder story and 30-second pitch.");
      return head(S_SC, s.exNote ? '<p class="fineprint" style="margin-bottom:20px">' + e(s.exNote) + (s.exSrc ? ' <a class="link" href="' + e(s.exSrc) + '" target="_blank" rel="noopener">Source</a>' : '') + '</p>' : '') +
        '<section class="stats"><div class="stat"><span class="stat__fig">' + o + '</span><span class="stat__label">Overall score of 100</span></div><div class="stat"><span class="stat__fig">' + answered() + '</span><span class="stat__label">Quality of answers given · ' + coverage() + '% of questions answered</span></div><div class="stat"><span class="stat__fig">' + money(tam()) + '</span><span class="stat__label">Beachhead TAM</span></div><div class="stat"><span class="stat__fig">' + lv + "/2" + '</span><span class="stat__label">VIRAL level</span></div><div class="stat"><span class="stat__fig">' + og.length + '</span><span class="stat__label">Open gaps</span></div></section>' +
        '<div class="pair" style="margin-top:28px"><figure class="chart"><figcaption class="chart__cap">Scores by framework<small>Out of 100; overall weights YC 15%, Thiel 10%, Beachhead &amp; TAM 15%, Business Model Canvas, Lean Canvas, Techstars, Who\'s tried this, VIRAL and Evidence 10% each</small></figcaption>' + svg + "</figure>" +
        '<aside class="callout" aria-label="Verdict"><p class="callout__head">Verdict' + (v("name") ? " · " + e(v("name")) : "") + '</p><p class="callout__lead"><strong>' + vd[0] + "</strong> " + vd[1] + '</p><p class="fineprint">' + e(VIRALTXT[lv]) + ". " + "Evidence score " + evScore() + '/100.</p><div class="links x-noprint"><button type="button" class="btn" id="print">Print</button><button type="button" class="btn" data-go="' + (S_SC + 1) + '">Next: ' + e(ALL[S_SC + 1].name) + '</button><button type="button" class="btn" id="copy">Copy prompt for an AI coach</button></div><textarea class="x-in" id="prompt-out" readonly hidden aria-label="Prompt for an AI coach" style="min-height:160px"></textarea></aside></div>' +
        '<div style="margin-top:28px" id="adjacent"><h3 style="font:var(--type-heading);margin-bottom:6px">Adjacent markets to explore</h3><p class="x-hint" style="margin-bottom:16px">Built from your answers' + (tam() ? ", starting from a " + money(tam()) + " beachhead" : "") + '. Use them as interview questions, not conclusions.</p><div class="cards">' + adj.map(function (x) { return "<div><h3>" + e(x[0]) + "</h3><p>" + e(x[1]) + "</p></div>"; }).join("") + "</div></div>" +
        '<div class="pair" style="margin-top:28px"><div><h3 style="font:var(--type-heading);margin-bottom:10px">Open gaps</h3>' + gl + '</div><div><h3 style="font:var(--type-heading);margin-bottom:10px">Matching investor theses</h3>' + (m.length ? '<ul class="checklist">' + m.map(function (x) { return '<li><span class="checklist__item"><a class="link" href="' + e(x.t.url) + '" target="_blank" rel="noopener">' + e(x.t.title) + "</a><small>" + e(x.t.src) + "</small></span></li>"; }).join("") + "</ul>" : '<p class="x-hint">No matches yet.</p>') + "</div></div>" + landscape() +
        '<div class="prose" style="margin-top:28px"><h3 style="font:var(--type-heading);margin-bottom:10px">Next steps</h3><ol>' + next.map(function (x) { return "<li>" + e(x) + "</li>"; }).join("") + "</ol></div>";
    }
  };
  var links = function (ph) {
    var q = encodeURIComponent(ph), L = [
      ["Reddit", "https://www.reddit.com/search/?q=" + q],
      ["Reddit complaints", "https://www.reddit.com/search/?q=" + encodeURIComponent(ph + ' (frustrated OR hate OR "wish there was")')],
      ["Hacker News", "https://hn.algolia.com/?q=" + q],
      ["Google Trends", "https://trends.google.com/trends/explore?q=" + q],
      ["YC directory", "https://www.ycombinator.com/companies?query=" + q],
      ["Product Hunt", "https://www.producthunt.com/search?q=" + q],
      ["G2", "https://www.g2.com/search?query=" + q],
      ["Google: alternatives", "https://www.google.com/search?q=" + encodeURIComponent(ph + " alternatives")]];
    return L.map(function (l) { return '<a class="btn" href="' + l[1] + '" target="_blank" rel="noopener">' + l[0] + "</a>"; }).join("");
  };
  // Adjacent markets: three prompts built from the founder's own answers, no network.
  var listItems = function (x) { return String(x || "").split(/\n|;|,(?!\d)|\s(?=\d[.)]\s)/).map(function (p) { return p.replace(/^\s*(\d+[.)]|[-•*])\s*/, "").trim(); }).filter(function (p) { return p.length > 2; }); };
  var adjacent = function () {
    var cust = v("beach") || v("l_early") || v("b_seg"), seg = v("b_seg") || v("l_early") || v("beach"), probs = listItems(v("l_prob"));
    var bare = function (x) { return first(x).replace(/[.!?]$/, ""); };
    var out = [];
    if (v("follow")) out.push(["Your plan", sent(v("follow"))]);
    out.push(["Same customer, next problem", (cust ? bare(cust) : "Your first customers") + " also struggle with " + (probs[1] ? "“" + low(probs[1]) + "”" : "other jobs around this one") + ". What's the next job you could do for them?"]);
    out.push(["Same product, new customer", "Who else has " + (probs[0] ? "“" + low(probs[0]) + "”" : "the problem you solve") + " but isn't " + (cust ? low(cust) : "in your beachhead") + "?"]);
    out.push(["Through a channel", "Which partner already sells to " + (seg ? low(seg) : "your customers") + " and could resell this?"]);
    return out;
  };
  var coachPrompt = function () {
    var lines = ["Act as a skeptical but supportive seed investor. Review this idea across the frameworks below. Ask me 5 clarifying questions, rank the three biggest risks, and name the riskiest assumption to test this week and the cheapest way to test it.", ""];
    [0].concat(FW).forEach(function (i) { var f = ALL[i]; lines.push("## " + f.name + (i ? " (score " + stepScore(i) + "/100)" : "")); f.qs.forEach(function (q) { if (v(q.id) && q.id !== "whywin") lines.push(q.l + ": " + v(q.id)); }); });
    var cr = filled().slice().sort(function (a, b) { return (CORDER[a.type] != null ? CORDER[a.type] : 4) - (CORDER[b.type] != null ? CORDER[b.type] : 4); });
    lines.push("", "## Competition");
    if (cr.length) cr.forEach(function (r) {
      var meta = [lab(CT, r.type, 2), lab(CS, r.status)].filter(Boolean).join("; ");
      lines.push("- " + (String(r.name).trim() || "Unnamed") + (meta ? " (" + meta + ")" : "") + (String(r.what).trim() ? ": " + String(r.what).trim() : "") + (String(r.short).trim() ? ". Falls short: " + String(r.short).trim() : "") + (href(r.url) ? " " + href(r.url) : ""));
    });
    else lines.push("No companies listed yet.");
    if (v("past")) lines.push("Earlier notes: " + v("past").replace(/\s*\n\s*/g, "; "));
    lines.push("Why I'll win against the strongest one: " + (v("whywin") || "[not answered]"));
    lines.push("", "Beachhead TAM (customers x revenue each): " + money(tam()) + (tam() ? (tam() < 5e6 ? " · too small for venture" : tam() < 2e7 ? " · below the $20M-$100M sweet spot" : tam() <= 1e8 ? " · in the $20M-$100M sweet spot" : tam() > 1e9 ? " · too broad, narrow it" : " · above the sweet spot") : ""), "Overall score: " + overall() + "/100", "VIRAL: " + VIRALTXT[viralLevel()], "", "Open gaps:");
    open().forEach(function (g) { lines.push("- [" + SEV[g.sev] + "] " + g.m); });
    lines.push("", "Adjacent markets to explore:"); adjacent().forEach(function (x) { lines.push("- " + x[0] + ": " + x[1]); });
    var fu = gaps().filter(resolved); if (fu.length) { lines.push("", "My answers to follow-ups:"); fu.forEach(function (g) { lines.push("- " + g.q + " " + s.fu[g.id]); }); }
    if (s.ev.length) { lines.push("", "Evidence:"); s.ev.forEach(function (x) { lines.push("- " + (x.k === "s" ? "Supports" : "Contradicts") + ", " + x.src + ": " + x.note); }); }
    var wy = WQ.filter(function (q) { return v(q.id); }); if (wy.length) { lines.push("", "## Why me"); wy.forEach(function (q) { lines.push(q.l + ": " + v(q.id)); }); }
    var m = matches().slice(0, 3); if (m.length) lines.push("", "Matching investor theses: " + m.map(function (x) { return x.t.title + " (" + x.t.src + ")"; }).join("; "));
    return lines.join("\n");
  };
  // Fills the example picker at the top of Idea Check; keeps the last chosen example selected.
  var picker = function () {
    var sel = $("ex-pick"); if (!sel) return;
    var p = s.exPick === "" || s.exPick == null ? -1 : +s.exPick; if (!(p >= 0 && p < EXS.length)) p = -1;
    if (sel.options.length !== EXS.length + 1) sel.innerHTML = '<option value="">Pick a real example</option>' + EXS.map(function (x, k) { return '<option value="' + k + '">' + e(x.label) + "</option>"; }).join("");
    sel.value = p < 0 ? "" : String(p);
  };
  var render = function () {
    stepper();
    picker();
    var i = s.step;
    if (!(i >= 0 && i <= LAST)) i = s.step = 0;
    $("stage").innerHTML = (isForm(i) ? views.form(i) : i === S_INV ? views.inv() : i === S_VAL ? views.val() : i === S_SC ? views.sc() : views.why());
    if (i === S_WHY) $("why-out").innerHTML = whyOut();
  };
  var live = function () {
    stepper();
    var i = s.step;
    if (i === S_WHY && $("why-out")) { clearTimeout(window._wt); window._wt = setTimeout(function () { $("why-out").innerHTML = whyOut(); }, 300); }
    if (FW.indexOf(i) > -1) {
      var m = $("meter"); if (m) m.outerHTML = meter(touched(i) ? stepScore(i) : 0, "Step score");
      if ($("tam")) $("tam").textContent = "Beachhead TAM (customers x revenue each): " + money(tam()) + (tam() ? (tam() < 5e6 ? " · too small for venture" : tam() < 2e7 ? " · below the $20M-$100M sweet spot" : tam() <= 1e8 ? " · in the $20M-$100M sweet spot" : tam() > 1e9 ? " · too broad, narrow it" : " · above the sweet spot") : "");
    }
  };
  // Why you: earned founder fit
  var L = function (id) { return v(id).length; };
  var sent = function (x) { x = String(x || "").trim().replace(/\s+/g, " "); if (!x) return ""; x = x.charAt(0).toUpperCase() + x.slice(1); return /[.!?]$/.test(x) ? x : x + "."; };
  var first = function (x) { x = String(x || "").trim(); var m = x.match(/^[\s\S]*?[.!?](\s|$)/); return sent(m ? m[0] : x); };
  var low = function (x) { x = first(x).replace(/[.!?]$/, ""); return !x ? "" : /^(I\b|I'|[A-Z][A-Z0-9])/.test(x) ? x : x.charAt(0).toLowerCase() + x.slice(1); };
  var slot = function (x, ph) { return x ? x : "[" + ph + "]"; };
  var insight = function () { return v("w_insight") || v("secret"); };
  var fit = function () {
    var convo = n("w_convo"), ins = v("w_ins");
    var sig = [
      ["Lived it", (v("fmf") === "inside" || n("yrs") >= 3) ? 2 : (v("fmf") === "adjacent" || v("fmf") === "studied" || L("w_skills") >= 40) ? 1 : 0, "Years in the job, or related work that carries over."],
      ["Insight", insight().length >= 60 ? 2 : insight().length >= 20 ? 1 : 0, "Something true about this market that outsiders miss."],
      ["Access", (ins === "yes" || (ins === "working" && L("w_access") >= 40)) ? 2 : (L("w_access") >= 20 || ins === "working") ? 1 : 0, "Customers and insiders you can reach now."],
      ["Learning speed", (convo >= 20 || v("s_rev") === "money") ? 2 : (convo >= 5 || L("w_learn") >= 40) ? 1 : 0, "How much you've learned from real customers, and how fast."]
    ];
    var rest = sig[1][1] + sig[2][1] + sig[3][1];
    var lab = sig[0][1] === 2 ? ["Insider", "Lead with your years in the work, then show what you've learned since you started."] :
      rest >= 5 ? ["Earned fit", "You're not an industry veteran, and you don't need to be. Lead with your insight, your access and how fast you learn."] :
      rest >= 2 ? ["Earning it", "You have a real start. The 30-day plan below closes the rest before you pitch."] :
      ["Not shown yet", "Fill in the questions above. Most founders have more fit than they give themselves credit for."];
    return { sig: sig, lab: lab };
  };
  var HEDGE = [
    [/\b(i'?m not an expert|not an expert|no (real )?experience|i don'?t have (much |any )?experience|never worked)\b/i, "Lead with what you've done, not what you haven't. Name the related work instead."],
    [/\b(just|only) (a|an|my)\b/i, "Cut \"just\" and \"only.\" They shrink real experience."],
    [/\b(i think|i feel like|hopefully|hope to|try to|trying to|kind of|sort of|a little bit)\b/i, "Say it plainly. \"I think customers want\" becomes \"Customers told me.\""],
    [/\b(avoid|prevent|protect|risk|lose|losing|worry|worried|fail|failing)\b/i, "You're framing around what could go wrong. Try framing around what grows: revenue won, hours saved, customers gained."]
  ];
  var hedges = function () {
    var txt = ["w_story", "w_skills", "w_learn", "w_access"].map(v).join(" ");
    return HEDGE.filter(function (h) { return h[0].test(txt); }).map(function (h) { return h[1]; });
  };
  var whyPara = function () {
    var p = [];
    p.push(v("w_story") ? sent(v("w_story")) : "[The moment you saw this problem.]");
    p.push("I bring " + slot(low(v("w_skills")), "related work that carries over") + ".");
    if (insight()) p.push("What I see that others miss: " + low(insight()) + ".");
    if (n("w_convo")) p.push("I've talked with " + n("w_convo") + " people who live this problem" + (v("w_learn") ? ", and the biggest lesson was that " + low(v("w_learn")) : "") + ".");
    else if (v("w_learn")) p.push("What I've learned from customers: " + low(v("w_learn")) + ".");
    if (v("w_access")) p.push("I can reach " + low(v("w_access")) + ".");
    return p.join(" ");
  };
  var pitch = function () {
    var p = [], ev = s.ev.filter(function (x) { return x.k === "s"; }).length;
    p.push(v("problem") ? first(v("problem")) : "[Who has what problem.]");
    var one = v("one"), verb = /^(helps|gives|lets|makes|turns|connects|automates|uses|builds|provides|enables|matches|finds|tracks|predicts|creates|is)\b/i.test(one);
    p.push(!one ? (v("name") ? v("name") + " is [what it does, for whom, and the result]." : "[What it does, for whom, and the result].") : v("name") ? v("name") + (verb ? " " + low(one) + "." : ": " + first(one)) : first(one));
    if (v("whynow")) p.push("Why now: " + low(v("whynow")) + ".");
    p.push("Why me: " + (v("w_story") ? low(v("w_story")) : v("w_skills") ? "I bring " + low(v("w_skills")) : "[your why-you line]") + ".");
    if (n("w_convo") || ev) p.push((n("w_convo") ? "We've talked with " + n("w_convo") + " customers" : "We've found " + ev + " signals of demand") + (v("w_learn") ? " and learned that " + low(v("w_learn")) : "") + ".");
    p.push("We're looking for " + slot(v("w_ask").replace(/[.]$/, ""), "your ask") + ".");
    return p.join(" ");
  };
  var iqs = function (f) {
    var Q = [], og = open().sort(function (a, b) { return PEN[b.sev] - PEN[a.sev]; });
    if (f.sig[0][1] < 2) Q.push(["You haven't worked in this industry. Why you?", "I know I'm not an expert yet, but I'm a fast learner.",
      "I come at this from " + slot(low(v("w_skills")), "your related work") + ", which is how I saw " + slot(low(insight()), "your insight") + ". " + (n("w_convo") ? "I've talked with " + n("w_convo") + " people who live this problem" : "[How many customers you've talked with]") + ", and " + slot(low(v("w_access")), "who you can reach") + "."]);
    if (v("people") === "solo" || v("people") === "one" || (v("v_build") && v("v_build") !== "yes")) Q.push(["Who's going to build this?", "I'm still looking for a technical cofounder.",
      "[Name, or exactly where you're recruiting.] Meanwhile I've " + (v("v_proto") === "yes" ? "built a prototype customers are already reacting to" : "[the mockup or no-code test you've shipped]") + "."]);
    if (!tam() || tam() < 2e7) Q.push(["How big can this get?", "It's a niche, but it's a start.",
      "We start with " + slot(low(v("beach")), "your beachhead") + (tam() ? ", " + money(tam()) + " a year" : "") + ", then grow into " + slot(low(v("follow")), "follow-on markets") + "."]);
    if (v("dur") !== "moat") Q.push(["What stops a bigger company from copying you?", "Hopefully we can move faster than them.",
      slot(sent(insight()), "What you know that they don't.") + " Every customer we add makes the product better because [the data, network or workflow you build up]."]);
    if (og.length) Q.push(["What's the biggest risk?", "List every worry and what could go wrong.",
      "The biggest open question: " + low(og[0].m) + ". Our next 30 days go to answering it. " + og[0].q]);
    if (v("whynow")) Q.push(["Why now?", "The timing feels right.", sent(v("whynow"))]);
    return Q.slice(0, 4);
  };
  var plan = function () {
    var c = n("w_convo");
    return [
      ["Talk to 20 people who live this problem", Math.min(c, 20) + " of 20 done. Ask about the last time it happened, not whether they'd buy.", c >= 20],
      ["Spend a day inside the work", "Shadow, ride along, or work a shift. Note what surprised you.", false],
      ["Recruit one insider advisor", "Someone with 5+ years in the job. A small advisor grant (often 0.25% to 1%) is common.", v("w_ins") === "yes"],
      ["Share what you learned", "A short post or one-page memo. Learning people can see is fit investors can see.", false],
      ["Bring it to a Build Night", "Ask the room for intros to insiders and first customers.", false]
    ];
  };
  var kit = function () {
    var f = fit(), q = iqs(f);
    return ["FOUNDER FIT: " + f.lab[0], f.lab[1], "", "WHY ME", whyPara(), "", "30-SECOND PITCH", pitch(), "", "LIKELY QUESTIONS"].concat(q.map(function (x) { return "Q: " + x[0] + "\nA: " + x[2]; }), ["", "TECHSTARS TEAM LENS"], TECH.qs.map(function (x) { return x.l + ": " + (v(x.id) || "[not answered]"); })).join("\n");
  };
  var whyOut = function () {
    var f = fit(), hs = hedges(), q = iqs(f), pl = plan(), pw = pitch().split(/\s+/).length;
    var lv = ["Not yet", "Building", "Strong"];
    var sigHTML = '<ul class="checklist">' + f.sig.map(function (x) { return '<li><span class="checklist__item">' + e(x[0]) + "<small>" + e(x[2]) + '</small></span><span class="chip' + (x[1] === 2 ? " chip--solid" : "") + '">' + lv[x[1]] + "</span></li>"; }).join("") + "</ul>";
    var hHTML = hs.length ? '<div class="x-gap"><span class="chip">Wording check</span>' + hs.map(function (h) { return "<p>" + e(h) + "</p>"; }).join("") + '<p>Investors tend to ask women more questions about risk and men more about growth. Founders who answered risk questions by pivoting to growth raised more (Kanze, Huang, Conley and Higgins, Academy of Management Journal, 2018).</p></div>' : "";
    var qHTML = q.map(function (x) { return '<div class="x-gap"><p>' + e(x[0]) + "</p><p><strong>Instead of:</strong> " + e(x[1]) + "</p><p><strong>Try:</strong> " + e(x[2]) + "</p></div>"; }).join("");
    var planHTML = (f.sig[0][1] < 2 || f.sig[3][1] < 2) ? '<h3 style="font:var(--type-heading);margin:28px 0 10px">Earn your fit in 30 days</h3><ul class="checklist">' + pl.map(function (x) { return '<li><span class="checklist__item">' + e(x[0]) + "<small>" + e(x[1]) + '</small></span><span class="chip' + (x[2] ? " chip--solid" : "") + '">' + (x[2] ? "Done" : "To do") + "</span></li>"; }).join("") + "</ul>" : "";
    return '<aside class="callout" aria-label="Founder fit" style="margin-top:28px"><p class="callout__head">Founder fit</p><p class="callout__lead"><strong>' + e(f.lab[0]) + ".</strong> " + e(f.lab[1]) + "</p></aside>" +
      '<div class="pair" style="margin-top:28px"><div><h3 style="font:var(--type-heading);margin-bottom:10px">Your fit signals</h3>' + sigHTML + "</div>" +
      '<div><h3 style="font:var(--type-heading);margin-bottom:10px">Why me, draft</h3><p class="prose">' + e(whyPara()) + '</p><h3 style="font:var(--type-heading);margin:20px 0 10px">30-second pitch, draft</h3><p class="prose">' + e(pitch()) + '</p><p class="x-hint">' + pw + " words. About 75 fits in 30 seconds.</p></div></div>" +
      (hHTML ? '<div style="margin-top:20px">' + hHTML + "</div>" : "") +
      '<h3 style="font:var(--type-heading);margin:28px 0 10px">Questions investors will likely ask</h3><div class="x-gaps" style="margin-top:0">' + qHTML + "</div>" + planHTML +
      '<p class="fineprint" style="margin-top:20px">These are drafts built from your answers. Rewrite them in your own voice; bracketed parts still need you.</p>' +
      '<div class="links x-noprint" style="margin-top:12px"><button type="button" class="btn" id="copy-kit">Copy my pitch kit</button><button type="button" class="btn" id="print">Print</button></div><textarea class="x-in" id="kit-out" readonly hidden aria-label="Pitch kit" style="min-height:160px"></textarea>';
  };
  views.why = function () {
    return head(S_WHY, '<p class="x-hint" style="margin-bottom:20px">You don\'t need ten years in the industry. Investors back founders who see something others miss, can reach customers, and learn fast. Answer what you can; the drafts update as you type.</p>') +
      '<div class="x-form">' + WQ.map(field).join("") + '</div><div id="why-out"></div>';
  };

  // Steps switch in place: hold the stepper where it was on screen.
  var go = function (i, fromNav) {
    var sp = $("stepper"), y0 = sp ? sp.getBoundingClientRect().top : 0;
    s.step = +i; save(); render();
    if (!sp) return;
    var d = sp.getBoundingClientRect().top - y0;
    if (Math.abs(d) > 0.5) window.scrollBy({ top: d, left: 0, behavior: "instant" });
    if (fromNav) {
      var r = sp.getBoundingClientRect();
      if (r.top < 0 || r.bottom > window.innerHeight) sp.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "nearest" });
    }
  };

  var EXS = [
 {
  "label": "Fleety · Y Combinator Fall 2026",
  "note": "Fleety (Y Combinator Fall 2026): inputs drafted from public descriptions, checked Nov 14, 2026. Founder background from public profiles: Both founders worked as dispatchers at Bay Area plumbing/HVAC shops; CEO ran a roofing company and founded contractor-permitting startup Timrep; CTO is technical. Not the founders' own answers; anything not public counts as a gap. A demo of the tool, not a judgment of the company.",
  "src": "https://cambrian.jafar.com/batches/fall-2026",
  "a": {
   "name": "Fleety",
   "one": "AI dispatcher for plumbing and HVAC companies.",
   "kw": "dispatch, plumbing, hvac, field services, trades, scheduling, SMB services, data, AI",
   "problem": "Owners and office managers of plumbing and HVAC companies: AI dispatcher for plumbing and HVAC companies.",
   "size": "big",
   "acute": "fire",
   "comp": "insight",
   "beach": "Owners and office managers of plumbing and HVAC companies",
   "b_seg": "Owners and office managers of plumbing and HVAC companies",
   "b_vp": "AI dispatcher for plumbing and HVAC companies.",
   "whynow": "Voice and agent AI can now handle calls and scheduling reliably",
   "fmf": "inside",
   "people": "both",
   "v_team": "yes",
   "v_build": "yes"
  }
 },
 {
  "label": "Ailit · Y Combinator Fall 2026",
  "note": "Ailit (Y Combinator Fall 2026): inputs drafted from public descriptions, checked Nov 14, 2026. Founder background from public profiles: Deep battery/powertrain builders (Koenigsegg, Candela electric ferry) and an ML engineer; no railroad operating background found. Full-scale prototype built. Not the founders' own answers; anything not public counts as a gap. A demo of the tool, not a judgment of the company.",
  "src": "https://presenc.ai/research/yc-fall-2026-batch-ai-startups",
  "a": {
   "name": "Ailit",
   "one": "Swappable batteries for North American freight rail.",
   "kw": "rail, railroad, freight, locomotive, battery, electrification, logistics, energy, manufacturing",
   "problem": "Class I and short-line freight railroads: Swappable batteries for North American freight rail.",
   "size": "big",
   "acute": "unclear",
   "comp": "insight",
   "beach": "Class I and short-line freight railroads",
   "b_seg": "Class I and short-line freight railroads",
   "b_vp": "Swappable batteries for North American freight rail.",
   "whynow": "Battery costs falling and pressure to decarbonize freight",
   "fmf": "studied",
   "people": "both",
   "v_team": "yes",
   "v_build": "yes",
   "v_proto": "yes"
  }
 },
 {
  "label": "Nimble · a16z speedrun SR007",
  "note": "Nimble (a16z speedrun SR007): inputs drafted from public descriptions, checked Nov 14, 2026. Founder background from public profiles: CEO's family runs a 70-year-old freight forwarding company; CTO is an ex-Microsoft Azure engineer. Family exposure, not hands-on forwarding work. Not the founders' own answers; anything not public counts as a gap. A demo of the tool, not a judgment of the company.",
  "src": "https://www.linkedin.com/posts/varad-mohod_andreessen-horowitz-speedrun-sr007-demo-day-activity-7515131514955681792-KRQC",
  "a": {
   "name": "Nimble",
   "one": "AI for freight forwarders.",
   "kw": "freight, forwarding, logistics, quotes, documents, procurement, logistics, data, AI",
   "problem": "Freight forwarding companies: AI for freight forwarders.",
   "size": "big",
   "acute": "fire",
   "comp": "crowded",
   "beach": "Freight forwarding companies",
   "b_seg": "Freight forwarding companies",
   "b_vp": "AI for freight forwarders.",
   "whynow": "Agents can now read shipping documents and emails at scale",
   "fmf": "studied",
   "people": "both",
   "v_team": "yes",
   "v_build": "yes"
  }
 },
 {
  "label": "Colmez · a16z speedrun SR007",
  "note": "Colmez (a16z speedrun SR007): inputs drafted from public descriptions, checked Nov 14, 2026. Founder background from public profiles: CEO and CTO traded these companies as quants; COO covered them in PE (Antin, Ares); ex-US Ecology CEO advises. Reports $800K+ contracted ARR and 5 of top 7 operators. Not the founders' own answers; anything not public counts as a gap. A demo of the tool, not a judgment of the company.",
  "src": "https://speedrun.substack.com/p/80-founders-sr007",
  "a": {
   "name": "Colmez",
   "one": "Agentic platform for the hazardous waste industry.",
   "kw": "hazardous waste, compliance, manifests, environmental, industrial, documents, data, AI, energy",
   "problem": "Hazardous waste haulers and generators: Agentic platform for the hazardous waste industry.",
   "size": "growing",
   "acute": "fire",
   "comp": "none",
   "beach": "Hazardous waste haulers and generators",
   "b_seg": "Hazardous waste haulers and generators",
   "b_vp": "Agentic platform for the hazardous waste industry.",
   "whynow": "Agents can handle compliance paperwork",
   "fmf": "studied",
   "people": "both",
   "v_team": "yes",
   "v_build": "yes",
   "s_seg": "money",
   "s_rev": "money"
  }
 },
 {
  "label": "HEDI · ABN AMRO + Techstars Future of Finance, Fall 2026",
  "note": "HEDI (ABN AMRO + Techstars Future of Finance, Fall 2026): inputs drafted from public descriptions, checked Nov 14, 2026. Founder background from public profiles: CEO led AI deployment for Paris 2024 and has insurance consulting experience; CTO builds AI for insurance workflows. Revenue live, 9,000+ claims a month (company claim). Not the founders' own answers; anything not public counts as a gap. A demo of the tool, not a judgment of the company.",
  "src": "https://www.techstars.com/newsroom/introducing-techstars-fall-2026-accelerator-class",
  "a": {
   "name": "HEDI",
   "one": "An AI agent that investigates insurance fraud.",
   "kw": "insurance, fraud, claims, investigation, documents, insurance, fintech, data, AI",
   "problem": "Insurance claims and special investigations units: An AI agent that investigates insurance fraud.",
   "size": "big",
   "acute": "fire",
   "comp": "insight",
   "beach": "Insurance claims and special investigations units",
   "b_seg": "Insurance claims and special investigations units",
   "b_vp": "An AI agent that investigates insurance fraud.",
   "whynow": "AI can forge documents, and AI can now investigate them",
   "fmf": "studied",
   "people": "both",
   "v_team": "yes",
   "v_build": "yes",
   "s_rev": "money"
  }
 },
 {
  "label": "Cadynce · Techstars Founder Catalyst Alabama, Fall 2026",
  "note": "Cadynce (Techstars Founder Catalyst Alabama, Fall 2026): inputs drafted from public descriptions, checked Nov 14, 2026. Founder background from public profiles: CEO was director of technology at a drywall contractor, then spent years in ERP consulting for manufacturers with the CTO. Founded 2023. Not the founders' own answers; anything not public counts as a gap. A demo of the tool, not a judgment of the company.",
  "src": "https://www.techstars.com/newsroom/introducing-the-2026-techstars-founder-catalyst-alabama-fall-cohort",
  "a": {
   "name": "Cadynce",
   "one": "Helps construction companies bid faster and win more with AI takeoffs and a bid workflow.",
   "kw": "construction, bids, takeoff, estimating, subcontracting, construction, data, AI, SMB services",
   "problem": "Construction contractors and estimators: Helps construction companies bid faster and win more with AI takeoffs and a bid workflow.",
   "size": "big",
   "acute": "fire",
   "comp": "crowded",
   "beach": "Construction contractors and estimators",
   "b_seg": "Construction contractors and estimators",
   "b_vp": "Helps construction companies bid faster and win more with AI takeoffs and a bid workflow.",
   "whynow": "AI can read plans and do takeoffs",
   "fmf": "inside",
   "yrs": "15",
   "people": "both",
   "v_team": "yes",
   "v_build": "yes"
  }
 },
 {
  "label": "CityVerse AI · NMotion Fall 2026 (Lincoln)",
  "note": "CityVerse AI (NMotion Fall 2026 (Lincoln)): inputs drafted from public descriptions, checked Nov 14, 2026. Founder background from public profiles: 23-year-old co-founders: CTO has an MS in AI (ex-Texas Instruments), CEO a quant-finance background. No civil engineering or city government experience; learned the market by pitching cities, now live in several. Not the founders' own answers; anything not public counts as a gap. A demo of the tool, not a judgment of the company.",
  "src": "https://cityverseai.com/about",
  "a": {
   "name": "CityVerse AI",
   "one": "AI document review for city governments, starting with Nebraska cities.",
   "kw": "city, government, permits, document review, zoning, public sector, government, data, AI",
   "problem": "City officials and planning departments: AI document review for city governments, starting with Nebraska cities.",
   "size": "big",
   "acute": "fire",
   "comp": "insight",
   "beach": "City officials and planning departments",
   "b_seg": "City officials and planning departments",
   "b_vp": "AI document review for city governments, starting with Nebraska cities.",
   "whynow": "AI can check documents against code; cities are short-staffed",
   "fmf": "studied",
   "people": "both",
   "v_team": "yes",
   "v_build": "yes",
   "s_seg": "int"
  }
 },
 {
  "label": "MeetingMD · NMotion Fall 2026 (Gretna)",
  "note": "MeetingMD (NMotion Fall 2026 (Gretna)): inputs drafted from public descriptions, checked Nov 14, 2026. Founder background from public profiles: The company describes its software as built for sales reps, by a sales rep. Technical builder on the team not confirmed. Not the founders' own answers; anything not public counts as a gap. A demo of the tool, not a judgment of the company.",
  "src": "https://www.linkedin.com/posts/kirkzeller_incubated-accelerator-activity-7495561202832699392-GuEA",
  "a": {
   "name": "MeetingMD",
   "one": "Gives medical practice managers control over scheduling meetings between physicians and industry vendors.",
   "kw": "medical practice, scheduling, vendors, pharma reps, physicians, healthcare, SMB services",
   "problem": "Medical practice managers: Gives medical practice managers control over scheduling meetings between physicians and industry vendors.",
   "size": "growing",
   "acute": "nice",
   "comp": "none",
   "beach": "Medical practice managers",
   "b_seg": "Medical practice managers",
   "b_vp": "Gives medical practice managers control over scheduling meetings between physicians and industry vendors.",
   "fmf": "inside"
  }
 },
 {
  "label": "Etholytics · Techstars Founder Catalyst Omaha, Fall 2026",
  "note": "Etholytics (Techstars Founder Catalyst Omaha, Fall 2026): inputs drafted from public descriptions, checked Nov 14, 2026. Founder background from public profiles: Founder is a former zookeeper with an MS and PhD in Animal Science (UNL), studying giraffe stress and cheetah behavior on camera; CTO has 20+ years in IT. Piloting at Omaha's zoo. Not the founders' own answers; anything not public counts as a gap. A demo of the tool, not a judgment of the company.",
  "src": "https://siliconprairienews.com/2026/09/open-range-shares-latest-techstars-cohort-and-a-new-partnership-with-first-national-bank-of-omaha/",
  "a": {
   "name": "Etholytics",
   "one": "Machine learning to monitor and collect data on animal behavior.",
   "kw": "animal behavior, livestock, computer vision, monitoring, farm, agriculture, agriculture, data, AI",
   "problem": "Livestock producers and animal researchers: Machine learning to monitor and collect data on animal behavior.",
   "size": "big",
   "acute": "unclear",
   "comp": "insight",
   "beach": "Livestock producers and animal researchers",
   "b_seg": "Livestock producers and animal researchers",
   "b_vp": "Machine learning to monitor and collect data on animal behavior.",
   "whynow": "Cheap cameras and computer vision",
   "fmf": "inside",
   "yrs": "10",
   "people": "both",
   "v_team": "yes",
   "v_build": "yes",
   "v_proto": "yes"
  }
 },
 {
  "label": "Moonlit AI · Techstars Founder Catalyst Omaha, Fall 2026",
  "note": "Moonlit AI (Techstars Founder Catalyst Omaha, Fall 2026): inputs drafted from public descriptions, checked Nov 14, 2026. Founder background from public profiles: Founder spent years in agency web and analytics work and built the product herself. Solo founder. Not the founders' own answers; anything not public counts as a gap. A demo of the tool, not a judgment of the company.",
  "src": "https://siliconprairienews.com/2026/09/open-range-shares-latest-techstars-cohort-and-a-new-partnership-with-first-national-bank-of-omaha/",
  "a": {
   "name": "Moonlit AI",
   "one": "Gives small businesses and marketing teams data insights from analyzing their websites.",
   "kw": "website analytics, small business, marketing, customer experience, SMB services, data, AI",
   "problem": "Small businesses and marketing teams: Gives small businesses and marketing teams data insights from analyzing their websites.",
   "size": "big",
   "acute": "nice",
   "comp": "crowded",
   "beach": "Small businesses and marketing teams",
   "b_seg": "Small businesses and marketing teams",
   "b_vp": "Gives small businesses and marketing teams data insights from analyzing their websites.",
   "fmf": "inside",
   "yrs": "4",
   "people": "solo",
   "v_team": "no",
   "v_build": "yes"
  }
 }
];
  var EX = null;

  document.addEventListener("input", function (ev) {
    var t = ev.target;
    var regap = function () { var g = $("gaps"); if (g && t.tagName !== "SELECT" && !g.contains(t)) clearTimeout(window._gt), window._gt = setTimeout(function () { g.innerHTML = gapHTML(s.step); }, 400); else if (g) g.innerHTML = gapHTML(s.step); };
    if (t.dataset.k) { s.a[t.dataset.k] = t.value; save(); live(); regap(); }
    else if (t.dataset.cf) { var R = rows(), ci = +t.dataset.ci; if (R[ci]) { R[ci][t.dataset.cf] = t.value; save(); live(); regap(); } }
    else if (t.id === "cphrase") { s.cphrase = t.value; save(); $("clinks").innerHTML = compLinks(t.value); }
    else if (t.dataset.fu) {
      s.fu[t.dataset.fu] = t.value; save(); live();
      var box = t.closest(".x-gap"), g2 = G.filter(function (x) { return x.id === t.dataset.fu; })[0], ok = resolved(g2), chip = box.querySelector(".chip");
      box.classList.toggle("is-ok", ok); chip.className = "chip" + (ok ? "" : g2.sev === "high" ? " chip--solid" : ""); chip.textContent = ok ? "Resolved" : SEV[g2.sev] + " severity";
      var h = box.parentNode.querySelector("h3"); if (h) h.textContent = "Gaps to close (" + open(s.step).length + " open)";
    } else if (t.id === "ex-pick") { s.exPick = t.value === "" ? "" : +t.value; save();
    } else if (t.id === "phrase") { s.phrase = t.value; save(); $("slinks").innerHTML = links(t.value); }
  });
  document.addEventListener("click", function (ev) {
    var t = ev.target.closest("button, [data-go]"); if (!t) return;
    if (t.dataset.go != null) return go(t.dataset.go, !!t.closest(".x-wiznav"));
    if (t.id === "c-add" || t.dataset.cdel != null) {
      // Redraw the step in place, holding the row list where it sits on screen.
      var R = rows(), box = $("c-rows"), y0 = box ? box.getBoundingClientRect().top : 0, add = t.id === "c-add";
      if (add) { if (R.length >= CMAX) return; R.push(blank()); } else R.splice(+t.dataset.cdel, 1);
      save(); render();
      var nb = $("c-rows"); if (nb) { var d = nb.getBoundingClientRect().top - y0; if (Math.abs(d) > 0.5) window.scrollBy({ top: d, left: 0, behavior: "instant" }); }
      var fo = add ? $("c-" + (R.length - 1) + "-name") : ($("c-add") || $("c-0-name"));
      if (fo) fo.focus({ preventScroll: true });
      return;
    }
    if (t.id === "load-ex") { var xv = $("ex-pick") ? $("ex-pick").value : ""; if (xv === "" || !EXS[+xv]) { if ($("ex-pick")) $("ex-pick").focus(); return; } var xi = +xv, X = EXS[xi]; s.exPick = xi; s.a = Object.assign({}, X.a); s.fu = {}; s.ev = []; s.phrase = null; s.cphrase = null; s.comp = null; s.exNote = X.note || ""; s.exSrc = X.src || ""; s.step = S_SC; save(); render(); }
    else if (t.id === "reset") { if (confirm("Clear every answer?")) { s = { a: {}, fu: {}, ev: [], phrase: null, step: 0, exNote: "" }; save(); render(); } }
    else if (t.id === "ev-add") { var src = $("ev-src").value.trim(), note = $("ev-note").value.trim(); if (!src && !note) return; s.ev.push({ src: src || "Unnamed source", note: note, k: $("ev-k").value }); save(); render(); }
    else if (t.dataset.del != null) { s.ev.splice(+t.dataset.del, 1); save(); render(); }
    else if (t.id === "print") window.print();
    else if (t.id === "copy-kit") {
      var k = kit(), ko = $("kit-out"), kf = function () { ko.hidden = false; ko.value = k; ko.focus(); ko.select(); t.textContent = "Select and copy the text below"; };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(k).then(function () { t.textContent = "Copied"; setTimeout(function () { t.textContent = "Copy my pitch kit"; }, 2000); }, kf); else kf();
    }
    else if (t.id === "copy") {
      var p = coachPrompt(), out = $("prompt-out"), fall = function () { out.hidden = false; out.value = p; out.focus(); out.select(); t.textContent = "Select and copy the text below"; };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(p).then(function () { t.textContent = "Copied"; setTimeout(function () { t.textContent = "Copy prompt for an AI coach"; }, 2000); }, fall); else fall();
    }
  });
  window.__nsic = { steps: { SC: S_SC, TECH: S_TECH, WHY: S_WHY, LAST: LAST }, s: s, EX: EX, EXS: EXS, answered: answered, coverage: coverage, stepScore: stepScore, viralLevel: viralLevel, gaps: gaps, matches: matches, overall: overall, fit: fit, whyOut: whyOut, kit: kit, views: views, setA: function (a) { s.a = a; }, load: function (t) { THESES = t; }, theses: function () { return THESES; }, prefill: function (txt) { s.a.problem = txt; s.step = 1; save(); render(); },
    // Fills only the fields that are still empty, then opens a step for review. Used by the deck and description import.
    fill: function (a, step) { Object.keys(a || {}).forEach(function (k) { if (a[k] !== "" && a[k] != null && v(k) === "") s.a[k] = String(a[k]); }); s.exNote = ""; s.exSrc = ""; s.step = step || 0; save(); render(); },
    // Adds imported companies after the founder's own rows; never changes a row that has content. Returns how many were added.
    fillComp: function (list) {
      var have = filled().map(row), names = {};
      have.forEach(function (r) { names[r.name.trim().toLowerCase()] = 1; });
      var add = (list || []).map(row).filter(function (r) { var k = r.name.trim().toLowerCase(); if (!k || names[k]) return false; names[k] = 1; return true; }).slice(0, 5);
      add = add.slice(0, Math.max(0, CMAX - have.length));
      if (!add.length) return 0;
      var out = have.concat(add); while (out.length < 3) out.push(blank());
      s.comp = out; save(); return add.length;
    },
    comp: function () { return rows(); },
    answers: function () { return s.a; } };
  render();
})();
    