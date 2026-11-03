import test from 'node:test';
import assert from 'node:assert/strict';
import {
  extractHtml,
  validateHtml,
  checkJsSyntax,
  checkMissingDomIds,
  validateAnswerCodeBlocks,
  isEchoResponse,
  taskGuide,
  secureHtml
} from './core.js';

test('extractHtml extracts clean HTML from fenced blocks and strips <think> tags', () => {
  const raw = `<think>Nejprve navrhnu strukturu...</think>\nZde je projekt:\n\`\`\`html\n<!doctype html><html lang="cs"><head><title>Test</title></head><body><button id="b">Klik</button></body></html>\n\`\`\`\nHotovo.`;
  const html = extractHtml(raw);
  assert.ok(html);
  assert.equal(html.startsWith('<!doctype html>'), true);
  assert.equal(html.endsWith('</html>'), true);
});

test('checkJsSyntax detects valid JS and catches syntax errors', () => {
  assert.equal(checkJsSyntax('const a = 1 + 2; console.log(a);'), null);
  assert.equal(checkJsSyntax('const data = await Promise.resolve(42);'), null);
  const err = checkJsSyntax('function broken( { return 1; }');
  assert.ok(err);
});

test('checkMissingDomIds detects missing DOM elements referenced in script', () => {
  const badHtml = `<!doctype html><html><head><title>App</title></head><body><div id="present"></div><script>
    const a = document.getElementById('present');
    const b = document.getElementById('missingBtn');
    const c = document.querySelector('#missingInput');
  </script></body></html>`;
  const missing = checkMissingDomIds(badHtml);
  assert.deepEqual(missing, ['missingBtn', 'missingInput']);
});

test('validateHtml passes valid interactive app and catches syntax + DOM ID + external link issues', () => {
  const goodHtml = `<!doctype html><html lang="cs"><head><title>Kalkulačka</title></head><body><input id="num"><button id="calc">Spočítat</button><script>document.getElementById('calc').onclick = () => {};</script></body></html>`;
  assert.deepEqual(validateHtml(goodHtml, 'Vytvoř kalkulačku'), []);

  const brokenHtml = `<!doctype html><html lang="cs"><head><title>Hra</title><script src="https://cdn.example.com/lib.js"></script></head><body><script>document.getElementById('ghost').onclick = ( => {};</script></body></html>`;
  const issues = validateHtml(brokenHtml, 'Vytvoř hru');
  assert.ok(issues.some(i => i.includes('Externí zdroj')));
  assert.ok(issues.some(i => i.includes('Chyba syntaxe JS')));
  assert.ok(issues.some(i => i.includes('#ghost')));
});

test('isEchoResponse does NOT falsely reject detailed answers that contain the prompt text', () => {
  const prompt = 'Napiš v JavaScriptu funkci debounce a vysvětli její použití.';
  const detailedAnswer = `Zde je vysvětlení pro tvůj dotaz („Napiš v JavaScriptu funkci debounce a vysvětli její použití“):

Funkce \`debounce\` zajišťuje, že se obslužná funkce zavolá až po uplynutí daného času od poslední události.

\`\`\`js
function debounce(fn, delay = 250) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
\`\`\``;
  assert.equal(isEchoResponse(prompt, detailedAnswer), false);
  assert.equal(isEchoResponse(prompt, prompt), true);
  assert.equal(isEchoResponse(prompt, '  ' + prompt + '? '), true);
});

test('validateAnswerCodeBlocks catches broken JS code blocks in assistant answers', () => {
  const goodMd = 'Ukázka:\n```js\nfunction sum(a, b) { return a + b; }\n```';
  assert.deepEqual(validateAnswerCodeBlocks(goodMd), []);

  const badMd = 'Ukázka:\n```javascript\nfunction sum(a, b { return a + b; }\n```';
  const issues = validateAnswerCodeBlocks(badMd);
  assert.equal(issues.length, 1);
});

test('secureHtml injects CSP and runtime error bridge into head', () => {
  const html = '<!doctype html><html><head><title>App</title></head><body></body></html>';
  const secured = secureHtml(html);
  assert.ok(secured.includes('Content-Security-Policy'));
  assert.ok(secured.includes('kodovna-preview-error'));
});

test('taskGuide returns specialized architecture blueprints for games, calculators, apps, and websites', () => {
  assert.ok(taskGuide('Vytvoř hru Had').includes('GAME'));
  assert.ok(taskGuide('Vědecká kalkulačka').includes('CALCULATOR/TOOL'));
  assert.ok(taskGuide('Správce úkolů todo').includes('APPLICATION'));
  assert.ok(taskGuide('Firemní web kavárny').includes('WEBSITE'));
});
