import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

const MENU_IMG = "https://i.ibb.co/1tqtGjTs/0f66403b55e38f7d0614e1c7f6b9b94c.jpg";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const handler = async (m, { conn, text, command, cli }) => {
  try { await m.react("⚙️"); } catch {}

  const { subs } = require("../../system/sub.js");
  if (!subs) {
    try { await m.react("❌"); } catch {}
    return m.reply("🖤: نظام البوتات الفرعية غير جاهز حالياً.");
  }

  const list = subs.list() || [];
  if (list.length >= 15) {
    try { await m.react("❌"); } catch {}
    return m.reply("🖤: العدد مكتمل (الحد الأقصى 15 بوت فرعي).");
  }

  let digits = text?.trim().replace(/\D/g, "");
  if (!digits) {
    digits = m.jid?.split("@")[0]?.split(":")[0]?.replace(/\D/g, "");
  }

  if (!digits) {
    try { await m.react("🖤"); } catch {}
    return m.reply(
      `\u200F*⪩ طريقة الاستخدام: ↯ •*\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
      `\u200F⦑ ➊ ⦒ ⦂ اكتب الأمر وبجانبه رقمك مع رمز الدولة\n` +
      `\u200F⦑ ➋ ⦒ ⦂ مثال ↜ ⟦ .${command} \u200E2010xxxxxxxx\u200F ⟧\n\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
      `\u200E> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`
    );
  }

  if (subs.get(digits)?.connected) {
    try { await m.react("🖤"); } catch {}
    return m.reply(`\u200F🖤: الرقم مفعل بوت بالفعل ↜ ⟦ \u200E${digits}\u200F ⟧`);
  }

  const code = await subs.addBot(digits);
  if (!code) {
    try { await m.react("❌"); } catch {}
    return m.reply("🖤: فشل في استخراج كود الربط، تأكد من صحة الرقم وحاول مرة أخرى.");
  }

  const senderNum = m.sender.split("@")[0].split(":")[0];
  const status = {
    key: {
      participant: `${senderNum}@s.whatsapp.net`,
      remoteJid: "status@broadcast",
      fromMe: false,
    },
    message: {
      contactMessage: {
        displayName: `${m.pushName || "User"}`,
        vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${m.pushName || "User"}\nitem1.TEL;waid=${senderNum}:${senderNum}\nEND:VCARD`,
      },
    },
    participant: "0@s.whatsapp.net",
  };

  const botImg = cli?.config?.info?.images?.[1] || cli?.config?.info?.images?.[0] || MENU_IMG;

  try { await m.react("🖤"); } catch {}

  await conn.buttonV2(
    m.chat,
    {
      text:
        `\u200F*⪩ نـظـام الـبـوتـات الـفـرعـيـة 🖤 ↯ •*\n` +
        `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
        `\u200F⦑ 📱 ⦒ ⦂ الرقم ↜ ⟦ \u200E${digits}\u200F ⟧\n` +
        `\u200F⦑ 🔑 ⦒ ⦂ الكود ↜ ⟦ \u200E${code}\u200F ⟧\n\n` +
        `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
        `\u200F⦑ 📌 ⦒ ⦂ الـخطـوات ↜ الأجهزة المرتبطة ⬅️ الربط بكود\n` +
        `\u200F⦑ ⚠️ ⦒ ⦂ تـنـبـيـه ↜ الكود تنتهي صلاحيته خلال ثوانٍ\n\n` +
        `\u200E> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`,
      footer: "Darkness ⇆ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃",
      image: botImg,
      contextInfo: cli?.config?.info?.channel,
      buttons: [
        {
          name: "cta_copy",
          buttonParamsJson: JSON.stringify({
            display_text: "نـسـخ الـكـود 🔑",
            copy_code: code,
          }),
        },
      ],
      newsletter: {
        name: "𝐋𝐋𝐎𝐘𝐃 ~ 𝐂𝐡𝐚𝐧𝐧𝐞𝐥 🖤",
        jid: "@newsletter",
      },
    },
    { quoted: status }
  );

  for (let i = 0; i < 20; i++) {
    await sleep(3000);
    if (subs.get(digits)?.connected) {
      return conn.linkPreview(
        m.chat,
        {
          text:
            `\u200F*⪩ ✅ تـم الاتـصـال بـنـجـاح ↯ •*\n` +
            `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
            `\u200F⦑ 📱 ⦒ ⦂ الرقم ↜ ⟦ \u200E${digits}\u200F ⟧\n` +
            `\u200F⦑ 🤖 ⦒ ⦂ الحالة ↜ ⟦ البوت جاهز للاستخدام الآن ⟧\n\n` +
            `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
            `\u200E> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`,
          url: botImg,
          height: 438,
          width: 734,
          title: "𝐃 𝐀 𝐑 𝐊 — 𝐋𝐋𝐎𝐘𝐃 🖤 | 𝐁𝐨𝐭 𝐢𝐬 𝐛𝐮𝐢𝐥𝐭 𝐨𝐧 𝐭𝐡𝐞 𝐌𝐄𝐎𝐖𝐒𝐀𝐁 𝐅𝐫𝐚𝐦𝐞𝐰𝐨𝐫𝐤",
          description: "نـظـام الـبـوتـات الـفـرعـيـة 🖤",
        },
        { quoted: status }
      );
    }
  }

  await conn.sendMessage(
    m.chat,
    {
      text: "🖤: انتهى وقت انتظار الربط (Timeout)، يرجى طلب كود جديد.",
      contextInfo: cli?.config?.info?.channel,
    },
    { quoted: m }
  );
};

handler.usage = ["تنصيب"];
handler.useg = ["تنصيب"];
handler.command = ["تنصيب"];
handler.category = "sub";

export default handler;