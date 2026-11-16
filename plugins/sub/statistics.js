let handler = async (m, { conn, command }) => {
  const sub = globalThis.subBots;

  if (!sub || typeof sub.stats !== 'function')
    return m.reply(
      `*⪩ نظام البوتات الفرعية غير متاح: ↯ •*\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
      `⦑ ➊ ⦒ ⦂ تأكد إن البوتات الفرعية متصلة\n\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
      `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`
    );

  const stats = await sub.stats();

  const status = stats.full ? '🔴 ممتلئ' : '🟢 متاح';

  return m.reply(
    `*⪩ إحصائيات البوتات الفرعية: ↯ •*\n` +
    `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
    `⦑ ➊ ⦒ ⦂ الإجمالي ↜ ⟦ ${stats.total} ⟧\n` +
    `⦑ ➋ ⦒ ⦂ متصل ↜ ⟦ ${stats.connected} ⟧\n` +
    `⦑ ➌ ⦒ ⦂ متوقف ↜ ⟦ ${stats.stopped} ⟧\n` +
    `⦑ ➍ ⦒ ⦂ الرسائل ↜ ⟦ ${stats.messages} ⟧\n` +
    `⦑ ➎ ⦒ ⦂ الحد الأقصى ↜ ⟦ ${stats.max} ⟧\n` +
    `⦑ ➏ ⦒ ⦂ الحالة ↜ ⟦ ${status} ⟧\n\n` +
    `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
    `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`
  );
};

handler.command = ["احصائيات_فرعي"];
handler.category = "subbots";
handler.usage = ["احصائيات_فرعي"];
handler.owner = true;

export default handler;