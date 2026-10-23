// Shared admin client for the Prinky Print designer pages.
// Talks to /api/data (public read) and /api/admin (password-protected writes).
// If the API is not there (plain static hosting), load() returns null and the pages
// fall back to the old shared-*.json files.
(function () {
  var KEY = 'pp_admin_pw';
  function getPw() { try { return sessionStorage.getItem(KEY) || ''; } catch (e) { return ''; } }
  function setPw(v) { try { v ? sessionStorage.setItem(KEY, v) : sessionStorage.removeItem(KEY); } catch (e) {} }
  async function post(body) {
    var r = await fetch('/api/admin', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(Object.assign({ password: getPw() }, body))
    });
    var j = {}; try { j = await r.json(); } catch (e) {}
    return { ok: r.ok, status: r.status, data: j };
  }
  function must(r, fallback) { if (!r.ok) { var e = new Error((r.data && r.data.error) || fallback); e.status = r.status; throw e; } return r.data; }
  window.PPAdmin = {
    // -> { exists, designs:[{id,label,src}], config } or null when there is no working server
    load: async function (product) {
      try {
        var r = await fetch('/api/data?product=' + encodeURIComponent(product) + '&t=' + Date.now(), { cache: 'no-store' });
        if (!r.ok) return null;
        var j = await r.json();
        return j && Array.isArray(j.designs) ? j : null;
      } catch (e) { return null; }
    },
    login: async function (pw) {
      setPw(pw);
      try {
        var r = await post({ action: 'login' });
        if (r.ok) return { ok: true };
        setPw('');
        return { ok: false, error: (r.data && r.data.error) || 'Login failed' };
      } catch (e) { setPw(''); return { ok: false, error: 'Could not reach the server' }; }
    },
    logout: function () { setPw(''); },
    addDesign: async function (product, label, dataUrl) { return must(await post({ action: 'addDesign', product: product, label: label, dataUrl: dataUrl }), 'Upload failed').design; },
    deleteDesign: async function (product, id) { must(await post({ action: 'deleteDesign', product: product, id: id }), 'Delete failed'); },
    saveConfig: async function (product, config) { must(await post({ action: 'saveConfig', product: product, config: config }), 'Could not save settings'); }
  };
})();
