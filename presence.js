(() => {
  const badge = document.querySelector('#presence');
  const label = document.querySelector('#presence-label');
  let pending = false;
  let timer;
  function show(state, text) {
    badge.dataset.state = state;
    label.textContent = text;
  }
  async function refresh() {
    clearTimeout(timer);
    if (pending || document.hidden) return;
    pending = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch('https://api.xatblog.net/onlinecheck/rainha', {
        signal: controller.signal,
        cache: 'no-store',
        credentials: 'omit'
      });
      if (!response.ok) throw new Error('Status indisponível');
      const data = await response.json();
      const status = typeof data.status === 'string' ? data.status.trim().toLowerCase() : '';
      if (data.code != null && Number(data.code) !== 200) throw new Error('Resposta inválida');
      if (status === 'online') show('online', 'Online no xat');
      else if (status === 'available') show('available', 'Disponível no xat');
      else if (status === 'offline') show('offline', 'Offline no xat');
      else throw new Error('Status desconhecido');
    } catch {
      show('unknown', 'Status indisponível');
    } finally {
      clearTimeout(timeout);
      pending = false;
      if (!document.hidden) timer = setTimeout(refresh, 60000);
    }
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearTimeout(timer);
    else refresh();
  });
  refresh();
})();

