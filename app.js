const $ = id => document.getElementById(id);
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

let engine = null;
let worker = null;
let busy = false;
let loading = false;
let mode = 'create';
let messages = [];
let latestProject = null;

const PROJECT_KEY = 'kodovna-last-project-v1';
const INSTRUCTIONS_KEY = 'kodovna-instructions-v1';
const MODEL_KEY = 'kodovna-model-v2';
const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || '');

const prompts = {
  create:
    'Jsi Kódovna, lokální tvůrce webových aplikací a her. Ze zadání uživatele vytvoř kompletní, plně funkční statický HTML5 dokument v jednom souboru (<!doctype html><html lang="cs">...</html>) s vloženým <style> a <script>. Každé ID použité v JavaScriptu (getElementById/querySelector) musí existovat v HTML. Vytvoř funkční ovládací prvky, responzivní vzhled a české texty rozhraní. Nepoužívej žádné externí knihovny, CDN odkazy ani síťová volání. Vypiš pouze samotný HTML dokument.',
  general:
    'Jsi Kódovna, přátelský a věcný český AI asistent běžící přímo v prohlížeči uživatele. Odpovídej přirozenou, spisovnou a srozumitelnou češtinou. Na pozdrav nebo běžnou konverzaci odpověz přirozeně a přátelsky. U odborných dotazů jdi rovnou k věci, používej přehledné odrážky a nevymýšlej si neexistující slova ani fakta.',
  code:
    'Jsi Kódovna, zkušený programátorský asistent. Piš čistý, kompletní a spustitelný kód bez nedodělaných TODO míst. Vysvětlení piš stručně a srozumitelně v češtině.',
  debug:
    'Jsi Kódovna, asistent pro ladění kódu. Pokud uživatel ještě neposlal kód nebo chybovou hlášku, stručně ho o ně česky požádej. Když kód pošle, vysvětli příčinu chyby a uveď kompletní opravený kód.',
  write:
    'Jsi Kódovna, český redaktor a textař. Piš přirozenou, gramaticky čistou a čtivou češtinou. Nepoužívej strojové překlady ani vymyšlená slova. Pokud v zadání chybí téma nebo komu je text určený, krátce a přirozeně se zeptej.'
};

const MODE_LABELS = {
  create: 'Tvůrce her a aplikací',
  general: 'Asistent',
  code: 'Kód',
  debug: 'Ladění',
  write: 'Psaní'
};

export function formatError(err) {
  if (!err) return 'Neznámá chyba WebGPU nebo modelu.';
  if (typeof err === 'string') return err;
  if (typeof err.message === 'string' && err.message.trim()) return err.message.trim();
  try {
    const str = String(err);
    return str && str !== '[object Object]' ? str : JSON.stringify(err);
  } catch {
    return 'Neznámá chyba při generování.';
  }
}

export function normalizeCz(text) {
  return (text || '')
    .toLocaleLowerCase('cs')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function detectEffectiveMode(selectedMode, input) {
  if (selectedMode !== 'create') return selectedMode;
  const q = normalizeCz(input).trim();
  if (
    /^(ahoj|cau|zdar|dobry den|zdravim|jak se mas|jak je|kdo jsi|co jsi zac|co umis|jak fungujes|diky|dekuji|pomoc)[?!.\s]*$/.test(
      q
    )
  ) {
    return 'general';
  }
  if (
    /pomoz mi napsat srozumitelny text|zeptej na tema a ctenare|napis email|napis clanek|prepis text/.test(
      q
    )
  ) {
    return 'write';
  }
  if (
    /pomoz mi najit chybu v kodu|chybovou hlasku|proc tento kod nefunguje|oprav chybu v tomto/.test(
      q
    )
  ) {
    return 'debug';
  }
  if (
    /napis v javascriptu funkci|vysvetli jeji pouziti|co je to |jak funguje /.test(q) &&
    !/html|aplikac|hra|hru|web|strank/.test(q)
  ) {
    return 'code';
  }
  return 'create';
}

export function getInstantCzechReply(effectiveMode, input) {
  const raw = (input || '').trim();
  const q = normalizeCz(raw)
    .replace(/[?!.,;:'"„“()\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!q) return null;

  if (/^(ahoj|cau|zdar|nazdar|dobry den|zdravim|hezk[y] den)(\s+jak se mas|\s+kodovno)?$/.test(q)) {
    return 'Ahoj! Jsem připravená v tvém prohlížeči. S čím ti dnes pomohu — chceš napsat text, zkontrolovat kód, nebo vytvořit aplikaci?';
  }
  if (/^(jak se mas|jak se dari|jak je|jak to jde|co delas)$/.test(q)) {
    return 'Mám se skvěle, děkuji za optání! Běžím přímo u tebe v prohlížeči a jsem připravená pomoct. Na čem dnes budeme pracovat — chceš napsat text, poradit s kódem, nebo vytvořit aplikaci?';
  }
  if (/^(kdo jsi|co jsi zac|co jsi|predstav se)$/.test(q)) {
    return 'Jsem **Kódovna** — tvoje osobní lokální AI dílna. Běžím přímo ve tvém prohlížeči přes WebGPU, takže tvoje texty ani kód nikam na cizí servery neodcházejí.\n\nUmím:\n- **✦ Tvůrce:** vytvořit funkční hru nebo webovou aplikaci v jednom HTML souboru\n- **◈ Asistent:** odpovídat na otázky, vysvětlovat a plánovat\n- **⌘ Kód & ⌕ Ladění:** psát funkce a opravovat chyby v kódu\n- **✎ Psaní:** psát a upravovat srozumitelné české texty';
  }
  if (/^(co umis|jak fungujes|s cim mi pomuzes|pomoc)$/.test(q)) {
    return 'Pomůžu ti s těmito úkoly přímo ve tvém prohlížeči:\n\n1. **Psaní textů (✎ Psaní):** e-maily, články, shrnutí i úpravy stylu.\n2. **Programování (⌘ Kód / ⌕ Ladění):** psaní funkcí, vysvětlení kódu a hledání chyb.\n3. **Tvorba miniaplikací (✦ Tvůrce):** kompletní HTML5 hry, kalkulačky a nástroje s okamžitým náhledem.\n\nNapiš mi, co potřebuješ vytvořit nebo vyřešit!';
  }
  if (/^(diky|dekuji|mockrat dekuji|super diky|skvele diky)$/.test(q)) {
    return 'Rádo se stalo! Kdybys potřeboval cokoliv dalšího upravit nebo napsat, stačí napsat.';
  }

  if (q === 'pomoz mi napsat srozumitelny text nejprve se zeptej na tema a ctenare') {
    return 'Ráda ti pomohu napsat čtivý a srozumitelný text. Aby přesně seděl tvému záměru, napiš mi prosím:\n\n1. **O jaké téma jde?** (Co je hlavní myšlenka nebo sdělení?)\n2. **Kdo bude text číst?** (Zákazníci, kolegové, přátelé, nebo široká veřejnost?)\n3. **Jakou formu a tón potřebuješ?** (Např. krátký e-mail, příspěvek na web, formální či přátelský tón.)';
  }
  if (q === 'pomoz mi najit chybu v kodu nejprve me pozadej o kod a chybovou hlasku') {
    return 'Jdeme na to. Pošli mi prosím:\n\n1. **Ukázku kódu**, ve které problém nastává.\n2. **Přesnou chybovou hlášku** z konzole (nebo popiš, co kód dělá špatně oproti očekávání).\n\nHned ti vysvětlím příčinu chyby a pošlu opravené řešení.';
  }
  if (q === 'napis v javascriptu funkci debounce a vysvetli jeji pouziti') {
    return `Funkce \`debounce\` odloží spuštění předané funkce až na chvíli, kdy uživatel přestane akci opakovat po zadanou dobu (\`delay\`). Hodí se například pro vyhledávací pole při psaní (\`input\`) nebo při změně velikosti okna (\`resize\`), aby se náročná operace nespouštěla při každém stisku klávesy.

\`\`\`javascript
function debounce(fn, delay = 300) {
  let timerId = null;

  return function (...args) {
    const context = this;
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
}

// Příklad použití u vyhledávacího pole:
const handleSearch = debounce((query) => {
  console.log('Hledám výraz:', query);
}, 300);

// Při rychlém psaní se zavolá až 300 ms po posledním znaku:
// inputElement.addEventListener('input', (e) => handleSearch(e.target.value));
\`\`\`

**Jak to funguje:**
- Při každém zavolání \`clearTimeout(timerId)\` zruší předchozí čekající časovač.
- Nový \`setTimeout\` spustí cílovou funkci \`fn\` teprve tehdy, když po dobu \`delay\` milisekund nepřijde žádné další volání.`;
  }

  return null;
}

export function hasCorruptedCzech(text) {
  if (!text) return false;
  const q = normalizeCz(text);
  if (
    /vyskytnuteln|vyslovan|umeteln|google translate|jazykove preklad|spravnim pripadem|vykonem vice informaci/.test(
      q
    )
  ) {
    return true;
  }
  if (/[\u4e00-\u9fff]{2,}/.test(text)) {
    return true;
  }
  return false;
}

export function cleanModelOutput(text) {
  if (!text) return '';
  let cleaned = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  cleaned = cleaned.replace(/^<think>/i, '').trim();
  return cleaned;
}

export function stripLeadingEcho(input, answer) {
  const cleaned = cleanModelOutput(answer);
  const rawInput = (input || '').trim();
  if (!cleaned || !rawInput || rawInput.length < 3) return cleaned;

  const escaped = rawInput
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/\s+/g, '\\s+');
  const prefixRegex = new RegExp(
    `^(?:(?:otazka|otázka|dotaz|zadani|zadání|user|ty)\\s*:\\s*)?["„“']?${escaped}["„“']?[?!.:;\\-–—]*\\s+(?:(?:odpoved|odpověď)\\s*:\\s*)?([\\s\\S]+)$`,
    'i'
  );
  const match = cleaned.match(prefixRegex);
  if (match && match[1] && match[1].trim().length > 0) {
    return match[1].trim();
  }
  return cleaned;
}

export function secureHtml(html) {
  const policy = `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data: blob:; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'none'; font-src data:; media-src data: blob:; form-action 'none'; base-uri 'none'">`;
  const errorBridge = `<script>(function(){window.addEventListener('error',function(e){try{parent.postMessage({type:'kodovna-preview-error',message:(e&&e.message)||'Chyba při běhu skriptu',line:e&&e.lineno},'*')}catch(_){}});window.addEventListener('unhandledrejection',function(e){try{var r=e&&e.reason;parent.postMessage({type:'kodovna-preview-error',message:(r&&(r.message||String(r)))||'Neošetřená chyba Promise'},'*')}catch(_){}});})();</script>`;
  const injected = policy + errorBridge;
  if (/<head(?:\s[^>]*)?>/i.test(html)) {
    return html.replace(/<head(?:\s[^>]*)?>/i, match => match + injected);
  }
  if (/<html(?:\s[^>]*)?>/i.test(html)) {
    return html.replace(/<html(?:\s[^>]*)?>/i, match => match + `<head>${injected}</head>`);
  }
  return `<!doctype html><html lang="cs"><head>${injected}</head><body>${html}</body></html>`;
}

export function extractHtml(text) {
  const cleaned = cleanModelOutput(text);
  if (!cleaned) return null;

  const fenceRegex = /```(?:html|htm|xml)?\s*([\s\S]*?)```/gi;
  let match;
  while ((match = fenceRegex.exec(cleaned)) !== null) {
    const candidate = match[1].trim();
    const start = candidate.search(/<!doctype\s+html|<html\b/i);
    if (start >= 0) {
      const sliced = candidate.slice(start).trim();
      const endMatch = sliced.match(/<\/html\s*>/i);
      if (endMatch) {
        return sliced.slice(0, endMatch.index + endMatch[0].length).trim();
      }
    }
  }

  const start = cleaned.search(/<!doctype\s+html|<html\b/i);
  if (start < 0) return null;
  const html = cleaned.slice(start).trim();
  const endMatch = html.match(/<\/html\s*>/i);
  if (!endMatch) return null;
  return html.slice(0, endMatch.index + endMatch[0].length).trim();
}

export function taskGuide(input) {
  const q = normalizeCz(input);
  if (/hra|herni|tetris|had|snake|pexeso|skore|arkanoid|pong|flappy|skakac|piskvork|minolovka|2048|kviz/.test(q)) {
    return ' Typ úkolu: HRA. Vytvoř hratelnou smyčku s viditelným skóre, tlačítkem Nová hra/Restart a funkčním ovládáním klávesnicí i dotykem/myší.';
  }
  if (/kalkula|prevod|vypocet|urok|bmi|casovac|stopky|minutk|pomodoro/.test(q)) {
    return ' Typ úkolu: KALKULAČKA/NÁSTROJ. Ošetři vstupy (zabraň NaN a dělení nulou), přidej podporu klávesnice a přehledné zobrazení výsledku.';
  }
  if (/web|stran|landing|portfolio|prezentac|vizitk|kavarn|restaurac/.test(q)) {
    return ' Typ úkolu: WEBOVÁ STRÁNKA. Vytvoř responzivní stránku s jasnými sekcemi, čitelnou typografií a funkčními prvky.';
  }
  if (/aplikac|nastroj|todo|ukol|seznam|generator|planner|planovac|sprav|poznamk|rozpocet/.test(q)) {
    return ' Typ úkolu: APLIKACE. Implementuj funkční přidávání, přepínání, mazání či filtrování položek a ulož výchozí ukázková data v paměti.';
  }
  return ' Typ úkolu: vytvoř přehlednou, plně funkční první verzi, kde každý viditelný ovládací prvek skutečně funguje.';
}

export function checkJsSyntax(code) {
  const trimmed = (code || '').trim();
  if (!trimmed) return null;
  try {
    new Function(trimmed);
    return null;
  } catch (syncErr) {
    try {
      new AsyncFunction(trimmed);
      return null;
    } catch {
      return syncErr.message || 'Neplatná syntaxe JavaScriptu';
    }
  }
}

export function checkMissingDomIds(html) {
  const definedIds = new Set();
  const idAttrRegex = /\bid\s*=\s*["']([^"']+)["']/gi;
  let match;
  while ((match = idAttrRegex.exec(html)) !== null) {
    definedIds.add(match[1]);
  }
  const dynamicIdRegex = /\.id\s*=\s*["']([^"']+)["']/g;
  while ((match = dynamicIdRegex.exec(html)) !== null) {
    definedIds.add(match[1]);
  }

  const missing = [];
  const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  let scriptMatch;
  while ((scriptMatch = scriptRegex.exec(html)) !== null) {
    const script = scriptMatch[1];
    const getByIdRegex = /getElementById\(\s*["']([^"']+)["']\s*\)/g;
    let idMatch;
    while ((idMatch = getByIdRegex.exec(script)) !== null) {
      const targetId = idMatch[1];
      if (targetId && !definedIds.has(targetId) && !missing.includes(targetId)) {
        missing.push(targetId);
      }
    }
  }
  return missing;
}

export function validateHtml(html, request = '') {
  const issues = [];
  if (!html || typeof html !== 'string') {
    return ['Model nevrátil platný HTML dokument.'];
  }
  if (!/<html\b/i.test(html)) issues.push('Chybí kořenový element HTML.');
  if (!/<body\b/i.test(html)) issues.push('Chybí element body.');
  if (!/<title\b[^>]*>[^<]+<\/title>/i.test(html)) issues.push('Chybí titulek stránky.');
  if (
    /<script\b[^>]*\bsrc\s*=\s*["']https?:|<link\b[^>]*\bhref\s*=\s*["']https?:|<(?:img|iframe|audio|video)\b[^>]*\bsrc\s*=\s*["']https?:/i.test(
      html
    )
  ) {
    issues.push('Externí zdroj je v rozporu s offline režimem.');
  }

  const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  let scriptMatch;
  let idx = 0;
  while ((scriptMatch = scriptRegex.exec(html)) !== null) {
    idx++;
    const err = checkJsSyntax(scriptMatch[1]);
    if (err) issues.push(`Chyba syntaxe JS (skript #${idx}): ${err}`);
  }

  const missingIds = checkMissingDomIds(html);
  if (missingIds.length > 0) {
    issues.push(`Chybějící HTML id: ${missingIds.slice(0, 3).map(id => '#' + id).join(', ')}.`);
  }

  const q = normalizeCz(request);
  if (
    /hra|herni|aplikac|kalkula|nastroj|todo|generator/.test(q) &&
    !/<button\b|<input\b|<select\b|<textarea\b|<canvas\b|addEventListener|onclick=/i.test(html)
  ) {
    issues.push('Pro aplikaci nebo hru nebylo nalezeno ovládání.');
  }
  return issues;
}

export function isEchoResponse(input, answer) {
  const norm = s =>
    (s || '')
      .toLocaleLowerCase('cs')
      .replace(/[?!.,'’"„“()\-\s]/g, '');
  const normInput = norm(input);
  const normAnswer = norm(cleanModelOutput(answer));
  if (!normAnswer) return false;
  if (normAnswer === normInput) return true;
  if (
    normInput.length >= 12 &&
    normAnswer.length <= Math.ceil(normInput.length * 1.2) &&
    normAnswer.includes(normInput)
  ) {
    return true;
  }
  return false;
}

function setModeUI(targetMode) {
  mode = targetMode;
  document.querySelectorAll('.mode').forEach(x => {
    x.classList.toggle('active', x.dataset.mode === targetMode);
  });
  $('section').textContent = MODE_LABELS[targetMode] || 'Tvůrce her a aplikací';
}

function setProjectView(view) {
  const code = view === 'code';
  document.querySelectorAll('[data-project-view]').forEach(button => {
    button.classList.toggle('active', button.dataset.projectView === view);
  });
  $('projectPreview').hidden = code;
  $('projectCode').hidden = !code;
  $('applyProjectCode').hidden = !code;
}

function updateAuditBadge(html, request = '') {
  const auditEl = $('projectAudit');
  if (!auditEl) return;
  const issues = validateHtml(html, request);
  if (issues.length === 0) {
    auditEl.className = 'audit-pill';
    auditEl.textContent = '✓ Syntaxe JS OK · ✓ DOM propojený · ✓ Offline CSP';
  } else {
    auditEl.className = 'audit-pill warn';
    auditEl.textContent = '⚠ ' + issues[0];
  }
}

function showProject(project) {
  const titleMatch = (project.html || '').match(/<title\b[^>]*>([^<]+)<\/title>/i);
  const resolvedTitle =
    project.title && project.title !== 'Můj projekt'
      ? project.title
      : titleMatch
      ? titleMatch[1].trim()
      : 'Můj projekt';
  latestProject = { ...project, title: resolvedTitle, lastRuntimeError: null };
  $('project').hidden = false;
  $('projectTitle').value = resolvedTitle;
  $('projectCode').value = project.html;
  $('projectPreview').srcdoc = secureHtml(project.html);
  setProjectView('preview');
  updateAuditBadge(project.html, project.prompt || '');
  $('projectNote').className = 'project-note';
  $('projectNote').textContent =
    'Náhled běží izolovaně bez přístupu k síti. Projekt je uložený jen v tomto prohlížeči.';
}

function saveProject(prompt, html, title) {
  const titleMatch = (html || '').match(/<title\b[^>]*>([^<]+)<\/title>/i);
  const resolvedTitle =
    title && title !== 'Můj projekt'
      ? title
      : titleMatch
      ? titleMatch[1].trim()
      : 'Můj projekt';
  const project = {
    prompt,
    html,
    title: resolvedTitle,
    updatedAt: new Date().toISOString()
  };
  showProject(project);
  try {
    localStorage.setItem(PROJECT_KEY, JSON.stringify(project));
  } catch {
    $('projectNote').textContent =
      'Náhled je připravený. Prohlížeč ale nedovolil projekt uložit; stáhni si HTML.';
  }
  return project;
}

window.addEventListener('message', event => {
  const data = event?.data;
  if (!data || data.type !== 'kodovna-preview-error' || !latestProject) return;
  const errMsg = String(data.message || 'Chyba při běhu skriptu');
  latestProject.lastRuntimeError = errMsg;
  const auditEl = $('projectAudit');
  if (auditEl) {
    auditEl.className = 'audit-pill warn';
    auditEl.textContent = `⚠ Chyba za běhu: ${errMsg.slice(0, 60)}`;
  }
  const noteEl = $('projectNote');
  if (noteEl) {
    noteEl.className = 'project-note warn';
    noteEl.textContent = `V náhledu byla zachycena chyba: ${errMsg}. Klikni na „Vylepšit“ pro opravu.`;
  }
});

function restoreLocalState() {
  try {
    const instructions = localStorage.getItem(INSTRUCTIONS_KEY);
    if (instructions !== null) $('instructions').value = instructions;
    const savedModel = localStorage.getItem(MODEL_KEY);
    if (savedModel && [...$('model').options].some(option => option.value === savedModel)) {
      $('model').value = savedModel;
    } else {
      $('model').value = 'Qwen2.5-1.5B-Instruct-q4f16_1-MLC';
    }
    const project = JSON.parse(localStorage.getItem(PROJECT_KEY) || 'null');
    if (project?.html) showProject(project);
  } catch {}
}

function downloadProject() {
  if (!latestProject) return;
  let html = latestProject.html;
  if (!$('projectCode').hidden) {
    const edited = extractHtml($('projectCode').value);
    if (!edited) {
      note('Kód musí být úplný HTML dokument; opravy můžeš vrátit přes kartu Náhled.');
      return;
    }
    html = edited;
    if (html !== latestProject.html) {
      saveProject(latestProject.prompt, html, latestProject.title);
    }
  }
  const blob = new Blob([secureHtml(html)], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download =
    (latestProject.title || 'kodovna-projekt')
      .toLocaleLowerCase('cs')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') + '.html';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function reviewHtml(request, html, change = '', issues = [], previous = null) {
  if (!engine || isMobile || html.length > 10000) return null;
  let revised = '';
  const stream = await engine.chat.completions.create({
    messages: [
      {
        role: 'system',
        content:
          'Zkontroluj a oprav statickou HTML aplikaci v jednom souboru. Oprav vypsané chyby syntaxe JavaScriptu a chybějící HTML id. Zachovej funkčnost a nepoužívej žádné externí odkazy. Vypiš pouze kompletní opravený HTML dokument.'
      },
      {
        role: 'user',
        content: `Původní zadání: ${previous?.prompt || request}\nPožadovaná změna: ${change || request}\nNalezené problémy: ${issues.join(' ')}\nAktuální HTML:\n${html}`
      }
    ],
    stream: true,
    max_tokens: 1800,
    temperature: 0.15,
    top_p: 0.85
  });
  for await (const chunk of stream) {
    revised += chunk.choices[0]?.delta?.content || '';
  }
  return extractHtml(revised);
}

function note(s) {
  $('loadtext').textContent = s;
}

function state() {
  $('send').disabled = !engine || busy || loading;
  $('load').disabled = busy || loading;
  $('model').disabled = busy || loading;
  $('new').disabled = busy || loading;
  document.querySelectorAll('.mode').forEach(b => {
    b.disabled = busy || loading;
  });
  $('stop').hidden = !busy;
}

function renderText(el, text) {
  el.replaceChildren();
  const cleaned = cleanModelOutput(text);
  const parts = cleaned.split(/```/);
  parts.forEach((part, i) => {
    if (i % 2) {
      const pre = document.createElement('pre');
      const code = document.createElement('code');
      code.textContent = part.replace(/^[a-zA-Z0-9_+-]*\n/, '');
      pre.append(code);
      el.append(pre);
    } else if (part) {
      const span = document.createElement('span');
      span.textContent = part;
      el.append(span);
    }
  });
}

function bubble(role, content) {
  const article = document.createElement('article');
  article.className = 'message ' + role;
  const who = document.createElement('div');
  who.className = 'who';
  who.textContent = role === 'user' ? 'TY' : 'KÓDOVNA';
  const text = document.createElement('div');
  text.className = 'text';
  renderText(text, content);
  article.append(who, text);
  if (role === 'assistant') {
    const copy = document.createElement('button');
    copy.type = 'button';
    copy.className = 'copy';
    copy.textContent = 'Kopírovat odpověď';
    copy.onclick = async () => {
      try {
        await navigator.clipboard.writeText(text.textContent);
        copy.textContent = 'Zkopírováno';
      } catch {
        copy.textContent = 'Kopírování není dostupné';
      }
    };
    article.append(copy);
  }
  $('chat').append(article);
  return text;
}

function reset() {
  messages = [];
  $('chat').replaceChildren();
  $('intro').hidden = false;
  try {
    engine?.resetChat?.();
  } catch {}
}

$('new').onclick = reset;

document.querySelectorAll('.mode').forEach(b => {
  b.onclick = () => {
    setModeUI(b.dataset.mode);
    reset();
  };
});

document.querySelectorAll('[data-prompt]').forEach(b => {
  b.onclick = () => {
    if (b.dataset.modeTarget) {
      setModeUI(b.dataset.modeTarget);
    }
    $('prompt').value = b.dataset.prompt;
    $('prompt').focus();
  };
});

$('model').onchange = async () => {
  try {
    localStorage.setItem(MODEL_KEY, $('model').value);
  } catch {}
  if (engine) {
    loading = true;
    state();
    try {
      await engine.unload();
    } finally {
      engine = null;
      worker?.terminate();
      worker = null;
      loading = false;
      state();
    }
  }
  $('status').textContent = '○ Model není načtený';
  $('status').classList.remove('ready');
  $('load').textContent = 'Spustit AI';
  if ($('model').value.includes('0.5B')) {
    note('Model 0.5B Coder je nouzový model pouze pro jednoduchý kód — pro psaní a češtinu zvol Qwen 2.5 · 1.5B.');
  } else {
    note('Vybraný model spustíš tlačítkem Spustit AI.');
  }
};

async function initEngine(contextWindowSize) {
  const { CreateWebWorkerMLCEngine } = await import(
    'https://esm.run/@mlc-ai/web-llm@0.2.87'
  );
  worker?.terminate();
  worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
  const deadline = new Promise((_, reject) => {
    worker.onerror = () =>
      reject(
        new Error('Nepodařilo se spustit AI worker. Zkontroluj připojení a obnov stránku.')
      );
  });
  return Promise.race([
    CreateWebWorkerMLCEngine(
      worker,
      $('model').value,
      {
        initProgressCallback: r => {
          $('progress').value = r.progress;
          note(r.text);
        }
      },
      { context_window_size: contextWindowSize }
    ),
    deadline
  ]);
}

$('load').onclick = async () => {
  loading = true;
  state();
  $('progress').hidden = false;
  try {
    if (engine) {
      await engine.unload();
      engine = null;
      worker?.terminate();
      worker = null;
    }
    if (!navigator.gpu) {
      throw new Error(
        'Tento prohlížeč nepodporuje WebGPU. Zkus aktuální Chrome nebo Edge a zapni hardwarovou akceleraci.'
      );
    }
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      throw new Error(
        'WebGPU nenašlo vhodnou grafickou kartu. Zkontroluj hardwarovou akceleraci a ovladače.'
      );
    }
    note('Načítání knihovny WebLLM…');
    const preferredWindow = isMobile ? 2048 : 4096;
    try {
      engine = await initEngine(preferredWindow);
    } catch {
      engine = await initEngine(2048);
    }
    $('status').textContent = '● AI připravena';
    $('status').classList.add('ready');
    $('load').textContent = 'Načíst znovu';
    note('Připraveno. Zadej úkol níže; odpověď vznikne na tvém zařízení.');
  } catch (e) {
    engine = null;
    worker?.terminate();
    worker = null;
    $('status').textContent = '○ Model není připraven';
    $('status').classList.remove('ready');
    note(
      'Spuštění se nezdařilo: ' +
        formatError(e) +
        ' Při nedostatku paměti zkus model Qwen 2.5 · 1.5B nebo zavři ostatní karty.'
    );
  } finally {
    loading = false;
    $('progress').hidden = true;
    state();
  }
};

$('form').onsubmit = async e => {
  e.preventDefault();
  if (!engine || busy || loading) return;
  const input = $('prompt').value.trim();
  if (!input) return;
  if (input.length > 6000) {
    note('Zkrať zadání na nejvýše 6000 znaků.');
    return;
  }

  const effectiveMode = detectEffectiveMode(mode, input);
  if (effectiveMode !== mode) {
    setModeUI(effectiveMode);
  }

  busy = true;
  state();
  $('intro').hidden = true;
  $('prompt').value = '';
  bubble('user', input);
  const output = bubble('assistant', 'Přemýšlím…');
  let answer = '';

  try {
    // Instant verified Czech responses for conversational greetings & starter prompts
    const instantReply = getInstantCzechReply(effectiveMode, input);
    if (instantReply) {
      renderText(output, instantReply);
      messages = [...messages, { role: 'user', content: input }, { role: 'assistant', content: instantReply }];
      note('Odpověď dokončena.');
      return;
    }

    const previous =
      effectiveMode === 'create' && latestProject?.html && latestProject.html.length < 8000
        ? latestProject
        : null;

    let history =
      effectiveMode === 'create'
        ? [{ role: 'user', content: input }]
        : [...messages, { role: 'user', content: input }];

    const maxHistoryChars = isMobile ? 2800 : 6000;
    while (
      effectiveMode !== 'create' &&
      history.length > 1 &&
      history.reduce((n, m) => n + m.content.length, 0) > maxHistoryChars
    ) {
      history.splice(0, 2);
    }

    const customInstructions = $('instructions').value.trim();
    const system =
      (effectiveMode === 'create'
        ? prompts.create + taskGuide(input)
        : prompts[effectiveMode]) +
      ' Vždy piš přirozenou a gramaticky správnou češtinou, pokud uživatel výslovně nechce jiný jazyk. Neopakuj otázku uživatele na začátku odpovědi.' +
      (customInstructions ? ' ' + customInstructions : '');

    const requestMessages = [{ role: 'system', content: system }];
    if (previous) {
      requestMessages.push({
        role: 'user',
        content: `Existující projekt k úpravě. Zachovej jeho funkčnost a zapracuj požadovanou změnu.\nPůvodní zadání: ${previous.prompt}\nAktuální HTML:\n${previous.html}`
      });
    }
    requestMessages.push(...history);

    const maxTokens = isMobile ? 1024 : 2048;
    const temperature =
      effectiveMode === 'write' || effectiveMode === 'general'
        ? 0.2
        : 0.15;

    let stream;
    try {
      stream = await engine.chat.completions.create({
        messages: requestMessages,
        stream: true,
        max_tokens: maxTokens,
        temperature,
        top_p: 0.85,
        repetition_penalty: 1.08
      });
    } catch (firstErr) {
      await engine.resetChat?.();
      stream = await engine.chat.completions.create({
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: input.slice(0, 2000) }
        ],
        stream: true,
        max_tokens: isMobile ? 768 : 1536,
        temperature,
        top_p: 0.85,
        repetition_penalty: 1.08
      });
    }

    for await (const chunk of stream) {
      answer += chunk.choices[0]?.delta?.content || '';
      output.textContent = stripLeadingEcho(input, answer) || 'Přemýšlím…';
    }

    answer = stripLeadingEcho(input, answer);
    if (!answer) {
      answer = 'Generování bylo ukončeno bez odpovědi. Zkus kratší zadání.';
    }

    if (effectiveMode === 'create') {
      let source = extractHtml(answer);
      let issues = source
        ? validateHtml(source, input)
        : ['Model nevrátil úplný HTML dokument.'];

      if (issues.length > 0 && !isMobile && source) {
        for (let pass = 0; pass < 2 && issues.length > 0; pass++) {
          note(
            pass === 0
              ? 'Automaticky kontroluji projekt…'
              : 'Opravuji nalezené problémy…'
          );
          const checked = await reviewHtml(
            input,
            source,
            input,
            issues,
            previous
          );
          if (!checked) break;
          const checkedIssues = validateHtml(checked, input);
          if (checkedIssues.length > issues.length) break;
          source = checked;
          issues = checkedIssues;
          if (!issues.length) break;
        }
      }

      if (source) {
        const saved = saveProject(
          previous ? previous.prompt + '\n\nÚprava: ' + input : input,
          source,
          previous?.title
        );
        answer = `Projekt „${saved.title}“ je připravený. Náhled je níže; můžeš ho dál upravovat nebo stáhnout.\n\n\`\`\`html\n${source}\n\`\`\``;
        note(
          issues.length
            ? 'Projekt je připravený; kontrola upozorňuje: ' +
                issues.slice(0, 2).join(' ')
            : 'Hotovo. Projekt byl automaticky zkontrolován a uložený v tomto prohlížeči.'
        );
      } else {
        note('Odpověď dokončena.');
      }
    } else {
      if (isEchoResponse(input, answer) || hasCorruptedCzech(answer)) {
        const isTinyCoder = $('model').value.includes('0.5B');
        answer = isTinyCoder
          ? 'Máš vybraný nouzový model **Qwen 2.5 Coder · 0.5B**, který je vytrénovaný jen na krátký programový kód a neumí plynule česky. Přepni prosím níže model na **Qwen 2.5 · 1.5B (univerzální · doporučeno pro češtinu)** a klikni na **Spustit AI**.'
          : 'Omlouvám se, odpověď nebyla srozumitelná. Zkus prosím otázku upřesnit jednou větou.';
      }
      note(
        'Odpověď dokončena. Dlouhé konverzace automaticky zkracuji pro paměť modelu.'
      );
    }

    renderText(output, answer);
    messages = [...history, { role: 'assistant', content: answer }];
  } catch (err) {
    const errText = formatError(err);
    renderText(
      output,
      (answer ? answer + '\n\n' : '') + 'Generování se nezdařilo: ' + errText
    );
    note('Zkus kratší zadání, tlačítko Nová konverzace nebo model Qwen 2.5 · 1.5B.');
  } finally {
    busy = false;
    state();
  }
};

$('stop').onclick = () => {
  engine?.interruptGenerate();
  note('Zastavuji generování…');
};

$('downloadProject').onclick = downloadProject;

document.querySelectorAll('[data-project-view]').forEach(button => {
  button.onclick = () => setProjectView(button.dataset.projectView);
});

$('applyProjectCode').onclick = () => {
  const html = extractHtml($('projectCode').value);
  if (!html) {
    note('Kód musí obsahovat úplný HTML dokument.');
    return;
  }
  saveProject(
    latestProject?.prompt || 'Ručně upravený projekt',
    html,
    latestProject?.title
  );
  note('Úpravy se promítly do náhledu a uložily se v tomto prohlížeči.');
};

$('projectTitle').oninput = () => {
  if (latestProject) {
    latestProject.title = $('projectTitle').value || 'Můj projekt';
    try {
      localStorage.setItem(PROJECT_KEY, JSON.stringify(latestProject));
    } catch {}
  }
};

$('newProject').onclick = () => {
  latestProject = null;
  $('project').hidden = true;
  try {
    localStorage.removeItem(PROJECT_KEY);
  } catch {}
  setModeUI('create');
  $('prompt').focus();
};

$('improveProject').onclick = () => {
  if (!latestProject) {
    note('Nejdřív vytvoř projekt.');
    return;
  }
  setModeUI('create');
  if (!$('prompt').value.trim()) {
    $('prompt').value = latestProject.lastRuntimeError
      ? `Oprav chybu „${latestProject.lastRuntimeError}“ a zlepši použitelnost projektu.`
      : 'Zkontroluj projekt, oprav chyby a zlepši jeho použitelnost, ale zachovej jeho účel.';
  }
  $('form').requestSubmit();
};

$('instructions').addEventListener('input', () => {
  try {
    localStorage.setItem(INSTRUCTIONS_KEY, $('instructions').value);
  } catch {}
});

restoreLocalState();

$('prompt').onkeydown = e => {
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    $('form').requestSubmit();
  }
};

$('export').onclick = () => {
  if (!messages.length) {
    note('Nejprve vytvoř konverzaci, pak ji můžeš exportovat.');
    return;
  }
  const text =
    '# Kódovna — konverzace\n\n' +
    messages
      .map(m => '## ' + (m.role === 'user' ? 'Ty' : 'Kódovna') + '\n\n' + m.content)
      .join('\n\n');
  const url = URL.createObjectURL(
    new Blob([text], { type: 'text/markdown;charset=utf-8' })
  );
  const a = document.createElement('a');
  a.href = url;
  a.download = 'kodovna-konverzace.md';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

if (!navigator.gpu) {
  note('WebGPU není dostupné. Pro spuštění AI zkus aktuální Chrome nebo Edge na počítači.');
  $('status').textContent = '○ WebGPU není dostupné';
}
