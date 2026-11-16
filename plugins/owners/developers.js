import { randomUUID } from 'crypto'
import { execFile } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import os from 'os'
import path from 'path'

const run = promisify(execFile)

const RAW = 'https://raw.githubusercontent.com/MohamedVex/Lora-Upload1/main/uploads/'
const CACHE = path.join(os.tmpdir(), 'dev_media_cache_v6.json')

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

    const [BG, HERO, VA_IMG, DA_IMG, MO_IMG, DEX_IMG, FONT] = await Promise.all([
      toBase64(RAW + '1792349463387.jpg', 'image/jpeg'),
      compressImg(RAW + '1792348149958.jpg', 300),
      compressImg(RAW + '1792357636731.jpg', 200),
      compressImg(RAW + '1792357665639.jpg', 200),
      compressImg(RAW + '1792358136298.png', 200),
      compressImg(RAW + '1792695210759.jpg', 200),
      loadFont().catch((e) => { console.error('dev font error:', e); return '' })
    ])

    const media = { BG, HERO, VA_IMG, DA_IMG, MO_IMG, DEX_IMG, FONT }
    if (FONT) { try { fs.writeFileSync(CACHE, JSON.stringify(media)) } catch {} }
    return media
  })().catch((e) => { MEDIA_P = null; throw e }))

loadMedia().catch((e) => console.error('dev media preload error:', e))

const buildHtml = async () => {
  const { BG, HERO, VA_IMG, DA_IMG, MO_IMG, DEX_IMG, FONT } = await loadMedia()

  return `<!DOCTYPE html>
<html lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Darkness Bot</title>

    <style>
        :root {
            --darkness: 0.6;
            --border: #593668;
            --text: #FFF5EB;
            --bacCard: rgba(28, 20, 30, 0.75);
            --button: #593668;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            color: var(--text);
            text-shadow: 0 4px 15px rgba(0, 0, 0, 0.7);
        }

        html {
            min-height: 100%;
        }

        @font-face {
            font-family: "DarknessCairo";
            src: url("${FONT}") format("woff2");
            font-weight: 400 900;
            font-style: normal;
        }

        body,
        button {
            font-family: "DarknessCairo", "Segoe UI", Tahoma, Arial, sans-serif;
        }

        body {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }

        .bg-layer {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            background: #000;
        }

        .bg-layer img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
        }

        .bg-layer::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, var(--darkness));
        }





        .all {
            width: 100%;
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 14px;
            padding-bottom: 22px;
        }

        .wahm {
            width: 100%;
            height: 12px;
            flex-shrink: 0;
        }

        .box_Darkness {
            width: 88%;
            max-width: 560px;
            padding: 26px 18px 23px;
            background: var(--bacCard);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border: 1px solid var(--border);
            border-radius: 18px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 14px;
            margin-bottom: 14px;
            text-align: center;
            box-shadow: 0 0 18px rgba(89, 54, 104, 0.18);
        }

        .hero-image {
            display: block;
            width: 150px;
            height: 150px;
            object-fit: cover;
            border: 2px solid rgba(181, 132, 207, 0.85);
            border-radius: 50%;
            box-shadow:
                0 0 10px rgba(142, 86, 173, 0.42),
                0 0 25px rgba(142, 86, 173, 0.22);
        }

        .box_Darkness h2 {
            font-size: 25px;
            letter-spacing: 0.4px;
        }

        .hero-description {
            max-width: 420px;
            color: rgba(255, 245, 235, 0.82);
            font-size: 16px;
            line-height: 1.8;
        }

        .developers {
            width: 84%;
            max-width: 470px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .box_dev {
            width: 100%;
            min-height: 0;
            padding: 10px 14px 12px;
            background: var(--bacCard);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border: 1px solid var(--border);
            border-radius: 14px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 5px;
            box-shadow: 0 0 14px rgba(89, 54, 104, 0.16);
        }

        .dev-avatar {
            width: 66px;
            height: 66px;
            flex-shrink: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 2px solid var(--border);
            border-radius: 50%;
            background: linear-gradient(145deg, #593668, #211727);
            box-shadow: 0 0 13px rgba(89, 54, 104, 0.35);
            font-size: 18px;
            font-weight: 900;
            overflow: hidden;
        }

        .dev-avatar img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .box_dev h3 {
            font-size: 25px;
            font-weight: 800;
        }

        .dev-description {
            min-height: 0;
            font-size: 17px;
            line-height: 1.5;
            color: rgba(255, 245, 235, 0.82);
        }

        .box_user_dev {
            width: 100%;
            min-height: 42px;
            margin-top: 3px;
            padding: 4px;
            display: grid;
            grid-template-columns: 34px minmax(0, 1fr) 34px;
            align-items: center;
            gap: 6px;
            background: rgba(12, 9, 15, 0.64);
            border: 1px solid var(--border);
            border-radius: 11px;
        }

        .contact-name {
            min-width: 0;
            text-align: center;
            font-size: 17px;
            font-weight: 700;
            overflow-wrap: anywhere;
            user-select: text;
        }

        .copy-btn,
        .whatsapp-icon {
            width: 34px;
            height: 34px;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid var(--border);
            border-radius: 9px;
            background: var(--button);
        }

        .copy-btn {
            cursor: pointer;
            transition: transform 0.2s, filter 0.2s;
        }

        .copy-btn:hover {
            transform: scale(1.05);
            filter: brightness(1.2);
        }

        .whatsapp-icon {
            cursor: default;
            flex-shrink: 0;
        }

        .copy-btn svg {
            width: 17px;
            height: 17px;
            fill: none;
            stroke: currentColor;
            stroke-width: 1.8;
            stroke-linecap: round;
            stroke-linejoin: round;
        }

        .whatsapp-icon svg {
            width: 20px;
            height: 20px;
            fill: currentColor;
        }

        .channels {
            width: 90%;
            max-width: 560px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-top: 4px;
        }

        .channels h2 {
            text-align: center;
            font-size: 24px;
            margin-bottom: 2px;
        }

        .channel-card {
            width: 100%;
            min-height: 78px;
            padding: 12px;
            display: flex;
            align-items: center;
            gap: 12px;
            background: var(--bacCard);
            border: 1px solid var(--border);
            border-radius: 13px;
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
        }

        .channel-mark {
            width: 44px;
            height: 44px;
            flex-shrink: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            border: none;
            border-radius: 0;
            background: transparent;
            text-shadow: none;
        }

        .channel-mark svg {
            width: 28px;
            height: 28px;
            display: block;
            fill: currentColor;
        }

        .channel-mark.whatsapp svg { color: #25D366; }
        .channel-mark.github svg { color: #F4F4F4; }

        .channel-info {
            min-width: 0;
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .channel-name {
            font-size: 17px;
            font-weight: 800;
        }

        .channel-note {
            color: rgba(255, 245, 235, 0.68);
            font-size: 14px;
            line-height: 1.5;
        }

        .channel-open {
            width: 42px;
            min-height: 42px;
            padding: 0;
            flex-shrink: 0;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            border: 1px solid var(--border);
            border-radius: 9px;
            background: var(--button);
            color: var(--text);
            font-size: 14px;
            font-weight: 800;
            cursor: pointer;
            transition: filter 0.2s, transform 0.2s;
        }

        .channel-open:hover {
            filter: brightness(1.2);
            transform: translateY(-1px);
        }

        .channel-open svg {
            width: 19px;
            height: 19px;
            fill: none;
            stroke: currentColor;
            stroke-width: 1.8;
            stroke-linecap: round;
            stroke-linejoin: round;
        }

        .site-footer {
            width: 100%;
            margin-top: auto;
            padding: 8px 12px 26px;
            text-align: center;
        }

        .site-footer strong {
            display: inline-block;
            padding: 8px 24px;
            font-size: 19px;
            font-weight: 900;
            letter-spacing: 1px;
            color: #d7b4eb;
            background: var(--bacCard);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border: 1px solid var(--border);
            border-radius: 10px;
            box-shadow: 0 0 14px rgba(89, 54, 104, 0.16);
        }

        @media (max-width: 380px) {
            .box_Darkness {
                width: 92%;
            }

            .developers {
                width: 86%;
            }

            .channels {
                width: 90%;
            }

            .box_user_dev {
                grid-template-columns: 32px minmax(0, 1fr) 32px;
                gap: 5px;
            }

            .copy-btn,
            .whatsapp-icon {
                width: 32px;
                height: 32px;
            }
        }

        @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
    </style>
</head>

<body>
    <div class="bg-layer"><img src="${BG}" alt=""></div>


    <main class="all">
        <div class="wahm"></div>

        <section class="box_Darkness">
            <img
                class="hero-image"
                src="${HERO}"
                alt="Darkness Bot"
            >
            <h2>Darkness Bot Developers</h2>
            <p class="hero-description" dir="auto">فريق تطوير Darkness Bot — شكرًا لدعمكم ومتابعتكم للمشروع.</p>
        </section>

        <section class="developers" aria-label="مطورو Darkness Bot">
            <article class="box_dev">
                <div class="dev-avatar" data-photo="${VA_IMG}" aria-label="صورة VA"><span>VA</span></div>
                <h3>VA</h3>
                <p class="dev-description">معملنا و المطور الاساسي لفيرم ورك مياو ساب 🌸
</p>
                <div class="box_user_dev">
                    <button class="copy-btn" type="button" title="نسخ بيانات التواصل" aria-label="نسخ بيانات VA">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"></rect><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"></path></svg>
                    </button>
                    <span class="contact-name">@d.py</span>
                    <span class="whatsapp-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.52 3.48A11.8 11.8 0 0 0 12.08 0C5.5 0 .15 5.35.15 11.93c0 2.1.55 4.16 1.6 5.97L0 24l6.26-1.64a11.9 11.9 0 0 0 5.81 1.49h.01c6.58 0 11.93-5.35 11.93-11.93a11.85 11.85 0 0 0-3.49-8.44ZM12.08 21.8h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.72.98.99-3.63-.24-.37a9.87 9.87 0 0 1-1.52-5.26c0-5.47 4.44-9.91 9.91-9.91a9.84 9.84 0 0 1 7.01 2.9 9.85 9.85 0 0 1 2.9 7.01c0 5.47-4.45 9.91-9.92 9.91Zm5.44-7.42c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.48-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.91-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.09 3.2 5.07 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.41.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35Z"/></svg>
                    </span>
                </div>
            </article>

            <article class="box_dev">
                <div class="dev-avatar" data-photo="${DA_IMG}" aria-label="صورة Da7oum"><span>D</span></div>
                <h3>Da7oum</h3>
                <p class="dev-description" dir="auto">عضو لدا 𝐋𝐋𝐎𝐘𝐃
                و مطور من مطورين بوت ريزي</p>
                <div class="box_user_dev">
                    <button class="copy-btn" type="button" title="نسخ بيانات التواصل" aria-label="نسخ بيانات Da7oum">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"></rect><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"></path></svg>
                    </button>
                    <span class="contact-name">64661166666</span>
                    <span class="whatsapp-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.52 3.48A11.8 11.8 0 0 0 12.08 0C5.5 0 .15 5.35.15 11.93c0 2.1.55 4.16 1.6 5.97L0 24l6.26-1.64a11.9 11.9 0 0 0 5.81 1.49h.01c6.58 0 11.93-5.35 11.93-11.93a11.85 11.85 0 0 0-3.49-8.44ZM12.08 21.8h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.72.98.99-3.63-.24-.37a9.87 9.87 0 0 1-1.52-5.26c0-5.47 4.44-9.91 9.91-9.91a9.84 9.84 0 0 1 7.01 2.9 9.85 9.85 0 0 1 2.9 7.01c0 5.47-4.45 9.91-9.92 9.91Zm5.44-7.42c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.48-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.91-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.09 3.2 5.07 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.41.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35Z"/></svg>
                    </span>
                </div>
            </article>

            <article class="box_dev">
                <div class="dev-avatar" data-photo="${MO_IMG}" aria-label="صورة Mohamed"><span>M</span></div>
                <h3>Mohamed</h3>
                <p class="dev-description" dir="auto">عضو لدا 𝐋𝐋𝐎𝐘𝐃
                و مطور من مطورين بوت ريزي</p>
                <div class="box_user_dev">
                    <button class="copy-btn" type="button" title="نسخ بيانات التواصل" aria-label="نسخ بيانات Mohamed">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"></rect><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"></path></svg>
                    </button>
                    <span class="contact-name">@T7_14</span>
                    <span class="whatsapp-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.52 3.48A11.8 11.8 0 0 0 12.08 0C5.5 0 .15 5.35.15 11.93c0 2.1.55 4.16 1.6 5.97L0 24l6.26-1.64a11.9 11.9 0 0 0 5.81 1.49h.01c6.58 0 11.93-5.35 11.93-11.93a11.85 11.85 0 0 0-3.49-8.44ZM12.08 21.8h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.72.98.99-3.63-.24-.37a9.87 9.87 0 0 1-1.52-5.26c0-5.47 4.44-9.91 9.91-9.91a9.84 9.84 0 0 1 7.01 2.9 9.85 9.85 0 0 1 2.9 7.01c0 5.47-4.45 9.91-9.92 9.91Zm5.44-7.42c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.48-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.91-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.09 3.2 5.07 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.41.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35Z"/></svg>
                    </span>
                </div>
            </article>
            <article class="box_dev">
                <div class="dev-avatar" data-photo="${DEX_IMG}" aria-label="صورة Dexter"><span>Dexter</span></div>
                <h3>Dexter</h3>
                <p class="dev-description" dir="auto">عضو لدا 𝐋𝐋𝐎𝐘𝐃
                و مطور من مطورين بوت ريزي</p>
                <div class="box_user_dev">
                    <button class="copy-btn" type="button" title="نسخ بيانات التواصل" aria-label="نسخ بيانات Dexter">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"></rect><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"></path></svg>
                    </button>
                    <span class="contact-name">@navbare</span>
                    <span class="whatsapp-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.52 3.48A11.8 11.8 0 0 0 12.08 0C5.5 0 .15 5.35.15 11.93c0 2.1.55 4.16 1.6 5.97L0 24l6.26-1.64a11.9 11.9 0 0 0 5.81 1.49h.01c6.58 0 11.93-5.35 11.93-11.93a11.85 11.85 0 0 0-3.49-8.44ZM12.08 21.8h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.72.98.99-3.63-.24-.37a9.87 9.87 0 0 1-1.52-5.26c0-5.47 4.44-9.91 9.91-9.91a9.84 9.84 0 0 1 7.01 2.9 9.85 9.85 0 0 1 2.9 7.01c0 5.47-4.45 9.91-9.92 9.91Zm5.44-7.42c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.48-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.91-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.09 3.2 5.07 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.41.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35Z"/></svg>
                    </span>
                </div>
            </article>
            
        </section>

        <section class="channels" aria-label="روابطنا">
            <h2>روابطنا</h2>

            <div class="channel-card">
                <div class="channel-mark whatsapp" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><path d="M20.52 3.48A11.8 11.8 0 0 0 12.08 0C5.5 0 .15 5.35.15 11.93c0 2.1.55 4.16 1.6 5.97L0 24l6.26-1.64a11.9 11.9 0 0 0 5.81 1.49h.01c6.58 0 11.93-5.35 11.93-11.93a11.85 11.85 0 0 0-3.49-8.44ZM12.08 21.8h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.72.98.99-3.63-.24-.37a9.87 9.87 0 0 1-1.52-5.26c0-5.47 4.44-9.91 9.91-9.91a9.84 9.84 0 0 1 7.01 2.9 9.85 9.85 0 0 1 2.9 7.01c0 5.47-4.45 9.91-9.92 9.91Zm5.44-7.42c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.48-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.91-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.09 3.2 5.07 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.41.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35Z"/></svg>
                </div>
                <div class="channel-info">
                    <span class="channel-name">واتساب</span>
                    <span class="channel-note">تابع آخر أخبار وتحديثات Darkness Bot.</span>
                </div>
                <button class="channel-open" type="button" title="نسخ الرابط" aria-label="نسخ الرابط" data-url="https://whatsapp.com/channel/0029VaQim2bAu3aPsRVaDq3v"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"></rect><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"></path></svg></button>
            </div>

            <div class="channel-card">
                <div class="channel-mark github" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.53v-2.08c-3.1.67-3.76-1.32-3.76-1.32-.5-1.28-1.24-1.62-1.24-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15 1 .1.76 2.02 3.7 1.42.1-.72.39-1.21.7-1.49-2.47-.28-5.07-1.24-5.07-5.51 0-1.22.44-2.21 1.15-2.99-.12-.28-.5-1.42.11-2.95 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.11-1.44 3.05-1.14 3.05-1.14.61 1.53.23 2.67.11 2.95.72.78 1.15 1.77 1.15 2.99 0 4.28-2.6 5.22-5.08 5.5.4.35.75 1.02.75 2.06V22c0 .29.2.63.76.52A11.1 11.1 0 0 0 12 .9Z"/></svg>
                </div>
                <div class="channel-info">
                    <span class="channel-name">GitHub</span>
                    <span class="channel-note">المشاريع والأكواد والتحديثات البرمجية.</span>
                </div>
                <button class="channel-open" type="button" title="نسخ الرابط" aria-label="نسخ الرابط" data-url=""><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"></rect><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"></path></svg></button>
            </div>
        </section>
    </main>

    <footer class="site-footer"><strong>by : 𝐋𝐋𝐎𝐘𝐃</strong></footer>

    <script>
        document.querySelectorAll(".dev-avatar[data-photo]").forEach((avatar) => {
            const photoUrl = avatar.dataset.photo.trim();
            if (!photoUrl) return;

            const photo = document.createElement("img");
            photo.src = photoUrl;
            photo.alt = avatar.getAttribute("aria-label") || "صورة المطور";
            photo.loading = "lazy";
            photo.onerror = () => photo.remove();
            avatar.replaceChildren(photo);
        });

        document.querySelectorAll(".channel-open").forEach((button) => {
            const original = button.innerHTML;
            const done = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg>';
            button.addEventListener("click", async () => {
                const url = button.dataset.url.trim();
                if (!url) {
                    alert("أضف رابط المنصة داخل data-url في زر النسخ.");
                    return;
                }
                try {
                    await navigator.clipboard.writeText(url);
                    button.innerHTML = done;
                    setTimeout(() => { button.innerHTML = original; }, 1200);
                } catch (error) {
                    window.prompt("انسخ الرابط:", url);
                }
            });
        });

        document.querySelectorAll(".copy-btn").forEach((button) => {
            button.addEventListener("click", async () => {
                const text = button.closest(".box_user_dev").querySelector(".contact-name").textContent.trim();
                try {
                    await navigator.clipboard.writeText(text);
                    button.title = "تم النسخ";
                    setTimeout(() => { button.title = "نسخ بيانات التواصل"; }, 1200);
                } catch (error) {
                    window.prompt("انسخ بيانات التواصل:", text);
                }
            });
        });
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
            title: 'Bot Darkness developers',
            is_in_progress: true
          }
        }
      }],
      embedded_screens: [{
        title: 'Bot Darkness developers',
        content: [{
          __typename: 'FOAIDNixelButtonSheets',
          tabs: [{
            id: 'tab_0',
            tab_header: 'Developers',
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
    console.error('[Developers Darkness]', e?.stack || e)
    await m.reply('حصل خطأ اثناء تشغيل الامر')
  }
}

handler.category = 'owner s'
handler.usage = ['مطور']
handler.command = ['مطور', 'مطورين', 'المطورين', 'owner', 'owners']

export default handler
