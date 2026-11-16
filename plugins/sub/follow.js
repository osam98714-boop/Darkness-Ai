let handler = async (m, { conn, text, command, usedPrefix }) => {
  const sub = globalThis.subBots;

  if (!sub || typeof sub.list !== 'function')
    return m.reply(
      `*⪩ مفيش SubBots متاحة: ↯ •*\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
      `⦑ ➊ ⦒ ⦂ تأكد إن البوتات الفرعية متصلة\n\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
      `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`
    );

  if (!text || !text.trim())
    return m.reply(
      `*⪩ طريقة الاستخدام: ↯ •*\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
      `⦑ ➊ ⦒ ⦂ .${command} ↜ ⟦ رابط_القناة ⟧\n` +
      `⦑ ➋ ⦒ ⦂ مثال ↜ ⟦ .${command} https://whatsapp.com/channel/0029Vb3UUKz3QxS3bgWmTc3x/220 ⟧\n\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
      `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`
    );

  const channelUrl = text.trim();

  const match = channelUrl.match(/whatsapp\.com\/channel\/([A-Za-z0-9]+)/);
  if (!match)
    return m.reply(
      `*⪩ رابط غير صالح: ↯ •*\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
      `⦑ ➊ ⦒ ⦂ تأكد إن الرابط بالشكل ده ↜ ⟦ https://whatsapp.com/channel/CODE ⟧\n\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
      `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`
    );

  const channelCode = match[1];

  const subs_ = await sub.list();
  if (!subs_.length)
    return m.reply(
      `*⪩ مفيش حسابات متصلة: ↯ •*\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
      `⦑ ➊ ⦒ ⦂ ضيف بوت فرعي الأول\n\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
      `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`
    );

  const statusMsg = await m.reply(`⏳ جاري المتابعة من ${subs_.length} حساب...`);

  const results = [];

  for (const bot of subs_) {
    if (bot.socket && typeof bot.socket === 'function' && bot.connected) {
      try {
        const sock = await bot.socket();
        const meta = await sock.newsletterMetadata("invite", channelCode);
        await sock.newsletterFollow(meta.id);
        results.push({ phone: bot.phone || bot.id, success: true, channelJid: meta.id });
      } catch (err) {
        results.push({ phone: bot.phone || bot.id, success: false, error: err.message });
      }
    } else {
      results.push({ phone: bot.phone || bot.id, success: false, error: "not connected" });
    }
  }

  const successCount = results.filter(r => r.success).length;
  const failCount = results.length - successCount;

  let report = `*⪩ نتيجة المتابعة: ↯ •*\n`;
  report += `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n`;
  report += `⦑ ➊ ⦒ ⦂ القناة ↜ ⟦ ${channelCode} ⟧\n`;
  report += `⦑ ➋ ⦒ ⦂ نجح ↜ ⟦ ${successCount} ⟧\n`;
  report += `⦑ ➌ ⦒ ⦂ فشل ↜ ⟦ ${failCount} ⟧\n`;
  report += `⦑ ➍ ⦒ ⦂ الإجمالي ↜ ⟦ ${results.length} ⟧\n\n`;
  report += `*⪩ التفاصيل: ↯ •*\n`;
  report += `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n`;
  for (const r of results)
    report += r.success ? `✅ ${r.phone}\n` : `❌ ${r.phone} — ${r.error}\n`;
  report += `\n── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n`;
  report += `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`;

  try {
    await conn.sendMessage(m.chat, { text: report, edit: statusMsg.key });
  } catch {
    await m.reply(report);
  }
};

handler.command = ["فولو"];
handler.category = "subbots";
handler.usage = ["فولو"];
handler.owner = true;

export default handler;