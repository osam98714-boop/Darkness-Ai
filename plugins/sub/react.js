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
      `⦑ ➊ ⦒ ⦂ .${command} ↜ ⟦ رابط_القناة | الإيموجي ⟧\n` +
      `⦑ ➋ ⦒ ⦂ مثال ↜ ⟦ .${command} https://whatsapp.com/channel/0029Vb3UUKz3QxS3bgWmTc3x/220 | ❤️ ⟧\n\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
      `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`
    );

  const parts = text.split('|').map(p => p.trim());
  const channelUrl = parts[0];
  const emoji = parts[1] || '❤️';

  const match = channelUrl.match(/whatsapp\.com\/channel\/([A-Za-z0-9]+)\/(\d+)/);
  if (!match)
    return m.reply(
      `*⪩ رابط غير صالح: ↯ •*\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
      `⦑ ➊ ⦒ ⦂ تأكد إن الرابط بالشكل ده ↜ ⟦ https://whatsapp.com/channel/CODE/ID ⟧\n\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
      `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`
    );

  const channelCode = match[1];
  const serverId = match[2];

  const subs_ = await sub.list();
  if (!subs_.length)
    return m.reply(
      `*⪩ مفيش حسابات متصلة: ↯ •*\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
      `⦑ ➊ ⦒ ⦂ ضيف بوت فرعي الأول\n\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
      `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`
    );

  const statusMsg = await m.reply(`⏳ جاري التفاعل بـ ${emoji} من ${subs_.length} حساب...`);

  const results = [];

  for (const bot of subs_) {
    if (bot.socket && typeof bot.socket === 'function' && bot.connected) {
      try {
        const sock = await bot.socket();
        const meta = await sock.newsletterMetadata("invite", channelCode);
        await sock.newsletterReactMessage(meta.id, serverId, emoji);
        results.push({ phone: bot.phone, success: true, channelJid: meta.id, serverId });
      } catch (err) {
        results.push({ phone: bot.phone, success: false, error: err.message });
      }
    } else {
      results.push({ phone: bot.phone, success: false, error: "not connected" });
    }
  }

  const successCount = results.filter(r => r.success).length;
  const failCount = results.length - successCount;

  let report = `*⪩ نتيجة التفاعل: ↯ •*\n`;
  report += `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n`;
  report += `⦑ ➊ ⦒ ⦂ القناة ↜ ⟦ ${channelCode} ⟧\n`;
  report += `⦑ ➋ ⦒ ⦂ الإيموجي ↜ ⟦ ${emoji} ⟧\n`;
  report += `⦑ ➌ ⦒ ⦂ نجح ↜ ⟦ ${successCount} ⟧\n`;
  report += `⦑ ➍ ⦒ ⦂ فشل ↜ ⟦ ${failCount} ⟧\n`;
  report += `⦑ ➎ ⦒ ⦂ الإجمالي ↜ ⟦ ${results.length} ⟧\n\n`;
  report += `*⪩ التفاصيل: ↯ •*\n`;
  report += `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n`;
  for (const r of results)
    report += r.success ? `✅ ${r.phone || r.id}\n` : `❌ ${r.phone || r.id} — ${r.error}\n`;
  report += `\n── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n`;
  report += `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`;

  try {
    await conn.sendMessage(m.chat, { text: report, edit: statusMsg.key });
  } catch {
    await m.reply(report);
  }
};

handler.command = ["رياكت"];
handler.category = "subbots";
handler.usage = ["رياكت رابط_القناة | الإيموجي"];
handler.owner = true;

export default handler;