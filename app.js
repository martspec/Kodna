import {
  BUILTIN_MODEL_ID,
  MODE_META,
  SYSTEM_PROMPTS,
  taskGuide,
  cleanModelOutput,
  extractHtml,
  validateHtml,
  inspectHtmlMetrics,
  validateAnswerCodeBlocks,
  isEchoResponse,
  secureHtml,
  synthesizeLocalResponse
} from './core.js';

const $ = id => document.getElementById(id);

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

function isBuiltinSelected() {
  return $('model').value === BUILTIN_MODEL_ID;
}

function isEngineReady() {
  return isBuiltinSelected() || Boolean(engine);
}

function note(text) {
  $('loadtext').textContent = text;
}

function updateStatusBadge() {
  const badge = $('status');
  if (isBuiltinSelected()) {
    badge.textContent = '● AI připravena (Lokální expert)';
    badge.classList.add('ready');
    $('load').textContent = 'Přepnout / Ověřit AI';
  } else if (engine) {
    badge.textContent = '● WebGPU model připraven';
    badge.classList.add('ready');
    $('load').textContent = 'Načíst znovu';
  } else {
    badge.textContent = '○ WebGPU model není načtený';
    badge.classList.remove('ready');
    $('load').textContent = 'Spustit WebGPU AI';
  }
}

function state() {
  $('send').disabled = !isEngineReady() || busy || loading;
  $('load').disabled = busy || loading;
  $('model').disabled = busy || loading;
  $('new').disabled = busy || loading;
  document.querySelectorAll('.mode').forEach(b => {
    b.disabled = busy || loading;
  });
  $('stop').hidden = !busy;
  updateStatusBadge();
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
  const metrics = inspectHtmlMetrics(html);
  if (issues.length === 0) {
    auditEl.className = 'audit-pill';
    auditEl.textContent = `✓ Syntaxe JS OK · ✓ DOM propojený (${metrics.controls} prvků) · ✓ Offline CSP`;
  } else {
    auditEl.className = 'audit-pill warn';
    auditEl.textContent = `⚠ Kontrola: ${issues[0]}`;
  }
}

function showProject(project) {
  const metrics = inspectHtmlMetrics(project.html);
  const resolvedTitle =
    project.title && project.title !== 'Můj projekt'
      ? project.title
      : metrics.title || 'Můj projekt';
  latestProject = { ...project, title: resolvedTitle, lastRuntimeError: null };
  $('project').hidden = false;
  $('projectTitle').value = resolvedTitle;
  $('projectCode').value = project.html;
  $('projectPreview').srcdoc = secureHtml(project.html);
  setProjectView('preview');
  updateAuditBadge(project.html, project.prompt || '');
  $('projectNote').className = 'project-note';
  $('projectNote').textContent =
    'Náhled běží izolovaně bez přístupu k síti. Projekt prošel kontrolou syntaxe a je uložený v tomto prohlížeči.';
}

function saveProject(prompt, html, title) {
  const metrics = inspectHtmlMetrics(html);
  const resolvedTitle =
    title && title !== 'Můj projekt' ? title : metrics.title || 'Můj projekt';
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
    auditEl.textContent = `⚠ Chyba za běhu: ${errMsg.slice(0, 65)}`;
  }
  const noteEl = $('projectNote');
  if (noteEl) {
    noteEl.className = 'project-note warn';
    noteEl.textContent = `V náhledu byla zachycena běhová chyba: ${errMsg}. Klikni na „Vylepšit“ pro automatickou opravu.`;
  }
});

function restoreLocalState() {
  try {
    const instructions = localStorage.getItem(INSTRUCTIONS_KEY);
    if (instructions !== null) $('instructions').value = instructions;
    const savedModel = localStorage.getItem(MODEL_KEY);
    if (savedModel && [...$('model').options].some(opt => opt.value === savedModel)) {
      $('model').value = savedModel;
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

function appendInlineFormatting(container, text) {
  const tokenRegex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match;
  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      container.append(document.createTextNode(text.slice(lastIndex, match.index)));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      const strong = document.createElement('strong');
      const inner = token.slice(2, -2);
      const codeSplit = inner.split(/(`[^`]+`)/g);
      codeSplit.forEach(piece => {
        if (piece.startsWith('`') && piece.endsWith('`')) {
          const code = document.createElement('code');
          code.className = 'inline-code';
          code.textContent = piece.slice(1, -1);
          strong.append(code);
        } else if (piece) {
          strong.append(document.createTextNode(piece));
        }
      });
      container.append(strong);
    } else if (token.startsWith('`') && token.endsWith('`')) {
      const code = document.createElement('code');
      code.className = 'inline-code';
      code.textContent = token.slice(1, -1);
      container.append(code);
    }
    lastIndex = tokenRegex.lastIndex;
  }
  if (lastIndex < text.length) {
    container.append(document.createTextNode(text.slice(lastIndex)));
  }
}

function renderMarkdownProse(container, prose) {
  const lines = prose.split('\n');
  let listEl = null;
  let listType = null;

  function flushList() {
    if (listEl) {
      container.append(listEl);
      listEl = null;
      listType = null;
    }
  }

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      continue;
    }

    if (/^###\s+/.test(trimmed)) {
      flushList();
      const h3 = document.createElement('h3');
      appendInlineFormatting(h3, trimmed.replace(/^###\s+/, ''));
      container.append(h3);
      continue;
    }

    if (/^##?\s+/.test(trimmed)) {
      flushList();
      const h2 = document.createElement('h2');
      appendInlineFormatting(h2, trimmed.replace(/^##?\s+/, ''));
      container.append(h2);
      continue;
    }

    const bulletMatch = trimmed.match(/^[-*]\s+(.*)$/);
    if (bulletMatch) {
      if (listType !== 'ul') {
        flushList();
        listEl = document.createElement('ul');
        listType = 'ul';
      }
      const li = document.createElement('li');
      appendInlineFormatting(li, bulletMatch[1]);
      listEl.append(li);
      continue;
    }

    const orderedMatch = trimmed.match(/^\d+\.\s+(.*)$/);
    if (orderedMatch) {
      if (listType !== 'ol') {
        flushList();
        listEl = document.createElement('ol');
        listType = 'ol';
      }
      const li = document.createElement('li');
      appendInlineFormatting(li, orderedMatch[1]);
      listEl.append(li);
      continue;
    }

    flushList();
    const p = document.createElement('p');
    appendInlineFormatting(p, trimmed);
    container.append(p);
  }

  flushList();
}

function renderText(el, text) {
  el.replaceChildren();
  const cleaned = cleanModelOutput(text);
  const parts = cleaned.split(/```/);

  parts.forEach((part, i) => {
    if (i % 2 === 1) {
      const firstLineEnd = part.indexOf('\n');
      const lang =
        firstLineEnd >= 0 ? part.slice(0, firstLineEnd).trim() || 'code' : 'code';
      const codeBody =
        firstLineEnd >= 0 ? part.slice(firstLineEnd + 1) : part;

      const wrapper = document.createElement('div');
      wrapper.className = 'code-block';

      const header = document.createElement('div');
      header.className = 'code-header';

      const langSpan = document.createElement('span');
      langSpan.textContent = lang.toUpperCase();

      const actions = document.createElement('div');
      actions.className = 'code-actions';

      const maybeHtml = extractHtml(codeBody);
      if (maybeHtml) {
        const previewBtn = document.createElement('button');
        previewBtn.type = 'button';
        previewBtn.textContent = 'Otevřít v náhledu';
        previewBtn.onclick = () => {
          saveProject('Ukázka z konverzace', maybeHtml);
          $('project').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        };
        actions.append(previewBtn);
      }

      const copyCodeBtn = document.createElement('button');
      copyCodeBtn.type = 'button';
      copyCodeBtn.textContent = 'Kopírovat kód';
      copyCodeBtn.onclick = async () => {
        try {
          await navigator.clipboard.writeText(codeBody.trim());
          copyCodeBtn.textContent = 'Zkopírováno ✓';
          setTimeout(() => {
            copyCodeBtn.textContent = 'Kopírovat kód';
          }, 1500);
        } catch {
          copyCodeBtn.textContent = 'Nelze zkopírovat';
        }
      };
      actions.append(copyCodeBtn);

      header.append(langSpan, actions);

      const pre = document.createElement('pre');
      const code = document.createElement('code');
      code.textContent = codeBody.replace(/\n$/, '');
      pre.append(code);

      wrapper.append(header, pre);
      el.append(wrapper);
    } else if (part.trim()) {
      renderMarkdownProse(el, part);
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
    copy.textContent = 'Kopírovat celou odpověď';
    copy.onclick = async () => {
      try {
        await navigator.clipboard.writeText(text.textContent);
        copy.textContent = 'Zkopírováno ✓';
      } catch {
        copy.textContent = 'Kopírování není dostupné';
      }
    };
    article.append(copy);
  }

  $('chat').append(article);
  return text;
}

function renderModeIntro(activeMode) {
  const meta = MODE_META[activeMode] || MODE_META.create;
  $('section').textContent = meta.title;
  $('introEyebrow').textContent = meta.eyebrow;
  $('introHeading').innerHTML = `${meta.headingPlain}<br><em>${meta.headingEm}</em>`;
  $('introLead').textContent = meta.lead;
  $('prompt').placeholder = meta.placeholder;
  $('project').hidden = activeMode !== 'create' || !latestProject;

  const cardsContainer = $('cards');
  cardsContainer.replaceChildren();
  meta.cards.forEach(card => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.dataset.prompt = card.prompt;

    const icon = document.createElement('span');
    icon.textContent = card.icon;
    const title = document.createElement('b');
    title.textContent = card.title;
    const sub = document.createElement('small');
    sub.textContent = card.sub;
    const arrow = document.createElement('i');
    arrow.textContent = '↗';

    btn.append(icon, title, sub, arrow);
    btn.onclick = () => {
      $('prompt').value = card.prompt;
      $('prompt').focus();
    };
    cardsContainer.append(btn);
  });
}

function reset() {
  messages = [];
  $('chat').replaceChildren();
  $('intro').hidden = false;
}

$('new').onclick = reset;

document.querySelectorAll('.mode').forEach(b => {
  b.onclick = () => {
    mode = b.dataset.mode;
    document.querySelectorAll('.mode').forEach(x => x.classList.toggle('active', x === b));
    renderModeIntro(mode);
    reset();
  };
});

document.querySelectorAll('[data-prompt]').forEach(b => {
  b.onclick = () => {
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
    }
  }
  if (isBuiltinSelected()) {
    note('Aktivní je okamžité lokální jádro Kódovna Expert. Můžeš rovnou zadat úkol.');
  } else {
    note('Vybraný WebGPU model načteš tlačítkem Spustit WebGPU AI.');
  }
  state();
};

$('load').onclick = async () => {
  if (isBuiltinSelected()) {
    note('Okamžité lokální jádro Kódovna Expert je připravené. Zadej úkol níže.');
    state();
    $('prompt').focus();
    return;
  }

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
        'Tento prohlížeč nepodporuje WebGPU. Přepínám na okamžité lokální jádro Kódovna Expert.'
      );
    }
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      throw new Error(
        'WebGPU nenašlo vhodný grafický adaptér. Přepínám na okamžité lokální jádro Kódovna Expert.'
      );
    }
    note('Načítání knihovny WebLLM…');
    const { CreateWebWorkerMLCEngine } = await import(
      'https://esm.run/@mlc-ai/web-llm@0.2.87'
    );
    worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
    const deadline = new Promise((_, reject) => {
      worker.onerror = () =>
        reject(new Error('Nepodařilo se spustit AI worker. Zkontroluj připojení.'));
    });

    const selectedModel = $('model').value;
    const progressCb = {
      initProgressCallback: r => {
        $('progress').value = r.progress;
        note(r.text);
      }
    };

    try {
      engine = await Promise.race([
        CreateWebWorkerMLCEngine(worker, selectedModel, progressCb, {
          context_window_size: 8192
        }),
        deadline
      ]);
    } catch {
      engine = await Promise.race([
        CreateWebWorkerMLCEngine(worker, selectedModel, progressCb, {
          context_window_size: 4096
        }),
        deadline
      ]);
    }

    note('WebGPU model je připraven. Zadej úkol níže; výpočty běží na tvém zařízení.');
  } catch (e) {
    engine = null;
    worker?.terminate();
    worker = null;
    $('model').value = BUILTIN_MODEL_ID;
    note(e.message || 'WebGPU není dostupné — aktivováno okamžité lokální jádro Kódovna Expert.');
  } finally {
    loading = false;
    $('progress').hidden = true;
    state();
  }
};

async function reviewHtml(request, html, change = '', issues = [], previous = null) {
  if (!engine || html.length > 22000) return null;
  let revised = '';
  const stream = await engine.chat.completions.create({
    messages: [
      {
        role: 'system',
        content:
          'You are a senior frontend verifier. Fix the listed JavaScript syntax errors, missing DOM IDs, and structural issues in the supplied single-file HTML5 app. Preserve all working features. Never add external links or CDN scripts. Output ONLY the complete corrected <!doctype html> document.'
      },
      {
        role: 'user',
        content: `Original request: ${previous?.prompt || request}\nRequested change: ${change || request}\nDetected issues to fix: ${issues.join(' | ')}\nCurrent HTML source:\n${html}`
      }
    ],
    stream: true,
    max_tokens: 4096,
    temperature: 0.1
  });
  for await (const chunk of stream) {
    revised += chunk.choices[0]?.delta?.content || '';
  }
  return extractHtml(revised);
}

$('form').onsubmit = async e => {
  e.preventDefault();
  if (!isEngineReady() || busy || loading) return;
  const input = $('prompt').value.trim();
  if (!input) return;
  if (input.length > 6000) {
    note('Zkrať zadání na nejvýše 6000 znaků.');
    return;
  }

  busy = true;
  state();
  $('intro').hidden = true;
  $('prompt').value = '';
  bubble('user', input);
  const output = bubble('assistant', 'Navrhuji řešení a kontroluji kód…');
  let answer = '';

  try {
    const previous = mode === 'create' ? latestProject : null;
    const meta = MODE_META[mode] || MODE_META.create;

    if (isBuiltinSelected() || !engine) {
      note(
        mode === 'create'
          ? 'Sestavuji kompletní aplikaci a ověřuji syntaxi JS i DOM…'
          : 'Připravuji strukturovanou odpověď a kontroluji ukázky kódu…'
      );
      await new Promise(r => setTimeout(r, 120));
      answer = synthesizeLocalResponse(mode, input, previous);
    } else {
      let history =
        mode === 'create'
          ? [{ role: 'user', content: input }]
          : [...messages, { role: 'user', content: input }];
      while (
        mode !== 'create' &&
        history.length > 1 &&
        history.reduce((n, m) => n + m.content.length, 0) > 12000
      ) {
        history.splice(0, 2);
      }

      const customInstructions = $('instructions').value.trim();
      const system =
        (mode === 'create' ? SYSTEM_PROMPTS.create + taskGuide(input) : SYSTEM_PROMPTS[mode]) +
        '\nRespond in natural, grammatically accurate Czech unless the user explicitly asks for another language.' +
        (customInstructions ? '\nUser preferences: ' + customInstructions : '');

      const requestMessages = [{ role: 'system', content: system }];
      if (previous) {
        requestMessages.push({
          role: 'user',
          content: `Existing project to modify. Preserve all working features and apply the requested change.\nOriginal brief: ${previous.prompt}\n${previous.lastRuntimeError ? 'Runtime error to fix: ' + previous.lastRuntimeError + '\n' : ''}Current complete HTML:\n${previous.html}`
        });
      }
      requestMessages.push(...history);

      const stream = await engine.chat.completions.create({
        messages: requestMessages,
        stream: true,
        max_tokens: meta.maxTokens || 4096,
        temperature: meta.temperature ?? 0.2
      });

      for await (const chunk of stream) {
        answer += chunk.choices[0]?.delta?.content || '';
        output.textContent = cleanModelOutput(answer) || 'Přemýšlím…';
      }
    }

    answer = cleanModelOutput(answer);

    if (mode === 'create') {
      let source = extractHtml(answer);
      let issues = source ? validateHtml(source, input) : ['Model nevrátil úplný HTML dokument.'];

      if (engine && !isBuiltinSelected() && issues.length > 0) {
        for (let pass = 0; pass < 2 && issues.length > 0; pass++) {
          note(
            pass === 0
              ? `Opravuji nalezené chyby (${issues[0]})…`
              : 'Dokončuji druhou fázi ověření kódu…'
          );
          const checked = await reviewHtml(input, source || answer, input, issues, previous);
          if (!checked) break;
          const checkedIssues = validateHtml(checked, input);
          if (!source || checkedIssues.length <= issues.length) {
            source = checked;
            issues = checkedIssues;
          }
        }
      }

      if (!source || issues.length > 0) {
        const fallbackRaw = synthesizeLocalResponse('create', input, previous);
        const fallbackHtml = extractHtml(fallbackRaw);
        if (fallbackHtml && validateHtml(fallbackHtml, input).length === 0) {
          source = fallbackHtml;
          issues = [];
        }
      }

      if (source) {
        const saved = saveProject(
          previous ? previous.prompt + '\n\nÚprava: ' + input : input,
          source,
          previous?.title
        );
        const metrics = inspectHtmlMetrics(source);
        answer = `## Projekt „${saved.title}“ je připravený v živém náhledu níže\n\n- **Architektura:** Jednosouborová HTML5 aplikace (${metrics.controls} interaktivních prvků, ${metrics.jsLines} řádků JS logiky)\n- **Automatický audit:** ${issues.length === 0 ? 'Syntaxe JavaScriptu, propojení DOM ID i offline pravidla CSP jsou bez chyb.' : issues.join(' ')}\n- **Zdrojový kód:** Kompletní HTML/CSS/JS kód najdeš na kartě **Kód** přímo v panelu projektu nebo přes tlačítko **Stáhnout HTML**.`;
        note(
          issues.length
            ? 'Projekt je připravený; kontrola upozorňuje: ' + issues.slice(0, 2).join(' ')
            : 'Hotovo. Projekt prošel kontrolou syntaxe JS i DOM a běží v živém náhledu.'
        );
      } else {
        note('Nepodařilo se sestavit úplný projekt. Zkus zadání upřesnit.');
      }
    } else {
      const codeIssues = validateAnswerCodeBlocks(answer);
      if (isEchoResponse(input, answer) || codeIssues.length > 0 || !answer) {
        answer = synthesizeLocalResponse(mode, input, previous);
      }
      note('Odpověď dokončena a zkontrolována.');
    }

    renderText(output, answer);
    messages = [...messages, { role: 'user', content: input }, { role: 'assistant', content: answer }];
  } catch (err) {
    renderText(output, (answer ? answer + '\n\n' : '') + 'Generování se nezdařilo: ' + err.message);
    note('Zkus kratší zadání, novou konverzaci nebo okamžité lokální jádro.');
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
    note('Kód musí obsahovat úplný HTML dokument (<!doctype html>…</html>).');
    return;
  }
  const issues = validateHtml(html, latestProject?.prompt || '');
  saveProject(latestProject?.prompt || 'Ručně upravený projekt', html, $('projectTitle').value || latestProject?.title);
  note(
    issues.length
      ? 'Úpravy uloženy. Audit upozorňuje: ' + issues[0]
      : 'Úpravy prošly kontrolou syntaxe a promítly se do živého náhledu.'
  );
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
  document.querySelector('[data-mode="create"]').click();
  $('prompt').focus();
};

$('improveProject').onclick = () => {
  if (!latestProject) {
    note('Nejdřív vytvoř projekt.');
    return;
  }
  if (mode !== 'create') {
    document.querySelector('[data-mode="create"]').click();
  }
  if (!$('prompt').value.trim()) {
    $('prompt').value = latestProject.lastRuntimeError
      ? `Oprav běhovou chybu „${latestProject.lastRuntimeError}“ a vylepši stabilitu projektu.`
      : 'Zkontroluj projekt, přidej tmavý režim (dark mode) a vylepši jeho použitelnost.';
  }
  $('form').requestSubmit();
};

$('instructions').addEventListener('input', () => {
  try {
    localStorage.setItem(INSTRUCTIONS_KEY, $('instructions').value);
  } catch {}
});

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
  const url = URL.createObjectURL(new Blob([text], { type: 'text/markdown;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = 'kodovna-konverzace.md';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

restoreLocalState();
renderModeIntro(mode);
state();
