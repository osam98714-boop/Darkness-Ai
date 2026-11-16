import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

const handler = async (m, { conn, cli }) => {
  try { await m.react("⚙️"); } catch {}

  let sub = globalThis.subBots;
  if (!sub) {
    try {
      const { subs } = require("../../system/sub.js");
      sub = subs;
    } catch {}
  }

  if (!sub) {
    try { await m.react("🖤"); } catch {}
    return conn.sendMessage(
      m.chat,
      {
        text: "🖤: مفيش بوتات فرعية مسجلة حالياً.",
        contextInfo: cli?.config?.info?.channel,
      },
      { quoted: m }
    );
  }

  const list = (await sub.list()) || [];

  if (!list.length) {
    try { await m.react("🖤"); } catch {}
    return conn.sendMessage(
      m.chat,
      {
        text: "🖤: مفيش بوتات فرعية مسجلة حالياً.",
        contextInfo: cli?.config?.info?.channel,
      },
      { quoted: m }
    );
  }

  const connected = list.filter((bot) => bot.connected).length;
  const disconnected = list.length - connected;

  const totalMessages = list.reduce(
    (total, bot) => total + (Number(bot.messages) || 0),
    0
  );

  const connectionRate = ((connected / list.length) * 100).toFixed(1);

  const details = list
    .map((bot, i) => {
      return [
        `\u200F*⪩ ⦑ ${i + 1} ⦒ ${bot.name || "بدون اسم"} ↯ •*`,
        `\u200F⦑ 📱 ⦒ ⦂ الرقم ↜ ⟦ \u200E${bot.phone || bot.id || "غير معروف"}\u200F ⟧`,
        `\u200F⦑ 🆔 ⦒ ⦂ المعرّف ↜ ⟦ \u200E${bot.id || "غير معروف"}\u200F ⟧`,
        `\u200F⦑ 📡 ⦒ ⦂ الحالة ↜ ⟦ ${bot.connected ? "متصل 🟢" : "غير متصل 🔴"} ⟧`,
        `\u200F⦑ 💬 ⦒ ⦂ الرسائل ↜ ⟦ \u200E${Number(bot.messages) || 0}\u200F ⟧`,
      ].join("\n");
    })
    .join("\n── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ──\n");

  const output = [
    `\u200F*⪩ 📊 إحصائيات البوتات الفرعية 🖤 ↯ •*`,
    `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ──`,
    `\u200F⦑ 🤖 ⦒ ⦂ إجمالي البوتات ↜ ⟦ \u200E${list.length}\u200F ⟧`,
    `\u200F⦑ 🟢 ⦒ ⦂ المتصلة ↜ ⟦ \u200E${connected}\u200F ⟧`,
    `\u200F⦑ 🔴 ⦒ ⦂ غير المتصلة ↜ ⟦ \u200E${disconnected}\u200F ⟧`,
    `\u200F⦑ 📈 ⦒ ⦂ نسبة الاتصال ↜ ⟦ \u200E${connectionRate}%\u200F ⟧`,
    `\u200F⦑ ✉️ ⦒ ⦂ إجمالي الرسائل ↜ ⟦ \u200E${totalMessages}\u200F ⟧`,
    `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ──`,
    ``,
    `\u200F*⪩ 📋 تفاصيل البوتات ↯ •*`,
    ``,
    details,
    ``,
    `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ──`,
    `\u200E> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`,
  ].join("\n");

  try { await m.react("🖤"); } catch {}
  return conn.sendMessage(
    m.chat,
    {
      text: output,
      contextInfo: cli?.config?.info?.channel,
    },
    { quoted: m }
  );
};

handler.usage = ["بوتات"];
handler.useg = ["بوتات"];
handler.command = ["بوتات", "subbots"];
handler.category = "sub";

export default handler;
