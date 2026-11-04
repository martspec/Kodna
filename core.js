const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

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
  if (/^(ahoj|cau|zdar|dobry den|zdravim|jak se mas|jak je|kdo jsi|co jsi zac|co umis|jak fungujes|diky|dekuji|pomoc)[?!.\s]*$/.test(q)) {
    return 'general';
  }
  if (/pomoz mi napsat srozumitelny text|zeptej na tema a ctenare|napis email|napis clanek|prepis text/.test(q)) {
    return 'write';
  }
  if (/pomoz mi najit chybu v kodu|chybovou hlasku|proc tento kod nefunguje|oprav chybu v tomto/.test(q)) {
    return 'debug';
  }
  if (/napis v javascriptu funkci|vysvetli jeji pouziti|co je to |jak funguje /.test(q) && !/html|aplikac|hra|hru|web|strank/.test(q)) {
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

  // 1. Conversational greetings & how-are-you
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

  // 2. Starter card prompts that ask the assistant to first ask clarifying questions
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
  // Detect typical 0.5B code-model Czech hallucinations & machine-translation artifacts
  if (
    /vyskytnuteln|vyslovan|umeteln|google translate|jazykove preklad|spravnim pripadem|vykonem vice informaci/.test(
      q
    )
  ) {
    return true;
  }
  // Detect unexpected CJK ideographs leaked by tiny Qwen models in Czech answers
  if (/[\u4e00-\u9fff]{2,}/.test(text)) {
    return true;
  }
  return false;
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
  // Match optional "Otázka:" / "Dotaz:" prefix + exact user input + punctuation at the very beginning, followed by more text
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
    const queryIdRegex = /querySelector\(\s*["']#([a-zA-Z0-9_-]+)["']\s*\)/g;
    while ((idMatch = queryIdRegex.exec(script)) !== null) {
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

  if (!/<html\b/i.test(html) || !/<\/html\s*>/i.test(html)) {
    issues.push('Chybí kořenový element HTML.');
  }
  if (!/<body\b/i.test(html) || !/<\/body\s*>/i.test(html)) {
    issues.push('Chybí element body.');
  }
  if (!/<title\b[^>]*>[^<]+<\/title>/i.test(html)) {
    issues.push('Chybí titulek stránky.');
  }

  if (
    /<script\b[^>]*\bsrc\s*=\s*["']https?:|<link\b[^>]*\bhref\s*=\s*["']https?:|<(?:img|iframe|audio|video)\b[^>]*\bsrc\s*=\s*["']https?:/i.test(
      html
    )
  ) {
    issues.push('Externí zdroj je v rozporu s offline režimem.');
  }

  const openScripts = (html.match(/<script\b/gi) || []).length;
  const closeScripts = (html.match(/<\/script\s*>/gi) || []).length;
  if (openScripts !== closeScripts) {
    issues.push('Neuzavřený tag <script>.');
  }

  const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  let scriptMatch;
  let scriptIndex = 0;
  while ((scriptMatch = scriptRegex.exec(html)) !== null) {
    scriptIndex++;
    const scriptBody = scriptMatch[1];
    const syntaxError = checkJsSyntax(scriptBody);
    if (syntaxError) {
      issues.push(`Chyba syntaxe JS (skript #${scriptIndex}): ${syntaxError}`);
    }
  }

  const missingIds = checkMissingDomIds(html);
  if (missingIds.length > 0) {
    issues.push(
      `Skript odkazuje na chybějící HTML id: ${missingIds.slice(0, 4).map(id => '#' + id).join(', ')}.`
    );
  }

  const q = normalizeCz(request);
  if (
    /hra|herni|aplikac|kalkula|nastroj|todo|ukol|generator|pexeso|had|tetris|casovac|stopky/.test(q) &&
    !/<button\b|<input\b|<select\b|<textarea\b|<canvas\b|addEventListener|onclick=|onkeydown=/i.test(html)
  ) {
    issues.push('Pro aplikaci nebo hru nebylo nalezeno ovládání.');
  }

  return issues;
}

export function validateAnswerCodeBlocks(markdown) {
  const issues = [];
  const fenceRegex = /```(js|javascript)\s*\n([\s\S]*?)```/gi;
  let match;
  let idx = 0;
  while ((match = fenceRegex.exec(markdown || '')) !== null) {
    idx++;
    const code = match[2];
    const err = checkJsSyntax(code);
    if (err) {
      issues.push(`Ukázka JavaScriptu #${idx} obsahuje syntaktickou chybu: ${err}`);
    }
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
