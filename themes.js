// Theme filter shared by the blouse, tote bag and t-shirt designers.
// Each designer keeps its own themes: they are whatever the admin typed for the designs on that page.
(function () {
  var cur = '';            // selected theme key ('' = All, '\u0000' = designs without a theme)
  var NONE = '\u0000';
  var bar, adm, dl;
  var key = function (t) { return String(t || '').trim().toLowerCase(); };

  function css() {
    if (document.getElementById('thcss')) return;
    var s = document.createElement('style'); s.id = 'thcss';
    s.textContent =
      '.thbar[hidden],.thadm[hidden]{display:none!important}' +
      '.thbar{display:flex;gap:6px;overflow-x:auto;padding:0 0 8px;margin:0 0 4px;scrollbar-width:thin;-webkit-overflow-scrolling:touch}' +
      '.thchip{flex:none;border:1.5px solid var(--bdr,#e3dccf);background:#fff;color:var(--mid,#6b6560);border-radius:999px;padding:5px 11px;font:500 .72rem "DM Sans",system-ui,sans-serif;cursor:pointer;white-space:nowrap}' +
      '.thchip:hover{border-color:var(--gold,#d99a2b)}' +
      '.thchip.on{background:var(--acc,#0d7a6e);border-color:var(--acc,#0d7a6e);color:#fff}' +
      '.thchip b{font-weight:500;opacity:.65;margin-left:3px}' +
      '.thadm{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin:0 0 8px;padding:7px 9px;background:#fff8e6;border:1px dashed #d9b45a;border-radius:8px;font:.72rem "DM Sans",system-ui,sans-serif;color:#5b4a14}' +
      '.thadm input,.thtag input{font:inherit;font-size:.74rem;padding:5px 8px;border:1px solid #cdbd8a;border-radius:6px;min-width:0;flex:1 1 140px;background:#fff}' +
      '.thtag{display:block;width:100%;border:none;border-top:1px dashed var(--bdr,#e3dccf);background:#fffaf0;color:#7a5d0e;font:500 .62rem "DM Sans",system-ui,sans-serif;padding:3px 4px;cursor:pointer;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
      '.thtag.edit{padding:2px}.thtag.edit input{width:100%;flex:none;padding:3px 5px;font-size:.66rem}';
    document.head.appendChild(s);
  }
  function ensure() {
    var grid = document.getElementById('dgrid'); if (!grid) return false;
    css();
    if (!bar) {
      bar = document.createElement('div'); bar.className = 'thbar'; bar.id = 'thbar'; bar.hidden = true;
      adm = document.createElement('div'); adm.className = 'thadm'; adm.id = 'thadm'; adm.hidden = true;
      adm.innerHTML = '<span><b>Theme for new uploads:</b></span><input id="thnew" list="thlist" maxlength="24" placeholder="Type a new theme or pick one (optional)" autocomplete="off">';
      dl = document.createElement('datalist'); dl.id = 'thlist'; adm.appendChild(dl);
      grid.parentNode.insertBefore(adm, grid); grid.parentNode.insertBefore(bar, adm);
    }
    return true;
  }
  function themes(list) { // [{key,name,n}] in first-seen order, plus count of designs without a theme
    var map = {}, order = [], none = 0;
    list.forEach(function (d) {
      var k = key(d.theme);
      if (!k) { none++; return; }
      if (!map[k]) { map[k] = { key: k, name: String(d.theme).trim(), n: 0 }; order.push(k); }
      map[k].n++;
    });
    order.sort(function (a, b) { return map[a].name.localeCompare(map[b].name); });
    return { list: order.map(function (k) { return map[k]; }), none: none };
  }
  function canonical(t, list) { // reuse the spelling already in use for the same theme
    var k = key(t), hit = themes(list).list.filter(function (x) { return x.key === k; })[0];
    return hit ? hit.name : String(t || '').trim().replace(/\s+/g, ' ').slice(0, 24);
  }
  function seller() { return typeof APP_MODE !== 'undefined' && APP_MODE === 'seller' && typeof SERVER !== 'undefined' && SERVER; }

  var PPThemes = window.PPThemes = {
    // Called at the start of buildGrid(list) -> the designs to show.
    filter: function (list) {
      if (!ensure()) return list;
      var t = themes(list);
      if (cur && cur !== NONE && !t.list.some(function (x) { return x.key === cur; })) cur = '';
      if (cur === NONE && !t.none) cur = '';
      var show = t.list.length > 0;
      bar.hidden = !show; bar.innerHTML = '';
      if (show) {
        var add = function (k, label, n) {
          var b = document.createElement('button'); b.type = 'button'; b.className = 'thchip' + (cur === k ? ' on' : '');
          b.innerHTML = '<span></span><b>' + n + '</b>'; b.firstChild.textContent = label;
          b.onclick = function () { cur = k; if (typeof buildGrid === 'function') buildGrid(); };
          bar.appendChild(b);
        };
        add('', 'All', list.length);
        t.list.forEach(function (x) { add(x.key, x.name, x.n); });
        if (t.none) add(NONE, 'Other', t.none);
      }
      adm.hidden = !seller();
      dl.innerHTML = ''; t.list.forEach(function (x) { var o = document.createElement('option'); o.value = x.name; dl.appendChild(o); });
      if (!cur) return list;
      return list.filter(function (d) { return cur === NONE ? !key(d.theme) : key(d.theme) === cur; });
    },
    // Theme typed in the admin box, spelled like an existing one when it matches.
    uploadTheme: function (list) {
      var i = document.getElementById('thnew'); return i ? canonical(i.value, list || []) : '';
    },
    // Seller-only: small tag under a tile; tap to change the design's theme.
    tag: function (tile, d, save) {
      if (!seller()) return;
      var b = document.createElement('button'); b.type = 'button'; b.className = 'thtag';
      b.textContent = '\u{1F3F7} ' + (d.theme || 'No theme'); b.title = 'Change theme';
      b.onclick = function (e) {
        e.stopPropagation();
        var w = document.createElement('div'); w.className = 'thtag edit';
        var inp = document.createElement('input'); inp.setAttribute('list', 'thlist'); inp.maxLength = 24; inp.value = d.theme || ''; inp.placeholder = 'Theme';
        w.appendChild(inp); b.replaceWith(w); inp.focus(); inp.select();
        var done = false;
        var commit = function (ok) { if (done) return; done = true; if (ok) save(d, inp.value); else if (typeof buildGrid === 'function') buildGrid(); };
        inp.onclick = function (ev) { ev.stopPropagation(); };
        inp.onkeydown = function (ev) { if (ev.key === 'Enter') commit(true); else if (ev.key === 'Escape') commit(false); };
        inp.onblur = function () { commit(true); };
      };
      tile.appendChild(b);
    },
    canonical: canonical
  };
})();
