// ─────────────────────────────────────────────────────────────────────────────
//  PRICES: change numbers here and every page updates (designers + homepage).
// ─────────────────────────────────────────────────────────────────────────────
(function () {
  var PRICES = {
    tote: {
      tiers: [                       // per bag, by quantity (highest minimum first match wins)
        { min: 100, price: 99 },
        { min: 10,  price: 129 },
        { min: 5,   price: 139 },
        { min: 1,   price: 149 }
      ]
    },
    blouse: {
      fabrics: [
        { id: 'pigeon', name: 'Pigeon silk', price: 299, note: 'with design' },
        { id: 'semi',   name: 'Semi silk',   price: 159, note: 'with design' }
      ]
    },
    tshirt: { from: 300 }
  };
  // Diwali offer: set on:false to switch it off. Optional until:'YYYY-MM-DD' makes it end by itself (last day included).
  var DIWALI = { on: true, until: '', toteSingle: 99, text: 'Diwali offer' };

  var rs = function (n) { return '₹' + n; };
  function diwaliOn() {
    if (!DIWALI.on) return false;
    if (!DIWALI.until) return true;
    var end = new Date(DIWALI.until + 'T23:59:59'); return isNaN(end) ? true : new Date() <= end;
  }
  function toteUnit(q) {
    q = Math.max(1, q | 0);
    var t = PRICES.tote.tiers.filter(function (x) { return q >= x.min; })[0];
    var regular = t.price;
    if (q === 1 && diwaliOn()) return { unit: DIWALI.toteSingle, regular: regular, diwali: true };
    return { unit: regular, regular: regular, diwali: false };
  }
  var state = { qty: 1, fabric: 'pigeon' };

  function css() {
    if (document.getElementById('ppcss')) return;
    var s = document.createElement('style'); s.id = 'ppcss';
    s.textContent =
      '.ppbox{width:100%;max-width:460px;align-self:center;box-sizing:border-box;margin:12px 0;padding:14px 16px;background:#fffdf7;border:1.5px solid #ecd9a6;border-radius:12px;font:400 .82rem/1.45 "DM Sans",system-ui,sans-serif;color:#2d2320}' +
      '.ppbox h3{margin:0 0 8px;font:600 .8rem "DM Sans",system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#0d7a6e}' +
      '.ppbig{font:600 1.5rem/1.1 "Cormorant Garamond",Georgia,serif}.ppbig s{font-size:1rem;color:#8a8279;font-weight:400;margin-left:6px}' +
      '.ppbadge{display:inline-block;margin-left:8px;background:#d9531e;color:#fff;font:600 .66rem "DM Sans",sans-serif;padding:3px 9px;border-radius:999px;letter-spacing:.05em;vertical-align:middle}' +
      '.pptiers{width:100%;border-collapse:collapse;margin-top:10px;font-size:.78rem}' +
      '.pptiers td{padding:4px 6px;border-top:1px dashed #e8dcb8}.pptiers td:last-child{text-align:right;font-weight:600}' +
      '.pptiers tr.on td{background:#e8f5f2;color:#0a524a}' +
      '.ppqty{display:flex;align-items:center;gap:8px;margin-top:10px}.ppqty b{font-weight:500}' +
      '.ppqty button{width:30px;height:30px;border-radius:50%;border:1.5px solid #cdbd8a;background:#fff;font-size:1rem;cursor:pointer;line-height:1}' +
      '.ppqty input{width:64px;text-align:center;font:500 .9rem "DM Sans",sans-serif;padding:5px;border:1.5px solid #cdbd8a;border-radius:8px}' +
      '.pptotal{margin-top:8px;font-weight:600}' +
      '.ppfab{display:flex;gap:8px;flex-wrap:wrap}.ppfab button{flex:1 1 140px;text-align:left;padding:9px 11px;border:1.5px solid #e0d4ae;background:#fff;border-radius:10px;cursor:pointer;font:inherit;color:inherit}' +
      '.ppfab button.on{border-color:#0d7a6e;background:#e8f5f2;box-shadow:0 0 0 2px rgba(13,122,110,.2)}.ppfab b{display:block;font-size:1rem}' +
      '.ppnote{margin-top:8px;font-size:.7rem;color:#7a7168}';
    document.head.appendChild(s);
  }
  function html(product) {
    if (product === 'tote') {
      var u = toteUnit(state.qty), tot = u.unit * state.qty;
      var big = '<div class="ppbig">' + rs(u.unit) + ' <span style="font-size:.9rem;font-weight:400">each</span>' +
        (u.diwali ? '<s>' + rs(u.regular) + '</s><span class="ppbadge">' + DIWALI.text.toUpperCase() + '</span>' : '') + '</div>';
      var asc = PRICES.tote.tiers.slice().reverse();
      var cur = asc.filter(function (t) { return state.qty >= t.min; }).pop();
      var rows = asc.map(function (t, i) {
        var next = asc[i + 1];
        var label = next ? (t.min === next.min - 1 ? t.min + ' bag' : t.min + ' to ' + (next.min - 1) + ' bags') : t.min + ' or more bags';
        return '<tr class="' + (!u.diwali && t === cur ? 'on' : '') + '"><td>' + label + '</td><td>' + rs(t.price) + ' each</td></tr>';
      }).join('');
      var dr = diwaliOn() ? '<tr class="' + (u.diwali ? 'on' : '') + '"><td>' + DIWALI.text + ': 1 bag</td><td>' + rs(DIWALI.toteSingle) + '</td></tr>' : '';
      return '<h3>Tote bag price</h3>' + big +
        '<div class="ppqty"><b>Quantity</b><button type="button" data-q="-1" aria-label="Fewer">−</button><input type="number" min="1" max="5000" value="' + state.qty + '" inputmode="numeric" aria-label="Quantity"><button type="button" data-q="1" aria-label="More">+</button></div>' +
        '<div class="pptotal">Total: ' + rs(tot) + '</div>' +
        '<table class="pptiers">' + dr + rows + '</table>' +
        '<div class="ppnote">Bulk prices apply per bag. Confirm your order on WhatsApp.</div>';
    }
    if (product === 'blouse') {
      var b = PRICES.blouse.fabrics.map(function (f) {
        return '<button type="button" data-f="' + f.id + '" class="' + (state.fabric === f.id ? 'on' : '') + '"><span>' + f.name + '</span><b>' + rs(f.price) + '</b><span style="font-size:.7rem;color:#7a7168">' + f.note + '</span></button>';
      }).join('');
      return '<h3>Choose fabric &amp; price</h3><div class="ppfab">' + b + '</div><div class="ppnote">Confirm your order on WhatsApp.</div>';
    }
    if (product === 'tshirt') {
      return '<h3>T-shirt price</h3><div class="ppbig"><span style="font-size:.9rem;font-weight:400">Starting from</span> ' + rs(PRICES.tshirt.from) + '</div><div class="ppnote">Final price depends on size and design. Confirm on WhatsApp.</div>';
    }
    return '';
  }
  function mount(el) {
    var product = el.getAttribute('data-product'); css();
    var draw = function () { el.innerHTML = html(product); wire(); };
    var wire = function () {
      var q = el.querySelector('.ppqty input');
      if (q) q.oninput = function () { state.qty = Math.min(5000, Math.max(1, parseInt(q.value, 10) || 1)); var pos = q.selectionStart; draw(); var n = el.querySelector('.ppqty input'); n.focus(); try { n.setSelectionRange(pos, pos); } catch (e) {} };
      el.querySelectorAll('[data-q]').forEach(function (b) { b.onclick = function () { state.qty = Math.min(5000, Math.max(1, state.qty + parseInt(b.getAttribute('data-q'), 10))); draw(); }; });
      el.querySelectorAll('[data-f]').forEach(function (b) { b.onclick = function () { state.fabric = b.getAttribute('data-f'); draw(); }; });
    };
    el.className = 'ppbox'; draw();
  }
  window.PPPrice = {
    mount: mount,
    // text to put in the WhatsApp enquiry
    waText: function (product) {
      if (product === 'tote') { var u = toteUnit(state.qty); return 'Quantity: ' + state.qty + '\nPrice: ' + rs(u.unit) + ' each' + (u.diwali ? ' (' + DIWALI.text + ')' : '') + ', total ' + rs(u.unit * state.qty) + '\n'; }
      if (product === 'blouse') { var f = PRICES.blouse.fabrics.filter(function (x) { return x.id === state.fabric; })[0]; return 'Fabric: ' + f.name + ' - ' + rs(f.price) + ' (' + f.note + ')\n'; }
      if (product === 'tshirt') return 'Price: starting from ' + rs(PRICES.tshirt.from) + '\n';
      return '';
    },
    // short text for the homepage cards
    card: function (product) {
      if (product === 'tote') {
        var low = PRICES.tote.tiers[0].price, reg = PRICES.tote.tiers[PRICES.tote.tiers.length - 1].price;
        return diwaliOn() ? '<b>' + DIWALI.text + ': 1 bag ' + rs(DIWALI.toteSingle) + '</b> &middot; regular ' + rs(reg) + ' &middot; bulk from ' + rs(low) : rs(reg) + ' each &middot; bulk from ' + rs(low);
      }
      if (product === 'blouse') return PRICES.blouse.fabrics.map(function (f) { return f.name + ' ' + rs(f.price); }).join(' &middot; ');
      if (product === 'tshirt') return 'Starting from ' + rs(PRICES.tshirt.from);
      return '';
    }
  };
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-product]').forEach(function (el) { if (el.id === 'ppprice') mount(el); });
    document.querySelectorAll('[data-pp]').forEach(function (el) { el.innerHTML = window.PPPrice.card(el.getAttribute('data-pp')); });
  });
})();
