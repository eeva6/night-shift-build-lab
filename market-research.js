// Research-backed markets for Idea Check: matching, cards and the browse list.
// Data comes from the opportunity-cards.json data block folded into the page (#market-cards).
(function () {
  var cards = [];
  try {
    var blk = document.getElementById("market-cards");
    var d = blk && blk.textContent ? JSON.parse(blk.textContent) : null;
    cards = d && Array.isArray(d.cards) ? d.cards : [];
  } catch (x) { cards = []; }

  var e = function (x) { return String(x == null ? "" : x).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var norm = function (x) { return " " + String(x || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ").trim() + " "; };
  var MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var date = function (x) {
    var s = String(x || ""), m = s.match(/^(\d{4})-(\d{2})(?:-(\d{2}))?/);
    if (!m) return s;
    var out = MON[+m[2] - 1] + (m[3] ? " " + +m[3] + "," : "") + " " + m[1];
    var rest = s.slice(m[0].length).replace(/(\d{4})-(\d{2})/, function (_, y, mo) { return MON[+mo - 1] + " " + y; });
    return out + rest;
  };
  var typeTag = function (t) {
    t = String(t || "").toLowerCase();
    return /modeled/.test(t) ? "Modeled estimate" : /^survey/.test(t) ? "Survey" : "Measured";
  };

  // Case-insensitive phrase match on whole words (a trailing "s" also counts). Strongest first, ties keep data order.
  var match = function (text, n) {
    var hay = norm(text);
    if (hay.trim() === "") return [];
    return cards.map(function (c, i) {
      var hit = [];
      (c.keywords || []).forEach(function (k) {
        var kw = norm(k).trim();
        if (kw && (hay.indexOf(" " + kw + " ") > -1 || hay.indexOf(" " + kw + "s ") > -1) && hit.indexOf(k) < 0) hit.push(k);
      });
      return { c: c, i: i, hit: hit };
    }).filter(function (m) { return m.hit.length > 0; })
      .sort(function (a, b) { return b.hit.length - a.hit.length || a.i - b.i; })
      .slice(0, n || 3);
  };

  var FINE = '<p class="fineprint">Market research drawn from <a class="link" href="https://www.ingeborginvestments.com/research" target="_blank" rel="noopener">Ingeborg Investments\' published reports</a>, traced to original sources and checked Nov 25, 2026. Not affiliated with Ingeborg.</p>';

  var cardHTML = function (c, hit, prefix) {
    var s = c.stat || {}, src = s.source || {};
    var ing = (c.links || []).filter(function (l) { return /^ingeborg/i.test(l.label || ""); })[0];
    var ctx = Array.isArray(c.ingeborg_context) ? c.ingeborg_context : c.ingeborg_context ? [c.ingeborg_context] : [];
    var meta = [s.period, s.geography].filter(Boolean).join(" · ");
    return '<article class="x-mr-card" id="' + prefix + e(c.id) + '">' +
      "<h3>" + e(c.title) + "</h3>" +
      (hit && hit.length ? '<p class="x-hint">Matched on: ' + e(hit.join(", ")) + "</p>" : "") +
      '<p class="x-mr-stat">' + e(s.text) + "</p>" +
      '<p class="x-mr-meta"><span class="chip">' + e(typeTag(s.type)) + "</span>" + (meta ? "<span>" + e(meta) + "</span>" : "") + "</p>" +
      "<h4>Problem it may point to</h4><p>" + e(c.problem) + "</p>" +
      "<h4>Who's well placed to see it</h4><ul class=\"x-mr-chips\">" + (c.backgrounds || []).map(function (b) { return '<li class="pill">' + e(b) + "</li>"; }).join("") + "</ul>" +
      "<h4>Questions to investigate</h4><ul>" + (c.questions || []).map(function (q) { return "<li>" + e(q) + "</li>"; }).join("") + "</ul>" +
      "<h4>Validate it</h4><ol>" + (c.next_steps || []).map(function (q) { return "<li>" + e(q) + "</li>"; }).join("") + "</ol>" +
      "<h4>Sources</h4><ul>" +
        (src.url ? '<li><a class="link" href="' + e(src.url) + '" target="_blank" rel="noopener">' + e(src.title || src.url) + "</a><small>" + e([src.publisher, date(src.pub_date)].filter(Boolean).join(" · ")) + "</small></li>" : "") +
        (ing ? '<li><a class="link" href="' + e(ing.url) + '" target="_blank" rel="noopener">' + e(ing.label) + "</a></li>" : "") +
      "</ul>" +
      (ctx.length ? '<p class="fineprint"><strong>Investor market estimate (Ingeborg). Not additive across markets and not a startup\'s addressable market.</strong> ' + e(ctx.map(function (x) { return x.figure || x; }).join("; ")) + "</p>" : "") +
      '<button type="button" class="btn x-noprint" data-mr-use="' + e(c.id) + '">Use this market</button>' +
      "</article>";
  };

  // The "Markets your background touches" card for Find a problem and Check an idea results.
  var matchedHTML = function (text, where) {
    var m = match(text, 3), id = "mr-" + (where || "fp");
    var body = m.length
      ? '<p class="x-hint">Matched on words in your answers, strongest first. Treat them as research leads, not conclusions.</p><div class="x-mr-grid">' + m.map(function (x) { return cardHTML(x.c, x.hit, id + "-"); }).join("") + "</div>"
      : '<p>No research-backed market matched your words yet. <a class="link" href="#mr-browse" data-mr-browse>Browse all ' + cards.length + " markets</a></p>";
    return '<div class="x-mr" id="' + id + '"><h3>Markets your background touches</h3>' + body + FINE + "</div>";
  };
  var titles = function (text) { return match(text, 3).map(function (x) { return x.c.title.split(":")[0]; }); };

  // Browse list in Find a problem.
  var list = document.getElementById("mr-browse-list");
  if (list) list.innerHTML = cards.map(function (c) { return cardHTML(c, null, "mr-all-"); }).join("");
  var wrap = document.getElementById("mr-browse-wrap");
  if (wrap && !cards.length) wrap.hidden = true;

  // Check an idea: add the card under Adjacent markets whenever the Idea Check summary renders.
  var checkText = function () {
    var s = window.__nsic && window.__nsic.s, a = s && s.a ? s.a : {};
    return Object.keys(a).map(function (k) { return typeof a[k] === "string" ? a[k] : ""; }).join(" \n ");
  };
  var stage = document.getElementById("stage");
  var inject = function () {
    if (!stage || !cards.length) return;
    var adj = stage.querySelector("#adjacent");
    if (!adj || stage.querySelector("#mr-check")) return;
    adj.insertAdjacentHTML("afterend", matchedHTML(checkText(), "check"));
  };
  if (stage && window.MutationObserver) new MutationObserver(inject).observe(stage, { childList: true });
  inject();

  document.addEventListener("click", function (ev) {
    var b = ev.target.closest && ev.target.closest("[data-mr-use], [data-mr-browse]");
    if (!b) return;
    if (b.hasAttribute("data-mr-browse")) {
      ev.preventDefault();
      var fm = document.getElementById("x-mode-find");
      if (fm && fm.getAttribute("aria-pressed") !== "true") fm.click();
      var det = document.getElementById("mr-browse");
      if (det) { det.open = true; setTimeout(function () { det.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" }); }, 30); }
      return;
    }
    var c = cards.filter(function (x) { return x.id === b.getAttribute("data-mr-use"); })[0];
    if (c && window.__nsfp && window.__nsfp.useMarket) window.__nsfp.useMarket(c.problem, c.title.split(":")[0]);
  });

  window.__nsmr = { cards: cards, match: match, matchedHTML: matchedHTML, titles: titles };
})();
