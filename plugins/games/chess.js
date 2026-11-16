import { randomUUID } from 'crypto'
import path from 'path'
import fs from 'fs'
import os from 'os'

const CACHE = path.join(os.tmpdir(), 'Darkness_chess_font_v1.json')
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
<title>الشطرنج</title>
<style>
:root{color-scheme:dark}
@font-face{font-family:"CairoG";src:url("${FONT}") format("woff2");font-weight:600 900;font-style:normal}
*{margin:0;padding:0;box-sizing:border-box;user-select:none;-webkit-tap-highlight-color:transparent}
html,body{width:100%;min-height:100%;min-height:100vh;background-color:#110A19!important;color:#F8FAFC;font-family:"CairoG","Cairo","Tajawal",sans-serif;overflow-x:hidden}
body{display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:8px 8px 12px;background-image:radial-gradient(circle at 50% 0%,#28173B 0%,#130A1C 65%,#0B0510 100%)}
button{font-family:inherit;color:inherit;border:none;background:none}
.wrap{width:100%;max-width:460px;display:flex;flex-direction:column;gap:8px;align-items:center}
.top-bar{width:100%;display:flex;align-items:center;justify-content:space-between;padding:8px 11px;border-radius:15px;border:2px solid #4A2D6B;background-color:#1B1029;box-shadow:0 6px 18px rgba(0,0,0,.5)}
.brand{display:flex;align-items:center;gap:8px}
.logo{width:34px;height:34px;border-radius:10px;background-color:#2C1944;border:1.5px solid #F59E0B;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 10px rgba(245,158,11,.2)}
.brand h1{font-size:16px;font-weight:900;color:#F8FAFC;line-height:1.1}
.actions{display:flex;align-items:center;gap:5px}
.icon-btn{height:32px;padding:0 9px;border-radius:9px;border:1.5px solid #4A2D6B;background-color:#28173C;color:#F8FAFC;font-size:11.5px;font-weight:800;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:4px;transition:background-color .15s,transform .1s}
.icon-btn:active:not(:disabled){transform:translateY(1px)}
.icon-btn:disabled{opacity:.45;cursor:default}
.icon-btn svg{width:15px;height:15px;stroke:currentColor;fill:none;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.diff-bar{width:100%;background-color:#150C20;border:1.5px solid #3B2356;border-radius:12px;padding:3px;display:grid;grid-template-columns:repeat(3,1fr);gap:4px}
.diff-btn{padding:5px 4px;border-radius:8px;font-size:11.5px;font-weight:800;color:#B79CED;cursor:pointer;text-align:center;transition:background-color .15s,color .15s}
.diff-btn.on{background-color:#F59E0B;color:#1A0E05;font-weight:900;box-shadow:0 2px 8px rgba(245,158,11,.35)}
.p-strip{width:100%;display:grid;grid-template-columns:1fr 1fr;gap:8px}
.p-card{border-radius:14px;border:2px solid #3B2356;background-color:#1B1029;padding:7px 10px;display:flex;flex-direction:column;gap:4px;box-shadow:0 4px 12px rgba(0,0,0,.4);transition:border-color .2s,background-color .2s}
.p-card.act-w{border-color:#F59E0B;background-color:#2B1B12;box-shadow:0 0 12px rgba(245,158,11,.25)}
.p-card.act-b{border-color:#06B6D4;background-color:#112432;box-shadow:0 0 12px rgba(6,182,212,.25)}
.p-head{display:flex;align-items:center;justify-content:space-between}
.p-id{display:flex;align-items:center;gap:6px}
.p-dot{width:8px;height:8px;border-radius:50%;background-color:#475569}
.p-card.act-w .p-dot{background-color:#F59E0B;box-shadow:0 0 8px #F59E0B}
.p-card.act-b .p-dot{background-color:#06B6D4;box-shadow:0 0 8px #06B6D4}
.p-name{font-size:12.5px;font-weight:900;color:#F8FAFC}
.p-adv{font-size:10.5px;font-weight:900;padding:1px 6px;border-radius:6px;background-color:rgba(255,255,255,.08);color:#FDE68A;direction:ltr}
.cap-tray{min-height:18px;display:flex;align-items:center;flex-wrap:wrap;gap:1px;direction:ltr}
.cap-tray svg{width:14px;height:14px;margin-right:-2px}
.board-outer{position:relative;width:100%;padding:14px;border-radius:22px;background-color:#4A2813;background-image:linear-gradient(145deg,#693A1D 0%,#472510 55%,#2D1608 100%);border:2.5px solid #8C5530;box-shadow:0 16px 36px rgba(0,0,0,.75),0 6px 0 #210F05,inset 0 2px 2px rgba(255,224,180,.28)}
.stud{position:absolute;width:8px;height:8px;border-radius:50%;background-color:#F59E0B;background-image:radial-gradient(circle at 30% 30%,#FDE68A,#D97706 75%,#451A03);border:1px solid #1E0D04;z-index:5}
.stud.tl{top:5px;left:5px}.stud.tr{top:5px;right:5px}.stud.bl{bottom:5px;left:5px}.stud.br{bottom:5px;right:5px}
.board-inner{position:relative;width:100%;height:0;padding-bottom:100%;direction:ltr;border-radius:12px;overflow:hidden;border:2.5px solid #1F0E05;background-color:#B58863;box-shadow:inset 0 4px 12px rgba(0,0,0,.6)}
.grid-8x8{position:absolute;top:0;left:0;right:0;bottom:0;width:100%;height:100%;display:grid;grid-template-columns:repeat(8,1fr);grid-template-rows:repeat(8,1fr)}
.sq{position:relative;width:100%;height:100%;display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0}
.sq.light{background-color:#F0D9B5}
.sq.dark{background-color:#B58863}
.sq.last-l{background-color:#CDD26A!important}
.sq.last-d{background-color:#AAA23A!important}
.sq.sel{background-color:#F59E0B!important;box-shadow:inset 0 0 0 2.5px #FFFBEB}
.sq.chk{background-color:#E11D48!important;background-image:radial-gradient(circle,#FB7185 10%,#BE123C 90%)!important}
.coord-r{position:absolute;top:2px;left:3px;font-size:8.5px;font-weight:900;line-height:1;pointer-events:none}
.coord-f{position:absolute;bottom:1px;right:3px;font-size:8.5px;font-weight:900;line-height:1;pointer-events:none}
.sq.light .coord-r,.sq.light .coord-f{color:#8C5E37}
.sq.dark .coord-r,.sq.dark .coord-f{color:#F0D9B5}
.piece-svg{width:84%;height:84%;display:block;pointer-events:none;transition:transform .12s}
.sq.sel .piece-svg{transform:scale(1.08) translateY(-2px)}
.mv-dot{position:absolute;width:28%;height:28%;border-radius:50%;background-color:rgba(20,83,45,.58);box-shadow:0 0 0 2px rgba(255,255,255,.35);pointer-events:none;z-index:4}
.mv-ring{position:absolute;width:86%;height:86%;border-radius:50%;border:3.5px solid rgba(225,29,72,.82);box-shadow:0 0 6px rgba(0,0,0,.35);pointer-events:none;z-index:4}
.status-dock{width:100%;border-radius:15px;border:2px solid #4A2D6B;background-color:#1B1029;padding:9px 12px;display:flex;align-items:center;justify-content:space-between;gap:8px;box-shadow:0 6px 16px rgba(0,0,0,.45)}
.st-msg{font-size:12.5px;font-weight:800;color:#FDE68A;display:flex;align-items:center;gap:7px}
.st-ind{width:9px;height:9px;border-radius:50%;background-color:#F59E0B;flex-shrink:0}
.new-btn{padding:7px 14px;border-radius:10px;background-color:#F58800;background-image:linear-gradient(180deg,#FFB02E 0%,#F58800 100%);box-shadow:0 3px 0 #B85B00;color:#1A0E05;font-size:12px;font-weight:900;cursor:pointer}
.new-btn:active{transform:translateY(2px);box-shadow:0 1px 0 #B85B00}
.modal{position:fixed;top:0;left:0;right:0;bottom:0;background-color:rgba(9,5,15,.84);z-index:99;display:none;align-items:center;justify-content:center;padding:16px}
.modal.open{display:flex}
.m-card{width:100%;max-width:340px;border-radius:22px;border:2.5px solid #5B3782;background-color:#1B1029;padding:20px 16px;text-align:center;box-shadow:0 20px 50px rgba(0,0,0,.88)}
.m-icon{width:56px;height:56px;border-radius:15px;margin:0 auto 10px;display:flex;align-items:center;justify-content:center;background-color:#28173C;border:2px solid #F59E0B}
.m-card h2{font-size:20px;font-weight:900;color:#F8FAFC;margin-bottom:5px}
.m-card p{font-size:12.5px;font-weight:700;color:#B79CED;margin-bottom:15px}
.m-btn{width:100%;padding:10px 16px;border-radius:12px;background-color:#F58800;background-image:linear-gradient(180deg,#FFB02E 0%,#F58800 100%);box-shadow:0 4px 0 #B85B00;color:#1A0E05;font-size:13.5px;font-weight:900;cursor:pointer}
.promo-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:10px}
.promo-btn{padding:8px;border-radius:12px;background-color:#28173C;border:2px solid #4A2D6B;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:4px;font-size:11px;font-weight:800;color:#F8FAFC}
.promo-btn:hover{border-color:#F59E0B;background-color:#351F4F}
.promo-btn svg{width:40px;height:40px}
footer{margin-top:2px;text-align:center;font-size:12px;font-weight:900;color:#A78BFA;letter-spacing:.5px}
</style>
</head>
<body>
<div class="wrap">
<header class="top-bar">
<div class="brand">
<div class="logo">
<svg width="20" height="20" viewBox="0 0 45 45"><path d="M22.5 9c-2.2 0-4 1.8-4 4 0 .9.3 1.7.8 2.4L16 29h13l-3.3-13.6c.5-.7.8-1.5.8-2.4 0-2.2-1.8-4-4-4zM12 33h21v4H12z" fill="#F59E0B"/></svg>
</div>
<h1>الشطرنج</h1>
</div>
<div class="actions">
<button type="button" id="btnUndo" class="icon-btn" title="تراجع عن النقلة" disabled>
<svg viewBox="0 0 24 24"><path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"/></svg>
<span>تراجع</span>
</button>
<button type="button" id="btnMute" class="icon-btn" title="الصوت">
<svg id="icoVol" viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
</button>
<button type="button" id="btnReset" class="icon-btn" title="جولة جديدة">
<svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
</button>
</div>
</header>
<section class="diff-bar" id="diffBox">
<button type="button" data-diff="1" class="diff-btn">سهل</button>
<button type="button" data-diff="2" class="diff-btn on">متوسط</button>
<button type="button" data-diff="3" class="diff-btn">محترف</button>
</section>
<section class="p-strip">
<div id="cardW" class="p-card act-w">
<div class="p-head">
<div class="p-id"><span class="p-dot"></span><span class="p-name">أنت (الأبيض)</span></div>
<span id="advW" class="p-adv" style="display:none">+0</span>
</div>
<div id="trayW" class="cap-tray"></div>
</div>
<div id="cardB" class="p-card">
<div class="p-head">
<div class="p-id"><span class="p-dot"></span><span class="p-name">الخصم (الأسود)</span></div>
<span id="advB" class="p-adv" style="display:none">+0</span>
</div>
<div id="trayB" class="cap-tray"></div>
</div>
</section>
<section class="board-outer">
<div class="stud tl"></div><div class="stud tr"></div><div class="stud bl"></div><div class="stud br"></div>
<div class="board-inner">
<div id="boardGrid" class="grid-8x8"></div>
</div>
</section>
<section class="status-dock">
<div class="st-msg">
<span id="stInd" class="st-ind"></span>
<span id="stTxt">دورك الآن — اختر قطعة للتحرك</span>
</div>
<button type="button" id="newBtn" class="new-btn">جولة جديدة</button>
</section>
<footer>by : 𝐋𝐋𝐎𝐘𝐃</footer>
</div>
<div id="promoModal" class="modal">
<div class="m-card">
<h2>ترقية البيدق</h2>
<p>اختر القطعة التي تريد ترقية البيدق إليها:</p>
<div class="promo-grid" id="promoGrid"></div>
</div>
</div>
<div id="endModal" class="modal">
<div class="m-card" id="endCard">
<div id="endIcon" class="m-icon"></div>
<h2 id="endTitle">كش مات — مبروك الفوز!</h2>
<p id="endSub">انتهت المباراة — جاري تجهيز الطاولة</p>
<button type="button" id="endBtn" class="m-btn">جولة جديدة</button>
</div>
</div>
<script>
  (function(){ function pieceSvg(code, cls) { if (!code) return ''; var isW = code[0] === 'w'; var t = code[1];
  var fill = isW ? '#FFFBEB' : '#1E293B'; var stroke = isW ? '#291709' : '#090D16'; var inner = isW ? '#D97706' : '#94A3B8';
  var rim = isW ? '' : '<circle cx="22.5" cy="22.5" r="20" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>';
  var body = ''; if (t === 'P') {
  body = '<path d="M 22.5,9 C 19.5,9 17,11.5 17,14.5 C 17,16.8 18.4,18.7 20.4,19.5 C 17.5,21.2 15.5,24.5 15.5,29 L 29.5,29 C 29.5,24.5 27.5,21.2 24.6,19.5 C 26.6,18.7 28,16.8 28,14.5 C 28,11.5 25.5,9 22.5,9 z M 11.5,33 L 33.5,33 L 35,37.5 L 10,37.5 L 11.5,33 z" fill="'+fill+'" stroke="'+stroke+'" stroke-width="2.4" stroke-linejoin="round"/>' +
  '<line x1="15" y1="31" x2="30" y2="31" stroke="'+inner+'" stroke-width="1.8" stroke-linecap="round"/>'; } else if (t === 'R') {
  body = '<path d="M 11,35 L 34,35 L 33,31 L 12,31 L 11,35 z M 14,31 L 15.5,17 L 29.5,17 L 31,31 L 14,31 z M 12,17 L 33,17 L 33,11 L 29,11 L 29,13.5 L 25.5,13.5 L 25.5,11 L 19.5,11 L 19.5,13.5 L 16,13.5 L 16,11 L 12,11 L 12,17 z M 9.5,35 L 35.5,35 L 35.5,38 L 9.5,38 L 9.5,35 z" fill="'+fill+'" stroke="'+stroke+'" stroke-width="2.3" stroke-linejoin="round"/>' +
  '<line x1="16" y1="20" x2="29" y2="20" stroke="'+inner+'" stroke-width="1.8" stroke-linecap="round"/>'; } else if (t === 'N') {
  body = '<path d="M 22,10 C 31.5,11 36.5,18 36,34 L 13,34 C 13,26 21,28.5 20,20 C 16.5,21 13.5,23 11,22 C 9.5,20.5 11.5,16 14,14 C 15,12 16,9.5 16,9.5 C 16,9.5 18.5,10.5 20,11.5 C 20.5,10 22,10 22,10 z M 10,34 L 35,34 L 36,38 L 9,38 L 10,34 z" fill="'+fill+'" stroke="'+stroke+'" stroke-width="2.3" stroke-linejoin="round"/>' +
  '<circle cx="16.5" cy="15.5" r="1.5" fill="'+inner+'"/>'; } else if (t === 'B') {
  body = '<path d="M 22.5,7.5 C 21,7.5 19.8,8.7 19.8,10.2 C 19.8,11.7 21,12.8 22.5,12.8 C 24,12.8 25.2,11.7 25.2,10.2 C 25.2,8.7 24,7.5 22.5,7.5 z M 15,31 C 13.5,23 16.5,14 22.5,13 C 28.5,14 31.5,23 30,31 L 15,31 z M 11,34 L 34,34 L 35.5,38 L 9.5,38 L 11,34 z" fill="'+fill+'" stroke="'+stroke+'" stroke-width="2.3" stroke-linejoin="round"/>' +
  '<path d="M 19.5,18.5 L 25.5,24.5 M 25.5,18.5 L 19.5,24.5" stroke="'+inner+'" stroke-width="2" stroke-linecap="round"/>';
  } else if (t === 'Q') {
  body = '<path d="M 9,15 L 14,31 L 31,31 L 36,15 L 28.5,23 L 22.5,13 L 16.5,23 L 9,15 z M 11,34 L 34,34 L 35.5,38 L 9.5,38 L 11,34 z" fill="'+fill+'" stroke="'+stroke+'" stroke-width="2.3" stroke-linejoin="round"/>' +
  '<circle cx="9" cy="13.5" r="2" fill="'+fill+'" stroke="'+stroke+'" stroke-width="1.8"/>' +
  '<circle cx="16.5" cy="11.5" r="2" fill="'+fill+'" stroke="'+stroke+'" stroke-width="1.8"/>' +
  '<circle cx="22.5" cy="10.5" r="2.2" fill="'+fill+'" stroke="'+stroke+'" stroke-width="1.8"/>' +
  '<circle cx="28.5" cy="11.5" r="2" fill="'+fill+'" stroke="'+stroke+'" stroke-width="1.8"/>' +
  '<circle cx="36" cy="13.5" r="2" fill="'+fill+'" stroke="'+stroke+'" stroke-width="1.8"/>' +
  '<line x1="15" y1="28.5" x2="30" y2="28.5" stroke="'+inner+'" stroke-width="1.8" stroke-linecap="round"/>';
  } else if (t === 'K') {
  body = '<path d="M 22.5,5.5 L 22.5,12 M 19.5,8.5 L 25.5,8.5" stroke="'+stroke+'" stroke-width="2.8" stroke-linecap="round"/>' +
  '<path d="M 14,31 C 11,22 14.5,14 22.5,13 C 30.5,14 34,22 31,31 L 14,31 z M 11,34 L 34,34 L 35.5,38 L 9.5,38 L 11,34 z" fill="'+fill+'" stroke="'+stroke+'" stroke-width="2.3" stroke-linejoin="round"/>' +
  '<path d="M 17.5,21 C 19.5,18.5 25.5,18.5 27.5,21" fill="none" stroke="'+inner+'" stroke-width="2" stroke-linecap="round"/>' +
  '<line x1="15" y1="28.5" x2="30" y2="28.5" stroke="'+inner+'" stroke-width="1.8" stroke-linecap="round"/>'; }
  return '<svg class="'+(cls||'piece-svg')+'" viewBox="0 0 45 45">' + rim + body + '</svg>'; } var aCtx = null, muted = false;
  function tone(f1, f2, d, tp) { if (muted) return; try { var C = window.AudioContext || window.webkitAudioContext;
  if (!aCtx && C) aCtx = new C(); if (!aCtx) return; if (aCtx.state === 'suspended') aCtx.resume();
  var o = aCtx.createOscillator(), g = aCtx.createGain(); o.type = tp || 'sine'; o.frequency.setValueAtTime(f1, aCtx.currentTime);
  if (f2) o.frequency.exponentialRampToValueAtTime(f2, aCtx.currentTime + d); g.gain.setValueAtTime(0.16, aCtx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, aCtx.currentTime + d); o.connect(g); g.connect(aCtx.destination);
  o.start(); o.stop(aCtx.currentTime + d + 0.01); } catch(e){} } var VALS = { P:100, N:320, B:330, R:500, Q:900, K:20000 };
  var PST_P = [ [0,  0,  0,  0,  0,  0,  0,  0], [50, 50, 50, 50, 50, 50, 50, 50], [12, 12, 22, 32, 32, 22, 12, 12],
  [6,  6, 12, 26, 26, 12,  6,  6], [0,  0,  4, 22, 22,  4,  0,  0], [4, -4, -8,  0,  0, -8, -4,  4],
  [6, 10, 10,-20,-20, 10, 10,  6], [0,  0,  0,  0,  0,  0,  0,  0] ]; var PST_N = [ [-40,-30,-20,-20,-20,-20,-30,-40],
  [-30,-10,  0,  4,  4,  0,-10,-30], [-20,  4, 12, 16, 16, 12,  4,-20], [-20,  6, 16, 22, 22, 16,  6,-20],
  [-20,  4, 16, 22, 22, 16,  4,-20], [-20,  6, 12, 16, 16, 12,  6,-20], [-30,-10,  0,  6,  6,  0,-10,-30],
  [-40,-30,-20,-20,-20,-20,-30,-40] ]; var PST_B = [ [-20,-10,-10,-10,-10,-10,-10,-20], [-10,  4,  0,  0,  0,  0,  4,-10],
  [-10,  8, 10, 12, 12, 10,  8,-10], [-10,  4, 12, 14, 14, 12,  4,-10], [-10,  6,  8, 14, 14,  8,  6,-10],
  [-10, 10, 10, 10, 10, 10, 10,-10], [-10,  8,  0,  0,  0,  0,  8,-10], [-20,-10,-10,-10,-10,-10,-10,-20] ];
  var boardGrid = document.getElementById('boardGrid'); var sqEls = []; var FILES = ['a','b','c','d','e','f','g','h'];
  for (var r = 0; r < 8; r++) { sqEls[r] = []; for (var c = 0; c < 8; c++) { var btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'sq ' + ((r + c) % 2 === 0 ? 'light' : 'dark'); btn.dataset.r = r; btn.dataset.c = c;
  boardGrid.appendChild(btn); sqEls[r][c] = btn; } } var state = null; var history = []; var selSq = null; var legalForSel = [];
  var diff = 2; var busy = false; var over = false; var sid = 1; var autoTimer = null;
  var pendingPromoMove = null; function initBoardState() { return { b: [ ['bR','bN','bB','bQ','bK','bB','bN','bR'],
  ['bP','bP','bP','bP','bP','bP','bP','bP'], [null,null,null,null,null,null,null,null], [null,null,null,null,null,null,null,null],
  [null,null,null,null,null,null,null,null], [null,null,null,null,null,null,null,null], ['wP','wP','wP','wP','wP','wP','wP','wP'],
  ['wR','wN','wB','wQ','wK','wB','wN','wR'] ], turn: 'w', castling: { wK:true, wQ:true, bK:true, bQ:true },
  ep: null, lastMove: null, capW: [], capB: [] }; } function cloneState(st) { return {
  b: st.b.map(function(row){ return row.slice(); }), turn: st.turn,
  castling: { wK:st.castling.wK, wQ:st.castling.wQ, bK:st.castling.bK, bQ:st.castling.bQ },
  ep: st.ep ? { r:st.ep.r, c:st.ep.c } : null,
  lastMove: st.lastMove ? { fr:st.lastMove.fr, fc:st.lastMove.fc, tr:st.lastMove.tr, tc:st.lastMove.tc } : null,
  capW: st.capW.slice(), capB: st.capB.slice() }; } function inBounds(r, c) { return r >= 0 && r < 8 && c >= 0 && c < 8; }
  function findKing(b, col) { var target = col + 'K'; for (var r = 0; r < 8; r++) { for (var c = 0; c < 8; c++) {
  if (b[r][c] === target) return { r:r, c:c }; } } return null; } function isSquareAttacked(b, r, c, byCol) {
  var pRow = byCol === 'w' ? r + 1 : r - 1; if (inBounds(pRow, c - 1) && b[pRow][c - 1] === byCol + 'P') return true;
  if (inBounds(pRow, c + 1) && b[pRow][c + 1] === byCol + 'P') return true;
  var kSteps = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]; for (var i = 0; i < 8; i++) {
  var nr = r + kSteps[i][0], nc = c + kSteps[i][1]; if (inBounds(nr, nc) && b[nr][nc] === byCol + 'N') return true; }
  for (var dr = -1; dr <= 1; dr++) { for (var dc = -1; dc <= 1; dc++) { if (dr === 0 && dc === 0) continue;
  var kr = r + dr, kc = c + dc; if (inBounds(kr, kc) && b[kr][kc] === byCol + 'K') return true; } }
  var ortho = [[-1,0],[1,0],[0,-1],[0,1]]; for (var d = 0; d < 4; d++) { var sr = r + ortho[d][0], sc = c + ortho[d][1];
  while (inBounds(sr, sc)) { var pc = b[sr][sc]; if (pc) { if (pc === byCol + 'R' || pc === byCol + 'Q') return true; break; }
  sr += ortho[d][0]; sc += ortho[d][1]; } } var diag = [[-1,-1],[-1,1],[1,-1],[1,1]]; for (var g = 0; g < 4; g++) {
  var br = r + diag[g][0], bc = c + diag[g][1]; while (inBounds(br, bc)) { var p2 = b[br][bc]; if (p2) {
  if (p2 === byCol + 'B' || p2 === byCol + 'Q') return true; break; } br += diag[g][0]; bc += diag[g][1]; } } return false; }
  function inCheck(b, col) { var kp = findKing(b, col); if (!kp) return false; var opp = col === 'w' ? 'b' : 'w';
  return isSquareAttacked(b, kp.r, kp.c, opp); } function applyMoveOnState(st, mv, promoPiece) { var ns = cloneState(st);
  var b = ns.b; var pc = b[mv.fr][mv.fc]; var col = pc[0], tp = pc[1]; var opp = col === 'w' ? 'b' : 'w';
  var target = b[mv.tr][mv.tc]; if (mv.epCapture) { var capR = mv.fr; var capC = mv.tc; var epCaptured = b[capR][capC];
  b[capR][capC] = null; if (col === 'w') ns.capW.push(epCaptured); else ns.capB.push(epCaptured); } else if (target) {
  if (col === 'w') ns.capW.push(target); else ns.capB.push(target); } b[mv.fr][mv.fc] = null; if (mv.promo) {
  b[mv.tr][mv.tc] = col + (promoPiece || mv.promo || 'Q'); } else { b[mv.tr][mv.tc] = pc; } if (mv.castle === 'K') {
  b[mv.tr][5] = b[mv.tr][7]; b[mv.tr][7] = null; } else if (mv.castle === 'Q') { b[mv.tr][3] = b[mv.tr][0]; b[mv.tr][0] = null; }
  if (pc === 'wK') { ns.castling.wK = false; ns.castling.wQ = false; }
  if (pc === 'bK') { ns.castling.bK = false; ns.castling.bQ = false; }
  if ((mv.fr === 7 && mv.fc === 0) || (mv.tr === 7 && mv.tc === 0)) ns.castling.wQ = false;
  if ((mv.fr === 7 && mv.fc === 7) || (mv.tr === 7 && mv.tc === 7)) ns.castling.wK = false;
  if ((mv.fr === 0 && mv.fc === 0) || (mv.tr === 0 && mv.tc === 0)) ns.castling.bQ = false;
  if ((mv.fr === 0 && mv.fc === 7) || (mv.tr === 0 && mv.tc === 7)) ns.castling.bK = false;
  if (tp === 'P' && Math.abs(mv.tr - mv.fr) === 2) { ns.ep = { r: (mv.fr + mv.tr) / 2, c: mv.fc }; } else { ns.ep = null; }
  ns.lastMove = { fr:mv.fr, fc:mv.fc, tr:mv.tr, tc:mv.tc }; ns.turn = opp; return ns; } function generateLegalMoves(st, forCol) {
  var col = forCol || st.turn; var opp = col === 'w' ? 'b' : 'w'; var b = st.b; var pseudo = []; for (var r = 0; r < 8; r++) {
  for (var c = 0; c < 8; c++) { var pc = b[r][c]; if (!pc || pc[0] !== col) continue; var tp = pc[1]; if (tp === 'P') {
  var dir = col === 'w' ? -1 : 1; var startRow = col === 'w' ? 6 : 1; var promoRow = col === 'w' ? 0 : 7; var nr = r + dir;
  if (inBounds(nr, c) && !b[nr][c]) { pseudo.push({ fr:r, fc:c, tr:nr, tc:c, promo: nr === promoRow ? 'Q' : null });
  var nr2 = r + dir * 2; if (r === startRow && !b[nr2][c]) { pseudo.push({ fr:r, fc:c, tr:nr2, tc:c }); } }
  for (var dc = -1; dc <= 1; dc += 2) { var nc = c + dc; if (!inBounds(nr, nc)) continue; var dest = b[nr][nc];
  if (dest && dest[0] === opp) { pseudo.push({ fr:r, fc:c, tr:nr, tc:nc, cap:true, promo: nr === promoRow ? 'Q' : null });
  } else if (st.ep && st.ep.r === nr && st.ep.c === nc) { pseudo.push({ fr:r, fc:c, tr:nr, tc:nc, cap:true, epCapture:true }); } }
  } else if (tp === 'N') { var ks = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]; for (var i = 0; i < 8; i++) {
  var kr = r + ks[i][0], kc = c + ks[i][1]; if (!inBounds(kr, kc)) continue; var kd = b[kr][kc];
  if (!kd || kd[0] === opp) pseudo.push({ fr:r, fc:c, tr:kr, tc:kc, cap:!!kd }); } } else if (tp === 'K') {
  for (var dr = -1; dr <= 1; dr++) { for (var dc2 = -1; dc2 <= 1; dc2++) { if (dr === 0 && dc2 === 0) continue;
  var tr = r + dr, tc = c + dc2; if (!inBounds(tr, tc)) continue; var td = b[tr][tc];
  if (!td || td[0] === opp) pseudo.push({ fr:r, fc:c, tr:tr, tc:tc, cap:!!td }); } } var homeR = col === 'w' ? 7 : 0;
  if (r === homeR && c === 4 && !inCheck(b, col)) { var canK = col === 'w' ? st.castling.wK : st.castling.bK;
  var canQ = col === 'w' ? st.castling.wQ : st.castling.bQ; if (canK && !b[homeR][5] && !b[homeR][6] && b[homeR][7] === col + 'R') {
  if (!isSquareAttacked(b, homeR, 5, opp) && !isSquareAttacked(b, homeR, 6, opp)) {
  pseudo.push({ fr:homeR, fc:4, tr:homeR, tc:6, castle:'K' }); } }
  if (canQ && !b[homeR][3] && !b[homeR][2] && !b[homeR][1] && b[homeR][0] === col + 'R') {
  if (!isSquareAttacked(b, homeR, 3, opp) && !isSquareAttacked(b, homeR, 2, opp)) {
  pseudo.push({ fr:homeR, fc:4, tr:homeR, tc:2, castle:'Q' }); } } } } else { var dirs = [];
  if (tp === 'R' || tp === 'Q') dirs.push([-1,0],[1,0],[0,-1],[0,1]);
  if (tp === 'B' || tp === 'Q') dirs.push([-1,-1],[-1,1],[1,-1],[1,1]); for (var d = 0; d < dirs.length; d++) {
  var sr = r + dirs[d][0], sc = c + dirs[d][1]; while (inBounds(sr, sc)) { var sd = b[sr][sc]; if (!sd) {
  pseudo.push({ fr:r, fc:c, tr:sr, tc:sc }); } else { if (sd[0] === opp) pseudo.push({ fr:r, fc:c, tr:sr, tc:sc, cap:true }); break;
  } sr += dirs[d][0]; sc += dirs[d][1]; } } } } } var legal = []; for (var m = 0; m < pseudo.length; m++) { var mv = pseudo[m];
  var nextSt = applyMoveOnState(st, mv, 'Q'); if (!inCheck(nextSt.b, col)) legal.push(mv); } return legal; }
  function evaluateBoard(st) { var b = st.b; var score = 0; for (var r = 0; r < 8; r++) { for (var c = 0; c < 8; c++) {
  var pc = b[r][c]; if (!pc) continue; var col = pc[0], tp = pc[1]; var v = VALS[tp] || 0; var pr = col === 'w' ? r : 7 - r;
  if (tp === 'P') v += PST_P[pr][c]; else if (tp === 'N') v += PST_N[pr][c]; else if (tp === 'B') v += PST_B[pr][c];
  else if (tp === 'Q' || tp === 'R') { if (r >= 2 && r <= 5 && c >= 2 && c <= 5) v += 10; } if (col === 'b') score += v;
  else score -= v; } } return score; } function searchAi(st, depth, alpha, beta, isMax) {
  var moves = generateLegalMoves(st, st.turn); if (moves.length === 0) { if (inCheck(st.b, st.turn)) {
  return isMax ? -18000 - depth * 20 : 18000 + depth * 20; } return 0; } if (depth === 0) return evaluateBoard(st);
  moves.sort(function(a, b) { var sa = (a.cap ? 10 : 0) + (a.promo ? 8 : 0); var sb = (b.cap ? 10 : 0) + (b.promo ? 8 : 0);
  return sb - sa; }); if (isMax) { var maxEval = -999999; for (var i = 0; i < moves.length; i++) {
  var child = applyMoveOnState(st, moves[i], 'Q'); var ev = searchAi(child, depth - 1, alpha, beta, false);
  if (ev > maxEval) maxEval = ev; if (ev > alpha) alpha = ev; if (beta <= alpha) break; } return maxEval; } else {
  var minEval = 999999; for (var j = 0; j < moves.length; j++) { var childMin = applyMoveOnState(st, moves[j], 'Q');
  var evMin = searchAi(childMin, depth - 1, alpha, beta, true); if (evMin < minEval) minEval = evMin;
  if (evMin < beta) beta = evMin; if (beta <= alpha) break; } return minEval; } } function chooseAiMove() {
  var moves = generateLegalMoves(state, 'b'); if (moves.length === 0) return null; if (diff === 1 && Math.random() < 0.55) {
  return moves[Math.floor(Math.random() * moves.length)]; } var searchDepth = diff === 1 ? 1 : diff === 2 ? 2 : 3;
  moves.sort(function(a, b) { var sa = (a.cap ? 12 : 0) + (a.promo ? 9 : 0) + (Math.random() * 2);
  var sb = (b.cap ? 12 : 0) + (b.promo ? 9 : 0) + (Math.random() * 2); return sb - sa; });
  var bestMove = moves[0], bestScore = -999999; for (var i = 0; i < moves.length; i++) {
  var nextSt = applyMoveOnState(state, moves[i], 'Q'); var sc = searchAi(nextSt, searchDepth - 1, -999999, 999999, false);
  if (sc > bestScore) { bestScore = sc; bestMove = moves[i]; } } return bestMove; } function renderBoard() { var b = state.b;
  var wKingChk = inCheck(b, 'w') ? findKing(b, 'w') : null; var bKingChk = inCheck(b, 'b') ? findKing(b, 'b') : null;
  for (var r = 0; r < 8; r++) { for (var c = 0; c < 8; c++) { var isLight = (r + c) % 2 === 0; var sq = sqEls[r][c];
  var cls = 'sq ' + (isLight ? 'light' : 'dark');
  if (state.lastMove && ((state.lastMove.fr === r && state.lastMove.fc === c) || (state.lastMove.tr === r && state.lastMove.tc === c))) {
  cls += isLight ? ' last-l' : ' last-d'; } if (selSq && selSq.r === r && selSq.c === c) { cls += ' sel'; }
  if ((wKingChk && wKingChk.r === r && wKingChk.c === c) || (bKingChk && bKingChk.r === r && bKingChk.c === c)) { cls += ' chk'; }
  sq.className = cls; var html = ''; if (c === 0) html += '<span class="coord-r">' + (8 - r) + '</span>';
  if (r === 7) html += '<span class="coord-f">' + FILES[c] + '</span>'; var pc = b[r][c]; if (pc) html += pieceSvg(pc);
  var mvMatch = legalForSel.find(function(m){ return m.tr === r && m.tc === c; }); if (mvMatch) {
  html += (pc || mvMatch.epCapture) ? '<span class="mv-ring"></span>' : '<span class="mv-dot"></span>'; } sq.innerHTML = html; } }
  document.getElementById('trayW').innerHTML = state.capW.map(function(p){ return pieceSvg(p, ''); }).join('');
  document.getElementById('trayB').innerHTML = state.capB.map(function(p){ return pieceSvg(p, ''); }).join('');
  var matW = 0, matB = 0; for (var r2 = 0; r2 < 8; r2++) { for (var c2 = 0; c2 < 8; c2++) { var p2 = b[r2][c2];
  if (!p2 || p2[1] === 'K') continue; if (p2[0] === 'w') matW += VALS[p2[1]]; else matB += VALS[p2[1]]; } }
  var diffMat = Math.round((matW - matB) / 100); var advW = document.getElementById('advW'), advB = document.getElementById('advB');
  if (diffMat > 0) { advW.style.display = 'inline-block'; advW.textContent = '+' + diffMat; advB.style.display = 'none';
  } else if (diffMat < 0) { advB.style.display = 'inline-block'; advB.textContent = '+' + Math.abs(diffMat);
  advW.style.display = 'none'; } else { advW.style.display = 'none'; advB.style.display = 'none'; }
  document.getElementById('cardW').className = 'p-card' + (!over && state.turn === 'w' ? ' act-w' : '');
  document.getElementById('cardB').className = 'p-card' + (!over && state.turn === 'b' ? ' act-b' : '');
  document.getElementById('btnUndo').disabled = busy || over || history.length === 0; } function showStatus(txt, col) {
  document.getElementById('stTxt').textContent = txt; document.getElementById('stInd').style.backgroundColor = col || '#F59E0B'; }
  function openEndPopup(type, title, sub, mySid) { if (sid !== mySid) return; var card = document.getElementById('endCard');
  var icon = document.getElementById('endIcon'); var h2 = document.getElementById('endTitle');
  var p = document.getElementById('endSub'); if (type === 'win') { card.style.borderColor = '#F59E0B';
  icon.style.borderColor = '#F59E0B'; icon.innerHTML = pieceSvg('wK'); h2.style.color = '#FBBF24'; } else if (type === 'loss') {
  card.style.borderColor = '#E11D48'; icon.style.borderColor = '#E11D48'; icon.innerHTML = pieceSvg('bK');
  h2.style.color = '#FB7185'; } else { card.style.borderColor = '#A78BFA'; icon.style.borderColor = '#A78BFA';
  icon.innerHTML = '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" stroke-width="2.6" stroke-linecap="round"><path d="M5 9h14M5 15h14"/></svg>';
  h2.style.color = '#E2E8F0'; } h2.textContent = title; p.textContent = sub;
  document.getElementById('endModal').classList.add('open'); clearTimeout(autoTimer); autoTimer = setTimeout(function() {
  if (sid === mySid) resetGame(); }, 2200); } function isInsufficientMaterial(b) { var minors = 0; for (var r = 0; r < 8; r++) {
  for (var c = 0; c < 8; c++) { var pc = b[r][c]; if (!pc || pc[1] === 'K') continue;
  if (pc[1] === 'P' || pc[1] === 'R' || pc[1] === 'Q') return false; minors++; } } return minors <= 1; } function checkGameEnd() {
  var mySid = sid; if (isInsufficientMaterial(state.b)) { over = true; busy = false; renderBoard();
  showStatus('تعادل — عدم كفاية القطع', '#A78BFA');
  setTimeout(function(){ openEndPopup('draw', 'تعادل!', 'عدم كفاية القطع للفوز — جاري تجهيز الطاولة', mySid); }, 450); return true;
  } var moves = generateLegalMoves(state, state.turn); if (moves.length === 0) { over = true; busy = false; renderBoard();
  if (inCheck(state.b, state.turn)) { if (state.turn === 'b') { tone(523, 1046, 0.45, 'triangle');
  showStatus('كش مات — مبروك الفوز!', '#10B981');
  setTimeout(function(){ openEndPopup('win', 'كش مات — مبروك الفوز!', 'حسمت المباراة لصالحك — جاري تفريغ الطاولة', mySid); }, 550);
  } else { tone(360, 180, 0.45, 'sawtooth'); showStatus('كش مات — فاز الخصم', '#E11D48');
  setTimeout(function(){ openEndPopup('loss', 'كش مات — فاز الخصم!', 'انتهت المباراة لصالح الخصم — جاري تفريغ الطاولة', mySid); }, 550);
  } } else { tone(320, 280, 0.3, 'sine'); showStatus('تعادل — طريق مسدود (Stalemate)', '#A78BFA');
  setTimeout(function(){ openEndPopup('draw', 'تعادل!', 'طريق مسدود (Stalemate) — جاري تفريغ الطاولة', mySid); }, 480); }
  return true; } return false; } function commitPlayerMove(mv, promoChoice) { var mySid = sid; history.push(cloneState(state));
  var hadCap = mv.cap || mv.epCapture; state = applyMoveOnState(state, mv, promoChoice || 'Q'); selSq = null; legalForSel = [];
  if (inCheck(state.b, 'b')) tone(580, 820, 0.14, 'sawtooth'); else if (hadCap) tone(280, 160, 0.1, 'triangle');
  else tone(380, 520, 0.08, 'sine'); renderBoard(); if (checkGameEnd()) return; busy = true;
  showStatus('الخصم يفكر في النقلة...', '#06B6D4'); setTimeout(function() { if (sid !== mySid || over) return;
  var aiMv = chooseAiMove(); if (aiMv) { var aiCap = aiMv.cap || aiMv.epCapture; state = applyMoveOnState(state, aiMv, 'Q');
  if (inCheck(state.b, 'w')) tone(540, 280, 0.18, 'sawtooth'); else if (aiCap) tone(260, 140, 0.1, 'triangle');
  else tone(320, 440, 0.08, 'sine'); } busy = false; renderBoard(); if (checkGameEnd()) return; if (inCheck(state.b, 'w')) {
  showStatus('كش ملك! احمِ ملكك الآن', '#E11D48'); } else { showStatus('دورك الآن — اختر قطعة للتحرك', '#F59E0B'); } }, 320); }
  function openPromotionChooser(mv) { pendingPromoMove = mv; var promoGrid = document.getElementById('promoGrid'); var opts = [
  { k:'Q', n:'وزير' }, { k:'R', n:'رخ' }, { k:'B', n:'فيل' }, { k:'N', n:'حصان' } ]; promoGrid.innerHTML = opts.map(function(o) {
  return '<button type="button" class="promo-btn" data-p="'+o.k+'">' + pieceSvg('w' + o.k) + '<span>' + o.n + '</span></button>';
  }).join(''); document.getElementById('promoModal').classList.add('open');
  promoGrid.querySelectorAll('.promo-btn').forEach(function(b) { b.onclick = function() { var choice = this.dataset.p;
  document.getElementById('promoModal').classList.remove('open'); var move = pendingPromoMove; pendingPromoMove = null;
  if (move) commitPlayerMove(move, choice); }; }); } function onSquareClick(r, c) { if (busy || over || state.turn !== 'w') return;
  var chosen = legalForSel.find(function(m){ return m.tr === r && m.tc === c; }); if (chosen) { if (chosen.promo) {
  openPromotionChooser(chosen); } else { commitPlayerMove(chosen, 'Q'); } return; } var pc = state.b[r][c];
  if (pc && pc[0] === 'w') { if (selSq && selSq.r === r && selSq.c === c) { selSq = null; legalForSel = []; } else {
  selSq = { r:r, c:c }; var allLegal = generateLegalMoves(state, 'w');
  legalForSel = allLegal.filter(function(m){ return m.fr === r && m.fc === c; }); tone(440, 520, 0.05, 'sine'); } renderBoard();
  return; } selSq = null; legalForSel = []; renderBoard(); } function resetGame() { sid++; clearTimeout(autoTimer);
  document.getElementById('endModal').classList.remove('open'); document.getElementById('promoModal').classList.remove('open');
  state = initBoardState(); history = []; selSq = null; legalForSel = []; busy = false; over = false; renderBoard();
  showStatus('دورك الآن — اختر قطعة للتحرك', '#F59E0B'); } for (var r3 = 0; r3 < 8; r3++) { for (var c3 = 0; c3 < 8; c3++) {
  sqEls[r3][c3].onclick = function() { onSquareClick(Number(this.dataset.r), Number(this.dataset.c)); }; } }
  document.getElementById('btnUndo').onclick = function() { if (busy || over || history.length === 0) return; state = history.pop();
  selSq = null; legalForSel = []; renderBoard(); showStatus('تم التراجع عن النقلة — دورك الآن', '#F59E0B'); };
  document.getElementById('btnReset').onclick = resetGame; document.getElementById('newBtn').onclick = resetGame;
  document.getElementById('endBtn').onclick = resetGame; document.querySelectorAll('#diffBox .diff-btn').forEach(function(b) {
  b.onclick = function() { document.querySelectorAll('#diffBox .diff-btn').forEach(function(el){ el.classList.remove('on'); });
  this.classList.add('on'); diff = Number(this.dataset.diff); resetGame(); }; });
  document.getElementById('btnMute').onclick = function() { muted = !muted; document.getElementById('icoVol').innerHTML = muted
  ? '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>'
  : '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>';
  }; resetGame(); })();
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
            title: 'الشطرنج',
            is_in_progress: true
          }
        }
      }],
      embedded_screens: [{
        title: 'الشطرنج',
        content: [{
          __typename: 'FOAIDNixelButtonSheets',
          tabs: [{
            id: 'tab_0',
            tab_header: 'الشطرنج',
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
    console.error('[Chess Game]', e?.stack || e)
    await m.reply('حصل خطأ اثناء تشغيل الامر')
  }
}

handler.category = 'games'
handler.usage = ['شطرنج']
handler.command = ['شطرنج', 'الشطرنج', 'chess']

export default handler