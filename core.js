const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

export const MODE_META = {
  create: {
    title: 'Tvůrce her a aplikací',
    eyebrow: 'MALÁ DÍLNA. VELKÉ NÁPADY.',
    headingPlain: 'Tvůj AI',
    headingEm: 'tvůrce.',
    lead: 'Popiš hru nebo aplikaci. Kódovna ji vytvoří, zkontroluje syntaxi i DOM a ukáže živý náhled. Výsledný soubor můžeš stáhnout a otevřít samostatně.',
    placeholder: 'Co dnes vytvoříme? Napiš zadání nebo vlož kód…',
    temperature: 0.2,
    maxTokens: 2560,
    cards: [
      {
        icon: '⌘',
        title: 'Napiš se mnou kód',
        sub: 'Od prvního řádku k funkčnímu řešení',
        prompt: 'Napiš v JavaScriptu funkci debounce a vysvětli její použití.'
      },
      {
        icon: '⌕',
        title: 'Najdi, kde je chyba',
        sub: 'Vysvětlení i návrh opravy',
        prompt: 'Pomoz mi najít chybu v kódu. Nejprve mě požádej o kód a chybovou hlášku.'
      },
      {
        icon: '✎',
        title: 'Dej slovům tvar',
        sub: 'Texty, které dávají smysl',
        prompt: 'Pomoz mi napsat srozumitelný text. Nejprve se zeptej na téma a čtenáře.'
      }
    ]
  },
  general: {
    title: 'Asistent',
    eyebrow: 'MALÁ DÍLNA. VELKÉ NÁPADY.',
    headingPlain: 'Tvůj AI',
    headingEm: 'asistent.',
    lead: 'Zeptej se na cokoliv — vysvětlení pojmů, výpočty, plánování nebo rozbor problému. Odpověď vzniká přímo ve tvém prohlížeči.',
    placeholder: 'Na co se chceš zeptat? Napiš dotaz nebo úkol…',
    temperature: 0.3,
    maxTokens: 2048
  },
  code: {
    title: 'Kód',
    eyebrow: 'MALÁ DÍLNA. VELKÉ NÁPADY.',
    headingPlain: 'Tvůj AI',
    headingEm: 'kodér.',
    lead: 'Nech si napsat kompletní funkce, algoritmy nebo komponenty s vysvětlením a kontrolou syntaxe.',
    placeholder: 'Jaký kód potřebuješ napsat nebo vysvětlit?',
    temperature: 0.15,
    maxTokens: 2560
  },
  debug: {
    title: 'Ladění',
    eyebrow: 'MALÁ DÍLNA. VELKÉ NÁPADY.',
    headingPlain: 'Tvůj AI',
    headingEm: 'diagnostik.',
    lead: 'Vlož kód a chybovou hlášku. Kódovna najde příčinu chyby, vysvětlí ji a navrhne kompletní opravu.',
    placeholder: 'Vlož nefunkční kód a chybovou hlášku…',
    temperature: 0.15,
    maxTokens: 2560
  },
  write: {
    title: 'Psaní',
    eyebrow: 'MALÁ DÍLNA. VELKÉ NÁPADY.',
    headingPlain: 'Tvůj AI',
    headingEm: 'redaktor.',
    lead: 'Tvoř srozumitelné e-maily, články, dokumentaci nebo texty na web v přirozené češtině.',
    placeholder: 'Jaký text potřebuješ napsat nebo upravit?',
    temperature: 0.6,
    maxTokens: 2048
  }
};

export const SYSTEM_PROMPTS = {
  create:
    'You are Kódovna, a precise local web-app creator. Turn the user request into a complete, working single-file HTML5 document (<!doctype html><html lang="cs">...</html>) with inline <style> and <script>. Every element ID referenced in JS (getElementById/querySelector) must exist in the HTML. Never leave TODO placeholders. Implement working controls, responsive layout, and clean Czech UI text. Do not use external libraries, CDN links, remote assets, or network calls. For revisions, preserve the existing project and apply the requested change.',
  general:
    'You are Kódovna, an accurate, capable Czech AI assistant. Answer the user request directly and thoroughly. Never substitute a generic greeting for an answer or repeat the question. Verify calculations and logic step by step. Use clear structure (headings, bullet points, examples) for longer answers.',
  code:
    'You are Kódovna, a senior programming assistant. Write complete, runnable, idiomatic code with edge-case handling and zero TODO placeholders. Explain key decisions concisely and include a usage example.',
  debug:
    'You are Kódovna, a debugging specialist. Pinpoint the exact root cause of the bug, provide the complete fixed code, and briefly explain why the fix works. If code or error details are missing, ask for them concisely.',
  write:
    'You are Kódovna, a Czech writing and editing assistant. Write clear, natural, idiomatic Czech text adapted to the target audience and purpose.'
};

export function normalizeCz(text) {
  return (text || '')
    .toLocaleLowerCase('cs')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function taskGuide(input) {
  const q = normalizeCz(input);
  if (/hra|herni|tetris|had|snake|pexeso|skore|arkanoid|pong|flappy|skakac|piskvork|minolovka|2048|kviz/.test(q)) {
    return ' Task type: GAME. Build a playable loop with visible score/status, New Game/Restart button, and working keyboard + click/touch controls.';
  }
  if (/kalkula|prevod|vypocet|urok|bmi|casovac|stopky|minutk|pomodoro/.test(q)) {
    return ' Task type: CALCULATOR/TOOL. Validate inputs (prevent NaN/division by zero), support keyboard input, and show clear results.';
  }
  if (/web|stran|landing|portfolio|prezentac|vizitk|kavarn|restaurac/.test(q)) {
    return ' Task type: WEBSITE. Create a responsive page with clear sections, readable typography, and interactive controls/forms.';
  }
  if (/aplikac|nastroj|todo|ukol|seznam|generator|planner|planovac|sprav|poznamk|rozpocet/.test(q)) {
    return ' Task type: APPLICATION. Implement working add/toggle/delete/filter controls and keep state in memory with initial sample items.';
  }
  return ' Task type: infer the best fit from the request. Build a focused, complete version where every visible control works.';
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

  // If script uses innerHTML/insertAdjacentHTML with dynamic id=, don't flag IDs created there
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
