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

  if (!m.quoted)
    return m.reply(
      `*⪩ لازم ترد على رسالة عايز تبعتها: ↯ •*\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
      `⦑ ➊ ⦒ ⦂ .${command} ↜ ⟦ رد على أي رسالة ⟧\n\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
      `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`
    );

  const subs_ = await sub.list();
  if (!subs_.length)
    return m.reply(
      `*⪩ مفيش حسابات متصلة: ↯ •*\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
      `⦑ ➊ ⦒ ⦂ ضيف بوت فرعي الأول\n\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
      `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`
    );

  const statusMsg = await m.reply(`⏳ جاري الإرسال من ${subs_.length} بوت...`);

  const results = [];
  const delay = (ms) => new Promise(r => setTimeout(r, ms));

  for (const bot of subs_) {
    if (!bot.socket || typeof bot.socket !== 'function' || !bot.connected) {
      results.push({ phone: bot.phone || bot.id, success: false, sent: 0, error: "not connected" });
      continue;
    }

    let sent = 0;
    let failed = 0;

    try {
      const sock = await bot.socket();
      const groups = await sock.groupFetchAllParticipating();

      for (const group of Object.values(groups)) {
        if (group.announce) continue;

        try {
          await sock.sendMessage(group.id, {
            forward: m.quoted,
            forceForward: true
          });
          sent++;
        } catch {
          failed++;
        }

        await delay(1500);
      }

      results.push({ phone: bot.phone || bot.id, success: true, sent, failed });
    } catch (err) {
      results.push({ phone: bot.phone || bot.id, success: false, sent, error: err.message });
    }

    await delay(3000);
  }

  const totalSent = results.reduce((a, r) => a + (r.sent || 0), 0);
  const totalFailed = results.reduce((a, r) => a + (r.failed || 0), 0);
  const okBots = results.filter(r => r.success).length;
  const failBots = results.length - okBots;

  let report = `*⪩ نتيجة الإذاعة: ↯ •*\n`;
  report += `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n`;
  report += `⦑ ➊ ⦒ ⦂ بوتات نجحت ↜ ⟦ ${okBots} ⟧\n`;
  report += `⦑ ➋ ⦒ ⦂ بوتات فشلت ↜ ⟦ ${failBots} ⟧\n`;
  report += `⦑ ➌ ⦒ ⦂ رسائل مرسلة ↜ ⟦ ${totalSent} ⟧\n`;
  report += `⦑ ➍ ⦒ ⦂ رسائل فشلت ↜ ⟦ ${totalFailed} ⟧\n\n`;
  report += `*⪩ التفاصيل: ↯ •*\n`;
  report += `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n`;
  for (const r of results)
    report += r.success
      ? `✅ ${r.phone} — ${r.sent} مرسلة / ${r.failed} فشلت\n`
      : `❌ ${r.phone} — ${r.error}\n`;
  report += `\n── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n`;
  report += `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`;

  try {
    await conn.sendMessage(m.chat, { text: report, edit: statusMsg.key });
  } catch {
    await m.reply(report);
  }
};

handler.command = ["اذاعه"];
handler.category = "subbots";
handler.usage = ["اذاعه (بالرد على رسالة)"];
handler.owner = true;

export default handler;