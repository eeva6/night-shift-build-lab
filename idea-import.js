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

  // A segment is one slide or paragraph: an array of lines.
  var classify = function (seg, every) {
    var title = (seg[0] || "").toLowerCase(), all = seg.join(" ").toLowerCase();
    var sc = AREAS.map(function (a) { return count(a[2], all) + 2 * count(a[2], title); });
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
  var compRows = function (segs) {
    var out = [], seen = {};
    segs.forEach(function (seg) {
      var lines = seg.slice();
      if (lines.length > 1 && words(lines[0]) <= 5) lines.shift();
      lines.forEach(function (ln) {
        String(ln).split(/\s*[;•·]\s*/).forEach(function (l) {
          if (out.length >= 5) return;
          l = clean(l).replace(/^([-*+]|\d+[.)])\s+/, "").replace(HEADWORD, "");
          if (l.length < 3) return;
          var name = "", what = "", m = l.match(/^(.{2,60}?)\s*(?::|\s[-–—]\s|[–—])\s*(.*)$/);
          if (m && words(m[1]) <= 6) { name = m[1]; what = m[2]; }
          else {
            var re = /[A-Z][\w&.'+-]*(?:\s+[A-Z][\w&.'+-]*)*/g, x;
            while ((x = re.exec(l))) {
              var ws = x[0].split(/\s+/);
              while (ws.length && CAP_SKIP.test(ws[0].replace(/[.,']+$/, ""))) ws.shift();
              if (ws.length) { name = ws.slice(0, 4).join(" "); break; }
            }
            if (name) what = l.replace(name, " ");
          }
          name = clean(name).replace(/^["'“‘(]+|["'”’),.]+$/g, "");
          what = clean(what).replace(/\s+([,.;:])/g, "$1").replace(/^[\s,.;:–—-]+/, "");
          var k = name.toLowerCase();
          if (!name || name.length > 60 || seen[k] || HEADWORD.test(name)) return;
          seen[k] = 1;
          out.push({ name: name, type: "direct", what: what.slice(0, 160), status: "", url: "", short: "" });
        });
      });
    });
    return out;
  };

  var map = function (segs, every) {
    var by = {}, a = {}, found = {}, compSegs = [];
    AREAS.forEach(function (x) { by[x[0]] = []; });
    segs.forEach(function (seg) { classify(seg, every).forEach(function (k) { by[k].push(body(seg)); if (k === "competition") compSegs.push(seg); }); });
    AREAS.forEach(function (x) { found[x[0]] = by[x[0]].filter(Boolean).length > 0; });
    var txt = function (k) { return by[k].filter(Boolean).join("\n"); };

    // Name: the first slide's title or the first line, when it reads like a name.
    var first = clean((segs[0] || [])[0]).replace(/^#+\s*/, "");
    var isName = first && words(first) <= 8 && first.length <= 60 && !/[.!?]$/.test(first);
    if (isName) a.name = first;
    // One-liner: the first short descriptive sentence.
    var lines = [].concat.apply([], segs);
    for (var i = 0; i < lines.length && !a.one; i++) {
      var ss = sentences(lines[i]);
      for (var j = 0; j < ss.length; j++) { var w = words(ss[j]); if (w >= 6 && w <= 35 && ss[j] !== first) { a.one = a.t_plain = ss[j]; break; } }
    }
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
    return { a: a, found: found, comp: found.competition ? compRows(compSegs) : [] };
  };

  // ---- Readers. Each resolves to an array of segments (arrays of lines).
  var toLines = function (t) { return String(t || "").split(/\n/).map(clean).filter(Boolean); };
  var readPDF = function (buf) {
    if (!window.pdfjsLib) return Promise.reject(new Error("pdf.js missing"));
    return window.pdfjsLib.getDocument({ data: new Uint8Array(buf), isEvalSupported: false }).promise.then(function (pdf) {
      var jobs = [];
      for (var i = 1; i <= pdf.numPages; i++) jobs.push(pdf.getPage(i).then(function (pg) {
        return pg.getTextContent().then(function (tc) { return toLines(tc.items.map(function (it) { return (it.str || "") + (it.hasEOL ? "\n" : " "); }).join("")); });
      }));
      return Promise.all(jobs);
    }).then(function (pages) {
      var chars = pages.reduce(function (n, p) { return n + p.join("").replace(/\s/g, "").length; }, 0);
      if (chars < MIN_PDF_TEXT) { var err = new Error("images"); err.images = true; throw err; }
      return pages.filter(function (p) { return p.length; });
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
