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
    lastError: '',
    load: async function (product) {
      var self = window.PPAdmin;
      try {
        var r = await fetch('/api/data?product=' + encodeURIComponent(product) + '&t=' + Date.now(), { cache: 'no-store' });
        var j = null; try { j = await r.json(); } catch (e) {}
        if (!r.ok) { self.lastError = 'server replied ' + r.status + (j && j.error ? ': ' + j.error : ''); return null; }
        if (!j || !Array.isArray(j.designs)) { self.lastError = 'unexpected reply from /api/data'; return null; }
        self.lastError = '';
        return j;
      } catch (e) { self.lastError = 'could not reach /api/data'; return null; }
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
