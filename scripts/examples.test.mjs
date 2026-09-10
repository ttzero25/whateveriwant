// Correctness tests for the algorithms taught in the concept docs.
// The docs show these in Python; here we re-express the same logic in JS and assert it
// behaves as claimed, so a wrong worked example cannot pass review unnoticed.
import test from 'node:test';
import assert from 'node:assert/strict';

test('edit distance (cs/dynamic-programming)', () => {
  const editDistance = (a, b) => {
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++)
      for (let j = 1; j <= n; j++)
        dp[i][j] = a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    return dp[m][n];
  };
  assert.equal(editDistance('kitten', 'sitting'), 3);
  assert.equal(editDistance('', 'abc'), 3);
  assert.equal(editDistance('same', 'same'), 0);
});

test('token bucket rate limiter (security/availability-dos)', () => {
  class TokenBucket {
    constructor(rate, capacity) { this.rate = rate; this.cap = capacity; this.tokens = capacity; this.t = 0; }
    allow(now, cost = 1) {
      this.tokens = Math.min(this.cap, this.tokens + (now - this.t) * this.rate);
      this.t = now;
      if (this.tokens >= cost) { this.tokens -= cost; return true; }
      return false;
    }
  }
  const b = new TokenBucket(1, 3);          // 1 token/sec, burst 3
  assert.equal(b.allow(0), true);
  assert.equal(b.allow(0), true);
  assert.equal(b.allow(0), true);
  assert.equal(b.allow(0), false);          // burst exhausted
  assert.equal(b.allow(1), true);           // 1s later, one token refilled
  assert.equal(b.allow(1), false);
});

test('NTP offset/delay symmetry (network/time-sync)', () => {
  const ntp = (t1, t2, t3, t4) => ({ offset: ((t2 - t1) + (t3 - t4)) / 2, delay: (t4 - t1) - (t3 - t2) });
  // Client clock 5 behind, symmetric 2-unit path each way.
  const { offset, delay } = ntp(0, 7, 8, 3);
  assert.equal(offset, 6);
  assert.equal(delay, 2);
});

test('robust z-score is resistant to outliers (ai-for-security/ueba)', () => {
  const median = (xs) => { const s = [...xs].sort((a, b) => a - b); const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
  const robustZ = (v, hist) => { const med = median(hist); const mad = median(hist.map((x) => Math.abs(x - med))) || 1e-9; return 0.6745 * (v - med) / mad; };
  const hist = [10, 11, 9, 10, 12, 10, 11];
  assert.ok(Math.abs(robustZ(10, hist)) < 1);       // typical value -> small score
  assert.ok(robustZ(100, hist) > 20);               // far outlier -> large score
});

test('byte entropy peaks for uniform data (ai-for-security/malware-classification)', () => {
  const entropy = (bytes) => {
    if (!bytes.length) return 0;
    const counts = new Map();
    for (const b of bytes) counts.set(b, (counts.get(b) || 0) + 1);
    const n = bytes.length;
    return -[...counts.values()].reduce((s, c) => s + (c / n) * Math.log2(c / n), 0);
  };
  assert.ok(Math.abs(entropy([7, 7, 7, 7])) < 1e-9);                        // no information
  const uniform = Array.from({ length: 256 }, (_, i) => i);
  assert.ok(Math.abs(entropy(uniform) - 8) < 1e-9);                         // max for bytes
});

test('cosine-similarity recommendation (ai/recommender-systems)', () => {
  const cosine = (a, b) => { const d = Math.hypot(...a) * Math.hypot(...b); return d ? a.reduce((s, x, i) => s + x * b[i], 0) / d : 0; };
  const R = [[5, 4, 0, 0], [4, 5, 0, 1], [0, 0, 5, 4]];
  const recommend = (u) => {
    const scores = Array(R[0].length).fill(0);
    R.forEach((row, o) => { if (o !== u) { const sim = cosine(R[u], row); row.forEach((v, i) => (scores[i] += sim * v)); } });
    R[u].forEach((v, i) => { if (v > 0) scores[i] = -1; });
    return scores.indexOf(Math.max(...scores));
  };
  assert.equal(recommend(0), 3);            // most similar user (1) rated item 3
});

test('RMS schedulability bound (os/realtime-scheduling)', () => {
  const bound = (n) => n * (2 ** (1 / n) - 1);
  assert.ok(0.5 <= bound(2) && bound(2) < 0.83);
  assert.ok(bound(1000) > 0.69 && bound(1000) < 0.70);   // approaches ln 2
});

test('overflow-safe multiply guard (vulnerabilities/integer-overflow)', () => {
  const MAX = 0xffffffff;                    // simulate 32-bit unsigned budget
  const safeMul = (count, size) => (size !== 0 && count > Math.floor(MAX / size) ? null : count * size);
  assert.equal(safeMul(10, 10), 100);
  assert.equal(safeMul(0x10000, 0x10000), null);   // would wrap -> rejected
});

test('DFA accepts even count of ones (cs/automata-regex)', () => {
  const trans = { even: { 0: 'even', 1: 'odd' }, odd: { 0: 'odd', 1: 'even' } };
  const accepts = (s) => { let st = 'even'; for (const c of s) { if (!(c in trans[st])) return false; st = trans[st][c]; } return st === 'even'; };
  assert.equal(accepts('11'), true);     // two ones -> even
  assert.equal(accepts('0110'), true);   // two ones -> even
  assert.equal(accepts('101'), true);    // two ones -> even
  assert.equal(accepts('1'), false);     // one one -> odd
  assert.equal(accepts('111'), false);   // three ones -> odd
});

test('open-redirect safe_next rejects external targets (vulnerabilities/open-redirect)', () => {
  const safeNext = (raw, def = '/') => {
    if (!raw) return def;
    let u; try { u = new URL(raw, 'http://x'); } catch { return def; }
    if (/^[a-z]+:/i.test(raw) || raw.startsWith('//')) return def;   // scheme or protocol-relative
    if (!raw.startsWith('/') || raw.startsWith('//')) return def;
    return u.pathname;
  };
  assert.equal(safeNext('/dashboard'), '/dashboard');
  assert.equal(safeNext('//evil.com'), '/');
  assert.equal(safeNext('https://evil.com'), '/');
  assert.equal(safeNext(''), '/');
});
