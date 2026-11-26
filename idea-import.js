/* Idea Check: "Describe your idea" and "Upload a pitch deck".
   Files are read with pdf.js (PDF), JSZip (PPTX) or as plain text (TXT/MD).
   Each slide or paragraph is sorted into an area by the keyword rules below,
   and the matching Idea Check fields are prefilled only where they are still empty. */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var e = function (x) { return String(x == null ? "" : x).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  if (window.pdfjsLib) { try { window.pdfjsLib.GlobalWorkerOptions.workerSrc = "pdf.worker.min.js"; } catch (x) {} }

  var MAX = 25 * 1024 * 1024;
  var MIN_PDF_TEXT = 150;
  var MSG_IMAGES = "This deck is saved as images, so there's no text to read. Paste the key slides into Describe your idea instead.";
  var MSG_FAIL = "Couldn't read this file. Paste the text instead.";

  // ---- Keyword rules. Tune here: [key, label, pattern]. A slide goes to the area(s) it matches most; its title counts 3x.
  var AREAS = [
    ["problem", "Problem", /\b(problems?|pain|pains|painful|today|struggles?|struggling|waste[sd]?|wasting|hours|spend|spends|costly|costs?|manual|manually|paper|slow|frustrat\w*|hard|lose|loses|miss|misses|stuck)\b/g],
    ["solution", "Solution", /\b(solutions?|product|how it works|features?|app|platform|tool|software|service|marketplace|helps|lets|automates?)\b/g],
    ["whynow", "Why now", /\b(why now|changed?|changes|trends?)\b/g],
    ["market", "Market", /\b(markets?|tam|sam|som|billion|customers|businesses|companies|agencies|clinics|schools|teams|for (?:small|rural|local|mid-?size)\b)\b/g],
    ["competition", "Competition", /\b(competition|competitors?|competitive|alternatives?|vs|versus)\b/g],
    ["model", "Business model", /\b(business model|pricing|revenue|subscriptions?)\b|\$\s?[\d,.]+\s*[kKmM]?\s*(\/|per\b)/g],
    ["traction", "Traction", /\b(traction|users|customers|mrr|arr|pilots?|growth)\b/g],
    ["team", "Team", /\b(team|founders?|co-?founders?|ceo|cto|coo|experience|years)\b/g],
    ["gtm", "Go-to-market", /\b(go-to-market|go to market|gtm|sales|channels?|distribution)\b/g],
    ["ask", "The ask", /\b(the ask|our ask|ask|raising|round|use of funds)\b/g]
  ];
  // Signals inside an area, used for the Idea Check selects.
  var BIG_MARKET = /\b(billion|tam)\b|\$\s?\d+(\.\d+)?\s?(b|bn)\b/i;
  var GROWING = /\b(growing|growth|cagr|fast[- ]growing)\b/i;
  var INSIGHT = /\b(unlike|only|different|differentiat\w*|advantage|better|faster|cheaper)\b/i;
  var BUILDER = /\b(cto|engineers?|engineering|developers?|technical|built|phd)\b/i;
  var SELLER = /\b(ceo|sales|business development|commercial|marketing|coo|operator)\b/i;
  var INSIDE = /\b\d+\+?\s*(years|yrs)\b|\bformer\b|\bex-/i;
  var ADJACENT = /\b(experience|worked|background)\b/i;
  var PRICE = /\$\s?([\d,]+(?:\.\d+)?)\s*([kK])?\s*(?:\/|per|a|an)\s*(year|yr|annum|month|mo)\b/;

  var clean = function (x) { return String(x || "").replace(/\s+/g, " ").trim(); };
  var count = function (re, txt) { re.lastIndex = 0; var m = txt.match(re); return m ? m.length : 0; };
  var words = function (x) { return clean(x).split(" ").filter(Boolean).length; };

  // ---- Common English and pitch words. Used to tell readable text from garbled text,
  // and to reject generic words as company names.
  var VOCAB = {};
  ("a about above across after again against all almost also always am among an and another any are around as at away back be because been before being below best better between big both but by can could day days do does done down during each early easy even every few first for from get gets give go good great had has have he her here him his how i if in into is it its just keep know large last less like little live local long look lot made make makes making many may me more most much must my need never new next no not now of off on once one only or other our out over own part people per place price rather real right same see should since small so some still such take than that the their them then there these they thing things think this those through time times to too top two under up us use used uses very want was way we well were what when where which while who why will with without work works would year years yet you your " +
   "able access account across add ads affordable analytics answer app apps approach area ask average based benefits billion book booking brand build built business businesses buy can't care cash check city clicks close co cost costs customer customers daily data deal deals demo design development device different digital direct discovery don't easier ease email employee employees engineering event events expensive experience fees financial financing find founder founders free fund funding growth guest guests help helps high hire home host hosts hotel hotels housing hr identity idea important income incentive industry information initial internet investment investor investors it's launch launched list listing listings low management manager market marketing markets meets million model money month monthly months network offline online opportunity order paid partner partners partnerships pay payment payroll plan platform post press pricing problem product products profile profiles projected rate reach rent rental research revenue room rooms round run sale sales save search service services share sharing simple site social software solution source space standard start started startup strategy support system systems target team tech technology temporary testimonials today tool tools total traction transaction transactions travel travelers trip trips user users value via web website week weekly world worldwide").split(" ").forEach(function (w) { VOCAB[w] = 1; });
  var tokenWord = function (t) { return t.toLowerCase().replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, "").replace(/[’]/g, "'"); };
  // Readability score: recognised words and plausible tokens count up, odd characters count down.
  var ODD = /[\u0000-\u0008\u000b-\u001f`\\^{}|~@<>\[\]\ufffd\ue000-\uf8ff]/g;
  var score = function (s) {
    var toks = clean(s).split(" ").filter(Boolean), good = 0, ok = 0;
    toks.forEach(function (t) {
      if (VOCAB[tokenWord(t)]) good++;
      else if (/^[“"(']?([A-Za-z][a-z'’]*|[A-Z]+|[A-Z][a-z]+[A-Z][a-z]+|\$?\d[\d,.]*[%kKmMbB+]?)[”".,;:!?)']*$/.test(t)) ok++;
    });
    return 3 * good + ok - 3 * count(ODD, String(s));
  };
  var goodWords = function (s) { return clean(s).split(" ").filter(function (t) { return VOCAB[tokenWord(t)]; }).length; };
  // A line that still reads as junk after any repair.
  var garbled = function (s) {
    s = String(s || "");
    if (/[\ue000-\uf8ff]/.test(s)) return true;
    var odd = count(ODD, s), n = s.replace(/\s/g, "").length;
    return !n || (odd >= 1 && odd / n > 0.06) || score(s) < 0 || !/[A-Za-z0-9]/.test(s);
  };

  // ---- Fonts without a ToUnicode map: pdf.js hands back every character shifted by a constant.
  // Try each shift and keep the one that reads as the most English.
  var shiftStr = function (s, k) {
    var out = "";
    for (var i = 0; i < s.length; i++) {
      var c = s.charCodeAt(i);
      if (c === 32 || c >= 128) { out += s[i]; continue; }
      var d = c + k;
      out += d >= 32 && d <= 126 ? String.fromCharCode(d) : "\ufffd";
    }
    return out;
  };
  // Non-ASCII glyphs left in shifted text are ligatures, dashes, quotes or bullets. For each one,
  // pick the reading that turns the most of its words into known words across the deck.
  var GLYPHS = ["", "fi", "fl", "ff", "-", "'"];
  var glyphMap = function (txt) {
    var map = {}, toks = txt.split(/\s+/);
    (txt.match(/[\u0080-\u00ff]/g) || []).forEach(function (ch) {
      if (map[ch] != null) return;
      var best = "", top = -1;
      GLYPHS.forEach(function (g) {
        var n = 0;
        toks.forEach(function (t) {
          if (t.indexOf(ch) < 0) return;
          t.split(ch).join(g).split(/[-']/).forEach(function (w) { if (VOCAB[tokenWord(w)]) n++; });
        });
        if (n > top) { top = n; best = g; }
      });
      map[ch] = best;
    });
    return map;
  };
  var applyGlyphs = function (s, map) { return s.replace(/[\u0080-\u00ff]/g, function (ch) { return map[ch] != null ? map[ch] : ch; }); };
  var bestShift = function (txt, only) {
    var base = score(txt), best = 0, top = base, ks = only;
    if (!ks) { ks = []; for (var k = -30; k <= 30; k++) if (k) ks.push(k); }
    ks.forEach(function (k) {
      var t = shiftStr(txt, k), sc = score(t);
      if (sc > top && goodWords(t) >= 2) { top = sc; best = k; }
    });
    return top >= base + 3 ? best : 0;
  };

  // ---- Contact boilerplate and repeated headers/footers never reach a field.
  var EMAIL = /[\w.+-]+@[\w-]+(\.[\w-]+)+/g;
  var PHONE = /(\+?\d{1,2}[\s.-]?)?\(\d{3}\)\s?\d{3}[\s.-]?\d{4}\b|\b\d{3}[.-]\d{3}[.-]\d{4}\b/g;
  var WWW = /\b(?:https?:\/\/|www\.)\S+/gi;
  var ADDRESS = /\b\d{1,5}\s+(?:[\w.'’-]+\s+){0,4}(?:street|st|avenue|ave|road|rd|boulevard|blvd|lane|ln|drive|dr|way|place|pl|suite|ste|floor|fl)\b\.?(?:,?\s*(?:ste|suite|#|unit|floor|fl)\.?\s*[\w-]+)?/gi;
  var ZIP = /,\s*[a-z]{2}\.?\s+\d{5}(?:-\d{4})?\b/gi;
  var BARE_URL = /^(?:(?:https?:\/\/)?(?:www\.)?[\w-]+(?:\.[\w-]+)*\.(?:com|org|net|io|co|ai|app|me|us|uk|de|tv|ly)(?:\/\S*)?[\s,;|·•]*)+$/i;
  var PAGE_NO = /^(?:page|slide|p\.?)?\s*\d{1,3}(?:\s*(?:\/|of)\s*\d{1,3})?$/i;
  var LEGAL = /^(?:confidential|strictly confidential|draft|private (?:and|&) confidential|for discussion only|all rights reserved)\b|©|\bcopyright\b|\bconfidential(?:ity)?\b(?=.{0,40}$)/i;
  var boiler = function (l) {
    if (PAGE_NO.test(l) || BARE_URL.test(l)) return true;
    if (LEGAL.test(l) && words(l) <= 8) return true;
    var hit = 0, rest = l.replace(EMAIL, function () { hit++; return " "; }).replace(PHONE, function () { hit++; return " "; })
      .replace(WWW, function () { hit++; return " "; }).replace(ADDRESS, function () { hit++; return " "; }).replace(ZIP, function () { hit++; return " "; });
    return hit > 0 && words(rest.replace(/[^\w\s]/g, " ")) <= 4;
  };
  // Emails and phone numbers inside a longer line are cut out of it.
  var scrub = function (l) { return clean(l.replace(EMAIL, " ").replace(PHONE, " ")).replace(/\s+([,.;:])/g, "$1"); };
  // Domains named in the deck, most used first, weighting the deck's own email addresses.
  var domains = function (lines) {
    var n = {};
    lines.forEach(function (l) {
      (l.match(/@([\w-]+)\.[a-z.]+/gi) || []).forEach(function (m) { var d = m.slice(1).split(".")[0].toLowerCase(); n[d] = (n[d] || 0) + 3; });
      (l.match(/(?:^|[\s(])(?:https?:\/\/)?(?:www\.)?([\w-]+)\.(?:com|org|net|io|co|ai|app)\b/gi) || []).forEach(function (m) {
        var d = m.replace(/^[\s(]*(?:https?:\/\/)?(?:www\.)?/i, "").split(".")[0].toLowerCase(); n[d] = (n[d] || 0) + 1;
      });
    });
    return Object.keys(n).sort(function (x, y) { return n[y] - n[x]; });
  };
  var normName = function (x) { return String(x).toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]/g, ""); };

  // A segment is one slide or paragraph: an array of lines.
  // A slide whose title is just an area's name belongs to that area.
  var HEADS = { problem: /^(the )?problems?$/, solution: /^(the |our )?solutions?$/, market: /^(the )?market( size| opportunity)?$/, competition: /^(the )?(competition|competitors|competitive (landscape|advantages?|analysis))$/, model: /^business model$/, traction: /^traction$/, team: /^(the )?team$/, ask: /^(the ask|our ask|financing|funding)$/ };
  var classify = function (seg, every) {
    var title = (seg[0] || "").toLowerCase(), all = seg.join(" ").toLowerCase();
    var sc = AREAS.map(function (a) { return count(a[2], all) + 2 * count(a[2], title) + ((seg.hint || []).indexOf(a[0]) >= 0 || (HEADS[a[0]] && HEADS[a[0]].test(clean(title))) ? 99 : 0); });
    var max = Math.max.apply(null, sc);
    if (!max) return [];
    return AREAS.filter(function (a, k) { return every ? sc[k] > 0 : sc[k] === max; }).map(function (a) { return a[0]; });
  };
  // Body text of a segment: drop a short heading line that only names the area.
  var body = function (seg) {
    var lines = seg.slice();
    if (lines.length > 1 && words(lines[0]) <= 5) lines.shift();
    var t = clean(lines.join(" "));
    return t.length > 700 ? t.slice(0, 697).replace(/\s\S*$/, "") + "…" : t;
  };
  var sentences = function (x) { return (clean(x).match(/[^.!?]+[.!?]*/g) || []).map(clean).filter(Boolean); };

  // Competition lines -> company rows for Who's tried this. Name: the text before a dash or colon,
  // or else the first capitalized phrase; What they do: the rest of the line.
  var CAP_SKIP = /^(the|our|we|unlike|competitors?|competition|competitive|alternatives?|today|most|many|existing|other|others|they|it|this|these|some|vs|versus|compared|like|incumbents?|players?|current|currently|main|key|direct|indirect|legacy|big|large|tools?|and|or|but|while|with|in|a|an|i|include|includes|including)$/i;
  var HEADWORD = /^(competition|competitors?|competitive landscape|the competition|alternatives?|landscape)\s*([:–—-]\s*|$)/i;
  // A company name: readable, at most four words, not only generic words, no long all-caps
  // labels (chart axes such as AFFORDABLE), and not a bare number.
  var nameLike = function (n, own) {
    n = clean(n);
    if (!n || n.length > 40 || garbled(n) || !/^[A-Za-z0-9][\w&.'’+ -]*$/.test(n) || words(n) > 4) return false;
    if (/^\d/.test(n) || CAP_SKIP.test(n) || HEADWORD.test(n) || (words(n) > 1 && /^[a-z]/.test(n))) return false;
    if (own && normName(n) === normName(own)) return false;
    var ws = n.split(/[\s-]+/).filter(Boolean);
    if (ws.some(function (w) { return /^[A-Z]{5,}$/.test(w.replace(/[^A-Za-z]/g, "")); })) return false;
    return !ws.every(function (w) { var t = tokenWord(w); return VOCAB[t] || CAP_SKIP.test(t) || /^\d+$/.test(t); });
  };
  var listNames = function (x) {
    // "Competitors include Weave" -> "Weave": lead-in words before a name are dropped.
    return String(x).split(/\s*,\s*|\s+and\s+|\s+or\s+/).map(function (p) {
      var ws = clean(p).replace(/[.,;:]+$/, "").split(" ");
      while (ws.length > 1 && (CAP_SKIP.test(ws[0]) || /^(compete|competes|competing|against|include|includes|including|such|as|e\.g\.)$/i.test(ws[0]) || (/^[a-z]/.test(ws[0]) && /^[A-Z]/.test(ws[ws.length - 1])))) ws.shift();
      return ws.join(" ");
    }).filter(Boolean);
  };
  var compRows = function (segs, own, allLines) {
    var out = [], seen = {};
    var add = function (name, what) {
      name = clean(name).replace(/^["'“‘(]+|["'”’),.:]+$/g, "");
      var k = name.toLowerCase();
      if (out.length >= 5 || !nameLike(name, own) || seen[k]) return;
      seen[k] = 1;
      what = clean(what).replace(/\s+([,.;:])/g, "$1").replace(/^[\s,.;:–—-]+/, "");
      out.push({ name: name, type: "direct", what: garbled(what) ? "" : what.slice(0, 160), status: "", url: "", short: "" });
    };
    var pending;
    segs.forEach(function (seg) {
      var lines = seg.slice();
      pending = "";
      if (lines.length > 1 && words(lines[0]) <= 5) lines.shift();
      lines.forEach(function (ln) {
        String(ln).split(/\s*[;•·]\s*/).forEach(function (l) {
          l = clean(l).replace(/^([-*+]|\d+[.)])\s+/, "").replace(HEADWORD, "");
          if (l.length < 2 || garbled(l)) return;
          // A category header such as "Customer feedback /" and its wrapped tail are not companies.
          if (/[\/:]$/.test(l)) { pending = l.replace(/[\/:]$/, ""); return; }
          var m = l.match(/^(.{2,60}?)\s*(?::|\s[-–—]\s|[–—])\s*(.*)$/);
          if (m && words(m[1]) <= 6) {
            // "Dashboards: Hootsuite, CoTweet" lists companies under a category.
            var items = listNames(m[2]).filter(function (p) { return nameLike(p, own); });
            if (items.length >= 2) { items.forEach(function (p) { add(p, m[1]); }); pending = m[1]; return; }
            add(m[1], m[2]); return;
          }
          var parts = listNames(l), named = parts.filter(function (p) { return nameLike(p, own) && /^[A-Z0-9]/.test(p) || (words(p) === 1 && nameLike(p, own)); });
          if (parts.length > 1 && named.length >= 2 && named.length >= parts.length * 0.6) { named.forEach(function (p) { add(p, pending); }); return; }
          // A line that is only a name ("craigslist", "Sprout Social").
          if (words(l) <= 3 && nameLike(l, own) && (/^[A-Z0-9]/.test(l) || words(l) === 1)) { add(l, pending); return; }
          // Otherwise names inside a sentence: domains, then capitalised phrases. Prose ends a category.
          pending = "";
          (l.match(/\b[\w-]+\.(?:com|org|net|io|co)\b/gi) || []).forEach(function (d) {
            if (/^www\./i.test(d)) d = d.slice(4);
            var stem = d.split(".")[0], same = (allLines.join(" ").match(new RegExp("\\b" + stem + "\\b(?!\\.)", "i")) || [])[0];
            add(same || (/[A-Z]/.test(d) ? d : stem.charAt(0).toUpperCase() + stem.slice(1)), "");
          });
          var re = /[A-Z][\w&.'+-]*(?:\s+[A-Z][\w&.'+-]*)*/g, x;
          while (words(l) <= 6 && (x = re.exec(l))) {
            var ws = x[0].split(/\s+/);
            while (ws.length && CAP_SKIP.test(ws[0].replace(/[.,']+$/, ""))) ws.shift();
            // An acronym in passing ("launch at DNC") is only a company when the line compares.
            if (ws.length && /^[A-Z0-9&.]+$/.test(ws.join("")) && !/\b(vs\.?|versus|unlike|than|compet\w*|against)\b/i.test(l)) continue;
            if (ws.length && nameLike(ws.slice(0, 4).join(" "), own)) { add(ws.slice(0, 4).join(" "), l.replace(x[0], " ")); break; }
          }
        });
      });
    });
    return out;
  };

  // The company's name: a phrase in the deck that matches the deck's own web or email domain,
  // else the first slide's title when it reads like a name.
  var GENERIC_TITLE = /^(welcome|introduction|intro|overview|agenda|contents|pitch deck|investor (deck|presentation)|presentation|draft|confidential|thank you|thanks|hello|hi)$/i;
  var findName = function (segs, doms) {
    var text = [].concat.apply([], segs).join("\n"), cands = [], re = /[A-Z][\w'’.-]*(?:\s*&\s*[A-Z][\w'’.-]*|&[A-Z][\w'’.-]*|\s+[A-Z][\w'’.-]*){0,3}/g, x;
    while ((x = re.exec(text))) {
      var ws = x[0].replace(/\s*&\s*/g, " & ").split(" ");
      for (var n = ws.length; n >= 1; n--) { var c = ws.slice(0, n).join(" ").replace(/[.’']+$/, ""); if (ws[n - 1] !== "&") cands.push(c); }
    }
    for (var i = 0; i < Math.min(doms.length, 3); i++) {
      var d = doms[i], hit = "";
      cands.forEach(function (c) {
        var nc = normName(c);
        if (nc.length >= 3 && (nc === d || (d.indexOf(nc) === 0 && /^(app|hq|inc|io|labs?|co|software|team)$/.test(d.slice(nc.length))) || /^(get|try|use|join|go)/.test(d) && d.slice(-nc.length) === nc) && c.length > hit.length && !garbled(c)) hit = c;
      });
      if (hit) return hit.replace(/\s*&\s*/g, " & ");
    }
    var first = segs[0] && (segs[0].page || 0) === (segs.firstText || 0) ? clean(segs[0][0]).replace(/^#+\s*/, "") : "";
    if (first && words(first) <= 8 && first.length <= 60 && !/[.!?:”"]$/.test(first) && !/^[“"]/.test(first) && !/^\d+$/.test(first) && !GENERIC_TITLE.test(first) && !garbled(first)) return first;
    return "";
  };
  // Sentences across wrapped lines; a period only ends one before a capital or a quote.
  var sentencesOf = function (seg) {
    return clean(seg.join(" ")).split(/(?<=[.!?…])\s+(?=[“"‘(]?[A-Z])/).map(clean).filter(Boolean);
  };
  var pitchOk = function (s, min) {
    var w = words(s);
    return w >= min && !/[“”"]/.test(s) && !/^[‘'-]/.test(s) && !/\?$/.test(s) && !/[”"]$/.test(s) && s !== s.toUpperCase() && !garbled(s) && !HEADWORD.test(s);
  };
  // Shorten a long sentence at a top-level comma.
  var clip = function (s) {
    if (words(s) <= 35) return s;
    var depth = 0, cut = -1, n = 0;
    for (var i = 0; i < s.length; i++) {
      var ch = s[i];
      if (ch === "(") depth++; else if (ch === ")") depth = Math.max(0, depth - 1);
      else if (ch === " ") n++;
      else if (ch === "," && !depth && n >= 8 && n <= 30 && cut < 0) cut = i;
      if (n > 30 || cut > 0) break;
    }
    return cut > 0 ? s.slice(0, cut) : s.split(" ").slice(0, 30).join(" ") + "…";
  };
  var findPitch = function (segs, solSegs, name) {
    var pick = function (seg, min, whole) {
      var lines = seg.slice();
      // Drop a short heading line, but not a quote or a lead-in such as "Intercom is…".
      if (!whole && lines.length > 1 && words(lines[0]) <= 5 && !/^[“"‘]|[…:]$/.test(lines[0])) lines.shift();
      var ss = sentencesOf(lines);
      for (var j = 0; j < ss.length; j++) if (pitchOk(ss[j], min) && ss[j] !== name && words(ss[j]) <= 60) return clip(ss[j].replace(/^[•·*-]\s*/, ""));
      return "";
    };
    var at = function (p) { for (var q = 0; q < segs.length; q++) if ((segs[q].page || 0) === p) return segs[q]; return null; };
    var p0 = segs.firstText || 0, t = at(p0) ? pick(at(p0), 4) : "";
    // A tagline slide: one or two short lines near the front.
    for (var i = p0 + 1; !t && i < p0 + 3; i++) { var sg = at(i); if (sg && sg.length <= 2 && words(sg.join(" ")) <= 12) t = pick(sg, 3, true); }
    for (var k = 0; !t && k < solSegs.length; k++) t = pick(solSegs[k], 5);
    for (var m = 0; !t && m < segs.length; m++) t = pick(segs[m], 6);
    return t;
  };

  var map = function (segs, every) {
    var by = {}, a = {}, found = {}, compSegs = [], solSegs = [];
    AREAS.forEach(function (x) { by[x[0]] = []; });
    segs.forEach(function (seg) { classify(seg, every).forEach(function (k) { by[k].push(body(seg)); if (k === "competition") compSegs.push(seg); if (k === "solution") solSegs.push(seg); }); });
    AREAS.forEach(function (x) { found[x[0]] = by[x[0]].filter(Boolean).length > 0; });
    var txt = function (k) { return by[k].filter(Boolean).join("\n"); };

    // Name: from the deck's own domain or its title slide; never a number or a generic word.
    var name = findName(segs, segs.domains || domains([].concat.apply([], segs)));
    if (name) a.name = name;
    // One-liner: a real sentence from the title slide, a tagline slide or the solution slide.
    var one = findPitch(segs, solSegs, name);
    if (one) a.one = a.t_plain = one;
    if (found.problem) a.problem = a.l_prob = txt("problem");
    if (found.solution) a.l_sol = a.b_vp = txt("solution");
    if (found.whynow) a.whynow = a.diff = txt("whynow");
    if (found.market) {
      a.segs = a.b_seg = txt("market");
      if (BIG_MARKET.test(a.segs)) a.size = "big"; else if (GROWING.test(a.segs)) a.size = "growing";
    }
    if (found.competition) { a.l_alt = txt("competition"); if (INSIGHT.test(a.l_alt)) a.comp = "insight"; }
    if (found.model) {
      a.b_rev = txt("model");
      var pm = a.b_rev.match(PRICE);
      if (pm) { var p = parseFloat(pm[1].replace(/,/g, "")) * (pm[2] ? 1000 : 1) * (/^mo/.test(pm[3]) ? 12 : 1); if (p > 0) a.price = String(Math.round(p)); }
    }
    if (found.traction) a.l_metrics = txt("traction");
    if (found.team) {
      var tm = txt("team"), b = BUILDER.test(tm), s = SELLER.test(tm);
      if (b && s) { a.people = "both"; a.t_team = "Both covered"; }
      else if (b) { a.people = "one"; a.t_team = "Builder only"; }
      else if (s) { a.people = "one"; a.t_team = "Seller only"; }
      if (INSIDE.test(tm)) a.fmf = "inside"; else if (ADJACENT.test(tm)) a.fmf = "adjacent";
    }
    if (found.gtm) a.first10 = a.b_ch = txt("gtm");
    // The ask has its own free-text field in Why you ("What you're asking for").
    if (found.ask) a.w_ask = txt("ask").slice(0, 240);
    // Companies come from slides titled as competition when there are any, not from a slide
    // that only mentions an alternative in passing.
    var headed = compSegs.filter(function (seg) { return (seg.hint || []).indexOf("competition") >= 0 || HEADS.competition.test(clean(seg[0]).toLowerCase()); });
    return { a: a, found: found, comp: found.competition ? compRows(headed.length ? headed : compSegs, name, [].concat.apply([], segs)) : [] };
  };

  // ---- Readers. Each resolves to an array of segments (arrays of lines).
  var toLines = function (t) { return String(t || "").split(/\n/).map(clean).filter(Boolean); };
  // Pages of lines -> cleaned segments: repeated headers and footers, contact boilerplate,
  // and lines that stay unreadable are dropped. Sets .domains and .unreadable on the result.
  var HINT_WORDS = { problem: "problem", solution: "solution", market: "market", competition: "competition competitors competitive", model: "business pricing revenue", traction: "traction", team: "team", ask: "financing funding" };
  var tidy = function (pages) {
    var all = [].concat.apply([], pages), seenOn = {}, n = pages.length, total = 0, lost = 0;
    pages.forEach(function (p) { var u = {}; p.forEach(function (l) { var k = l.toLowerCase(); if (!u[k]) { u[k] = 1; seenOn[k] = (seenOn[k] || 0) + 1; } }); });
    var rep = Math.max(3, Math.ceil(n * 0.4));
    var out = pages.map(function (p, pi) {
      var hint = [];
      var seg = p.filter(function (l) {
        var c = l.replace(/\s/g, "").length;
        if (n >= 3 && seenOn[l.toLowerCase()] >= rep) return false;
        if (boiler(l)) return false;
        total += c;
        if (garbled(l)) {
          lost += c;
          // A title broken by missing glyphs ("compe  rs") can still say which area the slide is.
          l.replace(/[\ue000-\uf8ff]/g, " ").split(/\s+/).forEach(function (f) {
            f = f.toLowerCase();
            if (f.length >= 4) Object.keys(HINT_WORDS).forEach(function (k) { if (HINT_WORDS[k].split(" ").some(function (w) { return w.indexOf(f) === 0; })) hint.push(k); });
          });
          return false;
        }
        return true;
      }).map(scrub).filter(Boolean);
      if (hint.length) seg.hint = hint;
      seg.page = pi;
      return seg;
    }).filter(function (s) { return s.length; });
    out.domains = domains(all);
    // The title slide is the first page with any text, even if all of it was dropped.
    for (var f = 0; f < n; f++) if (pages[f].length) { out.firstText = f; break; }
    out.unreadable = total ? lost / total : 0;
    out.chars = total - lost;
    return out;
  };
  var readPDF = function (buf) {
    if (!window.pdfjsLib) return Promise.reject(new Error("pdf.js missing"));
    return window.pdfjsLib.getDocument({ data: new Uint8Array(buf), isEvalSupported: false }).promise.then(function (pdf) {
      var jobs = [];
      for (var i = 1; i <= pdf.numPages; i++) jobs.push(pdf.getPage(i).then(function (pg) {
        return pg.getTextContent().then(function (tc) { return tc.items.filter(function (it) { return it.str != null; }); });
      }));
      return Promise.all(jobs);
    }).then(function (pages) {
      // Fonts without a ToUnicode map come back shifted: find each font's shift over all its text.
      var byFont = {}, shift = {}, votes = {};
      pages.forEach(function (items) { items.forEach(function (it) { var f = it.fontName || ""; byFont[f] = (byFont[f] || "") + it.str + " "; }); });
      Object.keys(byFont).forEach(function (f) { var k = bestShift(byFont[f]); shift[f] = k; if (k) votes[k] = (votes[k] || 0) + byFont[f].length; });
      // A font with too little text to decide alone tries the deck's main shift.
      var main = +(Object.keys(votes).sort(function (x, y) { return votes[y] - votes[x]; })[0] || 0);
      if (main) Object.keys(byFont).forEach(function (f) {
        if (!shift[f] && count(ODD, byFont[f]) && score(shiftStr(byFont[f], main)) > score(byFont[f])) shift[f] = main;
      });
      var glyphs = glyphMap(Object.keys(byFont).filter(function (f) { return shift[f]; }).map(function (f) { return shiftStr(byFont[f], shift[f]); }).join(" "));
      return pages.map(function (items) {
        return toLines(items.map(function (it) { var k = shift[it.fontName || ""]; return (k ? applyGlyphs(shiftStr(it.str, k), glyphs) : it.str) + (it.hasEOL ? "\n" : " "); }).join(""));
      });
    }).then(function (pages) {
      var segs = tidy(pages);
      // Mostly unreadable, or no text at all: ask for pasted text instead of filling fields with junk.
      if (segs.chars < MIN_PDF_TEXT || segs.unreadable > 0.5) { var err = new Error("images"); err.images = true; throw err; }
      return segs;
    });
  };
  var decode = function (x) { return x.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#(\d+);/g, function (m, d) { return String.fromCharCode(+d); }).replace(/&#x([0-9a-f]+);/gi, function (m, h) { return String.fromCharCode(parseInt(h, 16)); }).replace(/&amp;/g, "&"); };
  var readPPTX = function (buf) {
    if (!window.JSZip) return Promise.reject(new Error("JSZip missing"));
    return window.JSZip.loadAsync(buf).then(function (zip) {
      var names = Object.keys(zip.files).filter(function (n) { return /^ppt\/slides\/slide\d+\.xml$/.test(n); })
        .sort(function (x, y) { return +x.match(/(\d+)\.xml$/)[1] - +y.match(/(\d+)\.xml$/)[1]; });
      return Promise.all(names.map(function (n) { return zip.file(n).async("string"); }));
    }).then(function (xmls) {
      var slides = xmls.map(function (xml) {
        return xml.split(/<\/a:p>/).map(function (para) {
          var out = [], re = /<a:t(?:\s[^>]*)?>([\s\S]*?)<\/a:t>/g, m;
          while ((m = re.exec(para))) out.push(decode(m[1]));
          return clean(out.join(""));
        }).filter(Boolean);
      }).filter(function (s) { return s.length; });
      if (!slides.length) throw new Error("empty");
      slides = tidy(slides);
      if (!slides.length) throw new Error("empty");
      return slides;
    });
  };
  var md = function (l) { return l.replace(/^#+\s*/, "").replace(/^\s*([-*+]|\d+[.)])\s+/, "").replace(/[*_`]{1,3}/g, ""); };
  var readText = function (txt) {
    var segs = String(txt || "").split(/\n\s*\n/).map(function (p) { return p.split(/\n/).map(md).map(clean).filter(Boolean); }).filter(function (s) { return s.length; });
    if (!segs.length) throw new Error("empty");
    return segs;
  };

  // Any supported file -> Promise of segments. Shared with Find a problem through window.__nsimp.
  // Rejects with err.tooBig, err.badType or err.images set when those apply.
  var readFile = function (f) {
    var fail = function (code) { var err = new Error(code); err[code] = true; return Promise.reject(err); };
    if (!f) return fail("none");
    if (f.size > MAX) return fail("tooBig");
    var ext = (f.name.match(/\.([a-z0-9]+)$/i) || [])[1]; ext = ext ? ext.toLowerCase() : "";
    if (["pdf", "pptx", "txt", "md"].indexOf(ext) < 0) return fail("badType");
    try {
      if (ext === "pdf") return f.arrayBuffer().then(readPDF);
      if (ext === "pptx") return f.arrayBuffer().then(readPPTX);
      return f.text().then(readText);
    } catch (x) { return Promise.reject(x); }
  };
  window.__nsimp = { readFile: readFile, readText: readText, MAX: MAX };

  // ---- Summary and hand-off to Idea Check.
  var say = function (msg) { var m = $("imp-msg"); if (!m) return; m.textContent = msg || ""; m.hidden = !msg; };
  var summary = function (found, from, nComp) {
    var box = $("imp-sum"); if (!box) return;
    var miss = AREAS.filter(function (x) { return !found[x[0]]; }).length;
    box.innerHTML = '<h3>What we found in your ' + e(from) + '</h3>' +
      '<ul class="x-found">' + AREAS.map(function (x) { var ok = found[x[0]]; return '<li><span>' + e(x[1]) + '</span><span class="chip' + (ok ? "" : " chip--solid") + '">' + (ok ? "Found" : "Missing") + "</span></li>"; }).join("") + "</ul>" +
      '<p class="x-hint">' + (miss ? "Missing areas are the first gaps to fix. " : "Every area has something to start from. ") + "We filled in only empty fields; review and edit each step below." + (nComp ? " Added " + nComp + (nComp === 1 ? " company" : " companies") + " to Who's tried this." : "") + "</p>";
    box.hidden = false;
  };
  var run = function (segs, from, every) {
    var r = map(segs, every);
    if (!window.__nsic || !window.__nsic.fill) throw new Error("Idea Check not ready");
    var nComp = r.comp.length && window.__nsic.fillComp ? window.__nsic.fillComp(r.comp) : 0;
    window.__nsic.fill(r.a, 0);
    say("");
    summary(r.found, from, nComp);
    var b = $("imp-sum"); if (b) b.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  var check = $("check"); if (!check) return;
  check.addEventListener("click", function (ev) {
    var t = ev.target.closest("button"); if (!t) return;
    if (t.id === "imp-text-go") {
      var txt = ($("imp-text") || {}).value || "";
      if (!clean(txt)) { say("Write a few sentences first."); return; }
      try {
        // One paragraph per line; a line can feed several areas.
        run([].concat.apply([], txt.split(/\n/).map(clean).filter(Boolean).map(sentences)).map(function (l) { return [l]; }), "description", true);
      } catch (x) { say("Couldn't read that. Try a few plain sentences."); }
    } else if (t.id === "imp-file-go") {
      var inp = $("imp-file"), f = inp && inp.files && inp.files[0];
      if (!f) { say("Choose a file first."); return; }
      if (f.size > MAX) { say("That file is over 25 MB. Try a smaller export, or paste the text instead."); return; }
      var ext = (f.name.match(/\.([a-z0-9]+)$/i) || [])[1]; ext = ext ? ext.toLowerCase() : "";
      if (["pdf", "pptx", "txt", "md"].indexOf(ext) < 0) { say("Use a .pdf, .pptx, .txt or .md file."); return; }
      say("Reading " + f.name + "…");
      t.disabled = true;
      readFile(f).then(function (segs) { run(segs, "deck", false); })
        .catch(function (x) { say(x && x.images ? MSG_IMAGES : MSG_FAIL); if (window.console) console.warn("Idea Check import:", x); })
        .then(function () { t.disabled = false; });
    }
  });
})();
