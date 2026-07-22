type ReportMeta = {
  title: string
  subtitle?: string
  analysisType: string
  generatedAt?: string
  name?: string
  birthDate?: string
  location?: string
  labels?: {
    name: string
    analysisType: string
    birthDate: string
    location: string
    generated: string
    footer: string
  }
}

const palette = {
  ink: '#172033',
  muted: '#5b6477',
  border: '#e8ddff',
  purple: '#6d28d9',
  purple2: '#9333ea',
  violetSoft: '#f5f0ff',
  pinkSoft: '#fff1f8',
  amberSoft: '#fff8e6',
  greenSoft: '#eefdf4',
  blueSoft: '#eff6ff',
}

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function cleanHeading(line: string): string {
  return line
    .replace(/^[#\s]+/, '')
    .replace(/^[🌟✨🎯💕🚀🏠⭐⏰🎨🔮📋🧠🌙💝🔄🛡️❤️🔥⚡🛤️💎]+\s*/, '')
    .trim()
}

function formatInline(line: string): string {
  const escaped = escapeHtml(line)
  return escaped
    .replace(/\*\*(.*?)\*\*/g, `<strong style="color:${palette.purple};font-weight:800;">$1</strong>`)
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
}

function sectionAccent(title: string): string {
  const t = title.toLowerCase()
  if (t.includes('warning') || t.includes('risk') || t.includes('trap') || t.includes('off your')) return palette.amberSoft
  if (t.includes('action') || t.includes('do this') || t.includes('aligned') || t.includes('recommend')) return palette.greenSoft
  if (t.includes('question') || t.includes('reflection')) return palette.blueSoft
  if (t.includes('love') || t.includes('relationship')) return palette.pinkSoft
  return palette.violetSoft
}

function isCalloutLine(line: string): boolean {
  return /^(warning sign|do this instead|decision rule|practical use|non-negotiable|stop doing|start doing|protect|practice weekly|track for 30 days|important|note):/i.test(
    line.replace(/\*\*/g, '').trim()
  )
}

function calloutColor(line: string): string {
  const l = line.toLowerCase()
  if (l.includes('warning') || l.includes('stop doing')) return palette.amberSoft
  if (l.includes('do this') || l.includes('start doing') || l.includes('protect') || l.includes('practice')) return palette.greenSoft
  return palette.blueSoft
}

function stripLeadingPreamble(content: string): string {
  const lines = String(content || '').replace(/\r\n/g, '\n').split('\n')
  const firstHeadingIndex = lines.findIndex((line) => /^#{1,3}\s+/.test(line.trim()))

  if (firstHeadingIndex <= 0) {
    return lines.join('\n')
  }

  const leadingText = lines.slice(0, firstHeadingIndex).join(' ').trim().toLowerCase()
  const looksConversational =
    /^(разбира се|нека|с удоволствие|добре|sure|of course|let'?s|absolutely)/i.test(leadingText) ||
    leadingText.includes('нека разгледаме') ||
    leadingText.includes('let us look') ||
    leadingText.includes('let’s look')

  return looksConversational ? lines.slice(firstHeadingIndex).join('\n') : lines.join('\n')
}

export function analysisContentToHtml(content: string): string {
  const lines = stripLeadingPreamble(content).replace(/\r\n/g, '\n').split('\n')
  let html = ''
  let listType: 'ul' | 'ol' | null = null

  const closeList = () => {
    if (listType) {
      html += `</${listType}>`
      listType = null
    }
  }

  for (const raw of lines) {
    const line = raw.trim()
    if (!line) {
      closeList()
      continue
    }

    if (/^#{1,3}\s/.test(line)) {
      closeList()
      const title = cleanHeading(line)
      const accent = sectionAccent(title)
      html += `
        <section style="margin:28px 0 18px;padding:22px 22px 18px;border:1px solid ${palette.border};border-left:6px solid ${palette.purple};border-radius:18px;background:linear-gradient(135deg,${accent},#ffffff);box-shadow:0 12px 30px rgba(69,39,160,.08);">
          <h2 style="margin:0 0 12px;color:${palette.ink};font-size:22px;line-height:1.25;font-weight:900;letter-spacing:-.02em;">
            ${formatInline(title)}
          </h2>
      `
      continue
    }

    const bullet = line.match(/^[-•]\s+(.*)$/)
    if (bullet) {
      if (listType !== 'ul') {
        closeList()
        html += `<ul style="margin:12px 0 16px;padding-left:0;list-style:none;">`
        listType = 'ul'
      }
      html += `<li style="margin:9px 0;padding-left:26px;position:relative;color:${palette.ink};line-height:1.65;"><span style="position:absolute;left:0;top:.1em;color:${palette.purple};font-weight:900;">✓</span>${formatInline(bullet[1])}</li>`
      continue
    }

    const numbered = line.match(/^(\d+)\.\s+(.*)$/)
    if (numbered) {
      if (listType !== 'ol') {
        closeList()
        html += `<ol style="margin:12px 0 16px;padding-left:24px;color:${palette.ink};">`
        listType = 'ol'
      }
      html += `<li style="margin:9px 0;padding-left:4px;line-height:1.65;">${formatInline(numbered[2])}</li>`
      continue
    }

    closeList()

    if (line.startsWith('>')) {
      html += `<blockquote style="margin:16px 0;padding:16px 18px;border-left:5px solid ${palette.purple2};border-radius:14px;background:${palette.violetSoft};color:${palette.ink};font-weight:600;">${formatInline(line.replace(/^>\s*/, ''))}</blockquote>`
      continue
    }

    if (isCalloutLine(line)) {
      html += `<div style="margin:14px 0;padding:14px 16px;border-radius:14px;border:1px solid ${palette.border};background:${calloutColor(line)};color:${palette.ink};line-height:1.6;">${formatInline(line)}</div>`
      continue
    }

    html += `<p style="margin:12px 0;color:${palette.ink};font-size:15.5px;line-height:1.78;">${formatInline(line)}</p>`
  }

  closeList()
  html = html.replace(/(<section[\s\S]*?)(?=<section|$)/g, (match) =>
    match.endsWith('</section>') ? match : `${match}</section>`
  )
  return html
}

export function buildAnalysisReportHtml(meta: ReportMeta, content: string): string {
  const generated = meta.generatedAt ? new Date(meta.generatedAt).toLocaleString() : new Date().toLocaleString()
  const birth = meta.birthDate ? new Date(meta.birthDate).toLocaleDateString() : ''
  const analysisType = escapeHtml(meta.analysisType)
  const labels = meta.labels || {
    name: 'Name',
    analysisType: 'Analysis',
    birthDate: 'Birth date',
    location: 'Location',
    generated: 'Generated',
    footer: 'Personalized astrological report',
  }

  return `
    <div style="font-family:Inter,Arial,sans-serif;color:${palette.ink};background:#ffffff;">
      <div style="position:relative;overflow:hidden;border-radius:28px;padding:28px 30px;margin-bottom:28px;background:linear-gradient(135deg,#160c33 0%,#48208f 48%,#a21caf 100%);color:white;box-shadow:0 24px 50px rgba(64,35,120,.28);">
        <div style="position:absolute;right:-34px;top:-36px;width:170px;height:170px;border-radius:999px;background:radial-gradient(circle,#fff 0%,#f5d0fe 18%,#a855f7 45%,rgba(168,85,247,0) 72%);opacity:.86;"></div>
        <div style="position:absolute;right:38px;bottom:24px;font-size:42px;opacity:.28;">☽ ✦ ✧</div>
        <div style="position:relative;z-index:1;">
          <div style="display:inline-block;margin-bottom:12px;padding:7px 12px;border-radius:999px;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.26);font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;">AstroHoroscope.online</div>
          <h1 style="margin:0 0 8px;font-size:31px;line-height:1.12;letter-spacing:-.03em;">${escapeHtml(meta.title)}</h1>
          ${meta.subtitle ? `<p style="margin:0 0 18px;color:rgba(255,255,255,.82);font-size:15px;">${escapeHtml(meta.subtitle)}</p>` : ''}
          <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;max-width:680px;">
            <div style="padding:10px 12px;border-radius:14px;background:rgba(255,255,255,.12);"><strong>${escapeHtml(labels.name)}:</strong> ${escapeHtml(meta.name || '')}</div>
            <div style="padding:10px 12px;border-radius:14px;background:rgba(255,255,255,.12);"><strong>${escapeHtml(labels.analysisType)}:</strong> ${analysisType}</div>
            <div style="padding:10px 12px;border-radius:14px;background:rgba(255,255,255,.12);"><strong>${escapeHtml(labels.birthDate)}:</strong> ${escapeHtml(birth)}</div>
            <div style="padding:10px 12px;border-radius:14px;background:rgba(255,255,255,.12);"><strong>${escapeHtml(labels.location)}:</strong> ${escapeHtml(meta.location || '')}</div>
          </div>
          <div style="margin-top:10px;color:rgba(255,255,255,.75);font-size:12px;">${escapeHtml(labels.generated)}: ${escapeHtml(generated)}</div>
        </div>
      </div>
      <div style="padding:2px 0 10px;">
        ${analysisContentToHtml(content)}
      </div>
      <div style="margin-top:30px;padding:18px;border-top:2px solid ${palette.border};text-align:center;color:${palette.muted};font-size:12px;">
        ${escapeHtml(labels.footer)} · AstroHoroscope.online
      </div>
    </div>
  `
}
