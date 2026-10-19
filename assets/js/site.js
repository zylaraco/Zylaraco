/*
 * Zylara.co site script (shared by every page).
 *  - hides the header while scrolling down, shows it when scrolling up
 *  - scroll reveal animations, parallax, the big "zylara.co" footer word
 *  - homepage intro loader (once per visit)
 *  - mobile menu, work preview, post / brand-guideline lightbox, "See all posts"
 *  - contact form: opens WhatsApp with the details filled in
 */
(function () {
  'use strict';

  var w = window;
  var d = document;
  var html = d.documentElement;
  var WHATSAPP = '94761552015';

  var reduce = false;
  try { reduce = !!(w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) {}
  var motion = !reduce && !d.querySelector('.no-motion');

  /* ---------- show / hide blocks ---------- */
  var state = {};
  function setIf(name, on) {
    state[name] = on;
    var els = d.querySelectorAll('zy-if[data-if="' + name + '"]');
    for (var i = 0; i < els.length; i++) { els[i].hidden = !on; }
  }
  function overlayOpen() { return !!(state.lbOpen || state.zoomOpen); }
  function lock(on) { html.classList.toggle('lock', !!on); }

  /* fill data-ba-* (attributes) and data-bt (text) placeholders inside a block */
  function bind(block, data) {
    var all = block.querySelectorAll('*');
    for (var i = 0; i < all.length; i++) {
      var el = all[i];
      var attrs = el.attributes;
      for (var j = 0; j < attrs.length; j++) {
        var a = attrs[j].name;
        if (a.indexOf('data-ba-') === 0) { el.setAttribute(a.slice(8), data[attrs[j].value] || ''); }
      }
      var bt = el.getAttribute('data-bt');
      if (bt) { el.textContent = data[bt] || ''; }
    }
  }
  function block(name) { return d.querySelector('zy-if[data-if="' + name + '"]'); }

  /* ---------- header ---------- */
  var head = d.querySelector('.site-head');
  var last = w.scrollY || 0;

  /* ---------- parallax + footer word + reveal sweep ---------- */
  var pars = motion ? Array.prototype.slice.call(d.querySelectorAll('[data-par]')) : [];
  var ghost = motion ? d.querySelector('[data-gx]') : null;
  var sweep = null;
  var ticking = false;
  function paint() {
    ticking = false;
    if (sweep) { sweep(); }
    var y = w.scrollY || 0;
    if (y < 1800) {
      for (var i = 0; i < pars.length; i++) {
        var k = parseFloat(pars[i].getAttribute('data-par')) || 0;
        pars[i].style.transform = 'translate3d(0,' + (y * k).toFixed(1) + 'px,0)';
      }
    }
    if (ghost) {
      var from = parseFloat(ghost.getAttribute('data-gx')) || 0;
      var rest = html.scrollHeight - (y + (w.innerHeight || 800));
      var p = Math.max(0, Math.min(1, 1 - rest / 700));
      ghost.style.transform = 'translate3d(' + (from * (1 - p)).toFixed(2) + '%,0,0)';
    }
  }
  w.addEventListener('scroll', function () {
    var y = w.scrollY || 0;
    var dy = y - last;
    if (head && Math.abs(dy) >= 6) {
      last = y;
      var hide = dy > 0 && y > 140 && !state.menuOpen && !overlayOpen();
      head.classList.toggle('nav-hide', hide);
    }
    if (!ticking) { ticking = true; w.requestAnimationFrame(paint); }
  }, { passive: true });

  /* ---------- scroll reveal ---------- */
  function reveal() {
    if (!('IntersectionObserver' in w)) { return; }
    var vh = w.innerHeight || 800;
    var GRID = '.vals,.bento,.cards,.team,.gets,.steps,.chips,.works,.gal,.bk,.ev-pics,.ev-list,.faq,.qa,.plats,ol';
    var items = [];
    function walk(el) {
      if (items.indexOf(el) >= 0) { return; }
      if (el.tagName === 'H2') { el._rk = 'mk'; items.push(el); return; }
      if (el.matches(GRID)) { el._rk = 'stg'; items.push(el); return; }
      if (el.querySelector('h2,' + GRID)) {
        for (var c = el.firstElementChild; c; c = c.nextElementSibling) { walk(c); }
        return;
      }
      el._rk = el.classList.contains('reveal-l') ? 'fl' : 'fd';
      items.push(el);
    }
    var roots = d.querySelectorAll('.reveal,.reveal-l');
    for (var i = 0; i < roots.length; i++) { walk(roots[i]); }
    var pending = [];
    var io = null;
    function show(list) {
      list.sort(function (a, b) { return a.getBoundingClientRect().top - b.getBoundingClientRect().top; });
      var n = 0;
      for (var k = 0; k < list.length; k++) {
        var el = list[k];
        var at = pending.indexOf(el);
        if (at < 0) { continue; }
        pending.splice(at, 1);
        if (io) { io.unobserve(el); }
        var above = el.getBoundingClientRect().bottom < 0;
        if (el._rk !== 'stg') { el.style.animationDelay = above ? '0s' : (n * 0.09).toFixed(2) + 's'; }
        if (!above) { n++; }
        el.classList.remove('pre');
        el.classList.add('in');
      }
    }
    sweep = function () {
      if (!pending.length) { return; }
      var lim = (w.innerHeight || vh) * 0.94;
      var due = [];
      for (var q = 0; q < pending.length; q++) { if (pending[q].getBoundingClientRect().top < lim) { due.push(pending[q]); } }
      if (due.length) { show(due); }
    };
    io = new w.IntersectionObserver(function (entries) {
      var hits = [];
      for (var j = 0; j < entries.length; j++) { if (entries[j].isIntersecting) { hits.push(entries[j].target); } }
      if (hits.length) { show(hits); }
      sweep();
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0 });
    for (var m = 0; m < items.length; m++) {
      var it = items[m];
      if (it.getBoundingClientRect().top > vh * 0.94) {
        it.classList.add(it._rk);
        it.classList.add('pre');
        pending.push(it);
        io.observe(it);
      }
    }
  }

  /* ---------- homepage intro loader ---------- */
  function ready() {
    var s = d.querySelector('.site.wait');
    if (s) { s.classList.remove('wait'); s.classList.add('ready'); }
  }
  var ldr = d.querySelector('.ldr');
  if (!ldr || html.classList.contains('no-intro') || !motion) {
    if (ldr) { setIf('showLoader', false); }
    ready();
  } else {
    html.style.overflow = 'hidden';
    var minDone = false;
    var loaded = d.readyState === 'complete';
    var exited = false;
    var exit = function () {
      if (exited) { return; }
      exited = true;
      html.style.overflow = '';
      try { w.sessionStorage.setItem('zy_intro', '1'); } catch (e) {}
      ldr.classList.add('ldr-out');
      ready();
      setTimeout(function () { setIf('showLoader', false); }, 900);
    };
    var check = function () { if (minDone && loaded) { exit(); } };
    setTimeout(function () { minDone = true; check(); }, 1400);
    setTimeout(exit, 2600);
    if (!loaded) { w.addEventListener('load', function () { loaded = true; check(); }); }
  }

  /* ---------- videos ---------- */
  var vids = d.querySelectorAll('video[data-auto]');
  for (var vi = 0; vi < vids.length; vi++) {
    var v = vids[vi];
    v.muted = true; v.loop = true; v.playsInline = true;
    try { var pr = v.play(); if (pr && pr.catch) { pr.catch(function () {}); } } catch (e) {}
  }

  /* ---------- mobile menu ---------- */
  function setMenu(on) {
    setIf('menuOpen', on);
    setIf('menuClosed', !on);
    var b = d.querySelector('.menu-btn');
    if (b) { b.setAttribute('aria-expanded', on ? 'true' : 'false'); }
    if (on && head) { head.classList.remove('nav-hide'); }
  }

  /* ---------- lightbox (posts, brand guideline pages) ---------- */
  var lbItems = Array.prototype.slice.call(d.querySelectorAll('[data-act="lb"]'));
  var lbIndex = -1;
  function openLb(i) {
    var n = lbItems.length;
    if (!n) { return; }
    lbIndex = (i + n) % n;
    var btn = lbItems[lbIndex];
    var img = btn.querySelector('img');
    var box = block('lbOpen');
    bind(box, {
      src: img ? img.getAttribute('src') : '',
      alt: img ? img.getAttribute('alt') : '',
      name: btn.getAttribute('data-name'),
      what: btn.getAttribute('data-what'),
      pos: (lbIndex + 1) + ' / ' + n
    });
    setIf('lbOpen', true);
    lock(true);
    if (head) { head.classList.remove('nav-hide'); }
  }
  function closeLb() { setIf('lbOpen', false); lbIndex = -1; lock(false); }

  /* ---------- work preview (homepage) ---------- */
  function openZoom(btn) {
    bind(block('zoomOpen'), { src: btn.getAttribute('data-src'), alt: btn.getAttribute('data-alt') });
    setIf('zoomOpen', true);
    lock(true);
  }
  function closeZoom() { setIf('zoomOpen', false); lock(false); }

  /* ---------- clicks ---------- */
  d.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('[data-act]') : null;
    if (!t) { return; }
    var act = t.getAttribute('data-act');
    switch (act) {
      case 'toggleMenu': setMenu(!state.menuOpen); break;
      case 'closeMenu': setMenu(false); break;
      case 'zoom': openZoom(t); break;
      case 'closeZoom': closeZoom(); break;
      case 'lb': openLb(lbItems.indexOf(t)); break;
      case 'closeLb': closeLb(); break;
      case 'prevLb': openLb(lbIndex - 1); break;
      case 'nextLb': openLb(lbIndex + 1); break;
      case 'showAll':
        var more = d.querySelectorAll('[data-more]');
        for (var i = 0; i < more.length; i++) { more[i].hidden = false; }
        setIf('hasMore', false);
        break;
      case 'reset':
        var f = d.querySelector('form[data-wa-form]');
        if (f) { f.reset(); }
        setIf('sent', false);
        setIf('notSent', true);
        break;
    }
  });

  d.addEventListener('keydown', function (e) {
    if (state.lbOpen) {
      if (e.key === 'Escape') { closeLb(); }
      else if (e.key === 'ArrowLeft') { openLb(lbIndex - 1); }
      else if (e.key === 'ArrowRight') { openLb(lbIndex + 1); }
    } else if (state.zoomOpen && e.key === 'Escape') {
      closeZoom();
    } else if (state.menuOpen && e.key === 'Escape') {
      setMenu(false);
    }
  });

  /* ---------- contact form -> WhatsApp ---------- */
  var form = d.querySelector('form[data-wa-form]');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var el = form.elements;
      function val(n) { return el[n] && el[n].value ? String(el[n].value).trim() : ''; }
      var needs = [];
      var boxes = form.querySelectorAll('input[name="need"]:checked');
      for (var i = 0; i < boxes.length; i++) { needs.push(boxes[i].parentNode.textContent.trim()); }
      var lines = ["Hi Zylara, I'd like a free audit.", ''];
      if (val('name')) { lines.push('Name: ' + val('name')); }
      if (val('business')) { lines.push('Business: ' + val('business')); }
      if (val('phone')) { lines.push('WhatsApp: ' + val('phone')); }
      if (val('type')) { lines.push('Type of business: ' + val('type')); }
      if (needs.length) { lines.push('I need: ' + needs.join(', ')); }
      if (val('message')) { lines.push('', val('message')); }
      var url = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(lines.join('\n'));
      var win = null;
      try { win = w.open(url, '_blank'); } catch (err) {}
      if (win) { try { win.opener = null; } catch (err) {} } else { w.location.href = url; }
      setIf('notSent', false);
      setIf('sent', true);
    });
  }

  /* ---------- floating WhatsApp button: on phones it waits until the hero is scrolled past ---------- */
  var fab = d.querySelector('.fab');
  var heroSec = d.querySelector('section');
  if (fab && heroSec && 'IntersectionObserver' in w) {
    fab.classList.add('fab-off');
    new w.IntersectionObserver(function (es) {
      fab.classList.toggle('fab-off', es[0].isIntersecting);
    }, { threshold: 0 }).observe(heroSec);
  }

  /* ---------- start ---------- */
  if (pars.length || ghost) { paint(); }
  if (motion) { try { reveal(); } catch (e) {} }
})();
