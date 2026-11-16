import { randomUUID } from 'crypto'
import path from 'path'
import fs from 'fs'
import os from 'os'

const CACHE = path.join(os.tmpdir(), 'Darkness_xo_font_v1.json')
const FONT_CHARS =
  Array.from({ length: 0x5f }, (_, i) => String.fromCharCode(0x20 + i)).join('') +
  Array.from({ length: 0x100 }, (_, i) => String.fromCharCode(0x600 + i)).join('') +
  '—'

const fetchBuf = async (url, headers) =>
  Buffer.from(await (await fetch(url, { headers })).arrayBuffer())

const loadFont = async () => {
  try {
    const c = JSON.parse(fs.readFileSync(CACHE, 'utf8'))
    if (c && c.FONT) return c.FONT
  } catch {}
  const cssUrl =
    'https://fonts.googleapis.com/css2?family=Cairo:wght@600..900&text=' +
    encodeURIComponent(FONT_CHARS)
  const css = await (await fetch(cssUrl, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
    }
  })).text()
  const match = css.match(/url\((https:[^)]+)\)/)
  if (!match) return ''
  const buf = await fetchBuf(match[1])
  const FONT = `data:font/woff2;base64,${buf.toString('base64')}`
  try { fs.writeFileSync(CACHE, JSON.stringify({ FONT })) } catch {}
  return FONT
}

let FONT_P = null
const getFont = () => (FONT_P ??= loadFont().catch(() => ''))
getFont()

const buildHtml = async () => {
  const FONT = await getFont()

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<title>إكس أو</title>
<style>
:root{color-scheme:dark}
@font-face{font-family:"CairoG";src:url("${FONT}") format("woff2");font-weight:600 900;font-style:normal}
*{margin:0;padding:0;box-sizing:border-box;user-select:none;-webkit-tap-highlight-color:transparent}
html,body{width:100%;min-height:100%;min-height:100vh;background-color:#120B1A!important;color:#F8FAFC;font-family:"CairoG","Cairo","Tajawal",sans-serif;overflow-x:hidden}
body{display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:10px 10px 14px;background-image:radial-gradient(circle at 50% 0%,#2A183D 0%,#140B1D 62%,#0C0612 100%)}
button{font-family:inherit;color:inherit;border:none;background:none}
.wrap{width:100%;max-width:440px;display:flex;flex-direction:column;gap:10px;align-items:center}
.top-bar{width:100%;display:flex;align-items:center;justify-content:space-between;padding:9px 12px;border-radius:16px;border:2px solid #4C2E6E;background-color:#1D112B;box-shadow:0 8px 20px rgba(0,0,0,.5)}
.brand{display:flex;align-items:center;gap:9px}
.logo{width:36px;height:36px;border-radius:11px;background-color:#2D1A45;border:1.5px solid #7C4DFF;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 10px rgba(124,77,255,.25)}
.brand h1{font-size:17px;font-weight:900;color:#F8FAFC;line-height:1.1}
.actions{display:flex;align-items:center;gap:6px}
.icon-btn{height:34px;padding:0 10px;border-radius:10px;border:1.5px solid #4C2E6E;background-color:#2A183E;color:#F8FAFC;font-size:12px;font-weight:800;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:5px;transition:background-color .15s,transform .1s}
.icon-btn:active{transform:translateY(1px)}
.icon-btn svg{width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.controls-row{width:100%;display:grid;grid-template-columns:1.15fr 1fr;gap:8px}
.seg-box{background-color:#160D21;border:1.5px solid #3D2459;border-radius:13px;padding:3px;display:grid;grid-template-columns:1fr 1fr;gap:3px}
.seg-box.three{grid-template-columns:1fr 1fr 1fr}
.seg-btn{padding:6px 4px;border-radius:9px;font-size:11.5px;font-weight:800;color:#B79CED;cursor:pointer;transition:background-color .15s,color .15s;text-align:center}
.seg-btn.on{background-color:#F59E0B;color:#1A0E05;font-weight:900;box-shadow:0 2px 8px rgba(245,158,11,.35)}
.seg-box.three .seg-btn.on{background-color:#7C3AED;color:#FFF;box-shadow:0 2px 8px rgba(124,58,237,.4)}
.score-strip{width:100%;display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items: stretch}
.p-card{position:relative;border-radius:16px;border:2px solid #3D2459;background-color:#1D112B;padding:8px 11px;display:flex;align-items:center;justify-content:space-between;box-shadow:0 5px 14px rgba(0,0,0,.4);transition:border-color .2s,background-color .2s}
.p-card.act-x{border-color:#F59E0B;background-color:#2D1C14;box-shadow:0 0 14px rgba(245,158,11,.25)}
.p-card.act-o{border-color:#06B6D4;background-color:#122634;box-shadow:0 0 14px rgba(6,182,212,.25)}
.p-left{display:flex;align-items:center;gap:8px}
.p-badge{width:30px;height:30px;border-radius:9px;display:flex;align-items:center;justify-content:center}
.p-badge.bx{background-color:rgba(245,158,11,.15);border:1.5px solid rgba(245,158,11,.45)}
.p-badge.bo{background-color:rgba(6,182,212,.15);border:1.5px solid rgba(6,182,212,.45)}
.p-name{font-size:13px;font-weight:900;color:#F8FAFC;line-height:1.1}
.p-sub{font-size:10px;font-weight:700;color:#A78BFA}
.p-score{font-size:20px;font-weight:900;direction:ltr}
.draw-box{border-radius:14px;border:1.5px solid #3D2459;background-color:#160D21;padding:6px 12px;display:flex;flex-direction:column;align-items:center;justify-content:center;min-width:62px}
.draw-lbl{font-size:10px;font-weight:800;color:#94A3B8}
.draw-val{font-size:16px;font-weight:900;color:#E2E8F0}
.board-outer{position:relative;width:100%;padding:12px;border-radius:26px;background-color:#261638;background-image:linear-gradient(145deg,#351F4D 0%,#211230 55%,#150B20 100%);border:2.5px solid #5B3782;box-shadow:0 18px 38px rgba(0,0,0,.7),0 6px 0 #12081C,inset 0 2px 2px rgba(255,255,255,.12)}
.stud{position:absolute;width:9px;height:9px;border-radius:50%;background-color:#F59E0B;background-image:radial-gradient(circle at 30% 30%,#FDE68A,#D97706 75%,#451A03);border:1px solid #1E0D2E;z-index:5}
.stud.tl{top:7px;left:7px}.stud.tr{top:7px;right:7px}.stud.bl{bottom:7px;left:7px}.stud.br{bottom:7px;right:7px}
.board-inner{position:relative;width:100%;height:0;padding-bottom:100%;direction:ltr;border-radius:18px;background-color:#140B1E;border:2.5px solid #0E0716;box-shadow:inset 0 5px 14px rgba(0,0,0,.75);overflow:hidden}
.grid-abs{position:absolute;top:0;left:0;right:0;bottom:0;width:100%;height:100%;display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(3,1fr);gap:10px;padding:10px}
.cell{position:relative;border-radius:16px;background-color:#221433;border:2px solid #3D2459;box-shadow:0 5px 0 #11081B,inset 0 2px 1px rgba(255,255,255,.08);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform .12s,background-color .15s,border-color .15s}
.cell:hover:not(:disabled){background-color:#2A193F;border-color:#5B3782}
.cell:active:not(:disabled){transform:translateY(3px);box-shadow:0 2px 0 #11081B}
.cell:disabled{cursor:default}
.cell.win-x{background-color:#3B2310!important;border-color:#F59E0B!important;box-shadow:0 0 18px rgba(245,158,11,.45),inset 0 0 12px rgba(245,158,11,.25)!important}
.cell.win-o{background-color:#0F2938!important;border-color:#06B6D4!important;box-shadow:0 0 18px rgba(6,182,212,.45),inset 0 0 12px rgba(6,182,212,.25)!important}
.cell.fading svg{opacity:.38;transform:scale(.84);transition:opacity .25s,transform .25s}
.cell.fading::after{content:"تتلاشى";position:absolute;bottom:4px;right:6px;font-size:8.5px;font-weight:900;color:#F43F5E;background-color:rgba(15,7,24,.85);padding:1px 5px;border-radius:5px;border:1px solid rgba(244,63,94,.4)}
.mark-svg{width:64%;height:64%;overflow:visible;display:block}
@keyframes popIn{0%{transform:scale(.35);opacity:0}70%{transform:scale(1.08);opacity:1}100%{transform:scale(1);opacity:1}}
.mark-anim{animation:popIn .2s cubic-bezier(.34,1.56,.64,1) forwards}
.win-svg{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:20}
.win-line{stroke-linecap:round;stroke-dasharray:1000;stroke-dashoffset:1000;transition:stroke-dashoffset .38s ease-out}
.win-line.show{stroke-dashoffset:0}
.status-dock{width:100%;border-radius:16px;border:2px solid #4C2E6E;background-color:#1D112B;padding:10px 14px;display:flex;align-items:center;justify-content:space-between;gap:10px;box-shadow:0 6px 18px rgba(0,0,0,.45)}
.st-msg{font-size:13px;font-weight:800;color:#FDE68A;display:flex;align-items:center;gap:8px}
.st-dot{width:9px;height:9px;border-radius:50%;background-color:#F59E0B;flex-shrink:0}
.next-btn{padding:8px 16px;border-radius:11px;background-color:#F58800;background-image:linear-gradient(180deg,#FFB02E 0%,#F58800 100%);box-shadow:0 4px 0 #B85B00;color:#1A0E05;font-size:12.5px;font-weight:900;cursor:pointer;transition:transform .1s}
.next-btn:active{transform:translateY(2px);box-shadow:0 2px 0 #B85B00}
.modal{position:fixed;top:0;left:0;right:0;bottom:0;background-color:rgba(10,5,16,.82);z-index:99;display:none;align-items:center;justify-content:center;padding:16px}
.modal.open{display:flex}
.m-card{width:100%;max-width:330px;border-radius:24px;border:2.5px solid #5B3782;background-color:#1D112B;padding:22px 18px;text-align:center;box-shadow:0 20px 50px rgba(0,0,0,.85);animation:popIn .2s cubic-bezier(.34,1.56,.64,1) forwards}
.m-icon{width:58px;height:58px;border-radius:16px;margin:0 auto 10px;display:flex;align-items:center;justify-content:center;background-color:#2A183E;border:2px solid #5B3782}
.m-card h2{font-size:21px;font-weight:900;color:#F8FAFC;margin-bottom:5px}
.m-card p{font-size:12.5px;font-weight:700;color:#B79CED;margin-bottom:16px}
.m-btn{width:100%;padding:11px 16px;border-radius:13px;background-color:#F58800;background-image:linear-gradient(180deg,#FFB02E 0%,#F58800 100%);box-shadow:0 4px 0 #B85B00;color:#1A0E05;font-size:14px;font-weight:900;cursor:pointer;transition:transform .1s}
.m-btn:active{transform:translateY(2px);box-shadow:0 2px 0 #B85B00}
footer{margin-top:2px;text-align:center;font-size:12px;font-weight:900;color:#A78BFA;letter-spacing:.5px}
</style>
</head>
<body>
<div class="wrap">
<header class="top-bar">
<div class="brand">
<div class="logo">
<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round">
<path d="M4 4l6 6m0-6l-6 6" stroke="#F59E0B" stroke-width="2.8"/>
<circle cx="17" cy="17" r="3.5" stroke="#06B6D4" stroke-width="2.6"/>
</svg>
</div>
<h1>إكس أو</h1>
</div>
<div class="actions">
<button type="button" id="btnMute" class="icon-btn" title="الصوت">
<svg id="icoVol" viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
</button>
<button type="button" id="btnReset" class="icon-btn" title="تصفير النتيجة">
<svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
<span>جديد</span>
</button>
</div>
</header>
<section class="controls-row">
<div class="seg-box" id="modeBox">
<button type="button" data-mode="classic" class="seg-btn on">كلاسيكي</button>
<button type="button" data-mode="infinite" class="seg-btn">تلاشي (٣ قطع)</button>
</div>
<div class="seg-box three" id="diffBox">
<button type="button" data-diff="easy" class="seg-btn">سهل</button>
<button type="button" data-diff="med" class="seg-btn">متوسط</button>
<button type="button" data-diff="hard" class="seg-btn on">محترف</button>
</div>
</section>
<section class="score-strip">
<div id="cardX" class="p-card act-x">
<div class="p-left">
<div class="p-badge bx">
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="3.2" stroke-linecap="round"><path d="M5 5l14 14M19 5L5 19"/></svg>
</div>
<div>
<div class="p-name">أنت</div>
<div class="p-sub">اللاعب X</div>
</div>
</div>
<span id="scoreX" class="p-score" style="color:#FBBF24">0</span>
</div>
<div class="draw-box">
<span class="draw-lbl">تعادل</span>
<span id="scoreD" class="draw-val">0</span>
</div>
<div id="cardO" class="p-card">
<div class="p-left">
<div class="p-badge bo">
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" stroke-width="3.2"><circle cx="12" cy="12" r="7"/></svg>
</div>
<div>
<div class="p-name">الخصم</div>
<div class="p-sub">اللاعب O</div>
</div>
</div>
<span id="scoreO" class="p-score" style="color:#22D3EE">0</span>
</div>
</section>
<section class="board-outer">
<div class="stud tl"></div><div class="stud tr"></div><div class="stud bl"></div><div class="stud br"></div>
<div class="board-inner">
<div id="gridBox" class="grid-abs"></div>
<svg viewBox="0 0 300 300" class="win-svg">
<line id="winLineBg" class="win-line" x1="0" y1="0" x2="0" y2="0" stroke="rgba(0,0,0,0.5)" stroke-width="16"/>
<line id="winLine" class="win-line" x1="0" y1="0" x2="0" y2="0" stroke="#FBBF24" stroke-width="10"/>
</svg>
</div>
</section>
<section class="status-dock">
<div class="st-msg">
<span id="stDot" class="st-dot"></span>
<span id="stText">دورك الآن — اختر مربعاً للبدء</span>
</div>
<button type="button" id="nextBtn" class="next-btn">جولة جديدة</button>
</section>
<footer>by : 𝐋𝐋𝐎𝐘𝐃</footer>
</div>
<div id="resModal" class="modal">
<div class="m-card" id="resCard">
<div id="resIcon" class="m-icon"></div>
<h2 id="resTitle">تعادل</h2>
<p id="resSub">انتهت الجولة بالتعادل — جولة جديدة</p>
<button type="button" id="resBtn" class="m-btn">جولة جديدة</button>
</div>
</div>
<script>
  (function(){ var WIN_LINES = [ { c:[0,1,2], x1:28, y1:52, x2:272, y2:52 }, { c:[3,4,5], x1:28, y1:150, x2:272, y2:150 },
  { c:[6,7,8], x1:28, y1:248, x2:272, y2:248 }, { c:[0,3,6], x1:52, y1:28, x2:52, y2:272 },
  { c:[1,4,7], x1:150, y1:28, x2:150, y2:272 }, { c:[2,5,8], x1:248, y1:28, x2:248, y2:272 },
  { c:[0,4,8], x1:32, y1:32, x2:268, y2:268 }, { c:[2,4,6], x1:268, y1:32, x2:32, y2:268 } ]; function svgX() {
  return '<svg class="mark-svg mark-anim" viewBox="0 0 64 64">' +
  '<path d="M14 18L50 54M50 18L14 54" stroke="rgba(0,0,0,0.45)" stroke-width="12" stroke-linecap="round"/>' +
  '<path d="M14 14L50 50M50 14L14 50" stroke="#F59E0B" stroke-width="11" stroke-linecap="round"/>' +
  '<path d="M16 14L48 46M48 14L16 46" stroke="#FEF08A" stroke-width="3.5" stroke-linecap="round" opacity="0.75"/>' + '</svg>';
  } function svgO() { return '<svg class="mark-svg mark-anim" viewBox="0 0 64 64">' +
  '<circle cx="32" cy="36" r="20" fill="none" stroke="rgba(0,0,0,0.45)" stroke-width="11"/>' +
  '<circle cx="32" cy="32" r="20" fill="none" stroke="#06B6D4" stroke-width="10.5"/>' +
  '<path d="M 20 19 A 18 18 0 0 1 45 19" fill="none" stroke="#CFFAFE" stroke-width="3.5" stroke-linecap="round" opacity="0.8"/>' +
  '</svg>'; } var aCtx = null, muted = false; function tone(f1, f2, d, tp) { if (muted) return; try {
  var C = window.AudioContext || window.webkitAudioContext; if (!aCtx && C) aCtx = new C(); if (!aCtx) return;
  if (aCtx.state === 'suspended') aCtx.resume(); var o = aCtx.createOscillator(), g = aCtx.createGain(); o.type = tp || 'sine';
  o.frequency.setValueAtTime(f1, aCtx.currentTime); if (f2) o.frequency.exponentialRampToValueAtTime(f2, aCtx.currentTime + d);
  g.gain.setValueAtTime(0.16, aCtx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, aCtx.currentTime + d);
  o.connect(g); g.connect(aCtx.destination); o.start(); o.stop(aCtx.currentTime + d + 0.01); } catch(e){} }
  var gridBox = document.getElementById('gridBox'); var cells = []; for (var i = 0; i < 9; i++) {
  var btn = document.createElement('button'); btn.type = 'button'; btn.className = 'cell'; btn.dataset.idx = i;
  gridBox.appendChild(btn); cells.push(btn); } var mode = 'classic'; // 'classic' | 'infinite'
  var diff = 'hard';    // 'easy' | 'med' | 'hard' var board = Array(9).fill(null); var qX = [], qO = []; var turn = 'X';
  var over = false; var busy = false; var scores = { X:0, O:0, D:0 }; var sid = 1;
  var cardX = document.getElementById('cardX'), cardO = document.getElementById('cardO');
  var scoreXEl = document.getElementById('scoreX'), scoreOEl = document.getElementById('scoreO'), scoreDEl = document.getElementById('scoreD');
  var stText = document.getElementById('stText'), stDot = document.getElementById('stDot');
  var winLine = document.getElementById('winLine'), winLineBg = document.getElementById('winLineBg'); function getWinner(b) {
  for (var i = 0; i < WIN_LINES.length; i++) { var w = WIN_LINES[i], a = w.c[0], m = w.c[1], z = w.c[2];
  if (b[a] && b[a] === b[m] && b[a] === b[z]) return { player: b[a], line: w }; } return null; }
  function updateFadingMarkers() { for (var i = 0; i < 9; i++) cells[i].classList.remove('fading');
  if (mode !== 'infinite' || over) return; if (turn === 'X' && qX.length === 3) cells[qX[0]].classList.add('fading');
  if (turn === 'O' && qO.length === 3) cells[qO[0]].classList.add('fading'); } function syncHud(msg, color) {
  cardX.className = 'p-card' + (!over && turn === 'X' ? ' act-x' : '');
  cardO.className = 'p-card' + (!over && turn === 'O' ? ' act-o' : ''); scoreXEl.textContent = scores.X;
  scoreOEl.textContent = scores.O; scoreDEl.textContent = scores.D; stText.textContent = msg;
  stDot.style.backgroundColor = color || (turn === 'X' ? '#F59E0B' : '#06B6D4'); updateFadingMarkers(); }
  function showWinBeam(line, winner) { var col = winner === 'X' ? '#FBBF24' : '#22D3EE';
  [winLineBg, winLine].forEach(function(el) { el.setAttribute('x1', line.x1); el.setAttribute('y1', line.y1);
  el.setAttribute('x2', line.x2); el.setAttribute('y2', line.y2); }); winLine.setAttribute('stroke', col);
  void winLine.offsetWidth; winLineBg.classList.add('show'); winLine.classList.add('show'); line.c.forEach(function(idx) {
  cells[idx].classList.add(winner === 'X' ? 'win-x' : 'win-o'); }); } function hideWinBeam() {
  winLineBg.classList.remove('show'); winLine.classList.remove('show'); for (var i = 0; i < 9; i++) {
  cells[i].classList.remove('win-x', 'win-o', 'fading'); } } function placeMark(idx, pl) { if (mode === 'infinite') {
  var q = pl === 'X' ? qX : qO; if (q.length === 3) { var oldIdx = q.shift(); board[oldIdx] = null;
  cells[oldIdx].innerHTML = ''; cells[oldIdx].disabled = false; cells[oldIdx].classList.remove('fading'); } q.push(idx); }
  board[idx] = pl; cells[idx].innerHTML = pl === 'X' ? svgX() : svgO(); cells[idx].disabled = true;
  tone(pl === 'X' ? 420 : 340, pl === 'X' ? 620 : 480, 0.08, 'triangle'); } function minimax(b, depth, isMax) {
  var res = getWinner(b); if (res) return res.player === 'O' ? 10 - depth : depth - 10; var avail = [];
  for (var i = 0; i < 9; i++) if (!b[i]) avail.push(i); if (avail.length === 0 || depth >= 6) return 0; if (isMax) {
  var best = -999; for (var j = 0; j < avail.length; j++) { b[avail[j]] = 'O'; var val = minimax(b, depth + 1, false);
  b[avail[j]] = null; if (val > best) best = val; } return best; } else { var bestMin = 999;
  for (var k = 0; k < avail.length; k++) { b[avail[k]] = 'X'; var valMin = minimax(b, depth + 1, true); b[avail[k]] = null;
  if (valMin < bestMin) bestMin = valMin; } return bestMin; } } function pickAiMove() { var avail = [];
  for (var i = 0; i < 9; i++) if (!board[i]) avail.push(i); if (avail.length === 0) return -1; var simBoard = board.slice();
  if (mode === 'infinite' && qO.length === 3) simBoard[qO[0]] = null; if (diff === 'easy' && Math.random() < 0.7) {
  return avail[Math.floor(Math.random() * avail.length)]; } if (diff === 'med' && Math.random() < 0.35) {
  return avail[Math.floor(Math.random() * avail.length)]; } for (var w = 0; w < avail.length; w++) { var m = avail[w];
  simBoard[m] = 'O'; if (getWinner(simBoard)) return m; simBoard[m] = null; } var simX = board.slice();
  if (mode === 'infinite' && qX.length === 3) simX[qX[0]] = null; for (var b = 0; b < avail.length; b++) { var mb = avail[b];
  simX[mb] = 'X'; if (getWinner(simX)) return mb; simX[mb] = null; } if (!board[4] && Math.random() < 0.85) return 4;
  var bestVal = -999, bestMove = avail[0]; for (var idx = 0; idx < avail.length; idx++) { var mv = avail[idx];
  simBoard[mv] = 'O'; var score = minimax(simBoard, 0, false); simBoard[mv] = null; if (score > bestVal) { bestVal = score;
  bestMove = mv; } } return bestMove; }
  var resModal = document.getElementById('resModal'), resCard = document.getElementById('resCard');
  var resIcon = document.getElementById('resIcon'), resTitle = document.getElementById('resTitle'), resSub = document.getElementById('resSub');
  var autoTimer = null;
  function openEndModal(type, mySid) {
    if (sid !== mySid) return;
    if (type === 'X') {
      resCard.style.borderColor = '#F59E0B';
      resIcon.style.borderColor = '#F59E0B';
      resIcon.innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="3.2" stroke-linecap="round"><path d="M5 5l14 14M19 5L5 19"/></svg>';
      resTitle.style.color = '#FBBF24';
      resTitle.textContent = 'مبروك الفوز!';
      resSub.textContent = 'حسمت الجولة لصالحك — جاري تجهيز الطاولة';
    } else if (type === 'O') {
      resCard.style.borderColor = '#06B6D4';
      resIcon.style.borderColor = '#06B6D4';
      resIcon.innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" stroke-width="3.2"><circle cx="12" cy="12" r="7"/></svg>';
      resTitle.style.color = '#22D3EE';
      resTitle.textContent = 'فاز الخصم!';
      resSub.textContent = 'انتهت الجولة لصالح الخصم — جاري تجهيز الطاولة';
    } else {
      resCard.style.borderColor = '#A78BFA';
      resIcon.style.borderColor = '#A78BFA';
      resIcon.innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" stroke-width="2.6" stroke-linecap="round"><path d="M5 9h14M5 15h14"/></svg>';
      resTitle.style.color = '#E2E8F0';
      resTitle.textContent = 'تعادل!';
      resSub.textContent = 'تعادل الطرفان في هذه الجولة — جاري تفريغ الطاولة';
    }
    resModal.classList.add('open');
    clearTimeout(autoTimer);
    autoTimer = setTimeout(function() {
      if (sid === mySid) startNewRound(false);
    }, 1500);
  }
  function checkEndState() { var mySid = sid; var win = getWinner(board); if (win) { over = true;
  busy = false; scores[win.player]++; showWinBeam(win.line, win.player); if (win.player === 'X') {
  tone(523, 1046, 0.38, 'triangle'); syncHud('مبروك! فزت بهذه الجولة', '#10B981'); } else { tone(360, 220, 0.35, 'sawtooth');
  syncHud('فاز الخصم بهذه الجولة', '#F43F5E'); } setTimeout(function(){ openEndModal(win.player, mySid); }, 480); return true; }
  var empty = board.filter(function(c){return !c;}).length;
  if (empty === 0) { over = true; busy = false; scores.D++; tone(320, 280, 0.25, 'sine');
  syncHud('تعادل في هذه الجولة', '#A78BFA'); setTimeout(function(){ openEndModal('D', mySid); }, 350); return true; } return false; }
  function handleCellTap(idx) {
  if (over || busy || turn !== 'X' || board[idx]) return; var mySid = sid; placeMark(idx, 'X'); if (checkEndState()) return;
  turn = 'O'; busy = true; syncHud('دور الخصم...', '#06B6D4'); setTimeout(function() { if (sid !== mySid || over) return;
  var aiIdx = pickAiMove(); if (aiIdx > -1) { placeMark(aiIdx, 'O'); if (checkEndState()) return; } turn = 'X'; busy = false;
  syncHud('دورك الآن — اختر مربعاً', '#F59E0B'); }, 340); } function startNewRound(resetScores) { sid++;
  clearTimeout(autoTimer); resModal.classList.remove('open');
  board = Array(9).fill(null); qX = []; qO = []; turn = 'X'; over = false; busy = false;
  if (resetScores) scores = { X:0, O:0, D:0 }; hideWinBeam(); for (var i = 0; i < 9; i++) { cells[i].innerHTML = '';
  cells[i].disabled = false; } syncHud( mode === 'infinite' ? 'طور التلاشي (٣ قطع) — دورك الآن'
  : 'دورك الآن — اختر مربعاً للبدء', '#F59E0B' ); } cells.forEach(function(btn) { btn.onclick = function() {
  handleCellTap(Number(this.dataset.idx)); }; });
  document.getElementById('nextBtn').onclick = function() { startNewRound(false); };
  document.getElementById('resBtn').onclick = function() { startNewRound(false); };
  document.getElementById('btnReset').onclick = function() { startNewRound(true); };
  document.querySelectorAll('#modeBox .seg-btn').forEach(function(b) { b.onclick = function() {
  document.querySelectorAll('#modeBox .seg-btn').forEach(function(el){el.classList.remove('on');}); this.classList.add('on');
  mode = this.dataset.mode; startNewRound(false); }; }); document.querySelectorAll('#diffBox .seg-btn').forEach(function(b) {
  b.onclick = function() { document.querySelectorAll('#diffBox .seg-btn').forEach(function(el){el.classList.remove('on');});
  this.classList.add('on'); diff = this.dataset.diff; startNewRound(false); }; });
  document.getElementById('btnMute').onclick = function() { muted = !muted; document.getElementById('icoVol').innerHTML = muted
  ? '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>'
  : '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>';
  }; startNewRound(false); })();
</script>
</body>
</html>`
}

const handler = async (m, { conn }) => {
  try {
    await conn.sendMessage(m.chat, {
      react: { text: '⚡', key: m.key }
    })

    const GAME_HTML = await buildHtml()

    const data = {
      response_id: randomUUID(),
      sections: [{
        __typename: 'GenAIUnifiedResponseSection',
        view_model: {
          __typename: 'GenAISingleLayoutViewModel',
          primitive: {
            __typename: 'GenAIBotProgressStatusPrimitive',
            title: 'إكس أو',
            is_in_progress: true
          }
        }
      }],
      embedded_screens: [{
        title: 'إكس أو',
        content: [{
          __typename: 'FOAIDNixelButtonSheets',
          tabs: [{
            id: 'tab_0',
            tab_header: 'إكس أو',
            sections: [{
              __typename: 'GenAIUnifiedResponseSection',
              view_model: {
                __typename: 'GenAISingleLayoutViewModel',
                primitive: {
                  __typename: 'GenAIaeacdsnwHtmlPrimitive',
                  payload: GAME_HTML,
                  url: 'https://example.com',
                  trusted_sources: ['example.com']
                }
              }
            }],
            step_entries: []
          }]
        }]
      }]
    }

    await conn.relayMessage(
      m.chat,
      {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2,
          botMetadata: {
            messageDisclaimerText: '',
            richResponseSourcesMetadata: {}
          }
        },
        botForwardedMessage: {
          message: {
            richResponseMessage: {
              messageType: 1,
              unifiedResponse: {
                data: Buffer.from(JSON.stringify(data)).toString('base64')
              },
              contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedAiBotMessageInfo: {
                  botJid: '0@bot'
                },
                forwardOrigin: 4
              }
            }
          }
        }
      },
      { messageId: conn.generateMessageTag() }
    )
  } catch (e) {
    console.error('[XO Game]', e?.stack || e)
    await m.reply('حصل خطأ اثناء تشغيل الامر')
  }
}

handler.category = 'games'
handler.usage = ['xo']
handler.command = ['xo', 'اكس_او', 'اكس', 'tictactoe']

export default handler