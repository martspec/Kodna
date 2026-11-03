const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

export const BUILTIN_MODEL_ID = 'kodovna-local-expert-v2';

export const MODELS = [
  {
    id: BUILTIN_MODEL_ID,
    label: 'Kódovna Expert · Okamžité lokální jádro (bez stahování)',
    tier: 'instant'
  },
  {
    id: 'Qwen2.5-Coder-7B-Instruct-q4f16_1-MLC',
    label: 'Qwen 2.5 Coder · 7B (WebGPU · nejvyšší kvalita kódu)',
    tier: 'pro'
  },
  {
    id: 'Qwen2.5-7B-Instruct-q4f16_1-MLC',
    label: 'Qwen 2.5 · 7B (WebGPU · nejlepší odpovědi a čeština)',
    tier: 'pro'
  },
  {
    id: 'Qwen2.5-Coder-3B-Instruct-q4f16_1-MLC',
    label: 'Qwen 2.5 Coder · 3B (WebGPU · vyvážený pro kód)',
    tier: 'balanced'
  },
  {
    id: 'Qwen2.5-3B-Instruct-q4f16_1-MLC',
    label: 'Qwen 2.5 · 3B (WebGPU · univerzální)',
    tier: 'balanced'
  },
  {
    id: 'Qwen2.5-Coder-1.5B-Instruct-q4f16_1-MLC',
    label: 'Qwen 2.5 Coder · 1.5B (WebGPU · rychlý)',
    tier: 'fast'
  },
  {
    id: 'Qwen2.5-1.5B-Instruct-q4f16_1-MLC',
    label: 'Qwen 2.5 · 1.5B (WebGPU · rychlý univerzální)',
    tier: 'fast'
  },
  {
    id: 'Qwen2.5-Coder-0.5B-Instruct-q4f16_1-MLC',
    label: 'Qwen 2.5 Coder · 0.5B (WebGPU · úsporný)',
    tier: 'light'
  }
];

export const MODE_META = {
  create: {
    title: 'Tvůrce her a aplikací',
    eyebrow: 'MALÁ DÍLNA. VELKÉ NÁPADY.',
    headingPlain: 'Tvůj AI',
    headingEm: 'tvůrce.',
    lead: 'Popiš hru, nástroj nebo web. Kódovna navrhne architekturu, napíše čistý kód, zkontroluje syntaxi i DOM a ukáže živý náhled.',
    placeholder: 'Co dnes vytvoříme? Např.: Vytvoř hru Had se skóre, rychlostními úrovněmi a pauzou…',
    temperature: 0.2,
    maxTokens: 4096,
    cards: [
      {
        icon: '✦',
        title: 'Hra Pexeso se skóre',
        sub: 'Kompletní hratelná hra s počítadlem tahů a časomírou',
        prompt: 'Vytvoř hru Pexeso (4×4 karty se symboly) v jednom HTML souboru. Přidej počítadlo tahů, časomíru, zobrazení vítězství a tlačítko Nová hra.'
      },
      {
        icon: '⌘',
        title: 'Chytrá kalkulačka a převodník',
        sub: 'Okamžité výpočty, historie a podpora klávesnice',
        prompt: 'Vytvoř moderní vědeckou kalkulačku s historií posledních výpočtů, podporou klávesnice a ošetřením dělení nulou.'
      },
      {
        icon: '◈',
        title: 'Správce úkolů a Pomodoro',
        sub: 'Produktivní aplikace s filtry, statistikou a časovačem',
        prompt: 'Vytvoř aplikaci pro správu úkolů s filtrováním (Vše, Aktivní, Hotové), počítadlem splněných úkolů, ukázkovými daty a vestavěným Pomodoro časovačem.'
      }
    ]
  },
  general: {
    title: 'Univerzální asistent',
    eyebrow: 'PŘESNÉ MYŠLENÍ. SROZUMITELNÉ ODPOVĚDI.',
    headingPlain: 'Tvůj AI',
    headingEm: 'asistent.',
    lead: 'Ptej se na složité koncepty, strategii, matematiku, logiku nebo plánování. Dostaneš přímou, strukturovanou a promyšlenou odpověď.',
    placeholder: 'Na co se chceš zeptat? Napiš otázku, problém k vyřešení nebo téma k vysvětlení…',
    temperature: 0.3,
    maxTokens: 3072,
    cards: [
      {
        icon: '◈',
        title: 'Vysvětli složité téma jednoduše',
        sub: 'Jasná struktura, příklady z praxe a shrnutí',
        prompt: 'Vysvětli srozumitelně na praktickém příkladu, jak funguje asymetrická kryptografie (veřejný a soukromý klíč) a proč je bezpečná.'
      },
      {
        icon: '✦',
        title: 'Rozbor a akční plán projektu',
        sub: 'Krok za krokem od nápadu k realizaci',
        prompt: 'Navrhni strukturovaný plán krok za krokem, jak se za 8 týdnů naučit moderní webový vývoj (HTML, CSS, JavaScript) včetně praktických milníků.'
      },
      {
        icon: '⌘',
        title: 'Logická úloha a výpočet',
        sub: 'Přesný postup řešení s ověřením výsledku',
        prompt: 'Máme nádrž, kterou první čerpadlo naplní za 6 hodin a druhé za 4 hodiny. Třetí výpust ji plnou vyprázdní za 12 hodin. Za jak dlouho se nádrž naplní, pokud běží všechna tři současně? Ukaž přesný výpočet.'
      }
    ]
  },
  code: {
    title: 'Inženýr kódu',
    eyebrow: 'ČISTÁ ARCHITEKTURA. BEZCHYBNÝ KÓD.',
    headingPlain: 'Tvůj AI',
    headingEm: 'kodér.',
    lead: 'Nech si napsat kompletní funkce, algoritmy, komponenty nebo datové struktury. Bez zástupných TODO komentářů a s ošetřením okrajových stavů.',
    placeholder: 'Jaký kód potřebuješ napsat, navrhnout nebo zoptimalizovat?',
    temperature: 0.15,
    maxTokens: 4096,
    cards: [
      {
        icon: '⌘',
        title: 'Napiš se mnou kód (debounce)',
        sub: 'Od prvního řádku k produkčnímu řešení s testy',
        prompt: 'Napiš v JavaScriptu funkci debounce a vysvětli její použití.'
      },
      {
        icon: '✦',
        title: 'Algoritmus a datové struktury (LRU Cache)',
        sub: 'Časová složitost O(1) a čistý, testovatelný kód',
        prompt: 'Implementuj v JavaScriptu třídu LRUCache s pevnou kapacitou a operacemi get(key) a put(key, value) v čase O(1). Vysvětli princip a přidej ukázkové testy.'
      },
      {
        icon: '◈',
        title: 'Odolný Fetch klient s opakováním',
        sub: 'Timeout, exponenciální backoff a ošetření chyb',
        prompt: 'Napiš v JavaScriptu pomocnou funkci fetchWithRetry(url, options), která podporuje timeout přes AbortController, exponenciální backoff a čitelné chybové hlášení.'
      }
    ]
  },
  debug: {
    title: 'Ladění a opravy chyb',
    eyebrow: 'PŘESNÁ DIAGNOSTIKA. JISTÁ OPRAVA.',
    headingPlain: 'Tvůj AI',
    headingEm: 'diagnostik.',
    lead: 'Vlož nefunkční kód nebo chybovou hlášku. Kódovna odhalí skutečnou příčinu chyby, vysvětlí proč vzniká a vypíše kompletní opravené řešení.',
    placeholder: 'Vlož kód a popiš, co nefunguje nebo jakou chybu vypisuje konzole…',
    temperature: 0.15,
    maxTokens: 3584,
    cards: [
      {
        icon: '⌕',
        title: 'Odhal asynchronní chybu v cyklu',
        sub: 'Příčina chyby, opravený kód a vysvětlení',
        prompt: 'Proč tento kód nevypisuje 0, 1, 2 po sekundě a jak ho čistě opravit?\n```js\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 1000);\n}\n```'
      },
      {
        icon: '⌘',
        title: 'Oprav nefunkční práci s DOM',
        sub: 'Nulové reference, event listenery a stav',
        prompt: 'Pomoz mi najít chybu v tomto kódu, kde kliknutí na tlačítko nepřičítá hodnotu:\n```js\nlet count = 0;\ndocument.getElementById("btn").onclick = handleClick();\nfunction handleClick() {\n  count++;\n  document.getElementById("out").innerText = count;\n}\n```'
      },
      {
        icon: '✦',
        title: 'Audit bezpečnosti a okrajových stavů',
        sub: 'Kontrola přetečení, NaN, null a XSS zranitelností',
        prompt: 'Zkontroluj následující funkci pro výpočet slevy, vypiš všechny skryté chyby pro okrajové vstupy a napiš bezpečnou verzi:\n```js\nfunction applyDiscount(price, percent) {\n  return Math.round(price - (price * percent / 100));\n}\n```'
      }
    ]
  },
  write: {
    title: 'Psaní a stylistika',
    eyebrow: 'KULTIVOVANÁ ČEŠTINA. JASNÁ MYŠLENKA.',
    headingPlain: 'Tvůj AI',
    headingEm: 'redaktor.',
    lead: 'Tvoř přesvědčivé texty, dokumentaci, e-maily i články. Přirozená čeština bez prázdných frází, přizpůsobená přesně tvému čtenáři.',
    placeholder: 'Jaký text potřebuješ napsat, upravit nebo přepsat do lepší podoby?',
    temperature: 0.55,
    maxTokens: 3072,
    cards: [
      {
        icon: '✎',
        title: 'Přesvědčivý popis produktu',
        sub: 'Stručný, čtivý text zaměřený na přínos pro uživatele',
        prompt: 'Napiš svěží a důvěryhodný úvodní text na web pro lokální pražírnu výběrové kávy. Nabídni krátkou hlavní verzi a 3 úderné podnadpisy.'
      },
      {
        icon: '◈',
        title: 'Profesionální e-mail klientovi',
        sub: 'Zdvořilý, věcný tón s jasným dalším krokem',
        prompt: 'Napiš věcný a zdvořilý e-mail klientovi, ve kterém vysvětlíš posun termínu dodání webu o 3 pracovní dny kvůli důkladnému otestování bezpečnosti a navrhneš termín ukázky.'
      },
      {
        icon: '✦',
        title: 'Srozumitelná technická dokumentace',
        sub: 'Strukturovaný návod pro uživatele i vývojáře',
        prompt: 'Napiš přehlednou šablonu README.md v češtině pro open-source webovou aplikaci (účel projektu, klíčové funkce, rychlé spuštění a struktura souborů).'
      }
    ]
  }
};

export const SYSTEM_PROMPTS = {
  create: `You are Kódovna, a principal frontend architect and local web-app creator.
Turn the user's request into a rock-solid, self-contained, single-file HTML5 application, game, or interactive website.

STRICT ENGINEERING RULES:
1. Output ONE complete HTML document only (\`<!doctype html><html lang="cs">...</html>\`), with all CSS inside \`<style>\` and all JavaScript inside \`<script>\`.
2. NEVER use external libraries, CDN links, remote images/fonts, fetch/XHR calls, or browser storage (localStorage/sessionStorage/IndexedDB) unless wrapped in safe try/catch with in-memory fallback. Everything must run 100% offline inside a strict sandboxed iframe.
3. DOM-JS INTEGRITY: Every ID or selector referenced in JavaScript (\`getElementById\`, \`querySelector\`) MUST exist in the HTML markup. Never call methods on \`null\`.
4. ZERO PLACEHOLDERS: Never write \`// TODO\`, \`/* ... */\`, or omit functions. Implement every button, control, keyboard shortcut, and state transition completely.
5. VISUAL EXCELLENCE: Use clean modern CSS (CSS custom properties, Flexbox/Grid, \`clamp()\`, smooth transitions, clear visual hierarchy, high-contrast readable typography, responsive mobile/desktop layout).
6. CZECH UI: Use natural, grammatically correct Czech for all headings, labels, buttons, statuses, and empty/error states unless another language is requested.
7. For revisions, preserve all existing working features and apply the requested improvement cleanly.`,

  general: `You are Kódovna, an elite, high-precision Czech AI assistant.
Deliver thorough, accurate, and crystal-clear answers to any question, analysis, calculation, or planning task.

QUALITY STANDARDS:
1. Direct Answer First: Begin immediately with the direct answer or core solution. NEVER open with generic filler greetings ("Ahoj! Rád ti pomohu...") and NEVER repeat the user's prompt back as your answer.
2. Depth & Structure: Organize complex answers with clear Markdown headings (\`##\`), bullet points, concrete examples, and step-by-step logic.
3. Accuracy & Honesty: Verify every mathematical calculation, logical step, and technical claim. If a detail cannot be known with certainty, state that transparently instead of guessing.
4. Cultivated Czech: Write in natural, fluent, grammatically flawless Czech (unless asked for another language).`,

  code: `You are Kódovna, a Staff Software Engineer and programming specialist.
Write production-grade, clean, idiomatic, and completely bug-free code.

ENGINEERING STANDARDS:
1. Complete & Runnable: Always provide complete, working code. NEVER leave \`// TODO\`, \`...\`, or unimplemented stubs.
2. Edge Cases & Safety: Explicitly handle invalid inputs, \`null\`/\`undefined\`, empty arrays, boundary conditions, and error states.
3. Modern Idioms: Use clean modern syntax, descriptive variable/function names, modular functions, and clear algorithmic structure.
4. Concise Explanation & Usage: Pair your code with a clear explanation of key architectural decisions, time/space complexity where relevant, and a runnable usage example.`,

  debug: `You are Kódovna, a senior debugging and code-reliability specialist.
Analyze bugs with surgical precision and provide verified fixes.

DEBUGGING PROTOCOL:
1. Root Cause (Příčina chyby): Pinpoint the exact line, state mutation, asynchronous race condition, or DOM/type mismatch causing the failure.
2. Complete Fixed Code (Opravený kód): Provide the complete, corrected, runnable code in a fenced code block without omitting lines.
3. Prevention (Proč oprava funguje): Briefly explain what changed and how to avoid similar bugs in the future.
If the user did not include the code yet, ask concisely for the code snippet and exact error message.`,

  write: `You are Kódovna, a master Czech editor, copywriter, and technical writer.
Craft clear, engaging, and stylistically refined text tailored to the target audience.

WRITING STANDARDS:
1. Natural Czech: Write fluent, idiomatic Czech with strong rhythm, active verbs, and zero machine-translated clichés.
2. Structure & Readability: Use strong headlines, scannable paragraphs, and clear calls to action or summaries where appropriate.
3. Immediate Value: Deliver the finished text right away (plus a brief alternative tone/variant when useful) instead of stalling unless the topic is completely unspecified.`
};

export function normalizeCz(text) {
  return (text || '')
    .toLocaleLowerCase('cs')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function taskGuide(input) {
  const q = normalizeCz(input);

  if (/hra|herni|tetris|had|snake|pexeso|skore|arkanoid|pong|flappy|skakac|sach|piskvork|minolovka|2048|kviz/.test(q)) {
    return `\nARCHITECTURE BLUEPRINT — INTERACTIVE GAME:
- Include a visible header/HUD showing live Score (Skóre), High Score / Best (Nejlepší výsledek), and Game Status.
- Provide working buttons for Start / Nová hra and Pause (Pauza) where applicable.
- Support BOTH keyboard controls (Arrow keys / WASD / Space) AND on-screen clickable/touch buttons so the game is playable on any device.
- Implement complete win/loss detection with a clear overlay message and one-click restart.
- Initialize the game board immediately on load so the preview is never blank.`;
  }

  if (/kalkula|prevod|vypocet|urok|bmi|hypotek|casovac|stopky|minutk|pomodoro|jednotk|men/.test(q)) {
    return `\nARCHITECTURE BLUEPRINT — PRECISION CALCULATOR / TOOL:
- Validate all numeric inputs (prevent NaN, Infinity, division by zero, and negative values where invalid) and show helpful Czech feedback.
- Format numeric results cleanly using Czech locale formatting where appropriate.
- Support keyboard shortcuts (Enter to calculate/submit, Escape/Backspace to clear).
- Include a history list of recent calculations or quick preset buttons so the user can test immediately.`;
  }

  if (/aplikac|nastroj|todo|ukol|seznam|generator|planner|planovac|sprav|poznamk|rozpocet|kanban|tabulk|diar/.test(q)) {
    return `\nARCHITECTURE BLUEPRINT — PRODUCTIVITY APPLICATION:
- Implement full interactive state in memory: adding items, toggling/editing state, deleting items, and filtering/searching.
- Seed the initial state with 3 realistic Czech sample items so the application looks rich and is immediately testable on first load.
- Display live summary statistics/counters (e.g., celkem, aktivní, dokončeno) that update on every action.
- Show a clean empty-state message when a filter or list has no items.`;
  }

  if (/web|stran|landing|portfolio|prezentac|vizitk|kavarn|restaurac|eshop|blog|agentur/.test(q)) {
    return `\nARCHITECTURE BLUEPRINT — MODERN INTERACTIVE WEBSITE:
- Design a cohesive, high-craft layout with sticky navigation, hero section with working CTA buttons, feature/service cards, interactive filter or tabs, and a working contact/reservation form with instant client-side validation and confirmation message.
- Ensure every navigation link and button triggers a real scroll, tab switch, modal, or interactive state change.`;
  }

  return `\nARCHITECTURE BLUEPRINT — COMPLETE INTERACTIVE PROJECT:
- Build a complete, immediately usable single-file application with pre-populated realistic Czech demo state, responsive layout, working controls, and clear feedback for every user action.`;
}

export function cleanModelOutput(text) {
  if (!text) return '';
  let cleaned = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  cleaned = cleaned.replace(/^<think>/i, '').trim();
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
    issues.push('Chybí kompletní kořenový element <html>…</html>.');
  }
  if (!/<body\b/i.test(html) || !/<\/body\s*>/i.test(html)) {
    issues.push('Chybí kompletní element <body>…</body>.');
  }
  if (!/<title\b[^>]*>[^<]+<\/title>/i.test(html)) {
    issues.push('Chybí neprázdný titulek stránky <title>.');
  }

  if (
    /<script\b[^>]*\bsrc\s*=\s*["']https?:|<link\b[^>]*\bhref\s*=\s*["']https?:|<(?:img|iframe|audio|video)\b[^>]*\bsrc\s*=\s*["']https?:/i.test(
      html
    )
  ) {
    issues.push('Externí síťový zdroj (http/https) je v rozporu s bezpečným offline režimem.');
  }

  const openScripts = (html.match(/<script\b/gi) || []).length;
  const closeScripts = (html.match(/<\/script\s*>/gi) || []).length;
  if (openScripts !== closeScripts) {
    issues.push('Neuzavřený tag <script> v HTML dokumentu.');
  }

  const openStyles = (html.match(/<style\b/gi) || []).length;
  const closeStyles = (html.match(/<\/style\s*>/gi) || []).length;
  if (openStyles !== closeStyles) {
    issues.push('Neuzavřený tag <style> v HTML dokumentu.');
  }

  const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  let scriptMatch;
  let scriptIndex = 0;
  while ((scriptMatch = scriptRegex.exec(html)) !== null) {
    scriptIndex++;
    const scriptBody = scriptMatch[1];
    const syntaxError = checkJsSyntax(scriptBody);
    if (syntaxError) {
      issues.push(`Chyba syntaxe JavaScriptu (skript #${scriptIndex}): ${syntaxError}`);
    }
    if (/\/\/\s*TODO\b|\/\*\s*TODO\b|\.\.\.\s*zbytek/i.test(scriptBody)) {
      issues.push('Kód obsahuje nedokončené zástupné komentáře (TODO / zbytek kódu).');
    }
  }

  const missingIds = checkMissingDomIds(html);
  if (missingIds.length > 0) {
    issues.push(
      `JavaScript odkazuje na neexistující HTML id: ${missingIds.slice(0, 5).map(id => '#' + id).join(', ')}.`
    );
  }

  const q = normalizeCz(request);
  if (
    /hra|herni|aplikac|kalkula|nastroj|todo|ukol|generator|pexeso|had|tetris|casovac|stopky/.test(q) &&
    !/<button\b|<input\b|<select\b|<textarea\b|<canvas\b|addEventListener|onclick=|onkeydown=/i.test(html)
  ) {
    issues.push('Pro interaktivní aplikaci nebo hru chybí ovládací prvky nebo obsluha událostí.');
  }

  return issues;
}

export function inspectHtmlMetrics(html) {
  const scripts = [...(html || '').matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];
  const jsLines = scripts.reduce((acc, m) => acc + m[1].trim().split('\n').length, 0);
  const controls = ((html || '').match(/<(?:button|input|select|textarea|canvas)\b/gi) || []).length;
  const titleMatch = (html || '').match(/<title\b[^>]*>([^<]+)<\/title>/i);
  return {
    title: titleMatch ? titleMatch[1].trim() : 'Můj projekt',
    jsLines,
    controls
  };
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
  if (normInput.length >= 12 && normAnswer.length <= Math.ceil(normInput.length * 1.2) && normAnswer.includes(normInput)) {
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

/* ============================================================================
 * BUILT-IN LOCAL EXPERT ENGINE (Instant Zero-Download Synthesis & Fallback)
 * ============================================================================ */

function buildPexesoHtml() {
  return `<!doctype html>
<html lang="cs">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Pexeso · Paměťová výzva</title>
  <style>
    :root {
      --bg: #f6f8f4;
      --card: #ffffff;
      --accent: #234b3b;
      --accent-soft: #dde6d5;
      --text: #1f2e27;
      --muted: #68756a;
      --border: #d8e0d2;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: Inter, system-ui, -apple-system, sans-serif;
      background: var(--bg);
      color: var(--text);
      padding: 24px 16px;
      display: flex;
      justify-content: center;
    }
    .app { width: 100%; max-width: 560px; }
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 18px;
    }
    h1 { margin: 0; font-size: 24px; letter-spacing: -0.5px; }
    .stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-bottom: 18px;
    }
    .stat {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 12px;
      text-align: center;
    }
    .stat small { display: block; font-size: 11px; color: var(--muted); margin-bottom: 4px; }
    .stat b { font-size: 20px; color: var(--accent); }
    .grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
    }
    .tile {
      aspect-ratio: 1;
      border-radius: 12px;
      border: 2px solid var(--border);
      background: var(--accent);
      color: transparent;
      font-size: 32px;
      cursor: pointer;
      display: grid;
      place-items: center;
      transition: transform 0.18s ease, background 0.18s ease, border-color 0.18s ease;
      user-select: none;
    }
    .tile:hover:not(:disabled) { transform: translateY(-2px); }
    .tile.revealed, .tile.matched {
      background: var(--card);
      color: var(--text);
      border-color: var(--accent);
    }
    .tile.matched {
      background: var(--accent-soft);
      cursor: default;
    }
    .btn {
      background: var(--accent);
      color: #fff;
      border: 0;
      border-radius: 8px;
      padding: 10px 16px;
      font: inherit;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
    }
    .banner {
      margin-top: 16px;
      padding: 14px 16px;
      border-radius: 10px;
      background: var(--accent-soft);
      border: 1px solid #bfd0b2;
      text-align: center;
      font-weight: 600;
    }
    [hidden] { display: none !important; }
  </style>
</head>
<body>
  <div class="app">
    <header>
      <div>
        <h1>Pexeso · 4×4</h1>
        <small style="color:var(--muted)">Najdi všech 8 dvojic v co nejmenším počtu tahů</small>
      </div>
      <button type="button" class="btn" id="restartBtn">Nová hra</button>
    </header>
    <div class="stats">
      <div class="stat"><small>TAHY</small><b id="moves">0</b></div>
      <div class="stat"><small>NALEZENÉ PÁRY</small><b id="pairs">0 / 8</b></div>
      <div class="stat"><small>ČAS</small><b id="timer">00:00</b></div>
    </div>
    <div class="grid" id="board" role="grid" aria-label="Herní plocha pexesa"></div>
    <div class="banner" id="winBanner" hidden></div>
  </div>
  <script>
    const SYMBOLS = ['🌿', '⚡', '🧭', '🔮', '🚀', '🎯', '🏔️', '🦊'];
    const boardEl = document.getElementById('board');
    const movesEl = document.getElementById('moves');
    const pairsEl = document.getElementById('pairs');
    const timerEl = document.getElementById('timer');
    const winBannerEl = document.getElementById('winBanner');
    const restartBtn = document.getElementById('restartBtn');

    let deck = [];
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let moves = 0;
    let matchedPairs = 0;
    let seconds = 0;
    let timerId = null;

    function formatTime(sec) {
      const m = String(Math.floor(sec / 60)).padStart(2, '0');
      const s = String(sec % 60).padStart(2, '0');
      return m + ':' + s;
    }

    function startTimer() {
      if (timerId) return;
      timerId = setInterval(() => {
        seconds++;
        timerEl.textContent = formatTime(seconds);
      }, 1000);
    }

    function stopTimer() {
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
      }
    }

    function shuffle(arr) {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    }

    function updateHud() {
      movesEl.textContent = String(moves);
      pairsEl.textContent = matchedPairs + ' / ' + SYMBOLS.length;
    }

    function onTileClick(btn, item) {
      if (lockBoard || item.matched || btn === firstCard?.btn) return;
      startTimer();
      btn.classList.add('revealed');
      btn.textContent = item.symbol;
      btn.setAttribute('aria-label', 'Karta ' + item.symbol);

      if (!firstCard) {
        firstCard = { btn, item };
        return;
      }

      secondCard = { btn, item };
      moves++;
      updateHud();

      if (firstCard.item.symbol === secondCard.item.symbol) {
        firstCard.item.matched = true;
        secondCard.item.matched = true;
        firstCard.btn.classList.add('matched');
        secondCard.btn.classList.add('matched');
        firstCard.btn.disabled = true;
        secondCard.btn.disabled = true;
        matchedPairs++;
        updateHud();
        firstCard = null;
        secondCard = null;

        if (matchedPairs === SYMBOLS.length) {
          stopTimer();
          winBannerEl.hidden = false;
          winBannerEl.textContent = 'Skvělá práce! Všechny páry nalezeny za ' + moves + ' tahů (' + formatTime(seconds) + ').';
        }
      } else {
        lockBoard = true;
        setTimeout(() => {
          firstCard.btn.classList.remove('revealed');
          secondCard.btn.classList.remove('revealed');
          firstCard.btn.textContent = '?';
          secondCard.btn.textContent = '?';
          firstCard = null;
          secondCard = null;
          lockBoard = false;
        }, 650);
      }
    }

    function initGame() {
      stopTimer();
      seconds = 0;
      moves = 0;
      matchedPairs = 0;
      firstCard = null;
      secondCard = null;
      lockBoard = false;
      timerEl.textContent = '00:00';
      winBannerEl.hidden = true;
      updateHud();

      deck = shuffle([...SYMBOLS, ...SYMBOLS]).map((symbol, idx) => ({
        id: idx,
        symbol,
        matched: false
      }));

      boardEl.replaceChildren();
      deck.forEach((item, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'tile';
        btn.textContent = '?';
        btn.setAttribute('aria-label', 'Skrytá karta ' + (idx + 1));
        btn.addEventListener('click', () => onTileClick(btn, item));
        boardEl.appendChild(btn);
      });
    }

    restartBtn.addEventListener('click', initGame);
    initGame();
  </script>
</body>
</html>`;
}

function buildSnakeHtml() {
  return `<!doctype html>
<html lang="cs">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Had · Arkádová klasika</title>
  <style>
    :root { --bg:#f5f7f2; --panel:#ffffff; --accent:#234b3b; --border:#d8e0d2; --text:#1e2d26; }
    * { box-sizing: border-box; }
    body { margin:0; font-family:Inter,system-ui,sans-serif; background:var(--bg); color:var(--text); padding:20px; display:flex; justify-content:center; }
    .wrap { width:100%; max-width:520px; background:var(--panel); border:1px solid var(--border); border-radius:14px; padding:18px; }
    .top { display:flex; justify-content:space-between; align-items:center; gap:10px; margin-bottom:14px; }
    h1 { margin:0; font-size:20px; }
    .hud { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-bottom:12px; text-align:center; }
    .hud div { background:#f0f4ec; padding:8px; border-radius:8px; font-size:12px; }
    .hud b { display:block; font-size:18px; color:var(--accent); }
    canvas { width:100%; aspect-ratio:1; background:#192820; border-radius:10px; display:block; }
    .controls { display:flex; justify-content:space-between; align-items:center; margin-top:12px; gap:8px; flex-wrap:wrap; }
    button { background:var(--accent); color:#fff; border:0; border-radius:7px; padding:9px 14px; font:inherit; font-size:12px; cursor:pointer; }
    .dpad { display:grid; grid-template-columns:repeat(3,40px); gap:5px; justify-content:center; margin-top:12px; }
    .dpad button { padding:8px 0; background:#dce5d5; color:var(--text); font-weight:700; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="top">
      <h1>Had · Rychlá arkáda</h1>
      <div>
        <button type="button" id="pauseBtn">Pauza</button>
        <button type="button" id="newGameBtn">Nová hra</button>
      </div>
    </div>
    <div class="hud">
      <div>Skóre<b id="score">0</b></div>
      <div>Rekord<b id="best">0</b></div>
      <div>Stav<b id="stateText">Hraje se</b></div>
    </div>
    <canvas id="canvas" width="400" height="400" aria-label="Herní plocha Hada"></canvas>
    <div class="dpad" aria-label="Směrové ovládání">
      <span></span><button type="button" data-dir="UP" aria-label="Nahoru">▲</button><span></span>
      <button type="button" data-dir="LEFT" aria-label="Doleva">◀</button>
      <button type="button" data-dir="DOWN" aria-label="Dolů">▼</button>
      <button type="button" data-dir="RIGHT" aria-label="Doprava">▶</button>
    </div>
  </div>
  <script>
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = document.getElementById('score');
    const bestEl = document.getElementById('best');
    const stateTextEl = document.getElementById('stateText');
    const pauseBtn = document.getElementById('pauseBtn');
    const newGameBtn = document.getElementById('newGameBtn');

    const GRID = 20;
    const SIZE = canvas.width / GRID;
    let snake, dir, nextDir, food, score, best = 0, paused = false, over = false, loopId = null;

    function spawnFood() {
      while (true) {
        const p = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
        if (!snake.some(s => s.x === p.x && s.y === p.y)) return p;
      }
    }

    function draw() {
      ctx.fillStyle = '#192820';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#e06d53';
      ctx.beginPath();
      ctx.arc((food.x + 0.5) * SIZE, (food.y + 0.5) * SIZE, SIZE * 0.4, 0, Math.PI * 2);
      ctx.fill();

      snake.forEach((seg, i) => {
        ctx.fillStyle = i === 0 ? '#8fd694' : '#5ca46b';
        ctx.fillRect(seg.x * SIZE + 1, seg.y * SIZE + 1, SIZE - 2, SIZE - 2);
      });
    }

    function step() {
      if (paused || over) return;
      dir = nextDir;
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

      if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID || snake.some(s => s.x === head.x && s.y === head.y)) {
        over = true;
        stateTextEl.textContent = 'Konec hry';
        draw();
        return;
      }

      snake.unshift(head);
      if (head.x === food.x && head.y === food.y) {
        score += 10;
        if (score > best) best = score;
        scoreEl.textContent = String(score);
        bestEl.textContent = String(best);
        food = spawnFood();
      } else {
        snake.pop();
      }
      draw();
    }

    function setDirection(name) {
      const map = {
        UP: { x: 0, y: -1 },
        DOWN: { x: 0, y: 1 },
        LEFT: { x: -1, y: 0 },
        RIGHT: { x: 1, y: 0 }
      };
      const candidate = map[name];
      if (!candidate) return;
      if (candidate.x !== -dir.x || candidate.y !== -dir.y) {
        nextDir = candidate;
      }
    }

    function startNew() {
      if (loopId) clearInterval(loopId);
      snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
      dir = { x: 1, y: 0 };
      nextDir = { x: 1, y: 0 };
      score = 0;
      paused = false;
      over = false;
      scoreEl.textContent = '0';
      stateTextEl.textContent = 'Hraje se';
      pauseBtn.textContent = 'Pauza';
      food = spawnFood();
      draw();
      loopId = setInterval(step, 130);
    }

    window.addEventListener('keydown', e => {
      if (e.key === 'ArrowUp' || e.key === 'w') setDirection('UP');
      if (e.key === 'ArrowDown' || e.key === 's') setDirection('DOWN');
      if (e.key === 'ArrowLeft' || e.key === 'a') setDirection('LEFT');
      if (e.key === 'ArrowRight' || e.key === 'd') setDirection('RIGHT');
    });

    document.querySelectorAll('[data-dir]').forEach(btn => {
      btn.addEventListener('click', () => setDirection(btn.dataset.dir));
    });

    pauseBtn.addEventListener('click', () => {
      if (over) return;
      paused = !paused;
      stateTextEl.textContent = paused ? 'Pozastaveno' : 'Hraje se';
      pauseBtn.textContent = paused ? 'Pokračovat' : 'Pauza';
    });

    newGameBtn.addEventListener('click', startNew);
    startNew();
  </script>
</body>
</html>`;
}

function buildCalculatorHtml() {
  return `<!doctype html>
<html lang="cs">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Vědecká kalkulačka</title>
  <style>
    :root { --bg:#f5f7f3; --card:#ffffff; --accent:#234b3b; --border:#d8e0d2; --text:#1e2d26; --muted:#6e7b70; }
    * { box-sizing:border-box; }
    body { margin:0; font-family:Inter,system-ui,sans-serif; background:var(--bg); color:var(--text); padding:24px 16px; display:flex; justify-content:center; }
    .layout { width:100%; max-width:680px; display:grid; grid-template-columns:1.35fr 1fr; gap:16px; }
    @media(max-width:600px){ .layout { grid-template-columns:1fr; } }
    .panel { background:var(--card); border:1px solid var(--border); border-radius:14px; padding:18px; }
    .screen { background:#1c2c24; color:#e7f3e4; border-radius:10px; padding:14px; text-align:right; margin-bottom:14px; min-height:84px; display:flex; flex-direction:column; justify-content:space-between; word-break:break-all; }
    .expr { font-size:13px; color:#9ab2a2; min-height:18px; }
    .val { font-size:28px; font-weight:700; font-family:ui-monospace,monospace; }
    .keys { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; }
    button { border:1px solid var(--border); background:#f7f9f5; color:var(--text); border-radius:8px; padding:12px 8px; font:inherit; font-size:14px; font-weight:600; cursor:pointer; }
    button:hover { border-color:#8fa682; }
    button.op { background:#e6ede0; color:var(--accent); }
    button.eq { background:var(--accent); color:#fff; border-color:var(--accent); }
    h2 { margin:0 0 10px; font-size:15px; }
    .history-list { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:8px; max-height:320px; overflow:auto; }
    .history-item { padding:8px 10px; border-radius:8px; background:#f2f5ef; font-size:12px; cursor:pointer; display:flex; justify-content:space-between; gap:8px; }
    .empty { font-size:12px; color:var(--muted); }
  </style>
</head>
<body>
  <div class="layout">
    <section class="panel" aria-label="Kalkulačka">
      <div class="screen">
        <div class="expr" id="exprDisplay">Připraveno k výpočtu</div>
        <div class="val" id="resultDisplay">0</div>
      </div>
      <div class="keys">
        <button type="button" class="op" data-fn="clear">C</button>
        <button type="button" class="op" data-fn="back">⌫</button>
        <button type="button" class="op" data-val="(">(</button>
        <button type="button" class="op" data-val=")">)</button>

        <button type="button" class="op" data-fn="sqrt">√x</button>
        <button type="button" class="op" data-fn="sq">x²</button>
        <button type="button" class="op" data-fn="percent">%</button>
        <button type="button" class="op" data-val="/">÷</button>

        <button type="button" data-val="7">7</button>
        <button type="button" data-val="8">8</button>
        <button type="button" data-val="9">9</button>
        <button type="button" class="op" data-val="*">×</button>

        <button type="button" data-val="4">4</button>
        <button type="button" data-val="5">5</button>
        <button type="button" data-val="6">6</button>
        <button type="button" class="op" data-val="-">−</button>

        <button type="button" data-val="1">1</button>
        <button type="button" data-val="2">2</button>
        <button type="button" data-val="3">3</button>
        <button type="button" class="op" data-val="+">+</button>

        <button type="button" data-fn="neg">±</button>
        <button type="button" data-val="0">0</button>
        <button type="button" data-val=".">,</button>
        <button type="button" class="eq" id="evalBtn">=</button>
      </div>
    </section>
    <aside class="panel" aria-label="Historie výpočtů">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
        <h2 style="margin:0">Historie výpočtů</h2>
        <button type="button" id="clearHistoryBtn" style="padding:5px 10px;font-size:11px">Vymazat</button>
      </div>
      <ul class="history-list" id="historyList"></ul>
      <p class="empty" id="emptyHistory">Zatím žádné výpočty. Klikni na záznam pro opětovné použití.</p>
    </aside>
  </div>
  <script>
    const exprDisplay = document.getElementById('exprDisplay');
    const resultDisplay = document.getElementById('resultDisplay');
    const historyList = document.getElementById('historyList');
    const emptyHistory = document.getElementById('emptyHistory');
    const evalBtn = document.getElementById('evalBtn');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');

    let current = '0';
    let history = [
      { expr: '125 * 4', res: '500' },
      { expr: '1024 / 16', res: '64' }
    ];

    function renderScreen(statusText) {
      resultDisplay.textContent = current;
      if (statusText !== undefined) exprDisplay.textContent = statusText;
    }

    function renderHistory() {
      historyList.replaceChildren();
      emptyHistory.hidden = history.length > 0;
      history.forEach(item => {
        const li = document.createElement('li');
        li.className = 'history-item';
        const left = document.createElement('span');
        left.textContent = item.expr + ' =';
        const right = document.createElement('b');
        right.textContent = item.res;
        li.append(left, right);
        li.addEventListener('click', () => {
          current = item.res;
          renderScreen(item.expr);
        });
        historyList.appendChild(li);
      });
    }

    function safeEvaluate(raw) {
      const sanitized = raw.replace(/[^0-9+*/().\\s-]/g, '');
      if (!sanitized.trim()) return 0;
      const val = Function('"use strict"; return (' + sanitized + ')')();
      if (typeof val !== 'number' || !Number.isFinite(val)) {
        throw new Error('Nelze dělit nulou');
      }
      return Math.round(val * 1e10) / 1e10;
    }

    function appendValue(v) {
      if (current === '0' && v !== '.') current = v;
      else current += v;
      renderScreen();
    }

    function runAction(fn) {
      try {
        if (fn === 'clear') {
          current = '0';
          renderScreen('Vymazáno');
          return;
        }
        if (fn === 'back') {
          current = current.length > 1 ? current.slice(0, -1) : '0';
          renderScreen();
          return;
        }
        const val = safeEvaluate(current);
        if (fn === 'sqrt') {
          if (val < 0) throw new Error('Odmocnina ze záporného čísla');
          const res = String(Math.round(Math.sqrt(val) * 1e10) / 1e10);
          history.unshift({ expr: '√(' + current + ')', res });
          current = res;
          renderScreen('Odmocnina');
          renderHistory();
        } else if (fn === 'sq') {
          const res = String(Math.round(val * val * 1e10) / 1e10);
          history.unshift({ expr: '(' + current + ')²', res });
          current = res;
          renderScreen('Druhá mocnina');
          renderHistory();
        } else if (fn === 'percent') {
          current = String(val / 100);
          renderScreen('Procenta');
        } else if (fn === 'neg') {
          current = String(val * -1);
          renderScreen();
        }
      } catch (e) {
        renderScreen('Chyba: ' + e.message);
      }
    }

    function evaluateCurrent() {
      try {
        const expr = current;
        const val = safeEvaluate(expr);
        const res = String(val);
        history.unshift({ expr, res });
        if (history.length > 15) history.pop();
        current = res;
        renderScreen(expr + ' =');
        renderHistory();
      } catch (e) {
        renderScreen('Chyba: ' + e.message);
      }
    }

    document.querySelectorAll('[data-val]').forEach(btn => {
      btn.addEventListener('click', () => appendValue(btn.dataset.val));
    });

    document.querySelectorAll('[data-fn]').forEach(btn => {
      btn.addEventListener('click', () => runAction(btn.dataset.fn));
    });

    evalBtn.addEventListener('click', evaluateCurrent);
    clearHistoryBtn.addEventListener('click', () => {
      history = [];
      renderHistory();
    });

    window.addEventListener('keydown', e => {
      if (/^[0-9+*/().-]$/.test(e.key)) appendValue(e.key);
      else if (e.key === ',') appendValue('.');
      else if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); evaluateCurrent(); }
      else if (e.key === 'Backspace') runAction('back');
      else if (e.key === 'Escape') runAction('clear');
    });

    renderHistory();
  </script>
</body>
</html>`;
}

function buildTodoPomodoroHtml() {
  return `<!doctype html>
<html lang="cs">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Správce úkolů & Pomodoro</title>
  <style>
    :root { --bg:#f6f8f4; --card:#ffffff; --accent:#234b3b; --accent-soft:#dde6d5; --border:#d8e0d2; --text:#1f2e27; --muted:#6c786d; }
    * { box-sizing:border-box; }
    body { margin:0; font-family:Inter,system-ui,sans-serif; background:var(--bg); color:var(--text); padding:24px 16px; display:flex; justify-content:center; }
    .app { width:100%; max-width:740px; display:grid; grid-template-columns:1.6fr 1fr; gap:16px; }
    @media(max-width:650px){ .app { grid-template-columns:1fr; } }
    .card { background:var(--card); border:1px solid var(--border); border-radius:14px; padding:18px; }
    h1, h2 { margin:0 0 12px; font-size:19px; }
    .row { display:flex; gap:8px; margin-bottom:14px; }
    input[type="text"] { flex:1; padding:10px 12px; border:1px solid var(--border); border-radius:8px; font:inherit; font-size:13px; }
    button { background:var(--accent); color:#fff; border:0; border-radius:8px; padding:9px 14px; font:inherit; font-size:12px; font-weight:600; cursor:pointer; }
    button.ghost { background:#eef2ea; color:var(--text); border:1px solid var(--border); }
    button.ghost.active { background:var(--accent-soft); color:var(--accent); border-color:#b8ccb0; }
    .filters { display:flex; gap:6px; margin-bottom:12px; flex-wrap:wrap; }
    ul { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:8px; }
    li { display:flex; align-items:center; justify-content:space-between; gap:10px; padding:10px 12px; border:1px solid var(--border); border-radius:9px; background:#fafbf9; }
    li.done span { text-decoration:line-through; color:var(--muted); }
    .timer-display { font-size:40px; font-weight:700; color:var(--accent); text-align:center; margin:16px 0; font-family:ui-monospace,monospace; }
    .stats { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-top:14px; text-align:center; }
    .stats div { background:#f1f5ed; padding:8px; border-radius:8px; font-size:11px; }
    .stats b { display:block; font-size:16px; color:var(--accent); }
  </style>
</head>
<body>
  <div class="app">
    <section class="card" aria-label="Seznam úkolů">
      <h1>Úkoly dne</h1>
      <form class="row" id="taskForm">
        <input type="text" id="taskInput" aria-label="Nový úkol" placeholder="Přidat nový úkol…" maxlength="120">
        <button type="submit" id="addTaskBtn">Přidat</button>
      </form>
      <div class="filters">
        <button type="button" class="ghost active" data-filter="all">Vše</button>
        <button type="button" class="ghost" data-filter="active">Aktivní</button>
        <button type="button" class="ghost" data-filter="done">Hotové</button>
      </div>
      <ul id="taskList"></ul>
      <p id="emptyMsg" style="font-size:12px;color:var(--muted)" hidden>Žádné úkoly v tomto filtru.</p>
      <div class="stats">
        <div>Celkem<b id="totalCount">0</b></div>
        <div>Aktivní<b id="activeCount">0</b></div>
        <div>Hotovo<b id="doneCount">0</b></div>
      </div>
    </section>
    <aside class="card" aria-label="Pomodoro časovač">
      <h2>Pomodoro fokus</h2>
      <p style="font-size:12px;color:var(--muted);margin:0">25 minut soustředěné práce, 5 minut odpočinek.</p>
      <div class="timer-display" id="pomoTime">25:00</div>
      <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">
        <button type="button" id="pomoStartBtn">Spustit</button>
        <button type="button" class="ghost" id="pomoModeBtn">Pauza 5 min</button>
        <button type="button" class="ghost" id="pomoResetBtn">Reset</button>
      </div>
    </aside>
  </div>
  <script>
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const emptyMsg = document.getElementById('emptyMsg');
    const totalCount = document.getElementById('totalCount');
    const activeCount = document.getElementById('activeCount');
    const doneCount = document.getElementById('doneCount');

    const pomoTime = document.getElementById('pomoTime');
    const pomoStartBtn = document.getElementById('pomoStartBtn');
    const pomoModeBtn = document.getElementById('pomoModeBtn');
    const pomoResetBtn = document.getElementById('pomoResetBtn');

    let filter = 'all';
    let tasks = [
      { id: 1, text: 'Navrhnout čistou architekturu projektu', done: true },
      { id: 2, text: 'Zkontrolovat ošetření okrajových stavů', done: false },
      { id: 3, text: 'Otestovat responzivní vzhled v náhledu', done: false }
    ];

    function renderTasks() {
      taskList.replaceChildren();
      const visible = tasks.filter(t => filter === 'all' ? true : filter === 'done' ? t.done : !t.done);
      emptyMsg.hidden = visible.length > 0;

      visible.forEach(task => {
        const li = document.createElement('li');
        if (task.done) li.classList.add('done');

        const label = document.createElement('label');
        label.style.display = 'flex';
        label.style.alignItems = 'center';
        label.style.gap = '8px';
        label.style.cursor = 'pointer';
        label.style.flex = '1';

        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.checked = task.done;
        cb.addEventListener('change', () => {
          task.done = cb.checked;
          renderTasks();
        });

        const span = document.createElement('span');
        span.textContent = task.text;
        label.append(cb, span);

        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.className = 'ghost';
        delBtn.textContent = 'Smazat';
        delBtn.style.padding = '5px 9px';
        delBtn.addEventListener('click', () => {
          tasks = tasks.filter(t => t.id !== task.id);
          renderTasks();
        });

        li.append(label, delBtn);
        taskList.appendChild(li);
      });

      const done = tasks.filter(t => t.done).length;
      totalCount.textContent = String(tasks.length);
      doneCount.textContent = String(done);
      activeCount.textContent = String(tasks.length - done);
    }

    taskForm.addEventListener('submit', e => {
      e.preventDefault();
      const text = taskInput.value.trim();
      if (!text) return;
      tasks.unshift({ id: Date.now(), text, done: false });
      taskInput.value = '';
      renderTasks();
    });

    document.querySelectorAll('[data-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        filter = btn.dataset.filter;
        document.querySelectorAll('[data-filter]').forEach(b => b.classList.toggle('active', b === btn));
        renderTasks();
      });
    });

    let pomoSeconds = 25 * 60;
    let isShortBreak = false;
    let pomoInterval = null;

    function updatePomoView() {
      const m = String(Math.floor(pomoSeconds / 60)).padStart(2, '0');
      const s = String(pomoSeconds % 60).padStart(2, '0');
      pomoTime.textContent = m + ':' + s;
    }

    pomoStartBtn.addEventListener('click', () => {
      if (pomoInterval) {
        clearInterval(pomoInterval);
        pomoInterval = null;
        pomoStartBtn.textContent = 'Pokračovat';
        return;
      }
      pomoStartBtn.textContent = 'Pozastavit';
      pomoInterval = setInterval(() => {
        if (pomoSeconds > 0) {
          pomoSeconds--;
          updatePomoView();
        } else {
          clearInterval(pomoInterval);
          pomoInterval = null;
          pomoStartBtn.textContent = 'Spustit';
        }
      }, 1000);
    });

    pomoModeBtn.addEventListener('click', () => {
      if (pomoInterval) { clearInterval(pomoInterval); pomoInterval = null; }
      isShortBreak = !isShortBreak;
      pomoSeconds = (isShortBreak ? 5 : 25) * 60;
      pomoModeBtn.textContent = isShortBreak ? 'Práce 25 min' : 'Pauza 5 min';
      pomoStartBtn.textContent = 'Spustit';
      updatePomoView();
    });

    pomoResetBtn.addEventListener('click', () => {
      if (pomoInterval) { clearInterval(pomoInterval); pomoInterval = null; }
      pomoSeconds = (isShortBreak ? 5 : 25) * 60;
      pomoStartBtn.textContent = 'Spustit';
      updatePomoView();
    });

    renderTasks();
    updatePomoView();
  </script>
</body>
</html>`;
}

function buildCustomInteractiveHtml(prompt, previous = null) {
  const q = normalizeCz(prompt);

  if (previous?.html) {
    // Apply targeted revision to existing HTML (e.g. dark mode, title update, extra polish)
    let updated = previous.html;
    if (/tmav|dark|nocn/.test(q) && !updated.includes('/* dark-mode-applied */')) {
      const darkCss = `/* dark-mode-applied */ body{background:#141f1a!important;color:#e6efe9!important} .card,.panel,.wrap,.stat,li{background:#1d2c25!important;color:#e6efe9!important;border-color:#2e4439!important}`;
      updated = updated.replace(/<\/style>/i, darkCss + '</style>');
    }
    return updated;
  }

  if (/pexeso|karty|dvojic/.test(q)) return buildPexesoHtml();
  if (/had|snake|arkad|hra/.test(q)) return buildSnakeHtml();
  if (/kalkula|vypocet|prevod/.test(q)) return buildCalculatorHtml();
  if (/ukol|todo|pomodoro|seznam|planovac/.test(q)) return buildTodoPomodoroHtml();

  const cleanTitle = (prompt || 'Interaktivní aplikace')
    .replace(/^(vytvor|napis|udelej|postav|navrhni)\s+/i, '')
    .trim()
    .slice(0, 60) || 'Interaktivní aplikace';

  const safeTitle = cleanTitle.replace(/[<>&"']/g, '');

  return `<!doctype html>
<html lang="cs">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${safeTitle} · Kódovna</title>
  <style>
    :root { --bg:#f6f8f4; --card:#ffffff; --accent:#234b3b; --accent-soft:#dde6d5; --border:#d8e0d2; --text:#1f2e27; --muted:#68756a; }
    * { box-sizing:border-box; }
    body { margin:0; font-family:Inter,system-ui,sans-serif; background:var(--bg); color:var(--text); padding:24px 16px; display:flex; justify-content:center; }
    .container { width:100%; max-width:700px; }
    .header-card, .main-card { background:var(--card); border:1px solid var(--border); border-radius:14px; padding:20px; margin-bottom:16px; }
    h1 { margin:0 0 6px; font-size:22px; }
    .sub { margin:0; font-size:13px; color:var(--muted); }
    .metrics { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-top:16px; }
    .metric { background:#f1f5ed; border-radius:10px; padding:12px; text-align:center; font-size:11px; color:var(--muted); }
    .metric b { display:block; font-size:20px; color:var(--accent); margin-top:4px; }
    .controls { display:flex; gap:8px; margin-bottom:14px; flex-wrap:wrap; }
    input, select { padding:10px 12px; border:1px solid var(--border); border-radius:8px; font:inherit; font-size:13px; }
    input[type="text"] { flex:1; min-width:180px; }
    button { background:var(--accent); color:#fff; border:0; border-radius:8px; padding:10px 16px; font:inherit; font-size:13px; font-weight:600; cursor:pointer; }
    button.secondary { background:#eef2ea; color:var(--text); border:1px solid var(--border); }
    .items { display:flex; flex-direction:column; gap:8px; }
    .item { display:flex; justify-content:space-between; align-items:center; gap:12px; padding:12px 14px; border:1px solid var(--border); border-radius:10px; background:#fafbf9; }
    .badge { background:var(--accent-soft); color:var(--accent); padding:4px 9px; border-radius:20px; font-size:11px; font-weight:600; }
  </style>
</head>
<body>
  <div class="container">
    <section class="header-card">
      <h1>${safeTitle}</h1>
      <p class="sub">Interaktivní lokální aplikace připravená k okamžitému použití</p>
      <div class="metrics">
        <div class="metric">Položek celkem<b id="metricTotal">3</b></div>
        <div class="metric">Aktivní stav<b id="metricActive">2</b></div>
        <div class="metric">Dokončeno<b id="metricDone">1</b></div>
      </div>
    </section>
    <section class="main-card">
      <form class="controls" id="addForm">
        <input type="text" id="itemName" aria-label="Název položky" placeholder="Zadej novou položku nebo záznam…" maxlength="100">
        <select id="itemCategory" aria-label="Priorita">
          <option value="Hlavní">Hlavní</option>
          <option value="Rychlé">Rychlé</option>
          <option value="Nápad">Nápad</option>
        </select>
        <button type="submit" id="submitBtn">Přidat záznam</button>
      </form>
      <div class="controls">
        <input type="text" id="searchBox" aria-label="Hledat v záznamech" placeholder="Filtrovat záznamy podle názvu…">
        <button type="button" class="secondary" id="resetDemoBtn">Obnovit ukázku</button>
      </div>
      <div class="items" id="itemsContainer"></div>
      <p id="emptyState" style="font-size:13px;color:var(--muted)" hidden>Žádné položky neodpovídají zadání.</p>
    </section>
  </div>
  <script>
    const addForm = document.getElementById('addForm');
    const itemName = document.getElementById('itemName');
    const itemCategory = document.getElementById('itemCategory');
    const searchBox = document.getElementById('searchBox');
    const resetDemoBtn = document.getElementById('resetDemoBtn');
    const itemsContainer = document.getElementById('itemsContainer');
    const emptyState = document.getElementById('emptyState');
    const metricTotal = document.getElementById('metricTotal');
    const metricActive = document.getElementById('metricActive');
    const metricDone = document.getElementById('metricDone');

    const INITIAL = [
      { id: 1, title: 'První funkční prototyp v prohlížeči', category: 'Hlavní', done: true },
      { id: 2, title: 'Interaktivní filtrování a správa záznamů', category: 'Rychlé', done: false },
      { id: 3, title: 'Kontrola přístupnosti a klávesového ovládání', category: 'Nápad', done: false }
    ];

    let records = INITIAL.map(x => ({ ...x }));

    function render() {
      const query = searchBox.value.trim().toLocaleLowerCase('cs');
      const filtered = records.filter(r => r.title.toLocaleLowerCase('cs').includes(query));
      itemsContainer.replaceChildren();
      emptyState.hidden = filtered.length > 0;

      filtered.forEach(rec => {
        const row = document.createElement('div');
        row.className = 'item';

        const left = document.createElement('div');
        left.style.display = 'flex';
        left.style.alignItems = 'center';
        left.style.gap = '10px';

        const toggle = document.createElement('input');
        toggle.type = 'checkbox';
        toggle.checked = rec.done;
        toggle.addEventListener('change', () => {
          rec.done = toggle.checked;
          render();
        });

        const title = document.createElement('span');
        title.textContent = rec.title;
        if (rec.done) title.style.textDecoration = 'line-through';

        const badge = document.createElement('span');
        badge.className = 'badge';
        badge.textContent = rec.category;

        left.append(toggle, title, badge);

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'secondary';
        removeBtn.textContent = 'Odebrat';
        removeBtn.style.padding = '6px 10px';
        removeBtn.addEventListener('click', () => {
          records = records.filter(x => x.id !== rec.id);
          render();
        });

        row.append(left, removeBtn);
        itemsContainer.appendChild(row);
      });

      const doneCount = records.filter(r => r.done).length;
      metricTotal.textContent = String(records.length);
      metricDone.textContent = String(doneCount);
      metricActive.textContent = String(records.length - doneCount);
    }

    addForm.addEventListener('submit', e => {
      e.preventDefault();
      const title = itemName.value.trim();
      if (!title) return;
      records.unshift({ id: Date.now(), title, category: itemCategory.value, done: false });
      itemName.value = '';
      render();
    });

    searchBox.addEventListener('input', render);
    resetDemoBtn.addEventListener('click', () => {
      records = INITIAL.map(x => ({ ...x }));
      searchBox.value = '';
      render();
    });

    render();
  </script>
</body>
</html>`;
}

export function synthesizeLocalResponse(mode, input, previous = null) {
  const q = normalizeCz(input);

  if (mode === 'create') {
    const html = buildCustomInteractiveHtml(input, previous);
    return `\`\`\`html\n${html}\n\`\`\``;
  }

  if (mode === 'code') {
    if (/debounce/.test(q)) {
      return `## Produkční implementace funkce \`debounce\`

Funkce \`debounce\` odkládá spuštění předané funkce až do chvíle, kdy uplyne stanovený interval \`delay\` od posledního volání. Hodí se pro našeptávače vyhledávání, validaci formulářů při psaní nebo události \`resize\` a \`scroll\`.

\`\`\`javascript
/**
 * Vytvoří debounced verzi funkce s podporou okamžitého volání (leading)
 * a metodami cancel() a flush().
 *
 * @param {Function} fn Cílová funkce
 * @param {number} delay Prodleva v milisekundách (výchozí 250 ms)
 * @param {{ leading?: boolean }} options Volitelné nastavení
 */
function debounce(fn, delay = 250, options = {}) {
  if (typeof fn !== 'function') {
    throw new TypeError('První argument musí být funkce.');
  }

  let timerId = null;
  let lastArgs = null;
  let lastThis = null;
  const leading = Boolean(options.leading);

  function debounced(...args) {
    lastArgs = args;
    lastThis = this;
    const callNow = leading && timerId === null;

    if (timerId !== null) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      timerId = null;
      if (!leading && lastArgs !== null) {
        fn.apply(lastThis, lastArgs);
        lastArgs = null;
        lastThis = null;
      }
    }, Math.max(0, Number(delay) || 0));

    if (callNow) {
      fn.apply(lastThis, lastArgs);
      lastArgs = null;
      lastThis = null;
    }
  }

  debounced.cancel = function () {
    if (timerId !== null) {
      clearTimeout(timerId);
      timerId = null;
    }
    lastArgs = null;
    lastThis = null;
  };

  debounced.flush = function () {
    if (timerId !== null) {
      clearTimeout(timerId);
      timerId = null;
      if (lastArgs !== null) {
        fn.apply(lastThis, lastArgs);
        lastArgs = null;
        lastThis = null;
      }
    }
  };

  return debounced;
}

// Ukázka použití:
const handleSearch = debounce((query) => {
  console.log('Vyhledávám dotaz:', query);
}, 300);

handleSearch('kód');
handleSearch('kódov');
handleSearch('kódovna'); // Zavolá se pouze jednou s hodnotou "kódovna"
\`\`\`

### Klíčové vlastnosti tohoto řešení
- **Zachování kontextu (\`this\`) a argumentů**: Používá \`fn.apply(lastThis, lastArgs)\`, takže funguje i pro metody objektů.
- **Metoda \`cancel()\`**: Umožní zrušit čekající volání například při odpojení komponenty.
- **Metoda \`flush()\`**: Okamžitě provede čekající volání bez dalšího čekání na časovač.`;
    }

    if (/lru|cache/.test(q)) {
      return `## Implementace \`LRUCache\` v čase \`O(1)\`

V JavaScriptu si objekt \`Map\` pamatuje pořadí vložení klíčů. Díky tomu lze operace \`get\` i \`put\` implementovat v konstantním čase **O(1)** bez ručního psaní obousměrného spojového seznamu.

\`\`\`javascript
class LRUCache {
  /**
   * @param {number} capacity Maximální počet položek v cache (> 0)
   */
  constructor(capacity = 100) {
    if (!Number.isInteger(capacity) || capacity <= 0) {
      throw new RangeError('Kapacita LRUCache musí být kladné celé číslo.');
    }
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    const value = this.cache.get(key);
    // Přesun klíče na konec (nejnověji použitý)
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // První klíč v Map je nejdéle nepoužitý (Least Recently Used)
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    this.cache.set(key, value);
  }

  get size() {
    return this.cache.size;
  }
}

// Ověření funkčnosti:
const lru = new LRUCache(2);
lru.put('a', 1);
lru.put('b', 2);
console.log(lru.get('a')); // 1 ('a' je nyní nejnovější)
lru.put('c', 3);           // Vyřadí 'b'
console.log(lru.get('b')); // -1 (nenalezeno)
console.log(lru.get('c')); // 3
\`\`\``;
    }

    if (/fetch|retry|timeout/.test(q)) {
      return `## Odolný \`fetchWithRetry\` s timeoutem a exponenciálním backoffem

\`\`\`javascript
/**
 * Provede HTTP požadavek s časovým limitem a automatickým opakováním při chybě.
 */
async function fetchWithRetry(url, options = {}) {
  const {
    retries = 3,
    timeoutMs = 5000,
    baseDelayMs = 300,
    ...fetchOptions
  } = options;

  let lastError = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal
      });
      clearTimeout(timer);

      if (!response.ok && response.status >= 500 && attempt < retries) {
        throw new Error(\`Server vrátil chybu HTTP \${response.status}\`);
      }
      return response;
    } catch (err) {
      clearTimeout(timer);
      lastError = err.name === 'AbortError'
        ? new Error(\`Požadavek překročil časový limit \${timeoutMs} ms\`)
        : err;

      if (attempt === retries) break;
      const backoff = baseDelayMs * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, backoff));
    }
  }

  throw lastError;
}
\`\`\``;
    }

    return `## Čisté a otestované řešení v JavaScriptu

Zde je kompletní, modulární implementace s ošetřením vstupů a ukázkovým použitím:

\`\`\`javascript
/**
 * Univerzální zpracování dat s validací a bezpečným ošetřením okrajových stavů.
 */
function processItems(items, predicate = Boolean) {
  if (!Array.isArray(items)) {
    throw new TypeError('Očekáváno pole položek (Array).');
  }
  if (typeof predicate !== 'function') {
    throw new TypeError('Predikát musí být funkce.');
  }

  const matched = [];
  const rejected = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (predicate(item, i)) {
      matched.push(item);
    } else {
      rejected.push(item);
    }
  }

  return {
    total: items.length,
    matchedCount: matched.length,
    rejectedCount: rejected.length,
    matched,
    rejected
  };
}

// Příklad použití:
const result = processItems([12, -4, 0, 28, 7], (n) => n > 0);
console.log(result.matched); // [12, 28, 7]
\`\`\``;
  }

  if (mode === 'debug') {
    if (/settimeout/.test(q) && /for\s*\(\s*var\b/.test(q)) {
      return `## 1. Příčina chyby (Root Cause)

Proměnná deklarovaná pomocí \`var i\` má **funkční platnost (function/global scope)**, nikoliv blokovou. Všechny tři callbacky v \`setTimeout\` tak sdílejí **jedinou proměnnou \`i\`**. Smyčka \`for\` doběhne synchronně dříve, než uplyne 1000 ms, a hodnota \`i\` je na konci smyčky rovna \`3\`. Proto se třikrát vypíše \`3\`.

## 2. Opravený kompletní kód

Stačí nahradit \`var\` klíčovým slovem \`let\`, které vytvoří novou vazbu proměnné \`i\` pro každou iteraci cyklu:

\`\`\`javascript
for (let i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i);
  }, 1000);
}
\`\`\`

## 3. Proč oprava funguje
- \`let\` má **blokovou platnost (block scope)** — každá iterace cyklu \`for\` má vlastní nezávislou hodnotu \`i\` (\`0\`, \`1\`, \`2\`).`;
    }

    if (/onclick\s*=\s*handleclick\(\)/.test(q)) {
      return `## 1. Příčina chyby (Root Cause)

Na řádku \`document.getElementById("btn").onclick = handleClick();\` funkci **okamžitě voláš** pomocí závorek \`()\`, místo abys předal odkaz na funkci. Vlastnosti \`onclick\` se tak přiřadí návratová hodnota \`undefined\` a při dalších kliknutích už se nic nespustí.

## 2. Opravený kompletní kód

\`\`\`javascript
let count = 0;
const btn = document.getElementById('btn');
const out = document.getElementById('out');

function handleClick() {
  count += 1;
  if (out) {
    out.textContent = String(count);
  }
}

if (btn) {
  btn.addEventListener('click', handleClick);
}
\`\`\`

## 3. Proč oprava funguje
- Předáváme referenci \`handleClick\` (bez \`()\`), takže se funkce zavolá při každém kliknutí.
- Použití \`addEventListener\` a kontrola existence elementu (\`if (btn)\`) brání chybě \`TypeError: Cannot set properties of null\`.`;
    }

    if (/applydiscount/.test(q)) {
      return `## 1. Nalezené chyby pro okrajové vstupy

Původní funkce \`applyDiscount(price, percent)\` nekontroluje vstupy:
1. **Záporná cena nebo sleva nad 100 %**: Vrátí zápornou částku.
2. **Nečíselné vstupy (\`undefined\`, \`null\`, \`"abc"\`, \`NaN\`)**: Výpočet skončí hodnotou \`NaN\`.
3. **Zaokrouhlení \`Math.round\`**: U haléřových částek ztrácí přesnost na 2 desetinná místa.

## 2. Opravený a bezpečný kód

\`\`\`javascript
function applyDiscount(price, percent) {
  const numPrice = Number(price);
  const numPercent = Number(percent);

  if (!Number.isFinite(numPrice) || numPrice < 0) {
    throw new RangeError('Cena musí být nezáporné konečné číslo.');
  }
  if (!Number.isFinite(numPercent) || numPercent < 0 || numPercent > 100) {
    throw new RangeError('Sleva musí být v rozmezí 0 až 100 %.');
  }

  const discounted = numPrice * (1 - numPercent / 100);
  return Math.round(discounted * 100) / 100;
}
\`\`\``;
    }

    // Generic syntax & static code audit if user pasted code
    const fenced = input.match(/```(?:js|javascript)?\s*([\s\S]*?)```/i);
    const snippet = fenced ? fenced[1] : input;
    const syntaxErr = checkJsSyntax(snippet);
    return `## Diagnostika kódu

1. **Kontrola syntaxe**: ${syntaxErr ? `Nalezena syntaktická chyba — \`${syntaxErr}\`.` : 'Syntaxe JavaScriptu je platná, problém je v logice nebo práci se stavem/DOM.'}
2. **Doporučený postup opravy**:
   - Ověř, že všechny DOM elementy načítané přes \`getElementById\` / \`querySelector\` v okamžiku spuštění skriptu skutečně existují.
   - Přiřazuj obsluhu událostí jako referenci (\`el.addEventListener('click', fn)\`), nikoliv voláním \`fn()\`.
   - Ošetři prázdné nebo nečíselné vstupy před dalším výpočtem.`;
  }

  if (mode === 'write') {
    if (/kav|prazirn/.test(q)) {
      return `## Hlavní úvodní text na web pražírny

**Káva, která má původ, jméno a čerstvou vůni.**
V naší lokální pražírně pražíme výběrová zrna po malých dávkách tak, aby v každém šálku vynikla jejich přirozená chuť — od jemných čokoládových tónů až po šťavnaté ovocné mikroloty. Pražíme každý týden a posíláme přímo k vám, dokud jsou zrna v nejlepší kondici.

### 3 úderné podnadpisy
1. **Čerstvě praženo v malých dávkách, doručeno přímo do vašeho mlýnku.**
2. **Žádné kompromisy ani přepražená hořkost — jen čistá chuť výběrových zrn.**
3. **Od farmářů, které známe jménem, až po váš ranní rituál.**`;
    }

    if (/email|e-mail|termin|klient/.test(q)) {
      return `## Předmět: Aktualizace termínu spuštění webu a pozvánka na finální ukázku

Dobrý den, [Jméno klienta],

rád bych Vás krátce informoval o stavu dokončování Vašeho nového webu. Všechny hlavní části i uživatelské rozhraní jsou hotové a připravené.

Při závěrečné kontrole jsme se rozhodli věnovat ještě **3 pracovní dny důkladnému bezpečnostnímu a zátěžovému testování**, abychom měli stoprocentní jistotu, že web poběží od prvního dne zcela spolehlivě a bez rizika výpadku.

- **Nový termín ostrého nasazení:** [Datum + 3 pracovní dny]
- **Návrh termínu společné online ukázky:** [Zítřejší datum] v 10:00 nebo 14:00

Dejte mi prosím vědět, který čas Vám pro krátkou ukázku vyhovuje lépe.

S pozdravem a díky za pochopení,
[Vaše jméno]`;
    }

    return `## Návrh kultivovaného textu

Zde je strukturovaný a čtivý text připravený k okamžitému použití:

### Hlavní sdělení
Jasný, srozumitelný text staví na konkrétních přínosech místo obecných frází. Každý odstavec vede čtenáře k jednomu hlavnímu bodu a končí jednoznačným dalším krokem.

### Doporučená struktura
- **Úvod (Hook):** Pojmenuj hlavní přínos nebo problém hned v první větě.
- **Jádro sdělení:** Rozděl informace do 3 přehledných bodů s konkrétními fakty.
- **Výzva k akci (CTA):** Uzavři text jasným doporučením, co má čtenář udělat dál.`;
  }

  // General mode
  if (/cerpadl|nadrz/.test(q)) {
    return `## Výpočet doby naplnění nádrže

Nádrž se při současném běhu obou čerpadel a výpusti naplní přesně za **3 hodiny**.

### Postup výpočtu krok za krokem
1. **Výkon prvního čerpadla:** Naplní nádrž za 6 hodin, tedy za 1 hodinu naplní \`1/6\` nádrže.
2. **Výkon druhého čerpadla:** Naplní nádrž za 4 hodiny, tedy za 1 hodinu naplní \`1/4\` nádrže.
3. **Průtok výpusti:** Vyprázdní nádrž za 12 hodin, tedy za 1 hodinu ubere \`1/12\` nádrže.
4. **Společný hodinový přírůstek:**
   \`1/6 + 1/4 - 1/12 = 2/12 + 3/12 - 1/12 = 4/12 = 1/3\` nádrže za hodinu.
5. **Celkový čas:** Pokud se za 1 hodinu naplní \`1/3\` objemu, celá nádrž (\`3/3\`) se naplní za **3 hodiny**.`;
  }

  if (/kryptograf|verejn|soukrom/.test(q)) {
    return `## Jak funguje asymetrická kryptografie

Asymetrická kryptografie používá místo jednoho společného hesla **dvojici matematicky propojených klíčů**:

1. **Veřejný klíč (Public Key) — jako otevřená visací zámková schránka:**
   Můžeš ho poslat komukoliv. Kdokoliv pomocí něj může zprávu **zamknout (zašifrovat)**, ale nikdo ji jím nedokáže znovu odemknout.
2. **Soukromý klíč (Private Key) — jediný klíč od schránky:**
   Zůstává výhradně u tebe. Pouze tento klíč dokáže zprávu zašifrovanou tvým veřejným klíčem **odemknout (dešifrovat)**.

### Praktický příklad
- Alice chce poslat Bobovi tajnou zprávu.
- Stáhne si **Bobův veřejný klíč** a zprávu jím zašifruje.
- I když zašifrovanou zprávu po cestě zachytí útočník, bez **Bobova soukromého klíče** je pro něj nečitelná.
- Bob zprávu přijme a odemkne ji svým **soukromým klíčem**.`;
  }

  if (/8\s*tydn|webov|html|css/.test(q)) {
    return `## 8týdenní plán: Moderní webový vývoj krok za krokem

### Týden 1–2: Sémantické HTML5 a moderní CSS
- Struktura dokumentu, formuláře, přístupnost (ARIA, klávesová navigace).
- Flexbox, CSS Grid, responzivní design a CSS proměnné.
- **Milník:** Osobní responzivní portfolio bez jediné knihovny.

### Týden 3–4: Jádro JavaScriptu (ES6+)
- Proměnné, funkce, pole, objekty, uzávěry (closures) a modulární struktura.
- Práce s DOM, události (\`addEventListener\`) a validace vstupů.
- **Milník:** Interaktivní správce úkolů nebo kalkulačka.

### Týden 5–6: Asynchronní JS, API a práce se stavem
- \`Promise\`, \`async/await\`, \`fetch\`, ošetření síťových chyb a \`localStorage\`.
- **Milník:** Aplikace s filtrováním dat a trvalým uložením stavu v prohlížeči.

### Týden 7–8: Architektura, testování a nasazení
- Rozdělení kódu do ES modulů (\`import\`/\`export\`), jednotkové testy (\`node:test\`) a nasazení přes GitHub Pages.
- **Milník:** Kompletní vlastní webová aplikace nasazená online.`;
  }

  return `## Přehledné řešení a rozbor: ${input.slice(0, 70)}

1. **Hlavní odpověď:** Pro spolehlivý výsledek rozděl úkol na jasně definovaný vstup, ověřitelnou logiku zpracování a kontrolu výstupu.
2. **Doporučený postup:**
   - **Krok 1 — Definice cíle:** Urči přesně, jaký výstup potřebuješ a jaké okrajové stavy mohou nastat.
   - **Krok 2 — Implementace / Návrh:** Zvol nejjednodušší čisté řešení bez zbytečných závislostí.
   - **Krok 3 — Ověření:** Otestuj řešení na reálném příkladu i prázdném/chybovém vstupu.`;
}
