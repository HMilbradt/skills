#!/usr/bin/env node
// Validate a plan written in the format in ../PLAN.md, then render it as one HTML page.
// Usage: node plan.mjs <plan.md>
// Writes <plan>.html next to the plan. On a format error, prints each problem and exits 1.

import { readFileSync, writeFileSync } from "node:fs";

const SECTIONS = [
  "Why", "Done when", "Context", "Changes", "Stays the same", "Milestones",
  "Alternatives considered", "Wider change", "Decisions", "Risks and rollback",
  "Open questions", "Assumptions", "Follow-ups", "Progress", "Decision log", "Surprises",
];
const REQUIRED = ["Why", "Done when", "Milestones", "Progress", "Decision log", "Surprises"];

const path = process.argv[2];
if (!path || !path.endsWith(".md")) {
  console.error("Usage: node plan.mjs <plan.md>");
  process.exit(2);
}

const lines = readFileSync(path, "utf8").split(/\r?\n/);
const errors = [];
const fail = (line, msg) => errors.push(`${path}:${line + 1}: ${msg}`);

// Mark lines inside fenced code blocks, so headings and lists there are ignored.
const inFence = [];
for (let i = 0, open = null; i < lines.length; i++) {
  const m = lines[i].match(/^\s*(```|~~~)/);
  inFence[i] = open !== null || !!m;
  if (m) open = open === null ? m[1] : m[1] === open ? null : open;
}

// Split into title, intro and H2 sections.
let title = null, titleLine = -1;
const sections = [];
for (let i = 0; i < lines.length; i++) {
  if (inFence[i]) continue;
  const h1 = lines[i].match(/^# (.+)/);
  const h2 = lines[i].match(/^## (.+)/);
  if (h1 && title === null) { title = h1[1].trim(); titleLine = i; }
  else if (h1) fail(i, "only one `# ` title is allowed");
  else if (h2) {
    if (title === null) fail(i, "the `# ` title must come before any section");
    sections.push({ name: h2[1].trim(), start: i, end: lines.length });
  }
}
sections.forEach((s, i) => { if (sections[i + 1]) s.end = sections[i + 1].start; });
if (title === null) fail(0, "missing the `# <what the change does>` title");

const byName = {};
let lastIndex = -1;
for (const s of sections) {
  const idx = SECTIONS.indexOf(s.name);
  if (idx === -1) fail(s.start, `unknown section "## ${s.name}"; allowed: ${SECTIONS.join(", ")}`);
  else if (byName[s.name]) fail(s.start, `"## ${s.name}" appears twice`);
  else if (idx < lastIndex) fail(s.start, `"## ${s.name}" is out of order; sections follow the order in PLAN.md`);
  if (idx !== -1 && !byName[s.name]) { byName[s.name] = s; lastIndex = Math.max(lastIndex, idx); }
}
for (const name of REQUIRED) if (!byName[name]) fail(titleLine < 0 ? 0 : titleLine, `missing required section "## ${name}"`);

// Milestones: "### N. Goal" headings numbered from 1, each with steps that have a Check and a Proof line.
// Other H3 headings hold work that isn't code (a migration, a flag flip): steps with checks, no Proof.
const milestones = [];
if (byName.Milestones) {
  const s = byName.Milestones;
  const blocks = [];
  for (let i = s.start + 1; i < s.end; i++) {
    if (inFence[i]) continue;
    const h3 = lines[i].match(/^### (.+)/);
    if (h3) blocks.push({ heading: h3[1].trim(), start: i, end: s.end });
  }
  blocks.forEach((b, i) => { if (blocks[i + 1]) b.end = blocks[i + 1].start; });
  if (!blocks.length) fail(s.start, "Milestones has no `### 1. <goal>` milestone");

  for (const b of blocks) {
    const num = b.heading.match(/^(\d+)\.\s+(.+)/);
    if (num) {
      const n = Number(num[1]);
      if (n !== milestones.length + 1) fail(b.start, `milestone ${n} should be numbered ${milestones.length + 1}`);
      milestones.push({ n, goal: num[2], line: b.start });
    }
    const steps = [];
    for (let i = b.start + 1; i < b.end; i++) {
      if (inFence[i]) continue;
      if (/^\d+\.\s/.test(lines[i])) steps.push({ line: i, hasCheck: /\bCheck:/.test(lines[i]) });
      else if (steps.length && /^\s+Check:/.test(lines[i])) steps.at(-1).hasCheck = true;
    }
    if (!steps.length) fail(b.start, `"### ${b.heading}" has no numbered steps`);
    for (const st of steps) if (!st.hasCheck) fail(st.line, "step has no indented `Check:` line");
    if (num && !lines.slice(b.start, b.end).some((l, k) => !inFence[b.start + k] && /^Proof:/.test(l)))
      fail(b.start, `milestone ${num[1]} has no \`Proof:\` line`);
  }
}

// Progress: one "- [ ] Milestone N: goal" item per milestone.
const ticked = new Set();
if (byName.Progress) {
  const s = byName.Progress, seen = new Set();
  for (let i = s.start + 1; i < s.end; i++) {
    const m = lines[i].match(/^- \[([ xX])\] Milestone (\d+)(\b|:)/);
    if (!m || /released|production/i.test(lines[i])) continue;
    const n = Number(m[2]);
    if (!milestones.some(ms => ms.n === n)) fail(i, `Progress names milestone ${n}, which isn't under Milestones`);
    seen.add(n);
    if (m[1] !== " ") ticked.add(n);
  }
  for (const ms of milestones) if (!seen.has(ms.n)) fail(s.start, `Progress has no \`- [ ] Milestone ${ms.n}: ${ms.goal}\` item`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  console.error(`\n${errors.length} problem(s). Fix the plan to match PLAN.md, then run this again.`);
  process.exit(1);
}

// ---- Render ----

const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const inline = s => s.split(/(`[^`]*`)/).map(part =>
  part.startsWith("`") && part.endsWith("`") && part.length > 1
    ? `<code>${esc(part.slice(1, -1))}</code>`
    : esc(part)
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => `<a href="${u}">${t}</a>`)
).join("");

function md(block) {
  const out = [];
  let para = [], i = 0;
  const flush = () => { if (para.length) out.push(`<p>${inline(para.join(" "))}</p>`); para = []; };
  while (i < block.length) {
    const line = block[i];
    const fence = line.match(/^\s*(```|~~~)/);
    if (fence) {
      flush();
      const body = [];
      for (i++; i < block.length && !block[i].trim().startsWith(fence[1]); i++) body.push(block[i]);
      out.push(`<pre><code>${esc(body.join("\n"))}</code></pre>`);
      i++;
    } else if (/^#{3,6} /.test(line)) {
      flush();
      const lvl = line.match(/^#+/)[0].length;
      out.push(`<h${lvl}>${inline(line.slice(lvl + 1))}</h${lvl}>`);
      i++;
    } else if (/^\|/.test(line)) {
      flush();
      const rows = [];
      for (; i < block.length && /^\|/.test(block[i]); i++) rows.push(block[i]);
      const cells = r => r.replace(/^\||\|$/g, "").split("|").map(c => c.trim());
      const body = rows.filter((r, k) => k !== 1 || !/^[|:\-\s]+$/.test(r));
      out.push("<table>" + body.map((r, k) =>
        `<tr>${cells(r).map(c => k === 0 ? `<th>${inline(c)}</th>` : `<td>${inline(c)}</td>`).join("")}</tr>`
      ).join("") + "</table>");
    } else if (/^\s*([-*]|\d+\.)\s/.test(line)) {
      flush();
      const items = [];
      for (; i < block.length; i++) {
        const l = block[i];
        const m = l.match(/^(\s*)([-*]|\d+\.)\s+(.*)/);
        if (m) items.push({ indent: m[1].length, ordered: /\d/.test(m[2]), text: m[3], more: [] });
        else if (/^\s+\S/.test(l) && items.length) items.at(-1).more.push(l.trim());
        else if (l.trim() === "" && /^\s+\S|^\s*([-*]|\d+\.)\s/.test(block[i + 1] || "")) continue;
        else break;
      }
      out.push(list(items));
    } else if (line.trim() === "") { flush(); i++; }
    else { para.push(line.trim()); i++; }
  }
  flush();
  return out.join("\n");
}

function list(items) {
  let html = "";
  const stack = [];
  for (const it of items) {
    while (stack.length && it.indent < stack.at(-1).indent) html += `</li></${stack.pop().tag}>`;
    if (!stack.length || it.indent > stack.at(-1).indent) {
      const tag = it.ordered ? "ol" : "ul";
      stack.push({ indent: it.indent, tag });
      html += `<${tag}>`;
    } else html += "</li>";
    const task = it.text.match(/^\[([ xX])\]\s+(.*)/);
    const text = task
      ? `<input type="checkbox" disabled${task[1] !== " " ? " checked" : ""}> ${inline(task[2])}`
      : inline(it.text);
    const more = it.more.map(m => /^(Check|Proof):/.test(m)
      ? `<div class="check">${inline(m)}</div>` : `<div>${inline(m)}</div>`).join("");
    html += `<li${task ? ' class="task"' : ""}>${text}${more}`;
  }
  while (stack.length) html += `</li></${stack.pop().tag}>`;
  return html;
}

const intro = lines.slice(titleLine + 1, sections[0]?.start ?? lines.length);
const preface = lines.slice(0, titleLine).filter(l => l.trim());
const draft = intro.some(l => /^Draft:/.test(l.trim()));
const done = milestones.filter(m => ticked.has(m.n)).length;
const pct = milestones.length ? Math.round((done / milestones.length) * 100) : 0;

const sectionHtml = sections.map(s => {
  let body = lines.slice(s.start + 1, s.end);
  if (s.name === "Milestones") {
    // Tag each numbered milestone heading with its state from Progress.
    body = body.map(l => {
      const m = l.match(/^### (\d+)\.\s/);
      return m ? `${l} ${ticked.has(Number(m[1])) ? "✓" : ""}`.trimEnd() : l;
    });
  }
  const html = md(body).replace(/<p>(Proof:.*?)<\/p>/g, '<p class="check">$1</p>');
  return `<section id="${esc(s.name.toLowerCase().replace(/\W+/g, "-"))}"><h2>${esc(s.name)}</h2>\n${html}</section>`;
}).join("\n");

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<style>
:root { --bg: #fff; --fg: #1d1d1f; --muted: #6e6e73; --line: #e5e5ea; --soft: #f5f5f7; --accent: #2f6f4f; --warn: #a15c00; }
@media (prefers-color-scheme: dark) { :root { --bg: #161618; --fg: #ececf0; --muted: #9a9aa2; --line: #2c2c31; --soft: #1f1f23; --accent: #6fbf8f; --warn: #e0a24a; } }
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--fg); font: 16px/1.6 system-ui, -apple-system, sans-serif; }
main { max-width: 760px; margin: 0 auto; padding: 48px 16px 96px; }
h1 { font-size: 1.8rem; line-height: 1.25; margin: 0 0 12px; }
h2 { font-size: 1.15rem; margin: 48px 0 12px; padding-bottom: 6px; border-bottom: 1px solid var(--line); }
h3 { font-size: 1.05rem; margin: 32px 0 8px; }
.meta { color: var(--muted); font-size: .9rem; }
.draft { display: inline-block; color: var(--warn); border: 1px solid currentColor; border-radius: 4px; padding: 0 6px; font-size: .8rem; margin-bottom: 8px; }
.bar { height: 6px; background: var(--soft); border-radius: 3px; overflow: hidden; margin: 16px 0 4px; }
.bar > div { height: 100%; background: var(--accent); }
code { font: .88em ui-monospace, SFMono-Regular, Menlo, monospace; background: var(--soft); padding: 1px 4px; border-radius: 3px; }
pre { background: var(--soft); padding: 12px 14px; border-radius: 6px; overflow-x: auto; }
pre code { background: none; padding: 0; }
table { border-collapse: collapse; width: 100%; font-size: .93rem; display: block; overflow-x: auto; }
th, td { text-align: left; vertical-align: top; padding: 6px 10px; border-bottom: 1px solid var(--line); }
li { margin: 4px 0; }
li.task { list-style: none; margin-left: -1.3em; }
.check { color: var(--muted); font-size: .93rem; }
a { color: var(--accent); }
</style>
</head>
<body>
<main>
${preface.length ? `<p class="meta">${inline(preface.join(" "))}</p>` : ""}
${draft ? '<span class="draft">Draft</span>' : ""}
<h1>${inline(title)}</h1>
<div class="bar" role="img" aria-label="${done} of ${milestones.length} milestones done"><div style="width:${pct}%"></div></div>
<p class="meta">${done} of ${milestones.length} milestone${milestones.length === 1 ? "" : "s"} done</p>
${md(intro)}
${sectionHtml}
</main>
</body>
</html>
`;

const outPath = path.replace(/\.md$/, ".html");
writeFileSync(outPath, page);
console.log(`Valid. Wrote ${outPath}`);
