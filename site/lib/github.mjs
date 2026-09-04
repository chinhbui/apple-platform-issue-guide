export function normalizeIssue(raw) {
  return {
    number: raw.number,
    title: raw.title || '',
    state: raw.state || 'open',
    htmlUrl: raw.html_url || '',
    bodyHtml: raw.body_html || '',
    labels: (raw.labels || []).map((label) => typeof label === 'string' ? label : label.name).filter(Boolean),
    createdAt: raw.created_at || '',
    updatedAt: raw.updated_at || '',
  };
}

export function filterIssues(items = []) {
  return items
    .filter((item) => !item.pull_request)
    .map(normalizeIssue)
    .sort((a, b) => b.number - a.number);
}

export async function fetchIssues({ repository, token, fetchImpl = fetch }) {
  if (!repository) throw new Error('GitHub repository is required');

  const all = [];
  let page = 1;
  while (true) {
    const url = `https://api.github.com/repos/${repository}/issues?state=all&per_page=100&page=${page}`;
    const headers = {
      Accept: 'application/vnd.github.full+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'apple-platform-issue-guide-pages-builder',
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetchImpl(url, { headers });
    if (!response.ok) {
      const detail = typeof response.text === 'function' ? await response.text() : '';
      throw new Error(`GitHub Issues request failed (${response.status}): ${detail || 'unknown error'}`);
    }

    const items = await response.json();
    if (!Array.isArray(items)) {
      throw new Error('GitHub Issues request returned a non-array payload');
    }
    all.push(...items);
    if (items.length < 100) break;
    page += 1;
  }

  return filterIssues(all);
}
