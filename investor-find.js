/* Idea Check, Find investors mode. Self-contained: adds a third option to the
   Idea Check switch (#check .x-fp-switch), its own panel, and "Find investors
   for this idea" buttons on Find-mode idea cards and Check results.
   Answers are saved in localStorage. Styles: idea-check.css (.x-inv-*). */
(function () {
  "use strict";

  // Public info checked 2026-11-17. Fields as in investors-page.csv, minus source_url and date_checked.
  var INVESTORS = [
    {"group": "1 Nebraska", "name": "Invest Nebraska", "type": "VC fund (state-backed seed fund / nonprofit venture development org)", "hq": "Lincoln, NE", "stage": "Seed (early PMF)", "typical_check_published": "Average first check $250K, as part of a round giving 12-18 months runway", "sectors_thesis": "Industry-agnostic, tech/IP-enabled: IoT, medtech, fintech, insurtech, agtech, food tech, health software, robotics & advanced manufacturing", "women_founder_focus": "no", "geographic_focus": "Nebraska (must have Nebraska footprint and in-state growth plan)", "how_to_approach": "Contact form on site; warm intro via ecosystem (also co-invests with Nebraska Angels / NMotion)", "official_url": "https://www.investnebraska.com", "status": "active", "caution": "Wants early product-market fit: recurring revenue (software) or proof of concept (hardware/life science)."},
    {"group": "1 Nebraska", "name": "Nebraska Angels", "type": "Angel group", "hq": "Lincoln, NE (Lincoln + Omaha)", "stage": "Pre-seed, Seed, Series A", "typical_check_published": "Members' aggregate investment typically $250K-$500K+", "sectors_thesis": "Industry-agnostic", "women_founder_focus": "no", "geographic_focus": "Midwest preference", "how_to_approach": "Apply on site (Gust); monthly pitch meetings", "official_url": "https://www.nebraskaangels.org", "status": "active", "caution": "Expects MVP in market, users/pilots or recurring revenue, and a term sheet or lead investor in place (exceptions for medtech/agtech). NVCA-style docs only. Software cos need a technical team member."},
    {"group": "1 Nebraska", "name": "NMotion powered by gener8tor", "type": "Accelerator fund", "hq": "Lincoln, NE", "stage": "Pre-seed / Seed", "typical_check_published": "$100K for 7.5% equity (SAFE)", "sectors_thesis": "Industry- and business-model-agnostic; Great Plains high-growth startups", "women_founder_focus": "no", "geographic_focus": "Great Plains region", "how_to_approach": "Apply via online application (Airtable) when a cohort opens", "official_url": "https://www.nmotion.co", "status": "active", "caution": "Fall 2026 application closed (deadline was May 17, 2026); 6 startups per cohort; spring 2026 cohort was paused per earlier project research. Next cohort dates not posted."},
    {"group": "1 Nebraska", "name": "Maverick Venture Fund (UNO)", "type": "University student-run venture fund", "hq": "Omaha, NE", "stage": "Seed / pre-revenue", "typical_check_published": "Conflicting published figures: UNO marketing page says $1,000-$5,000; UndergradVC (citing fund page) says up to $25,000", "sectors_thesis": "Industry-agnostic", "women_founder_focus": "no", "geographic_focus": "Nebraska; targets UNO students and alumni", "how_to_approach": "Online funding application (Microsoft Form) on UNO page", "official_url": "https://www.unomaha.edu/college-of-business-administration/center-for-innovation-entrepreneurship-franchising/courses/maverick-venture-fund.php", "status": "active", "caution": "Primarily for UNO students/alumni; very small checks. Useful only for founders with a UNO tie."},
    {"group": "1 Nebraska", "name": "AQi (Aequitas Invest)", "type": "Reg CF funding portal", "hq": "Omaha, NE", "stage": "Pre-seed to growth (crowdfunding)", "typical_check_published": "Raises of $150K-$5M; portal fee up to 6.5% of amount raised", "sectors_thesis": "Any sector; women-owned companies", "women_founder_focus": "yes", "geographic_focus": "US (investors nationwide)", "how_to_approach": "Apply on site ('Launch your campaign'); Entrepreneur dashboard", "official_url": "https://www.aequitasinvest.com", "status": "active", "caution": "Launched May 2026; SEC-registered/FINRA member (SEC File 7-483). Note: Golden Seeds will not invest in companies using Reg CF, so a Reg CF raise can close off some angel options."},
    {"group": "1 Nebraska", "name": "Nelnet Ventures", "type": "Corporate VC", "hq": "Lincoln, NE", "stage": "Post-MVP seed / early stage", "typical_check_published": "Avg first check shown on page but value did not load; not confirmed", "sectors_thesis": "Fintech, edtech, future of work, renewable energy/climate, agtech", "women_founder_focus": "no", "geographic_focus": "Midwest ecosystem (co-invests with Nebraska Angels, Invest Nebraska, gener8tor)", "how_to_approach": "Contact form on page; often via Nebraska Angels", "official_url": "https://nelnetinc.com/capabilities/investing/venture-capital-investments/", "status": "active", "caution": "Invests beyond MVP with established revenue."},
    {"group": "1 Nebraska", "name": "Grit Road Partners", "type": "VC fund", "hq": "Omaha, NE", "stage": "Seed ('series seed')", "typical_check_published": "$250K seed checks (Fund I); Fund II is a $35M seed fund", "sectors_thesis": "Agtech across the ag value chain; producer problems; Midwest ag", "women_founder_focus": "no", "geographic_focus": "Midwest base, expanding globally", "how_to_approach": "Contact via site/LinkedIn; warm intro", "official_url": "https://gritrd.com", "status": "active", "caution": "Check size is from 2023 coverage; Fund II aims to lead more. Also GP for DIAL Ventures Fund II (agrifood studio)."},
    {"group": "1 Nebraska", "name": "Proven Ventures (Burlington Capital)", "type": "VC fund (debt-equity model)", "hq": "Omaha, NE", "stage": "Revenue stage", "typical_check_published": "$250K-$500K", "sectors_thesis": "Industry-agnostic, customer-driven; B2B with ~$250K annual revenue", "women_founder_focus": "no", "geographic_focus": "Nebraska", "how_to_approach": "Apply/contact via proven.ventures", "official_url": "https://www.proven.ventures", "status": "active (limited capital)", "caution": "Limited capital left in Fund One; founders buy back equity from revenue. Not for pre-revenue founders."},
    {"group": "1 Nebraska", "name": "LaunchLNK (LPED)", "type": "Grant", "hq": "Lincoln, NE", "stage": "Early stage", "typical_check_published": "$20,000 non-dilutive grant + ~$23K-$43K in services", "sectors_thesis": "Scalable startups growing in Lincoln", "women_founder_focus": "no", "geographic_focus": "Lincoln, NE (must be located in or have Lincoln presence)", "how_to_approach": "Annual application (Round 1 closed Oct 16, 2026 for 2027 cohort)", "official_url": "https://www.startuplnk.com/launch-lnk-grant", "status": "active", "caution": "6 recipients per year; 2027 cycle closed. Next window likely fall 2027 (not confirmed)."},
    {"group": "1 Nebraska", "name": "Omaha Capital", "type": "Private investment group", "hq": "Omaha, NE", "stage": "Early", "typical_check_published": "", "sectors_thesis": "Enterprise software, financial infrastructure, healthcare tech, industrial & logistics; sector-agnostic for exceptional founders", "women_founder_focus": "no", "geographic_focus": "Midwest and beyond", "how_to_approach": "Email hello@omahacapfund.com", "official_url": "https://omahacapfund.com", "status": "uncertain", "caution": "Site names no team, portfolio, or check size; could not verify who runs it. Treat as unverified until a warm contact confirms."},
    {"group": "2 Midwest", "name": "M25", "type": "VC fund", "hq": "Chicago, IL", "stage": "Pre-seed, Seed", "typical_check_published": "", "sectors_thesis": "Tech/tech-enabled, software emphasis; finance & insurance, supply chain & industrial, healthcare IT, horizontal SaaS", "women_founder_focus": "no", "geographic_focus": "Midwest-headquartered companies only (includes Omaha and Lincoln)", "how_to_approach": "'Pitch Us' form on site", "official_url": "https://m25vc.com", "status": "active", "caution": "Company must be HQ'd in their Midwest map. Also runs midweststartups.com rankings."},
    {"group": "2 Midwest", "name": "Revolution - Rise of the Rest Seed Fund", "type": "VC fund", "hq": "Washington, DC", "stage": "Seed", "typical_check_published": "Not published on site", "sectors_thesis": "Generalist; startups outside Silicon Valley, NY, Boston", "women_founder_focus": "no", "geographic_focus": "US outside SV/NYC/Boston", "how_to_approach": "Contact via revolution.com; warm intro typical", "official_url": "https://www.revolution.com/venture-capital", "status": "active", "caution": "Invests out of its second $150M fund (per third-party sources). Often co-invests with local leads."},
    {"group": "2 Midwest", "name": "Hyde Park Venture Partners", "type": "VC fund", "hq": "Chicago, IL", "stage": "Pre-seed to Series A (first or second institutional round)", "typical_check_published": "", "sectors_thesis": "AI-first applications, software, tech-enabled services; logistics/robotics in portfolio", "women_founder_focus": "no", "geographic_focus": "Midwest, Toronto, Southeast", "how_to_approach": "'Get in touch' contact page", "official_url": "https://hydeparkvp.com", "status": "active", "caution": "Invests from idea stage up to $2M revenue. Raised $98M fourth fund. Primary domain hydeparkvc.com failed; hydeparkvp.com worked."},
    {"group": "2 Midwest", "name": "Flyover Capital", "type": "VC fund", "hq": "Overland Park, KS / Kansas City, MO", "stage": "Seed (primary), selective Pre-seed", "typical_check_published": "Seed initial checks $1M-$3M; smaller pre-seed checks", "sectors_thesis": "AI in essential industries: healthcare, financial services & insurance, agriculture, logistics & supply chain, industrials, infrastructure", "women_founder_focus": "no", "geographic_focus": "Central US primarily", "how_to_approach": "'Submit your company' form on contact page", "official_url": "https://www.flyovercapital.com", "status": "active", "caution": "Wants evidence customers care (revenue, pilots, ROI) and founders close to the problem. Good thesis match for industry-insider founders."},
    {"group": "2 Midwest", "name": "Cultivation Capital", "type": "VC fund", "hq": "St. Louis, MO", "stage": "Series Seed to Series B", "typical_check_published": "$250K-$3.5M", "sectors_thesis": "Life sciences/health tech, software/IT, agtech; Midwest Seed Stage strategy: fintech, healthcare, agtech", "women_founder_focus": "no", "geographic_focus": "St. Louis / greater Midwest for seed strategy", "how_to_approach": "Contact via site", "official_url": "https://www.cultivationcapital.com", "status": "active", "caution": "Multiple strategy funds; confirm which fund is actively writing seed checks."},
    {"group": "2 Midwest", "name": "Lewis & Clark Ventures", "type": "VC fund", "hq": "St. Louis, MO", "stage": "Late seed to Series A", "typical_check_published": "$2M-$3M initial", "sectors_thesis": "B2B software", "women_founder_focus": "no", "geographic_focus": "Between the coasts", "how_to_approach": "Contact page", "official_url": "https://www.lewisandclarkventures.com", "status": "active", "caution": "Too late-stage for most pre-accelerator grads; a later-round target."},
    {"group": "3 Women", "name": "Golden Seeds", "type": "Angel group (with managed funds)", "hq": "New York, NY (9 chapters incl. Chicago)", "stage": "Early stage (first institutional round)", "typical_check_published": "Golden Seeds typically invests $125K-$350K in a first round; companies raising $250K-$2M, pre-money usually < $10M", "sectors_thesis": "B2B/B2C tech, health care, consumer", "women_founder_focus": "yes", "geographic_focus": "US-domiciled companies", "how_to_approach": "Apply via Dealum; free Info Sessions and Office Hours", "official_url": "https://www.goldenseeds.com", "status": "active", "caution": "Needs a woman in an operating C-suite role with fair equity; beta product and proof-of-concept revenue or pilots. Will NOT invest in companies using Reg CF or 506(c)."},
    {"group": "3 Women", "name": "Pipeline Angels", "type": "Angel group (training network)", "hq": "Newark, NJ (IFEL program)", "stage": "Pre-seed (friends-and-family round)", "typical_check_published": "Each cohort member invests at least $5,000; classes of 5-10 members; community may join syndicate", "sectors_thesis": "Social/environmental mission encouraged; sector-agnostic", "women_founder_focus": "partial (women and non-binary founders strongly encouraged)", "geographic_focus": "US companies", "how_to_approach": "Apply to Pitch Summit (virtual); spring 2027 summit Apr 17-18, 2027; interest form open, apps open January", "official_url": "https://www.pipelineangels.org", "status": "active", "caution": "Small checks; investors are angels-in-training. Fall 2026 apps closed."},
    {"group": "3 Women", "name": "Portfolia", "type": "VC platform (thematic funds, women investors)", "hq": "San Mateo, CA", "stage": "Seed to pre-IPO", "typical_check_published": "Not published on own site", "sectors_thesis": "Women's health; Rising America (US emerging markets); greentech", "women_founder_focus": "partial (backs female- and male-led teams; prefers gender-balanced)", "geographic_focus": "US C-corps", "how_to_approach": "Submit company form; monthly funding info session (2nd Thursdays)", "official_url": "https://www.portfolia.co", "status": "active", "caution": "Wants a solution in market and prefers a lead investor already secured."},
    {"group": "3 Women", "name": "BBG Ventures", "type": "VC fund", "hq": "New York, NY", "stage": "Pre-seed, Seed", "typical_check_published": "", "sectors_thesis": "Health, work, vertical AI, consumer, fintech, climate; founders with lived experience of the problem", "women_founder_focus": "partial (diverse founders; women-founder history)", "geographic_focus": "US", "how_to_approach": "'Pitch Us' Typeform on site", "official_url": "https://www.bbgventures.com", "status": "active", "caution": "Current site emphasizes 'diverse founders' rather than women-only."},
    {"group": "3 Women", "name": "Female Founders Fund", "type": "VC fund", "hq": "New York, NY", "stage": "Early stage", "typical_check_published": "", "sectors_thesis": "Digital health, AI-first vertical software, beauty, pet, deep tech (aerospace, robotics, materials)", "women_founder_focus": "yes", "geographic_focus": "US (no stated limit)", "how_to_approach": "No public pitch form found; warm intro", "official_url": "https://femalefoundersfund.com", "status": "uncertain", "caution": "Fortune (Oct 7, 2026) reports FFF changing strategy to get a bigger stake in AI - may shift away from first checks. Verify before outreach."},
    {"group": "3 Women", "name": "Women's Capital Connection (OneKC for Women)", "type": "Angel network / equity-capital connector", "hq": "Overland Park, KS", "stage": "Early stage", "typical_check_published": "", "sectors_thesis": "Women-led enterprises", "women_founder_focus": "yes", "geographic_focus": "Kansas City region", "how_to_approach": "Free consultation with equity-capital experts; email via site", "official_url": "https://womenscapitalconnection.com", "status": "uncertain", "caution": "Site now emphasizes consultations and introductions to other networks; unclear whether it still makes direct investments. KC-region focus."},
    {"group": "3 Women", "name": "IFundWomen", "type": "Grant + crowdfunding platform", "hq": "Pittsburgh, PA", "stage": "Any (small business / startup)", "typical_check_published": "Current grants $5,000 (Startup Accelerator Grant through Nov 30, 2026; Honeycomb grant through Jan 15, 2027)", "sectors_thesis": "Women-owned businesses; crowdfunding, coaching", "women_founder_focus": "yes", "geographic_focus": "US", "how_to_approach": "Apply online; crowdfunding campaign", "official_url": "https://www.ifundwomen.com", "status": "active", "caution": "Grant/crowdfunding, not equity VC. Small amounts."},
    {"group": "3 Women", "name": "Amber Grant (WomensNet)", "type": "Grant", "hq": "Penfield, NY", "stage": "Idea to growth", "typical_check_published": "$15,000 monthly grants (Amber, Startup, category); three $75,000 year-end grants", "sectors_thesis": "All women-owned businesses; Nov category = STEM", "women_founder_focus": "yes", "geographic_focus": "US (per program)", "how_to_approach": "One online application ($ fee not checked)", "official_url": "https://ambergrantsforwomen.com", "status": "active", "caution": "Grant; startup grant is for idea-phase or <$10K sales."},
    {"group": "3 Women", "name": "Cartier Women's Initiative", "type": "Grant / fellowship", "hq": "Geneva (global program)", "stage": "Revenue stage", "typical_check_published": "$100K / $60K / $30K grants for 1st/2nd/3rd per region", "sectors_thesis": "For-profit impact businesses (UN SDGs)", "women_founder_focus": "yes", "geographic_focus": "Global (North America region)", "how_to_approach": "Annual application; 2027 edition closed", "official_url": "https://www.cartierwomensinitiative.com", "status": "active", "caution": "Needs $50K-$5M revenue, 5-250 team members, <$2M dilutive funding raised; woman founder in lead role. Not for idea-stage."},
    {"group": "4 Industry", "name": "Ag Startup Engine", "type": "Angel/seed investment group (ag)", "hq": "Ames, IA (ISU Research Park)", "stage": "Pre-seed", "typical_check_published": "$25K-$100K", "sectors_thesis": "Agtech seed to consumption: animal health, robotics, precision ag, livestock automation, sustainability", "women_founder_focus": "no", "geographic_focus": "Midwest ag emphasis", "how_to_approach": "Monthly investor pitch meetings; email mikayla@agstartupengine.com", "official_url": "https://www.agstartupengine.com", "status": "active", "caution": "Fund 2 has ~2 years of deployment left, 12-15 more companies (per site; page date unclear)."},
    {"group": "4 Industry", "name": "Ag Ventures Alliance", "type": "Farmer-member investment cooperative / angel network (Countryside Angels)", "hq": "", "stage": "Pre-seed to Series C (application options)", "typical_check_published": "", "sectors_thesis": "Agtech; farm trials; first customers among 300+ farmer members", "women_founder_focus": "no", "geographic_focus": "US farm economy (Midwest)", "how_to_approach": "Direct investing application form on site", "official_url": "https://agventuresalliance.com", "status": "active", "caution": "Check size not published. Confirm the application form is current."},
    {"group": "4 Industry", "name": "Bread & Butter Ventures", "type": "VC fund", "hq": "Minneapolis, MN", "stage": "Seed", "typical_check_published": "Up to $1M initial into $1.5M-$3M rounds (Managing Partner LinkedIn, Aug 2025)", "sectors_thesis": "Food tech (no CPG), health tech/digital health (no FDA devices or pharma), enterprise tech/supply chain", "women_founder_focus": "no", "geographic_focus": "Invests globally; Minnesota corporate network", "how_to_approach": "Contact hello@breadandbutterventures.com", "official_url": "https://www.breadandbutterventures.com", "status": "active", "caution": "Investing from $40M Fund IV (closed Mar 2025)."},
    {"group": "4 Industry", "name": "Ironspring Ventures", "type": "VC fund", "hq": "Austin, TX", "stage": "Early stage", "typical_check_published": "", "sectors_thesis": "Industrial supply chain: manufacturing/automation, construction, transport & logistics, alternative energy", "women_founder_focus": "no", "geographic_focus": "US/Americas (not Midwest-specific)", "how_to_approach": "Deck submission form on Connect page", "official_url": "https://ironspring.com", "status": "active", "caution": "Strong match for manufacturing/logistics/rail founders; stage and check not published."},
    {"group": "4 Industry", "name": "HealthX Ventures", "type": "VC fund", "hq": "Madison, WI", "stage": "Seed", "typical_check_published": "", "sectors_thesis": "Digital health: access, efficiency, affordability; recurring revenue models", "women_founder_focus": "no", "geographic_focus": "US (Midwest base)", "how_to_approach": "Entrepreneurs page / submit startup", "official_url": "https://www.healthxventures.com", "status": "active", "caution": "Prefers founders with healthcare senior-management experience; leads priced equity rounds and usually takes a board seat."},
    {"group": "4 Industry", "name": "American Family Ventures", "type": "Corporate-origin VC (multi-LP)", "hq": "Madison, WI (offices Boston, Minneapolis, NY, Philadelphia)", "stage": "Incubation to growth", "typical_check_published": "First checks often $250K-$10M", "sectors_thesis": "Insurtech: all insurance lines, adjacent verticals, enabling tech", "women_founder_focus": "no", "geographic_focus": "US", "how_to_approach": "Contact page", "official_url": "https://www.amfamventures.com", "status": "active", "caution": "Best insurtech fit; checks skew larger than pre-seed."},
    {"group": "5 Family office", "name": "PGSA Venture Capital", "type": "Family-office-style real estate/investment firm with VC arm", "hq": "Omaha, NE", "stage": "Pre-seed, Seed, Series A (case by case)", "typical_check_published": "", "sectors_thesis": "Industry-agnostic; emerging sectors; Midwest-focused", "women_founder_focus": "no", "geographic_focus": "Midwest-focused, broader when aligned", "how_to_approach": "'Partner With Us' contact page; info@pgsa.com", "official_url": "https://pgsa.com/venture-capital/", "status": "active", "caution": "Not a self-described family office; a private investment firm with a venture arm. Wants post-prototype traction."},
    {"group": "5 Family office", "name": "Momentis Family Office", "type": "Single family office", "hq": "Omaha, NE", "stage": "Pre-seed/Seed deals recorded", "typical_check_published": "", "sectors_thesis": "Wealth mgmt/fintech & crypto, tech & AI, wellness, sports & entertainment, regenerative & real estate", "women_founder_focus": "no", "geographic_focus": "Not stated", "how_to_approach": "Email/form via site ('Connect with us')", "official_url": "https://momentisfamilyoffice.com", "status": "active", "caution": "Carson family office; invests in 'conscious leaders'. Has backed pre-seed and seed deals."},
    {"group": "5 Family office", "name": "Elkhorn Investments", "type": "Family-owned venture fund", "hq": "Omaha, NE", "stage": "Not stated", "typical_check_published": "", "sectors_thesis": "Industry-agnostic", "women_founder_focus": "no", "geographic_focus": "Not stated", "how_to_approach": "Contact page on site", "official_url": "https://www.elkhorninvestments.vc", "status": "uncertain", "caution": "Site copyright 2025; no stage/check or recent deals stated."},
    {"group": "5 Family office", "name": "Woodard Investments", "type": "Family office", "hq": "Chicago, IL", "stage": "Seed and Series A", "typical_check_published": "$50K-$250K", "sectors_thesis": "Applied AI (primary), healthcare, defense, AI infrastructure", "women_founder_focus": "no", "geographic_focus": "Not stated (Chicago-based)", "how_to_approach": "Submit deck on site; deals@woodardinvestments.com", "official_url": "https://woodardinvestments.com", "status": "active", "caution": "Recent deals 2025-2026."}
  ];

  // Prefer the investors-page.csv data block folded into the page; fall back to the list above.
  (function () {
    var blk = document.getElementById("investors-page");
    var txt = blk && blk.textContent ? blk.textContent.trim() : "";
    if (!txt) return;
    var rows = [], row = [], f = "", q = false, i, c;
    for (i = 0; i < txt.length; i++) {
      c = txt[i];
      if (q) {
        if (c === '"') { if (txt[i + 1] === '"') { f += '"'; i++; } else q = false; }
        else f += c;
      } else if (c === '"') q = true;
      else if (c === ",") { row.push(f); f = ""; }
      else if (c === "\n" || c === "\r") {
        if (c === "\r" && txt[i + 1] === "\n") i++;
        row.push(f); rows.push(row); row = []; f = "";
      } else f += c;
    }
    row.push(f); rows.push(row);
    var head = rows.shift();
    if (!head || head.indexOf("name") < 0) return;
    var list = rows.filter(function (r) { return r.length === head.length; }).map(function (r) {
      var o = {}; head.forEach(function (h, j) { o[h.trim()] = r[j]; }); return o;
    });
    if (list.length) INVESTORS = list;
  })();

  var $ = function (id) { return document.getElementById(id); };
  var e = function (x) { return String(x == null ? "" : x).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var check = $("check");
  var sw = check && check.querySelector(".x-fp-switch");
  if (!check || !sw) return;

  // Inputs
  var STAGES = [["idea", "Idea only"], ["talking", "Talking to customers"], ["proto", "Prototype or MVP"], ["paying", "Paying customers or pilots"]];
  var LEVEL = { idea: 0, talking: 1, proto: 2, paying: 3 };
  // [id, label, keywords in an investor's sectors/type/name, words that clearly name it in an idea's text]
  var SECTORS = [
    ["ag", "Ag and food", /\bag\b|agtech|agri|food|farm|livestock/, /\b(ag|agtech|agri\w*|farms?|farm(er|ers|ing)|crops?|livestock|food|grain|ranch\w*|harvest\w*)\b/],
    ["health", "Health", /health|medtech|medical|life science/, /\b(health\w*|medical|clinic\w*|hospital\w*|patients?|medtech|nurs(e|es|ing)|physicians?|pharma\w*)\b/],
    ["insurance", "Insurance", /insur/, /insur/],
    ["fintech", "Fintech", /fintech|financ|wealth/, /\b(fintech|banks?|banking|payments?|lending|loans?|financ\w*|accounting|invoic\w*)\b/],
    ["logistics", "Logistics and supply chain", /logistics|supply chain|transport/, /\b(logistics|supply chains?|freight|shipping|shipments?|rail\w*|warehous\w*|trucks?|trucking|fleets?|deliver(y|ies)|dispatch\w*)\b/],
    ["industrial", "Manufacturing and industrial", /manufactur|industrial|robotics|construction|energy/, /\b(manufactur\w*|industrial|factor(y|ies)|robot\w*|construction|machin(e|es|ery))\b/],
    ["b2b", "B2B software and AI", /software|saas|\bai\b|enterprise (software|tech)|b2b/, /\b(software|saas|ai|b2b|enterprise|automat\w*)\b/],
    ["consumer", "Consumer", /consumer|beauty|\bpet\b|wellness|b2c/, /\b(consumers?|shoppers?|households?|b2c|retail)\b/],
    ["other", "Other", null, null]
  ];
  var FLAGS = [["ne", "Based in Nebraska"], ["women", "At least 50% women-owned"], ["grants", "Open to grants"], ["regcf", "Considering crowdfunding (Reg CF)"]];
  var sectorLabel = function (id) { return SECTORS.filter(function (x) { return x[0] === id; })[0][1]; };

  // State
  var KEY = "nsinv-v1";
  var blank = function () { return { stage: "idea", sectors: [], ne: false, women: false, grants: false, regcf: false, shown: false }; };
  var st = blank();
  try { var sv = JSON.parse(localStorage.getItem(KEY)); if (sv && sv.sectors) st = Object.assign(blank(), sv); } catch (x) {}
  var save = function () { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (x) {} };

  // Rules, one per question. Each investor row gets read once, here.
  var isGrant = function (r) { return /grant/i.test(r.type); };
  var neOnly = function (r) { return /^(nebraska|lincoln)/i.test(r.geographic_focus) || /\bUNO\b/.test(r.name); };
  var unoOnly = function (r) { return /\bUNO\b/.test(r.name); };
  var agnostic = function (r) { return /agnostic|any sector|generalist|women-led|women-owned businesses/i.test(r.sectors_thesis); };
  // Readiness a row asks for: 0 idea, 1 talking to customers, 2 prototype, 3 paying customers or pilots.
  var need = function (r) {
    var s = (r.stage + " " + r.caution).toLowerCase();
    if (/from idea stage|idea-phase|idea to growth|^any\b/.test(s)) return 0;
    if (/not for idea-stage|revenue stage|established revenue|recurring revenue|product-market fit|\bpmf\b|mvp in market|post-mvp|beyond mvp|post-prototype|solution in market|pilots|traction|too late-stage|late seed/.test(s)) return 3;
    if (/pre-revenue/.test(s)) return 0;
    if (/pre-seed/.test(s)) return 1;
    if (/^seed|series/.test(s)) return 2;
    return 1;
  };
  var NEED = ["", "customer conversations", "a prototype or MVP", "paying customers or pilots"];

  var score = function (r) {
    var hay = (r.sectors_thesis + " " + r.type + " " + r.name).toLowerCase();
    var hits = st.sectors.filter(function (id) { var x = SECTORS.filter(function (s) { return s[0] === id; })[0]; return x && x[2] && x[2].test(hay); });
    // Sector match 3 each, industry-agnostic 1, unverified status ranks 2 lower.
    var open = agnostic(r), sc = hits.length * 3 + (open ? 1 : 0) - (r.status === "uncertain" ? 2 : 0);
    var why = [];
    if (hits.length) why.push("Invests in " + hits.map(sectorLabel).join(", ").replace(/^./, function (c) { return c.toLowerCase(); }));
    else if (open) why.push("Open to any sector");
    if (st.women && r.women_founder_focus === "yes") { sc += 3; why.push("Women-founder focus"); }
    else if (st.women && /^partial/.test(r.women_founder_focus)) { sc += 1; why.push("Partly women-founder focused"); }
    if (st.ne && neOnly(r)) { sc += 1; why.push("Nebraska founders only"); }
    return { r: r, hits: hits, open: open, sc: sc, why: why.join(" · "), need: need(r) };
  };

  var results = function () {
    var lv = LEVEL[st.stage] || 0;
    var picked = st.sectors.length > 0; // "Other" alone leaves the industry-agnostic investors
    var out = { aqi: null, now: [], later: [], grants: [], nowAll: 0, laterAll: 0 };
    INVESTORS.forEach(function (r) {
      var m = score(r);
      if (st.regcf && /reg cf/i.test(r.type)) { out.aqi = m; return; }
      if (neOnly(r) && !st.ne) return;
      if (r.women_founder_focus === "yes" && !st.women) return;
      if (isGrant(r)) { if (st.grants) out.grants.push(m); return; }
      if (picked && !m.hits.length && !m.open) return;
      (m.need > lv ? out.later : out.now).push(m);
    });
    var by = function (a, b) { return b.sc - a.sc || a.need - b.need; };
    out.now.sort(by); out.later.sort(by); out.grants.sort(by);
    out.nowAll = out.now.length; out.laterAll = out.later.length;
    out.now = out.now.slice(0, 6); out.later = out.later.slice(0, 6);
    return out;
  };

  // Markup
  var card = function (m, extra) {
    var r = m.r, tags = [];
    if (extra && extra.tag) tags.push('<span class="chip chip--solid">' + e(extra.tag) + "</span>");
    if (r.status === "uncertain") tags.push('<span class="chip">Status uncertain</span>');
    if (unoOnly(r)) tags.push('<span class="chip">UNO students and alumni only</span>');
    if (m.need > (LEVEL[st.stage] || 0)) tags.push('<span class="chip">Needs ' + e(NEED[m.need]) + "</span>");
    var warn = st.regcf && /golden seeds/i.test(r.name) ? '<p class="x-inv-warn"><strong>Reg CF:</strong> Golden Seeds doesn\'t invest in companies that raised through Reg CF.</p>' : "";
    return '<div class="' + (extra && extra.hi ? "x-inv-hi" : "") + '">' +
      (tags.length ? '<p class="x-inv-tags">' + tags.join("") + "</p>" : "") +
      "<h3>" + e(r.name) + "</h3>" +
      '<p class="x-inv-meta">' + e(r.type) + (r.hq ? " · " + e(r.hq) : "") + "</p>" + warn +
      "<ul>" +
      "<li><small>Why it's here</small>" + e(m.why || "Possible fit") + "</li>" +
      "<li><small>Stage</small>" + e(r.stage) + "</li>" +
      "<li><small>Check size</small>" + e(r.typical_check_published || "Check size not published") + "</li>" +
      "<li><small>Caution</small>" + e(r.caution) + "</li>" +
      "<li><small>How to approach</small>" + e(r.how_to_approach) + "</li>" +
      "</ul>" +
      '<p class="x-inv-go"><a class="link" href="' + e(r.official_url) + '" target="_blank" rel="noopener">Visit site</a></p>' +
      "</div>";
  };
  var group = function (title, sub, list, extra) {
    return '<div class="x-inv-group"><h3>' + e(title) + '</h3><p class="x-hint">' + e(sub) + '</p><div class="cards x-inv-res">' + list.map(function (m) { return card(m, extra); }).join("") + "</div></div>";
  };

  var resultsHTML = function () {
    var o = results();
    var any = o.aqi || o.now.length || o.later.length || o.grants.length;
    var h = "";
    if (!any) return h + '<p class="x-inv-empty">No close match yet. Widen sectors, or come back after your next milestone.</p>';
    if (o.aqi) h += '<div class="x-inv-group"><h3>Crowdfunding (Reg CF)</h3><p class="x-hint">A Reg CF raise can close off some angels. Read the caution first.</p><div class="cards x-inv-res">' + card(o.aqi, { hi: true, tag: "Reg CF portal" }) + "</div></div>";
    if (o.now.length) h += group("Fits now", (o.nowAll > 6 ? "Top 6 of " + o.nowAll : o.nowAll + (o.nowAll === 1 ? " match" : " matches")) + " at your stage, best fit first.", o.now);
    if (o.later.length) h += group("Later, once you have traction", (o.laterAll > 6 ? "Top 6 of " + o.laterAll : o.laterAll + (o.laterAll === 1 ? " match" : " matches")) + ". They want more evidence than you have today.", o.later);
    if (o.grants.length) h += group("Grants", "Non-dilutive. Check each window and who qualifies.", o.grants);
    h += '<div class="prose x-inv-next"><p><strong>Next step:</strong> pick two, read their portfolio, and look for a warm intro through someone they\'ve backed. Most of these want customer evidence first. Night Shift\'s milestones are built to earn it.</p></div>';
    h += '<p class="x-hint">Checked November 17, 2026.</p>';
    return h;
  };

  var pill = function (type, name, val, label, on) {
    return '<label><input type="' + type + '" name="' + name + '" value="' + val + '"' + (on ? " checked" : "") + " />" + e(label) + "</label>";
  };
  // Stage follow-up questions. Optional; never gate "Show matches". Answers kept per stage.
  var CH = ["My network", "Industry associations or events", "Online communities", "Direct outreach (email, LinkedIn, calls)", "Partners or resellers", "Content or search", "Not sure yet"];
  var T = function (id, q) { return { id: id, t: "text", q: q }; };
  var ONE = function (id, q, o) { return { id: id, t: "one", q: q, o: o }; };
  var ANY = function (id, q, o) { return { id: id, t: "any", q: q, o: o }; };
  var QS = {
    idea: [
      T("q1", "In one sentence: who has the problem, and what does it cost them today (time, money, risk)?"),
      ONE("q2", "How do you know?", ["Lived it at work", "See it every week", "Heard it from 5+ people", "Hunch"]),
      T("q3", "What do people use or pay for now instead?"),
      ANY("q4", "How will you reach your first 10 customers?", CH),
      T("q4b", "Where do they already gather?"),
      ONE("q5", "Hours a week you can give it over the next 3 months", ["Under 5", "5–10", "10–20", "20+"])
    ],
    talking: [
      ONE("q1", "How many target customers have you interviewed?", ["0–5", "6–15", "16–30", "30+"]),
      T("q2", "Who buys it, and who uses it? (job title, type of organization)"),
      T("q3", "How many asked for a trial, joined a waitlist, signed a letter of intent or offered to pay?"),
      ANY("q4", "How did you find the people you talked to?", CH),
      T("q4b", "Which of these could bring in customers at scale, and why?"),
      T("q5", "Your strongest customer quote or finding, in one sentence.")
    ],
    proto: [
      ONE("q1", "Who built it?", ["Me", "A cofounder", "A contractor", "No-code tools"]),
      T("q2", "How many people use it, and how often?"),
      ONE("q3", "Best signal so far", ["Repeat use", "Referrals", "A pilot request or letter of intent", "Someone agreed to a price"]),
      ANY("q4", "Where did your users come from?", CH),
      T("q4b", "Roughly what does it cost to get one user, in time or dollars?"),
      T("q5", "What will it take to land the first paying customer, in dollars and months?")
    ],
    paying: [
      T("q1", "Monthly revenue or pilot value now, and 3 months ago."),
      T("q2", "Paying customers, largest contract, and typical sales cycle."),
      ONE("q3", "Which channel has won you the most customers?", CH.slice(0, 6)),
      ONE("q3b", "How do you sell?", ["Self-serve", "Sales-led", "Partner-led"]),
      T("q3c", "What does it cost to win a customer, compared with what they pay in year one?"),
      T("q4", "Raised so far, how much you're raising now, and the milestone it buys."),
      T("q5", "How many founders, and who's full-time?")
    ]
  };
  var STATUS = ONE("status", "Company status", ["Not formed yet", "LLC", "C-corp", "Other"]);
  var QKEY = "nsinvq-v1";
  var qblank = function () { return { a: { idea: {}, talking: {}, proto: {}, paying: {} }, status: "", share: false, name: "", email: "" }; };
  var qa = qblank();
  try { var qsv = JSON.parse(localStorage.getItem(QKEY)); if (qsv && qsv.a) { qa = Object.assign(qblank(), qsv); qa.a = Object.assign(qblank().a, qsv.a); } } catch (x) {}
  var qsave = function () { try { localStorage.setItem(QKEY, JSON.stringify(qa)); } catch (x) {} };
  var qval = function (stage, q) { return q.id === "status" ? qa.status : (qa.a[stage] || {})[q.id]; };
  var qtext = function (v) { return Array.isArray(v) ? v.join(", ") : String(v || "").trim(); };

  var qField = function (stage, q) {
    var v = qval(stage, q), nm = "invq-" + stage + "-" + q.id;
    if (q.t === "text") {
      return '<div class="x-field"><label for="' + nm + '">' + e(q.q) + '</label><textarea class="x-in" rows="2" id="' + nm + '" name="' + nm + '" data-q="' + q.id + '">' + e(v || "") + "</textarea></div>";
    }
    var many = q.t === "any", on = many ? (Array.isArray(v) ? v : []) : [v];
    return '<fieldset class="x-inv-opts"><legend>' + e(q.q) + (many ? ' <span class="x-hint">(pick any)</span>' : "") + "</legend>" +
      q.o.map(function (o) { return '<label><input type="' + (many ? "checkbox" : "radio") + '" name="' + nm + '" data-q="' + q.id + '" value="' + e(o) + '"' + (on.indexOf(o) > -1 ? " checked" : "") + " />" + e(o) + "</label>"; }).join("") +
      "</fieldset>";
  };
  var moreHTML = function () {
    var s = st.stage;
    return '<h3>Tell investors more (optional)</h3>' +
      (QS[s] || []).map(function (q) { return qField(s, q); }).join("");
  };
  var shareHTML = function () {
    return qField(st.stage, STATUS) +
      '<label class="x-inv-share"><input type="checkbox" name="invq-share"' + (qa.share ? " checked" : "") + " />Share my answers with Night Shift's investor partners</label>" +
      '<div class="x-inv-sharef" id="inv-sharef"' + (qa.share ? "" : " hidden") + ">" +
      '<div class="x-inv-who">' +
      '<div class="x-field"><label for="invq-name">Name</label><input class="x-in" type="text" id="invq-name" name="invq-name" autocomplete="name" value="' + e(qa.name) + '" /></div>' +
      '<div class="x-field"><label for="invq-email">Email</label><input class="x-in" type="email" id="invq-email" name="invq-email" autocomplete="email" value="' + e(qa.email) + '" /></div>' +
      "</div>" +
      '<div class="links x-noprint"><a class="btn" id="inv-send" href="mailto:?subject=Night%20Shift%3A%20Investor%20scouting">Send by email</a></div>' +
      '<p class="fineprint">Send by email opens your email app with your answers.</p>' +
      "</div>";
  };
  var compose = function () {
    var send = $("inv-send"); if (!send) return;
    var stageName = STAGES.filter(function (x) { return x[0] === st.stage; })[0];
    var flags = FLAGS.filter(function (f) { return st[f[0]]; }).map(function (f) { return f[1]; });
    var lines = [
      "Stage: " + (stageName ? stageName[1] : ""),
      "Sector: " + (st.sectors.map(sectorLabel).join(", ") || "None picked"),
      "About you: " + (flags.join(", ") || "None picked"),
      ""
    ];
    (QS[st.stage] || []).concat([STATUS]).forEach(function (q) {
      var v = qtext(qval(st.stage, q));
      if (v) lines.push(q.q, v, "");
    });
    lines.push("Name: " + qa.name, "Email: " + qa.email);
    send.href = "mailto:?subject=" + encodeURIComponent("Night Shift: Investor scouting") + "&body=" + encodeURIComponent(lines.join("\n"));
  };
  var renderMore = function () {
    var m = $("inv-more"); if (!m) return;
    m.innerHTML = moreHTML(); compose();
  };
  var onQ = function (i) {
    var n = i.name;
    if (n === "invq-share") { qa.share = i.checked; var f = $("inv-sharef"); if (f) f.hidden = !i.checked; }
    else if (n === "invq-name") qa.name = i.value;
    else if (n === "invq-email") qa.email = i.value;
    else {
      var id = i.getAttribute("data-q"), s = st.stage;
      if (!id) return;
      if (id === "status") qa.status = i.value;
      else {
        var box = qa.a[s] || (qa.a[s] = {});
        if (i.type === "checkbox") box[id] = [].slice.call(panel.querySelectorAll('input[name="' + n + '"]:checked')).map(function (x) { return x.value; });
        else box[id] = i.value;
      }
    }
    qsave(); compose();
  };

  var formBody = function () {
    return '<div class="x-form x-inv-form">' +
      '<fieldset class="x-inv-opts"><legend>Stage</legend>' + STAGES.map(function (s) { return pill("radio", "inv-stage", s[0], s[1], st.stage === s[0]); }).join("") + "</fieldset>" +
      '<div class="x-inv-q" id="inv-more" aria-live="polite">' + moreHTML() + "</div>" +
      '<fieldset class="x-inv-opts"><legend>Sector, pick any</legend>' + SECTORS.map(function (s) { return pill("checkbox", "inv-sector", s[0], s[1], st.sectors.indexOf(s[0]) > -1); }).join("") + "</fieldset>" +
      '<fieldset class="x-inv-opts"><legend>About you</legend>' + FLAGS.map(function (f) { return pill("checkbox", "inv-flag", f[0], f[1], st[f[0]]); }).join("") + "</fieldset>" +
      shareHTML() +
      '<div class="links x-noprint"><button type="button" class="x-cta x-inv-show" id="inv-show">Show matches</button></div>' +
      "</div>";
  };
  var formHTML = function () {
    return '<div class="head"><p class="head__eyebrow">Find investors</p><h2>Who might fund this, and when?</h2></div>' +
      formBody() +
      '<div class="x-inv-out" id="inv-out" aria-live="polite"></div>' +
      '<p class="fineprint">Public info checked November 17, 2026. Check sizes and criteria change. Confirm on each investor\'s site. Not financial or legal advice.</p>';
  };

  // Build the mode: switch option, intro line, panel.
  var btn = $("x-mode-inv") || sw.querySelector('[data-mode="investors"]');
  if (!btn) {
    btn = document.createElement("button");
    btn.type = "button"; btn.id = "x-mode-inv"; btn.setAttribute("aria-pressed", "false"); btn.textContent = "Find investors";
    sw.appendChild(btn);
  }
  var ic = check.querySelector(".x-ic");
  if (ic && !ic.querySelector('[data-fp-mode="investors"]')) {
    var intro = document.createElement("div");
    intro.className = "x-fp-only x-inv-only"; intro.setAttribute("data-fp-mode", "investors"); intro.hidden = true;
    intro.innerHTML = "<p>Who might fund this, and when? A starting list of Nebraska, Midwest and women-focused investors, family offices and grants.</p>";
    ic.appendChild(intro);
  }
  var panel = $("inv-panel");
  if (panel && $("inv-out")) {
    $("inv-out").insertAdjacentHTML("beforebegin", formBody());
  } else {
    if (panel) panel.parentNode.removeChild(panel);
    panel = document.createElement("div");
    panel.className = "x-inv-only x-inv"; panel.setAttribute("data-fp-mode", "investors"); panel.hidden = true; panel.id = "inv-panel";
    panel.innerHTML = formHTML();
    check.appendChild(panel);
  }
  var out = $("inv-out");
  compose();

  var paint = function () { out.innerHTML = st.shown ? resultsHTML() : ""; };
  var sync = function () {
    [].slice.call(panel.querySelectorAll("input")).forEach(function (i) {
      if (i.name.indexOf("invq") === 0) return;
      if (i.name === "inv-stage") i.checked = st.stage === i.value;
      else if (i.name === "inv-sector") i.checked = st.sectors.indexOf(i.value) > -1;
      else i.checked = !!st[i.value];
    });
  };
  var setMode = function () {
    [].slice.call(check.querySelectorAll("[data-fp-mode]")).forEach(function (el) { el.hidden = el.getAttribute("data-fp-mode") !== "investors"; });
    [].slice.call(sw.querySelectorAll("button")).forEach(function (b) { b.setAttribute("aria-pressed", b === btn ? "true" : "false"); });
    sync(); paint();
  };
  var show = function () { st.shown = true; save(); paint(); out.scrollIntoView({ behavior: "smooth", block: "start" }); };

  // The other two options run their own switch; keep this one in step with them.
  sw.addEventListener("click", function (ev) {
    var b = ev.target.closest("button"); if (!b) return;
    if (b === btn) setMode();
    else btn.setAttribute("aria-pressed", "false");
  });
  panel.addEventListener("change", function (ev) {
    var i = ev.target; if (!i.name) return;
    if (i.name.indexOf("invq") === 0) { onQ(i); return; }
    if (i.name === "inv-stage") { st.stage = i.value; renderMore(); }
    else if (i.name === "inv-sector") st.sectors = i.checked ? st.sectors.filter(function (s) { return s !== i.value; }).concat([i.value]) : st.sectors.filter(function (s) { return s !== i.value; });
    else st[i.value] = i.checked;
    save(); paint(); compose();
  });
  panel.addEventListener("input", function (ev) {
    var i = ev.target;
    if (i.name && i.name.indexOf("invq") === 0 && (i.tagName === "TEXTAREA" || i.type === "text" || i.type === "email")) onQ(i);
  });
  panel.addEventListener("click", function (ev) {
    var b = ev.target.closest("button"); if (!b) return;
    if (b.id === "inv-show") show();
  });

  // From an idea: pick the sectors its words clearly name, then switch here.
  var sectorsIn = function (txt) {
    txt = String(txt || "").toLowerCase();
    return SECTORS.filter(function (s) { return s[3] && s[3].test(txt); }).map(function (s) { return s[0]; });
  };
  var fromIdea = function (txt) {
    var found = sectorsIn(txt);
    if (found.length) { st.sectors = found; st.shown = true; save(); }
    setMode();
  };
  var CTA = "Find investors for this idea";
  var addToFind = function () {
    var fs = $("fp-stage"); if (!fs) return;
    [].slice.call(fs.querySelectorAll("[data-fp-check]")).forEach(function (b) {
      if (b.nextElementSibling && b.nextElementSibling.hasAttribute("data-inv-idea")) return;
      var x = document.createElement("button");
      x.type = "button"; x.className = "btn"; x.setAttribute("data-inv-idea", "find"); x.textContent = CTA;
      b.insertAdjacentElement("afterend", x);
    });
  };
  var addToCheck = function () {
    var cs = $("stage"); if (!cs) return;
    var v = cs.querySelector('.callout[aria-label="Verdict"]');
    if (!v || v.querySelector("[data-inv-idea]")) return;
    var x = document.createElement("button");
    x.type = "button"; x.className = "btn"; x.setAttribute("data-inv-idea", "check"); x.textContent = CTA;
    var row = v.querySelector(".links");
    if (row) row.appendChild(x); else v.appendChild(x);
  };
  var checkText = function () {
    var a = null;
    try { a = (JSON.parse(localStorage.getItem("nsic-v1")) || {}).a; } catch (x) {}
    if (!a && window.__nsic && window.__nsic.s) a = window.__nsic.s.a;
    return a ? Object.keys(a).map(function (k) { return a[k]; }).join(" ") : "";
  };
  check.addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-inv-idea]"); if (!b) return;
    if (b.getAttribute("data-inv-idea") === "find") {
      var c = b.parentNode, h = c.querySelector("h3"), ul = c.querySelector("ul");
      fromIdea((h ? h.textContent : "") + " " + (ul ? ul.textContent : ""));
    } else fromIdea(checkText());
  });
  ["fp-stage", "stage"].forEach(function (id) {
    var el = $(id); if (!el || !window.MutationObserver) return;
    new MutationObserver(function () { addToFind(); addToCheck(); }).observe(el, { childList: true });
  });
  addToFind(); addToCheck();
})();
