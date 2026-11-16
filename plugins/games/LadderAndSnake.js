import { randomUUID } from 'crypto'
import { execFile } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import os from 'os'
import path from 'path'

const run = promisify(execFile)

const RAW = 'https://raw.githubusercontent.com/MohamedVex/Lora-Upload1/main/uploads/'
const CACHE = path.join(os.tmpdir(), 'Darkness_snakes_ladders_v2.json')

const FONT_CHARS =
  Array.from({ length: 0x5f }, (_, i) => String.fromCharCode(0x20 + i)).join('') +
  Array.from({ length: 0x100 }, (_, i) => String.fromCharCode(0x600 + i)).join('') +
  '—'

const fetchBuf = async (url, headers) =>
  Buffer.from(await (await fetch(url, { headers })).arrayBuffer())

const toBase64 = async (url, mime) => {
  const buffer = await fetchBuf(url)
  return `data:${mime};base64,${buffer.toString('base64')}`
}

const compressImg = async (url, size) => {
  const id = Math.random().toString(36).slice(2)
  const inp = path.join(os.tmpdir(), `in_${id}`)
  const out = path.join(os.tmpdir(), `out_${id}.jpg`)
  fs.writeFileSync(inp, await fetchBuf(url))
  await run('ffmpeg', [
    '-y', '-i', inp,
    '-vf', `scale=${size}:${size}:force_original_aspect_ratio=increase,crop=${size}:${size}`,
    '-q:v', '6', out
  ])
  const b = fs.readFileSync(out)
  fs.unlinkSync(inp)
  fs.unlinkSync(out)
  return `data:image/jpeg;base64,${b.toString('base64')}`
}

const loadFont = async () => {
  const cssUrl =
    'https://fonts.googleapis.com/css2?family=Cairo:wght@400..900&text=' +
    encodeURIComponent(FONT_CHARS)
  const css = await (await fetch(cssUrl, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
    }
  })).text()
  const match = css.match(/url\((https:[^)]+)\)/)
  if (!match) throw new Error('font url not found')
  const buf = await fetchBuf(match[1])
  return `data:font/woff2;base64,${buf.toString('base64')}`
}

let MEDIA_P = null
const loadMedia = () =>
  (MEDIA_P ??= (async () => {
    try {
      const c = JSON.parse(fs.readFileSync(CACHE, 'utf8'))
      if (c && c.BG && c.FONT && c.HERO) return c
    } catch {}

    const [BG, HERO, FONT] = await Promise.all([
      toBase64(RAW + '1792349463387.jpg', 'image/jpeg'),
      compressImg(RAW + '1792348149958.jpg', 220),
      loadFont().catch((e) => { console.error('snakes font error:', e); return '' })
    ])

    const media = { BG, HERO, FONT }
    if (FONT) { try { fs.writeFileSync(CACHE, JSON.stringify(media)) } catch {} }
    return media
  })().catch((e) => { MEDIA_P = null; throw e }))

loadMedia().catch((e) => console.error('snakes media preload error:', e))

const buildHtml = async () => {
  const { BG, HERO, FONT } = await loadMedia()

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<title>Darkness Bot - السلم والثعبان 2D</title>
<style>
  :root {
    --darkness: 0.68;
    --border: #7c4dff;
    --border-soft: rgba(181, 132, 207, 0.45);
    --text: #FFF5EB;
    --bacCard: rgba(24, 15, 30, 0.84);
    --button: #593668;
    --accent: #f59e0b;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  @font-face {
    font-family: "DarknessCairo";
    src: url("${FONT}") format("woff2");
    font-weight: 400 900;
    font-style: normal;
  }

  body, button {
    font-family: "DarknessCairo", "Segoe UI", Tahoma, Arial, sans-serif;
    color: var(--text);
  }

  body {
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 8px 8px 14px;
    overflow-x: hidden;
    background: #120918;
  }

  .bg-layer {
    position: fixed;
    inset: 0;
    z-index: -1;
    background: #000;
  }
  .bg-layer img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .bg-layer::after {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, rgba(20,10,28,0.55) 0%, rgba(8,4,12,0.85) 100%);
  }

  .game-shell {
    width: 100%;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .top-bar {
    width: 100%;
    padding: 8px 12px;
    background: var(--bacCard);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1.5px solid var(--border-soft);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    box-shadow: 0 6px 20px rgba(0,0,0,0.45);
  }

  .brand-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .hero-mini {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #c084fc;
    box-shadow: 0 0 10px rgba(192,132,252,0.5);
  }

  .brand-title h1 {
    font-size: 15px;
    font-weight: 900;
    color: #fcd34d;
    line-height: 1.2;
  }
  .brand-title p {
    font-size: 10px;
    color: rgba(255,245,235,0.75);
    font-weight: 700;
  }

  .top-actions {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .mode-pill {
    display: flex;
    background: rgba(10, 6, 14, 0.75);
    border: 1px solid var(--border-soft);
    border-radius: 10px;
    padding: 2px;
  }

  .mode-btn {
    border: none;
    background: transparent;
    color: #d8b4fe;
    font-size: 11px;
    font-weight: 800;
    padding: 4px 8px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.15s;
  }
  .mode-btn.active {
    background: linear-gradient(135deg, #f59e0b, #ea580c);
    color: #fff;
    box-shadow: 0 2px 8px rgba(245,158,11,0.4);
  }

  .icon-btn {
    width: 32px;
    height: 32px;
    border-radius: 9px;
    border: 1px solid var(--border-soft);
    background: rgba(89, 54, 104, 0.55);
    color: #fff;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .players-strip {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .p-card {
    background: var(--bacCard);
    border: 1.5px solid rgba(181, 132, 207, 0.3);
    border-radius: 13px;
    padding: 6px 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all 0.2s;
  }

  .p-card.active-p1 {
    border-color: #f59e0b;
    background: rgba(65, 38, 15, 0.82);
    box-shadow: 0 0 14px rgba(245, 158, 11, 0.35);
  }

  .p-card.active-p2 {
    border-color: #a855f7;
    background: rgba(52, 24, 74, 0.85);
    box-shadow: 0 0 14px rgba(168, 85, 247, 0.38);
  }

  .p-info {
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .p-name {
    font-size: 12px;
    font-weight: 900;
    line-height: 1.1;
  }
  .p-sub {
    font-size: 10px;
    color: rgba(255,245,235,0.72);
    font-weight: 700;
  }

  .p-tile-badge {
    font-size: 12px;
    font-weight: 900;
    padding: 2px 8px;
    border-radius: 8px;
    background: rgba(0,0,0,0.45);
    border: 1px solid rgba(255,255,255,0.18);
  }

  .board-frame {
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1;
    padding: 9px;
    border-radius: 22px;
    background: linear-gradient(145deg, #6b3820 0%, #492311 55%, #2d1408 100%);
    box-shadow:
      0 14px 32px rgba(0,0,0,0.75),
      0 5px 0 #230f06,
      inset 0 2px 2px rgba(255,220,175,0.35);
  }

  .stud {
    position: absolute;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, #fde68a, #d97706 75%, #451a03);
    border: 1px solid #291004;
    z-index: 5;
  }
  .stud.tl { top: 6px; left: 6px; }
  .stud.tr { top: 6px; right: 6px; }
  .stud.bl { bottom: 6px; left: 6px; }
  .stud.br { bottom: 6px; right: 6px; }

  .board-inner {
    position: relative;
    width: 100%;
    height: 100%;
    direction: ltr;
    border-radius: 14px;
    overflow: hidden;
    border: 2.5px solid #231107;
    background: #FFF9EB;
    box-shadow: inset 0 4px 10px rgba(0,0,0,0.45);
  }

  .tiles-layer {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .tile {
    position: absolute;
    width: 10%;
    height: 10%;
    border: 0.5px solid rgba(146, 108, 70, 0.32);
    padding: 2px 3px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: background-color 0.15s;
  }

  .tile.highlight {
    background-color: #fde047 !important;
    box-shadow: inset 0 0 0 2.5px #d97706;
    z-index: 4;
  }

  .tile-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    width: 100%;
    line-height: 1;
  }

  .tile-num {
    font-size: 10px;
    font-weight: 900;
    color: #3e2723;
    text-shadow: none;
  }
  @media (min-width: 400px) {
    .tile-num { font-size: 11.5px; }
  }

  .tile-arrow {
    font-size: 8px;
    font-weight: 900;
    color: rgba(120, 83, 48, 0.55);
    text-shadow: none;
  }

  .tile-tag {
    align-self: flex-end;
    font-size: 7.5px;
    font-weight: 900;
    padding: 0.5px 3px;
    border-radius: 4px;
    color: #fff;
    line-height: 1.1;
    text-shadow: none;
  }
  .tag-ladder { background: #059669; }
  .tag-snake { background: #e11d48; }
  .tag-start { background: #16a34a; align-self: flex-start; }
  .tag-goal { background: #d97706; align-self: center; font-size: 8.5px; }

  .artwork-svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 10;
  }

  @keyframes tongueFlick {
    0%, 70%, 100% { transform: scaleY(0.85) rotate(0deg); }
    80% { transform: scaleY(1.25) rotate(5deg); }
    90% { transform: scaleY(1.15) rotate(-5deg); }
  }
  .snake-tongue {
    transform-origin: center top;
    animation: tongueFlick 2.4s ease-in-out infinite;
  }

  .pawn-wrap {
    position: absolute;
    z-index: 25;
    pointer-events: none;
    transform: translate(-50%, -50%);
    transition: left 195ms cubic-bezier(0.34, 1.56, 0.64, 1), top 195ms cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .pawn-wrap.sliding {
    transition: left 40ms linear, top 40ms linear;
  }

  @keyframes pawnHop {
    0% { transform: translateY(0) scale(1); }
    35% { transform: translateY(-18px) scale(0.93, 1.1); }
    70% { transform: translateY(-20px) scale(1.05, 0.95); }
    100% { transform: translateY(0) scale(1); }
  }
  .pawn-body.hopping {
    animation: pawnHop 0.21s ease-out;
  }

  @keyframes pawnFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-3.5px); }
  }
  .pawn-body.active-turn {
    animation: pawnFloat 2s ease-in-out infinite;
  }

  .pawn-label {
    position: absolute;
    top: -14px;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
    font-size: 8.5px;
    font-weight: 900;
    padding: 0.5px 5px;
    border-radius: 99px;
    color: #fff;
    border: 1px solid rgba(255,255,255,0.65);
    box-shadow: 0 2px 4px rgba(0,0,0,0.5);
    z-index: 2;
  }

  .pawn-ring {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    border: 2px solid #f59e0b;
    animation: pulseRing 1.4s ease-out infinite;
  }
  @keyframes pulseRing {
    0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.9; }
    100% { transform: translate(-50%, -50%) scale(1.35); opacity: 0; }
  }

  .board-toast {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 40;
    padding: 8px 14px;
    border-radius: 14px;
    border: 2px solid #fff;
    text-align: center;
    font-weight: 900;
    box-shadow: 0 12px 28px rgba(0,0,0,0.65);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s, transform 0.2s;
    direction: rtl;
    min-width: 200px;
  }
  .board-toast.show {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.03);
  }

  .dice-dock {
    width: 100%;
    background: var(--bacCard);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1.5px solid var(--border-soft);
    border-radius: 18px;
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.5);
  }

  .dice-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .die-btn {
    position: relative;
    width: 64px;
    height: 64px;
    flex-shrink: 0;
    border-radius: 16px;
    background: linear-gradient(145deg, #fffdf9 0%, #f3e1c0 100%);
    border: 3px solid #5a3119;
    box-shadow:
      0 5px 0 #8c583a,
      0 7px 0 #3e1f0d,
      0 10px 18px rgba(0,0,0,0.5),
      inset 0 2px 1px #fff;
    padding: 7px;
    cursor: pointer;
    transition: transform 0.12s;
  }
  .die-btn:active:not(:disabled) {
    transform: translateY(3px);
  }
  .die-btn.six-glow {
    border-color: #10b981;
    box-shadow: 0 0 16px rgba(16,185,129,0.7), 0 5px 0 #065f46;
  }

  @keyframes diceTumble {
    0% { transform: rotate(0deg) scale(1); }
    25% { transform: rotate(-16deg) scale(1.1) translateY(-5px); }
    50% { transform: rotate(16deg) scale(1.12) translateY(-7px); }
    75% { transform: rotate(-12deg) scale(1.06) translateY(-3px); }
    100% { transform: rotate(0deg) scale(1); }
  }
  .die-btn.rolling {
    animation: diceTumble 0.38s infinite;
  }

  .die-face {
    width: 100%;
    height: 100%;
    background: linear-gradient(180deg, #f7ebd5 0%, #fffbf2 100%);
    border-radius: 10px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    place-items: center;
    padding: 3px;
    box-shadow: inset 0 1.5px 3px rgba(90,49,25,0.2);
  }

  .pip {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, #573b2a, #1f120b 80%);
    box-shadow: inset 0 1px 2px rgba(0,0,0,0.6);
  }
  .pip.pip-one {
    width: 15px;
    height: 15px;
    background: radial-gradient(circle at 35% 35%, #fb7185, #e11d48 75%, #881337);
  }
  .pip.pip-six {
    background: radial-gradient(circle at 35% 35%, #34d399, #059669 75%, #064e3b);
  }

  .roll-cta-wrap {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .roll-main-btn {
    width: 100%;
    padding: 11px 14px;
    border-radius: 14px;
    border: none;
    background: linear-gradient(180deg, #ffb02e 0%, #f58800 100%);
    box-shadow: 0 5px 0 #b85b00, 0 8px 16px rgba(245,136,0,0.35);
    color: #fff;
    font-size: 15px;
    font-weight: 900;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    transition: all 0.12s;
  }
  .roll-main-btn:active:not(:disabled) {
    transform: translateY(3px);
    box-shadow: 0 2px 0 #b85b00;
  }
  .roll-main-btn:disabled {
    background: #52435c;
    box-shadow: 0 4px 0 #312638;
    color: #cbbad6;
    cursor: not-allowed;
  }

  .status-line {
    font-size: 11.5px;
    font-weight: 800;
    color: #fde68a;
    background: rgba(12, 7, 16, 0.65);
    border: 1px solid rgba(181, 132, 207, 0.28);
    border-radius: 9px;
    padding: 5px 9px;
    text-align: center;
    line-height: 1.35;
  }

  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.78);
    backdrop-filter: blur(5px);
    z-index: 100;
    display: none;
    align-items: center;
    justify-content: center;
    padding: 16px;
  }
  .modal-backdrop.open {
    display: flex;
  }
  .modal-card {
    width: 100%;
    max-width: 360px;
    background: #23142b;
    border: 2.5px solid #c084fc;
    border-radius: 24px;
    padding: 22px 18px;
    text-align: center;
    box-shadow: 0 20px 50px rgba(0,0,0,0.8);
  }
  .modal-card h2 {
    font-size: 21px;
    font-weight: 900;
    color: #fcd34d;
    margin: 8px 0 6px;
  }
  .modal-card p {
    font-size: 13px;
    color: #e9d5ff;
    margin-bottom: 16px;
    line-height: 1.5;
  }

  .site-footer {
    margin-top: 6px;
    text-align: center;
  }
  .site-footer strong {
    display: inline-block;
    padding: 4px 18px;
    font-size: 14px;
    font-weight: 900;
    letter-spacing: 1px;
    color: #d7b4eb;
    background: var(--bacCard);
    border: 1px solid var(--border-soft);
    border-radius: 9px;
  }
</style>
</head>
<body>
  <div class="bg-layer"><img src="${BG}" alt=""></div>

  <main class="game-shell">
    <header class="top-bar">
      <div class="brand-wrap">
        <img class="hero-mini" src="${HERO}" alt="Darkness Bot">
        <div class="brand-title">
          <h1>السلم والثعبان 2D</h1>
          <p>Darkness Bot • سباق المربع 100</p>
        </div>
      </div>

      <div class="top-actions">
        <div class="mode-pill">
          <button type="button" id="btnVsAi" class="mode-btn active">🤖 ضد الكمبيوتر</button>
          <button type="button" id="btnVs2P" class="mode-btn">👥 لاعبين</button>
        </div>
        <button type="button" id="btnSound" class="icon-btn" title="الصوت">🔊</button>
        <button type="button" id="btnReset" class="icon-btn" title="إعادة">🔄</button>
      </div>
    </header>

    <section class="players-strip">
      <div id="cardP1" class="p-card active-p1">
        <div class="p-info">
          <span style="font-size:20px">👑</span>
          <div>
            <div class="p-name">أنت <span id="turnBadge1">🎲</span></div>
            <div class="p-sub">التاج الذهبي</div>
          </div>
        </div>
        <span id="tileBadge1" class="p-tile-badge" style="color:#fcd34d">1 / 100</span>
      </div>

      <div id="cardP2" class="p-card">
        <div class="p-info">
          <span id="p2Emoji" style="font-size:20px">🤖</span>
          <div>
            <div class="p-name"><span id="p2NameText">الكمبيوتر</span> <span id="turnBadge2" style="display:none">🎲</span></div>
            <div id="p2SubText" class="p-sub">الروبوت الذكي</div>
          </div>
        </div>
        <span id="tileBadge2" class="p-tile-badge" style="color:#d8b4fe">1 / 100</span>
      </div>
    </section>

    <section class="board-frame">
      <div class="stud tl"></div>
      <div class="stud tr"></div>
      <div class="stud bl"></div>
      <div class="stud br"></div>

      <div class="board-inner" id="boardInner">
        <div class="tiles-layer" id="tilesLayer"></div>
        <svg viewBox="0 0 1000 1000" class="artwork-svg" id="artworkSvg" preserveAspectRatio="none"></svg>

        <div id="pawn2" class="pawn-wrap" style="left:6.5%; top:95.8%;">
          <div id="ring2" class="pawn-ring" style="display:none; border-color:#a855f7;"></div>
          <div id="body2" class="pawn-body">
            <span id="label2" class="pawn-label" style="background:#5b21b6;">الكمبيوتر (1)</span>
            <svg width="32" height="32" viewBox="0 0 64 64">
              <ellipse cx="32" cy="55" rx="20" ry="6" fill="#4c1d95" stroke="#1e1108" stroke-width="3.5"/>
              <circle cx="32" cy="30" r="20" fill="#8b5cf6" stroke="#f5f3ff" stroke-width="3"/>
              <rect x="20" y="21" width="24" height="13" rx="5" fill="#1e1b4b" stroke="#ede9fe" stroke-width="2"/>
              <circle cx="26.5" cy="27.5" r="3" fill="#38bdf8"/>
              <circle cx="37.5" cy="27.5" r="3" fill="#38bdf8"/>
            </svg>
          </div>
        </div>

        <div id="pawn1" class="pawn-wrap" style="left:3.5%; top:94.2%;">
          <div id="ring1" class="pawn-ring"></div>
          <div id="body1" class="pawn-body active-turn">
            <span id="label1" class="pawn-label" style="background:#b45309;">أنت (1)</span>
            <svg width="34" height="34" viewBox="0 0 64 64">
              <ellipse cx="32" cy="55" rx="20" ry="6" fill="#92400e" stroke="#1e1108" stroke-width="3.5"/>
              <circle cx="32" cy="30" r="20" fill="#f59e0b" stroke="#fffbeb" stroke-width="3"/>
              <path d="M 19 36 L 22 21 L 28 27 L 32 18 L 36 27 L 42 21 L 45 36 Z" fill="#fef08a" stroke="#451a03" stroke-width="2.4" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>

        <div id="boardToast" class="board-toast"></div>
      </div>
    </section>

    <section class="dice-dock">
      <div class="dice-row">
        <button type="button" id="dieBtn" class="die-btn" title="اضغط لرمي النرد">
          <div id="dieFace" class="die-face"></div>
        </button>

        <div class="roll-cta-wrap">
          <button type="button" id="rollMainBtn" class="roll-main-btn">
            <span>🎲</span>
            <span id="rollBtnText">ارمِ النرد الآن!</span>
          </button>
          <div id="statusLine" class="status-line">
            اضغط على النرد لبدء المغامرة نحو المربع 100! 🎲✨
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer class="site-footer"><strong>by : 𝐋𝐋𝐎𝐘𝐃</strong></footer>

  <div id="victoryModal" class="modal-backdrop">
    <div class="modal-card">
      <div id="winEmoji" style="font-size:48px">👑🎉</div>
      <h2 id="winTitle">مبروووك! أنت الفائز!</h2>
      <p id="winDesc">وصلت إلى المربع 100 وتفوقت على الكمبيوتر بجدارة!</p>
      <button type="button" id="btnPlayAgain" class="roll-main-btn">🔄 العب جولة جديدة</button>
    </div>
  </div>

<script>
(function() {
  var LADDERS = [
    { id: 'L1', name: 'سلم البداية', start: 4, end: 25, color: '#84cc16', dark: '#365314' },
    { id: 'L2', name: 'سلم النخيل', start: 13, end: 46, color: '#f59e0b', dark: '#451a03' },
    { id: 'L3', name: 'سلم الشجاعة', start: 33, end: 49, color: '#d97706', dark: '#3e1f0d' },
    { id: 'L4', name: 'سلم الغيوم', start: 42, end: 63, color: '#84cc16', dark: '#365314' },
    { id: 'L5', name: 'سلم القلعة', start: 50, end: 69, color: '#d97706', dark: '#3e1f0d' },
    { id: 'L6', name: 'سلم الأبطال', start: 62, end: 81, color: '#f59e0b', dark: '#451a03' },
    { id: 'L7', name: 'سلم التاج الملكي', start: 74, end: 92, color: '#f59e0b', dark: '#451a03' }
  ];

  var SNAKES = [
    { id: 'S1', name: 'أفعى الأعشاب', head: 27, tail: 5, c1: '#22c55e', c2: '#15803d', belly: '#bbf7d0', out: '#052e16', o1: 65, o2: -60 },
    { id: 'S2', name: 'كوبرا الرمال', head: 40, tail: 3, c1: '#f59e0b', c2: '#b45309', belly: '#fef3c7', out: '#451a03', o1: -75, o2: 75 },
    { id: 'S3', name: 'أفعى المرجان', head: 43, tail: 18, c1: '#f43f5e', c2: '#be123c', belly: '#ffe4e6', out: '#4c0519', o1: 70, o2: -65 },
    { id: 'S4', name: 'ثعبان المحيط', head: 54, tail: 31, c1: '#06b6d4', c2: '#0e7490', belly: '#cffafe', out: '#083344', o1: -65, o2: 65 },
    { id: 'S5', name: 'ثعبان النمر', head: 66, tail: 45, c1: '#fb923c', c2: '#c2410c', belly: '#ffedd5', out: '#431407', o1: 60, o2: -55 },
    { id: 'S6', name: 'أفعى الجمشت', head: 89, tail: 53, c1: '#a855f7', c2: '#6b21a8', belly: '#f3e8ff', out: '#3b0764', o1: -80, o2: 75 },
    { id: 'S7', name: 'أفعى الزمرد', head: 95, tail: 76, c1: '#10b981', c2: '#047857', belly: '#d1fae5', out: '#064e3b', o1: 62, o2: -62 },
    { id: 'S8', name: 'التنين الحارس', head: 99, tail: 64, c1: '#ec4899', c2: '#9d174d', belly: '#fce7f3', out: '#500724', o1: -95, o2: 90 }
  ];

  var PIP_MAP = {
    1: [4],
    2: [2, 6],
    3: [2, 4, 6],
    4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8],
    6: [0, 2, 3, 5, 6, 8]
  };

  function getTilePos(tile) {
    var t = Math.max(1, Math.min(100, tile));
    var idx = t - 1;
    var rowFromBottom = Math.floor(idx / 10);
    var rowFromTop = 9 - rowFromBottom;
    var colInRow = idx % 10;
    var col = rowFromBottom % 2 === 0 ? colInRow : 9 - colInRow;
    return {
      col: col,
      rowFromTop: rowFromTop,
      rowFromBottom: rowFromBottom,
      x: col * 100 + 50,
      y: rowFromTop * 100 + 50
    };
  }

  function getSnakeGeometry(s) {
    var start = getTilePos(s.head);
    var end = getTilePos(s.tail);
    var dx = end.x - start.x;
    var dy = end.y - start.y;
    var len = Math.hypot(dx, dy) || 1;
    var nx = -dy / len;
    var ny = dx / len;
    var mid = { x: start.x + dx * 0.5, y: start.y + dy * 0.5 };
    var cp1 = { x: start.x + dx * 0.22 + nx * s.o1, y: start.y + dy * 0.22 + ny * s.o1 };
    var cp2 = { x: start.x + dx * 0.35 + nx * (s.o1 * 0.6), y: start.y + dy * 0.35 + ny * (s.o1 * 0.6) };
    var cp3 = { x: start.x + dx * 0.68 + nx * s.o2, y: start.y + dy * 0.68 + ny * s.o2 };
    var cp4 = { x: start.x + dx * 0.85 + nx * (s.o2 * 0.5), y: start.y + dy * 0.85 + ny * (s.o2 * 0.5) };

    var path = 'M ' + start.x + ' ' + start.y + ' C ' + cp1.x + ' ' + cp1.y + ', ' + cp2.x + ' ' + cp2.y + ', ' + mid.x + ' ' + mid.y + ' C ' + cp3.x + ' ' + cp3.y + ', ' + cp4.x + ' ' + cp4.y + ', ' + end.x + ' ' + end.y;

    function cubic(p0, p1, p2, p3, t) {
      var u = 1 - t;
      return {
        x: u*u*u*p0.x + 3*u*u*t*p1.x + 3*u*t*t*p2.x + t*t*t*p3.x,
        y: u*u*u*p0.y + 3*u*u*t*p1.y + 3*u*t*t*p2.y + t*t*t*p3.y
      };
    }

    function pointAt(t) {
      var c = Math.max(0, Math.min(1, t));
      return c <= 0.5 ? cubic(start, cp1, cp2, mid, c * 2) : cubic(mid, cp3, cp4, end, (c - 0.5) * 2);
    }

    var neck = pointAt(0.08);
    var headAngle = (Math.atan2(neck.y - start.y, neck.x - start.x) * 180) / Math.PI - 90;
    return { start: start, end: end, path: path, pointAt: pointAt, headAngle: headAngle };
  }

  var audioCtx = null;
  var muted = false;
  function getAudio() {
    if (muted) return null;
    if (!audioCtx) {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) audioCtx = new Ctx();
    }
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume().catch(function(){});
    return audioCtx;
  }

  function playTone(freq, endFreq, dur, type) {
    var ctx = getAudio();
    if (!ctx) return;
    try {
      var osc = ctx.createOscillator();
      var g = ctx.createGain();
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + dur);
      g.gain.setValueAtTime(0.18, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + dur + 0.01);
    } catch (e) {}
  }

  var tilesLayer = document.getElementById('tilesLayer');
  var palette = ['#FFF9EB', '#F3E3C3', '#E4F0D0', '#FDE4CF'];
  var tileEls = {};

  for (var t = 1; t <= 100; t++) {
    var pos = getTilePos(t);
    var div = document.createElement('div');
    div.className = 'tile';
    div.style.left = (pos.col * 10) + '%';
    div.style.top = (pos.rowFromTop * 10) + '%';
    var cIdx = (pos.rowFromTop * 2 + (pos.col % 2)) % palette.length;
    div.style.backgroundColor = t === 100 ? '#FEF08A' : t === 1 ? '#DCFCE7' : palette[cIdx];

    var isCorner = t % 10 === 0 && t < 100;
    var arrow = t === 100 ? '' : isCorner ? '↑' : pos.rowFromBottom % 2 === 0 ? '→' : '←';

    var lad = LADDERS.find(function(l) { return l.start === t; });
    var snk = SNAKES.find(function(s) { return s.head === t; });

    var bottomTag = '';
    if (t === 1) bottomTag = '<span class="tile-tag tag-start">🚩1</span>';
    else if (t === 100) bottomTag = '<span class="tile-tag tag-goal">👑100</span>';
    else if (lad) bottomTag = '<span class="tile-tag tag-ladder">↑' + lad.end + '</span>';
    else if (snk) bottomTag = '<span class="tile-tag tag-snake">↓' + snk.tail + '</span>';

    div.innerHTML = '<div class="tile-top"><span class="tile-num">' + t + '</span><span class="tile-arrow">' + arrow + '</span></div>' + bottomTag;
    tilesLayer.appendChild(div);
    tileEls[t] = div;
  }

  var svg = document.getElementById('artworkSvg');
  var svgHtml = '';

  LADDERS.forEach(function(l) {
    var p1 = getTilePos(l.start);
    var p2 = getTilePos(l.end);
    var dx = p2.x - p1.x, dy = p2.y - p1.y;
    var len = Math.hypot(dx, dy) || 1;
    var nx = -dy / len, ny = dx / len;
    var w = 20;
    var l1x = p1.x + nx*w, l1y = p1.y + ny*w, l2x = p2.x + nx*w, l2y = p2.y + ny*w;
    var r1x = p1.x - nx*w, r1y = p1.y - ny*w, r2x = p2.x - nx*w, r2y = p2.y - ny*w;
    var steps = Math.max(3, Math.floor((len - 30) / 36));
    var rungs = '';
    for (var i = 1; i <= steps; i++) {
      var k = i / (steps + 1);
      var cx = p1.x + dx*k, cy = p1.y + dy*k;
      var ax = cx + nx*w, ay = cy + ny*w, bx = cx - nx*w, by = cy - ny*w;
      rungs += '<line x1="' + ax + '" y1="' + ay + '" x2="' + bx + '" y2="' + by + '" stroke="' + l.dark + '" stroke-width="10" stroke-linecap="round"/>';
      rungs += '<line x1="' + ax + '" y1="' + ay + '" x2="' + bx + '" y2="' + by + '" stroke="' + l.color + '" stroke-width="6" stroke-linecap="round"/>';
    }
    svgHtml += '<g opacity="0.96">' +
      rungs +
      '<line x1="' + l1x + '" y1="' + l1y + '" x2="' + l2x + '" y2="' + l2y + '" stroke="' + l.dark + '" stroke-width="13" stroke-linecap="round"/>' +
      '<line x1="' + l1x + '" y1="' + l1y + '" x2="' + l2x + '" y2="' + l2y + '" stroke="' + l.color + '" stroke-width="8" stroke-linecap="round"/>' +
      '<line x1="' + r1x + '" y1="' + r1y + '" x2="' + r2x + '" y2="' + r2y + '" stroke="' + l.dark + '" stroke-width="13" stroke-linecap="round"/>' +
      '<line x1="' + r1x + '" y1="' + r1y + '" x2="' + r2x + '" y2="' + r2y + '" stroke="' + l.color + '" stroke-width="8" stroke-linecap="round"/>' +
    '</g>';
  });

  SNAKES.forEach(function(s) {
    var g = getSnakeGeometry(s);
    var spots = '';
    for (var i = 0; i < 9; i++) {
      var pt = g.pointAt(0.14 + i * 0.08);
      spots += '<circle cx="' + pt.x + '" cy="' + pt.y + '" r="5" fill="' + s.belly + '" stroke="' + s.out + '" stroke-width="1.5"/>';
    }
    svgHtml += '<g>' +
      '<path d="' + g.path + '" fill="none" stroke="rgba(0,0,0,0.28)" stroke-width="28" stroke-linecap="round" transform="translate(5,8)"/>' +
      '<path d="' + g.path + '" fill="none" stroke="' + s.out + '" stroke-width="27" stroke-linecap="round"/>' +
      '<path d="' + g.path + '" fill="none" stroke="' + s.c1 + '" stroke-width="20" stroke-linecap="round"/>' +
      '<path d="' + g.path + '" fill="none" stroke="' + s.c2 + '" stroke-width="10" stroke-linecap="round" stroke-dasharray="8 14"/>' +
      spots +
      '<g transform="translate(' + g.start.x + ', ' + g.start.y + ') rotate(' + g.headAngle + ')">' +
        '<g class="snake-tongue" transform="translate(0, -18)">' +
          '<path d="M 0 4 L 0 -10 M 0 -6 L -5 -13 M 0 -6 L 5 -13" fill="none" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>' +
        '</g>' +
        '<path d="M -15 7 C -19 -5, -12 -19, 0 -19 C 12 -19, 19 -5, 15 7 C 11 15, -11 15, -15 7 Z" fill="' + s.c1 + '" stroke="' + s.out + '" stroke-width="3.2"/>' +
        '<circle cx="-7.5" cy="-4.5" r="5.5" fill="#fef08a" stroke="' + s.out + '" stroke-width="2"/>' +
        '<circle cx="-7.5" cy="-4.5" r="2.2" fill="#0f172a"/>' +
        '<circle cx="7.5" cy="-4.5" r="5.5" fill="#fef08a" stroke="' + s.out + '" stroke-width="2"/>' +
        '<circle cx="7.5" cy="-4.5" r="2.2" fill="#0f172a"/>' +
      '</g>' +
    '</g>';
  });

  svg.innerHTML = svgHtml;

  var isVsAi = true;
  var p1Tile = 1, p2Tile = 1;
  var turn = 1;
  var busy = false;
  var diceVal = 6;
  var sessionId = 1;

  var dieBtn = document.getElementById('dieBtn');
  var dieFace = document.getElementById('dieFace');
  var rollMainBtn = document.getElementById('rollMainBtn');
  var rollBtnText = document.getElementById('rollBtnText');
  var statusLine = document.getElementById('statusLine');
  var pawn1 = document.getElementById('pawn1');
  var pawn2 = document.getElementById('pawn2');
  var body1 = document.getElementById('body1');
  var body2 = document.getElementById('body2');
  var label1 = document.getElementById('label1');
  var label2 = document.getElementById('label2');
  var ring1 = document.getElementById('ring1');
  var ring2 = document.getElementById('ring2');
  var tileBadge1 = document.getElementById('tileBadge1');
  var tileBadge2 = document.getElementById('tileBadge2');
  var cardP1 = document.getElementById('cardP1');
  var cardP2 = document.getElementById('cardP2');
  var turnBadge1 = document.getElementById('turnBadge1');
  var turnBadge2 = document.getElementById('turnBadge2');
  var boardToast = document.getElementById('boardToast');
  var victoryModal = document.getElementById('victoryModal');

  function renderDieFace(v) {
    var pips = PIP_MAP[v] || PIP_MAP[1];
    var html = '';
    for (var i = 0; i < 9; i++) {
      if (pips.includes(i)) {
        var cls = v === 1 ? 'pip pip-one' : v === 6 ? 'pip pip-six' : 'pip';
        html += '<div class="' + cls + '"></div>';
      } else {
        html += '<div></div>';
      }
    }
    dieFace.innerHTML = html;
    dieBtn.classList.toggle('six-glow', v === 6);
  }

  function updatePawnCoords(player, pt, sliding) {
    var overlap = p1Tile === p2Tile && !sliding;
    var ox = overlap ? (player === 1 ? -15 : 15) : 0;
    var oy = overlap ? (player === 1 ? -8 : 8) : 0;
    var el = player === 1 ? pawn1 : pawn2;
    el.classList.toggle('sliding', !!sliding);
    el.style.left = ((pt.x + ox) / 10) + '%';
    el.style.top = ((pt.y + oy) / 10) + '%';
  }

  function refreshHud() {
    var p2Name = isVsAi ? 'الكمبيوتر' : 'اللاعب ٢';
    label1.textContent = 'أنت (' + p1Tile + ')';
    label2.textContent = p2Name + ' (' + p2Tile + ')';
    tileBadge1.textContent = p1Tile + ' / 100';
    tileBadge2.textContent = p2Tile + ' / 100';

    cardP1.className = 'p-card' + (turn === 1 ? ' active-p1' : '');
    cardP2.className = 'p-card' + (turn === 2 ? ' active-p2' : '');
    turnBadge1.style.display = turn === 1 ? 'inline' : 'none';
    turnBadge2.style.display = turn === 2 ? 'inline' : 'none';
    ring1.style.display = turn === 1 ? 'block' : 'none';
    ring2.style.display = turn === 2 ? 'block' : 'none';
    body1.classList.toggle('active-turn', turn === 1);
    body2.classList.toggle('active-turn', turn === 2);

    var canHuman = !busy && (turn === 1 || (!isVsAi && turn === 2));
    dieBtn.disabled = !canHuman;
    rollMainBtn.disabled = !canHuman;
    rollBtnText.textContent = busy
      ? 'جاري التحرك...'
      : (isVsAi && turn === 2)
      ? 'الكمبيوتر يلعب الآن...'
      : 'ارمِ النرد الآن!';
  }

  function showToast(bg, text) {
    boardToast.style.background = bg;
    boardToast.innerHTML = text;
    boardToast.classList.add('show');
  }
  function hideToast() {
    boardToast.classList.remove('show');
  }

  function sleep(ms) {
    return new Promise(function(r) { setTimeout(r, ms); });
  }

  async function doTurn(player) {
    if (busy) return;
    var mySession = sessionId;
    busy = true;
    refreshHud();

    var pName = player === 1 ? 'أنت' : (isVsAi ? 'الكمبيوتر' : 'اللاعب ٢');
    statusLine.textContent = pName + ' يرمي النرد... 🎲';
    dieBtn.classList.add('rolling');

    for (var i = 0; i < 6; i++) {
      if (sessionId !== mySession) return;
      renderDieFace(((i + Math.floor(Math.random() * 6)) % 6) + 1);
      playTone(260 + i * 25, 110, 0.04, 'triangle');
      await sleep(62);
    }
    if (sessionId !== mySession) return;
    dieBtn.classList.remove('rolling');

    var rolled = Math.floor(Math.random() * 6) + 1;
    diceVal = rolled;
    renderDieFace(rolled);

    var start = player === 1 ? p1Tile : p2Tile;
    var rawTarget = start + rolled;
    var steps = [];
    var bounced = false;

    if (rawTarget <= 100) {
      for (var s = start + 1; s <= rawTarget; s++) steps.push(s);
    } else {
      bounced = true;
      for (var s2 = start + 1; s2 <= 100; s2++) steps.push(s2);
      var over = rawTarget - 100;
      for (var b = 1; b <= over; b++) steps.push(100 - b);
    }

    for (var k = 0; k < steps.length; k++) {
      if (sessionId !== mySession) return;
      var nextT = steps[k];
      Object.values(tileEls).forEach(function(el) { el.classList.remove('highlight'); });
      tileEls[nextT].classList.add('highlight');

      if (player === 1) {
        p1Tile = nextT;
        body1.classList.remove('hopping');
        void body1.offsetWidth;
        body1.classList.add('hopping');
      } else {
        p2Tile = nextT;
        body2.classList.remove('hopping');
        void body2.offsetWidth;
        body2.classList.add('hopping');
      }

      updatePawnCoords(1, getTilePos(p1Tile), false);
      updatePawnCoords(2, getTilePos(p2Tile), false);
      refreshHud();
      playTone(330 + (k % 6) * 40, 480, 0.08, 'sine');
      await sleep(205);
    }

    if (sessionId !== mySession) return;
    Object.values(tileEls).forEach(function(el) { el.classList.remove('highlight'); });

    var finalT = steps[steps.length - 1];

    if (bounced) {
      showToast('rgba(109, 40, 217, 0.95)', 'ارتداد من المربع 100 إلى ' + finalT + '! 🔄');
      await sleep(650);
      if (sessionId !== mySession) return;
      hideToast();
    }

    if (finalT === 100) {
      playTone(523, 1046, 0.45, 'triangle');
      document.getElementById('winEmoji').textContent = player === 1 ? '👑🎉' : '🤖🏆';
      document.getElementById('winTitle').textContent =
        player === 1 ? 'مبروووك! أنت الفائز بالسباق!' : (pName + ' فاز بالمباراة!');
      document.getElementById('winDesc').textContent =
        player === 1
          ? 'وصلت إلى المربع 100 وتفوقت على الكمبيوتر بجدارة!'
          : 'جولة حماسية جداً! العب جولة جديدة الآن وانتقم!';
      victoryModal.classList.add('open');
      busy = false;
      refreshHud();
      return;
    }

    var lad = LADDERS.find(function(l) { return l.start === finalT; });
    if (lad) {
      showToast('rgba(5, 150, 105, 0.95)', '🪜 ' + lad.name + '!<br><small>صعود من ' + lad.start + ' إلى ' + lad.end + '</small>');
      statusLine.textContent = pName + ' صعد ' + lad.name + ' إلى مربع ' + lad.end + '! 🪜✨';
      playTone(392, 880, 0.38, 'triangle');
      var pStart = getTilePos(lad.start);
      var pEnd = getTilePos(lad.end);
      for (var f = 1; f <= 13; f++) {
        if (sessionId !== mySession) return;
        var ratio = f / 13;
        updatePawnCoords(player, { x: pStart.x + (pEnd.x - pStart.x)*ratio, y: pStart.y + (pEnd.y - pStart.y)*ratio }, true);
        await sleep(32);
      }
      finalT = lad.end;
      if (player === 1) p1Tile = finalT; else p2Tile = finalT;
      updatePawnCoords(1, getTilePos(p1Tile), false);
      updatePawnCoords(2, getTilePos(p2Tile), false);
      refreshHud();
      await sleep(420);
      hideToast();
    }

    var snk = SNAKES.find(function(s) { return s.head === finalT; });
    if (snk) {
      showToast('rgba(225, 29, 72, 0.95)', '🐍 ' + snk.name + '!<br><small>انزلاق من ' + snk.head + ' إلى ' + snk.tail + '</small>');
      statusLine.textContent = 'آه! ' + pName + ' لدغه ' + snk.name + ' ونزل لمربع ' + snk.tail + '! 🐍';
      playTone(480, 140, 0.55, 'sawtooth');
      var geom = getSnakeGeometry(snk);
      for (var f2 = 1; f2 <= 16; f2++) {
        if (sessionId !== mySession) return;
        updatePawnCoords(player, geom.pointAt(f2 / 16), true);
        await sleep(32);
      }
      finalT = snk.tail;
      if (player === 1) p1Tile = finalT; else p2Tile = finalT;
      updatePawnCoords(1, getTilePos(p1Tile), false);
      updatePawnCoords(2, getTilePos(p2Tile), false);
      refreshHud();
      await sleep(420);
      hideToast();
    }

    if (!lad && !snk) {
      statusLine.textContent = pName + ' رمى ' + rolled + ' وتقدم للمربع ' + finalT + ' ✨';
    }

    if (rolled === 6) {
      showToast('rgba(245, 158, 11, 0.96)', '🎲 رقم 6 المحظوظ! رمية إضافية!');
      statusLine.textContent = pName + ' جاب 6 وله رمية إضافية الآن! 🔥🎲';
      await sleep(700);
      if (sessionId !== mySession) return;
      hideToast();
      busy = false;
      refreshHud();
      if (isVsAi && turn === 2) setTimeout(function() { doTurn(2); }, 500);
    } else {
      turn = player === 1 ? 2 : 1;
      busy = false;
      refreshHud();
      if (isVsAi && turn === 2) setTimeout(function() { doTurn(2); }, 550);
    }
  }

  function resetGame() {
    sessionId++;
    p1Tile = 1;
    p2Tile = 1;
    turn = 1;
    busy = false;
    diceVal = 6;
    hideToast();
    victoryModal.classList.remove('open');
    Object.values(tileEls).forEach(function(el) { el.classList.remove('highlight'); });
    renderDieFace(6);
    updatePawnCoords(1, getTilePos(1), false);
    updatePawnCoords(2, getTilePos(1), false);
    statusLine.textContent = isVsAi
      ? 'جولة جديدة ضد الكمبيوتر! دورك الآن، ارمِ النرد 🎲🔥'
      : 'جولة جديدة بين لاعبين! دور اللاعب الأول 🎲✨';
    refreshHud();
  }

  dieBtn.addEventListener('click', function() { doTurn(turn); });
  rollMainBtn.addEventListener('click', function() { doTurn(turn); });
  document.getElementById('btnReset').addEventListener('click', resetGame);
  document.getElementById('btnPlayAgain').addEventListener('click', resetGame);

  document.getElementById('btnSound').addEventListener('click', function() {
    muted = !muted;
    this.textContent = muted ? '🔇' : '🔊';
  });

  document.getElementById('btnVsAi').addEventListener('click', function() {
    isVsAi = true;
    this.classList.add('active');
    document.getElementById('btnVs2P').classList.remove('active');
    document.getElementById('p2NameText').textContent = 'الكمبيوتر';
    document.getElementById('p2SubText').textContent = 'الروبوت الذكي';
    document.getElementById('p2Emoji').textContent = '🤖';
    resetGame();
  });

  document.getElementById('btnVs2P').addEventListener('click', function() {
    isVsAi = false;
    this.classList.add('active');
    document.getElementById('btnVsAi').classList.remove('active');
    document.getElementById('p2NameText').textContent = 'اللاعب ٢';
    document.getElementById('p2SubText').textContent = 'البرق الأزرق';
    document.getElementById('p2Emoji').textContent = '⚡';
    resetGame();
  });

  renderDieFace(6);
  updatePawnCoords(1, getTilePos(1), false);
  updatePawnCoords(2, getTilePos(1), false);
  refreshHud();
})();
</script>
</body>
</html>`
}

const handler = async (m, { conn }) => {
  try {
    await conn.sendMessage(m.chat, {
      react: { text: '🎲', key: m.key }
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
            title: 'Darkness Bot - السلم والثعبان 2D',
            is_in_progress: true
          }
        }
      }],
      embedded_screens: [{
        title: 'Darkness Bot - السلم والثعبان 2D',
        content: [{
          __typename: 'FOAIDNixelButtonSheets',
          tabs: [{
            id: 'tab_0',
            tab_header: 'السلم والثعبان 🎲',
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
    console.error('[Snakes & Ladders Darkness]', e?.stack || e)
    await m.reply('حصل خطأ اثناء تشغيل لعبة السلم والثعبان')
  }
}

handler.category = 'games'
handler.usage = ['سلم']
handler.command = ['سلم', 'سلم_وثعبان', 'السلم_والثعبان', 'snakes', 'snake']

export default handler
