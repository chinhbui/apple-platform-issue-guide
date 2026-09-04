import test from 'node:test';
import assert from 'node:assert/strict';

import { matchesIssueCard, readFilterState } from '../client.js';

test('matchesIssueCard applies query and label together', () => {
  const card = {
    searchText: '6 hls avplayer area/hls platform/ios',
    labels: 'area/hls|platform/ios',
  };

  assert.equal(matchesIssueCard(card, { query: 'avplayer', label: 'area/hls' }), true);
  assert.equal(matchesIssueCard(card, { query: 'fairplay', label: 'area/hls' }), false);
  assert.equal(matchesIssueCard(card, { query: '', label: 'area/fairplay' }), false);
});

test('readFilterState normalizes q and label from a URL', () => {
  assert.deepEqual(
    readFilterState('https://example.test/?q=%20FairPlay%20&label=area%2Ffairplay'),
    { query: 'fairplay', label: 'area/fairplay' },
  );
});
