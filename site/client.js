export function readFilterState(url) {
  const parsed = new URL(url, 'https://example.invalid/');
  return {
    query: (parsed.searchParams.get('q') || '').trim().toLowerCase(),
    label: (parsed.searchParams.get('label') || '').trim().toLowerCase(),
  };
}

export function matchesIssueCard(card, filters) {
  const query = (filters.query || '').trim().toLowerCase();
  const label = (filters.label || '').trim().toLowerCase();
  const searchText = (card.searchText || '').toLowerCase();
  const labels = (card.labels || '').toLowerCase().split('|').filter(Boolean);
  return (!query || searchText.includes(query)) && (!label || labels.includes(label));
}

function setupIndex(documentRef, windowRef) {
  const cards = [...documentRef.querySelectorAll('[data-issue-card]')];
  if (!cards.length) return;

  const input = documentRef.querySelector('[data-search-input]');
  const count = documentRef.querySelector('[data-result-count]');
  const empty = documentRef.querySelector('[data-filter-empty]');
  const filters = readFilterState(windowRef.location.href);

  if (input) input.value = filters.query;
  for (const link of documentRef.querySelectorAll('[data-filter-link]')) {
    if ((link.dataset.label || '').toLowerCase() === filters.label) link.setAttribute('aria-current', 'true');
  }

  const apply = (state) => {
    let visible = 0;
    for (const element of cards) {
      const match = matchesIssueCard({
        searchText: element.dataset.search || '',
        labels: element.dataset.labels || '',
      }, state);
      element.hidden = !match;
      if (match) visible += 1;
    }
    if (count) count.textContent = String(visible);
    if (empty) empty.hidden = visible !== 0;
  };

  apply(filters);
  if (input) {
    input.addEventListener('input', () => apply({ ...filters, query: input.value.trim().toLowerCase() }));
  }
}

function setupCopyLinks(documentRef, navigatorRef) {
  for (const button of documentRef.querySelectorAll('[data-copy-link]')) {
    button.addEventListener('click', async () => {
      const value = button.dataset.copyValue || '';
      const original = button.textContent;
      try {
        await navigatorRef.clipboard.writeText(value);
        button.textContent = 'Copied';
      } catch {
        button.textContent = 'Copy failed';
      }
      window.setTimeout(() => { button.textContent = original; }, 1600);
    });
  }
}

if (typeof document !== 'undefined' && typeof window !== 'undefined') {
  setupIndex(document, window);
  setupCopyLinks(document, navigator);
}
