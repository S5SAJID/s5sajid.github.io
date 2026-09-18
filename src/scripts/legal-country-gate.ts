const gate = document.querySelector<HTMLElement>('[data-country-gate]');
const content = document.querySelector<HTMLElement>('[data-legal-content]');
const countryStatus = document.querySelector<HTMLElement>('[data-country-status]');

if (gate && content && countryStatus) {
  let activeRequest: AbortController | undefined;

  const hideDocuments = () => {
    content.hidden = true;
    gate.hidden = false;
  };

  const checkCountry = async () => {
    activeRequest?.abort();
    const controller = new AbortController();
    activeRequest = controller;
    hideDocuments();
    countryStatus.textContent = 'Checking your country…';
    const timeout = window.setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch('https://free.freeipapi.com/api/v1/json', {
        signal: controller.signal,
        credentials: 'omit',
        cache: 'no-store',
        referrerPolicy: 'no-referrer',
      });
      if (!response.ok) throw new Error('Country lookup unavailable');
      const result: unknown = await response.json();
      if (
        typeof result !== 'object' || result === null ||
        !('countryCode' in result) || typeof result.countryCode !== 'string' ||
        !/^[A-Z]{2}$/.test(result.countryCode)
      ) throw new Error('Invalid country response');
      if (activeRequest !== controller) return;

      if (result.countryCode !== 'PK') {
        countryStatus.textContent = 'These documents are available only to visitors whose IP location is Pakistan. Your connection was not identified as being in Pakistan.';
        return;
      }

      gate.hidden = true;
      content.hidden = false;
      if (window.location.hash) {
        let fragment = window.location.hash.slice(1);
        try { fragment = decodeURIComponent(fragment); } catch { /* Ignore malformed URL encoding. */ }
        const target = document.getElementById(fragment);
        if (target && content.contains(target)) target.scrollIntoView();
      }
    } catch {
      if (activeRequest !== controller) return;
      hideDocuments();
      countryStatus.textContent = 'We could not confirm your country. Documents remain unavailable.';
    } finally {
      window.clearTimeout(timeout);
    }
  };

  void checkCountry();
  window.addEventListener('pagehide', () => {
    activeRequest?.abort();
    activeRequest = undefined;
    hideDocuments();
  });
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) void checkCountry();
  });
}
