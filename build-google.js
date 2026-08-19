/*
 * final-v1/index.html → google/index.html
 *
 * 구글 제작 담당자 전달본을 생성합니다.
 * final-v1 을 고친 뒤 `node build-google.js` 로 다시 뽑으면 됩니다.
 *
 * 빼는 것: 히어로 / 요약 스트립 / 앵커 내비 / 01 전략 / 04 전체 원고 / 발표자 모드
 * 넣는 것: 표지 1장 / A4 인쇄 CSS
 * 바꾸는 것: 내부 리스크 검토 카드 → 제작 지시 카드
 */
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, 'final-v1', 'index.html');
const DST = path.join(__dirname, 'google', 'index.html');

let h = fs.readFileSync(SRC, 'utf8');
const log = [];

function cut(start, end, label) {
  const i = h.indexOf(start);
  const j = end ? h.indexOf(end, i) : h.length;
  if (i < 0 || j < 0) { log.push('  FAIL  ' + label); return; }
  h = h.slice(0, i) + h.slice(j);
  log.push('  제거  ' + label);
}

function swap(a, b, label) {
  if (!h.includes(a)) { log.push('  FAIL  ' + label); return; }
  h = h.replace(a, b);
  log.push('  교체  ' + label);
}

// ── 1. 내부용 요소 제거 ────────────────────────────────
cut('<div class="toolbar">', '</div>\r\n    </div>\r\n  </header>', '툴바');
cut('<div id="top" class="hero">', '<div class="summary-strip">', '히어로');
cut('<div class="summary-strip">', '<nav class="anchor-nav"', '요약 스트립');
cut('<nav class="anchor-nav"', '<main class="wrap">', '앵커 내비');
cut('<section id="strategy">', '<section id="slides">', '01 전략');
cut('<section id="script">', '<section id="checks">', '04 전체 원고');
cut('  <script>', '</script>\r\n</body>', '발표자 모드 JS');

// 툴바를 잘라내면 닫는 </div> 가 하나 남는다
swap('    <div class="wrap topbar-inner">\r\n      <a class="brand" href="#top"><span class="brand-dot" aria-hidden="true"></span>최종 통합본 · 8/19 개정</a>\r\n      </div>\r\n    </div>\r\n  </header>',
     '    <div class="wrap topbar-inner">\r\n      <span class="brand"><span class="brand-dot" aria-hidden="true"></span>PPT 제작 의뢰서 · 현대홈쇼핑</span>\r\n    </div>\r\n  </header>',
     '헤더 정리');

// ── 2. 메타 교체 ───────────────────────────────────────
h = h.replace(/<title>[^<]*<\/title>/, '<title>현대홈쇼핑 × 유튜브 쇼핑 — 구글 제작 전달본</title>');
h = h.replace(/<meta name="description"[^>]*>/, '<meta name="description" content="현대홈쇼핑 유튜브 쇼핑 제휴프로그램 발표 PPT 제작 의뢰서. 2026년 8월 28일 발표, 6장, 약 5분 55초.">');
h = h.replace(/<meta property="og:title"[^>]*>/, '<meta property="og:title" content="현대홈쇼핑 × 유튜브 쇼핑 — 구글 제작 전달본">');
h = h.replace(/<meta name="twitter:title"[^>]*>/, '<meta name="twitter:title" content="현대홈쇼핑 × 유튜브 쇼핑 — 구글 제작 전달본">');
h = h.replace('<span>현대홈쇼핑 × 유튜브 쇼핑 제휴프로그램 · 최종 통합본 (8/19 개정)</span>',
              '<span>현대홈쇼핑 × 유튜브 쇼핑 제휴프로그램 · 구글 제작 전달본</span>');

// ── 3. 내부 리스크 검토 카드 → 제작 지시 카드 ──────────
const cardStart = '<article class="check-card"><b>운영 킥 · 번호 공개</b>';
const ci = h.indexOf(cardStart);
if (ci >= 0) {
  const cj = h.indexOf('</article>', ci) + 10;
  h = h.slice(0, ci) +
    '<article class="check-card"><b>DIRECT LINE</b><h3>직통번호 슬라이드</h3><ul>' +
    '<li><strong>번호는 이 문서에 없습니다.</strong> 보안상 별도 전달드립니다.</li>' +
    '<li><strong>단독 슬라이드 한 장</strong>으로 빼주십시오. 검은 화면에 번호만.</li>' +
    '<li>로고·QR·설명 문구를 함께 얹지 마십시오. 효과가 사라집니다.</li>' +
    '<li>“제가 직접 받고, 직접 해결하겠습니다”에서 <strong>3초 정지</strong>합니다.</li>' +
    '<li>이 순간이 발표 전체의 절정입니다.</li>' +
    '</ul></article>' + h.slice(cj);
  log.push('  교체  내부 리스크 카드 → 제작 지시 카드');
} else {
  log.push('  FAIL  리스크 카드 미발견');
}

// ── 4. 표지 삽입 ───────────────────────────────────────
const cover = `  <div class="cover">
    <div class="wrap">
      <div class="cover-eyebrow">PPT PRODUCTION BRIEF</div>
      <h1>현대홈쇼핑 × 유튜브 쇼핑<br>발표 PPT 제작 의뢰서</h1>
      <p class="cover-lead">2026 유튜브 쇼핑 스타 행사에서 사용할 발표 자료입니다. 슬라이드별 화면 문구와 발화, 제작 시 유의사항을 정리했습니다.</p>
      <div class="cover-meta">
        <div><b>발표자</b><span>현대홈쇼핑 영업전략담당 이경우 상무</span></div>
        <div><b>발표일</b><span>2026년 8월 28일</span></div>
        <div><b>분량</b><span>6장 · 목표 5분 55초 / 최대 6분</span></div>
        <div><b>핵심 메시지</b><span>“여러분은 팬과 콘텐츠에 집중해 주세요. 그 뒤는 저희가 맡겠습니다.”</span></div>
      </div>
    </div>
  </div>
`;
swap('  <main class="wrap">', cover + '  <main class="wrap">', '표지 삽입');

// ── 5. 표지 + A4 인쇄 CSS ──────────────────────────────
const css = `
    .cover { padding: 44px 0 38px; color: #fff; background: var(--ink); }
    .cover-eyebrow { color: #ffaaa1; font-size: 12px; font-weight: 850; letter-spacing: .14em; }
    .cover h1 { margin: 16px 0 0; font-size: clamp(30px,4.6vw,52px); line-height: 1.12; letter-spacing: -.05em; font-weight: 880; }
    .cover-lead { max-width: 780px; margin: 18px 0 0; color: #c8c4bd; font-size: 16px; }
    .cover-meta { display: grid; grid-template-columns: repeat(2,1fr); gap: 12px 34px; margin-top: 28px; }
    .cover-meta > div { padding-top: 11px; border-top: 1px solid rgba(255,255,255,.16); }
    .cover-meta b { display: block; color: #aaa69f; font-size: 11px; font-weight: 800; letter-spacing: .1em; }
    .cover-meta span { display: block; margin-top: 4px; font-size: 15px; font-weight: 700; }
    @media (max-width: 650px) { .cover-meta { grid-template-columns: 1fr; } }

    @page { size: A4 portrait; margin: 13mm 11mm; }
    @media print {
      html, body { background: #fff !important; }
      .topbar { display: none !important; }
      .cover { padding: 0 0 22px; color: #161616; background: #fff; border-bottom: 3px solid var(--coral); break-after: page; }
      .cover h1 { font-size: 30px; }
      .cover-lead { color: #4a4640; font-size: 12px; }
      .cover-eyebrow { color: var(--coral-dark); }
      .cover-meta > div { border-top: 1px solid rgba(22,22,22,.2); }
      .cover-meta b { color: #6c6963; }
      .cover-meta span { font-size: 12px; }
      main { padding: 0 !important; }
      .wrap { width: 100% !important; }
      section { margin-top: 0 !important; padding-top: 16px; break-before: page; }
      section:first-of-type { break-before: auto; }
      .section-head { margin-bottom: 16px; padding-bottom: 12px; }
      h2 { font-size: 22px; }
      .section-intro { font-size: 11px; }
      .slide-card { margin-bottom: 12px; break-inside: avoid; box-shadow: none !important; border: 1px solid #c9c4ba; }
      .slide-top { padding: 12px 16px; }
      .slide-title { font-size: 15px; }
      .slide-index, .slide-time { font-size: 10px; }
      .screen-copy, .speech { padding: 16px; }
      .screen-copy h4 { font-size: 17px; }
      .speech p { font-size: 11.5px; line-height: 1.6; margin-top: 8px; }
      .screen-copy p, .visual-chip { font-size: 10.5px; }
      .director-note, .fact-note { padding: 10px 16px; font-size: 10.5px; }
      .director-note p { font-size: 10.5px; margin-top: 4px; }
      .brief-grid { grid-template-columns: 1fr; }
      .brief-index { display: none; }
      .brief-copy { padding: 0; border: 0; box-shadow: none; }
      .brief-copy h3 { font-size: 18px; }
      .brief-copy h4 { font-size: 13px; margin-top: 16px; }
      .brief-copy p { font-size: 11.5px; line-height: 1.65; }
      .brief-copy .emphasis { font-size: 12px; padding: 12px 14px; }
      .check-grid { grid-template-columns: repeat(2,1fr); gap: 10px; }
      .check-card { padding: 14px; break-inside: avoid; }
      .check-card h3 { font-size: 14px; }
      .check-card li { font-size: 10.5px; margin: 5px 0; }
      .sources { grid-template-columns: repeat(3,1fr); }
      .source-card { padding: 12px; }
      .source-card strong { font-size: 12px; }
      .source-card span { font-size: 10px; }
      footer { padding: 16px 0 0; break-before: avoid; }
    }
`;
swap('  </style>', css + '  </style>', '인쇄 CSS');

// ── 6. 검증 ────────────────────────────────────────────
fs.mkdirSync(path.dirname(DST), { recursive: true });
fs.writeFileSync(DST, h);

const c = s => h.split(s).length - 1;
const checks = [
  ['슬라이드 6장', c('class="slide-card"') === 6],
  ['전략 섹션 제거', !h.includes('id="strategy"')],
  ['전체 원고 제거', !h.includes('id="script"')],
  ['발표자 모드 제거', !h.includes('speakerMode')],
  ['내부 리스크 문구 제거', !h.includes('컴플라이언스')],
  ['전화번호 미포함', !/4629/.test(h)],
  ['div 균형', (c('<div ') + c('<div>')) === c('</div>')],
];

console.log(log.join('\n'));
console.log('\n생성: google/index.html (' + Math.round(h.length / 1024) + ' KB)\n');
let bad = 0;
checks.forEach(([n, v]) => { if (!v) bad++; console.log('  ' + (v ? 'OK  ' : 'FAIL') + ' ' + n); });
process.exit(bad ? 1 : 0);
