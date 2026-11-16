const handler = async (m, { cli, text }) => {
  const sub = globalThis.subBots;

  if (!sub || typeof sub.list !== 'function')
    return m.reply(
      `*⪩ نظام البوتات الفرعية غير متاح: ↯ •*\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
      `⦑ ➊ ⦒ ⦂ تأكد إن البوتات الفرعية متصلة\n\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
      `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`
    );

  if (!text || !text.trim())
    return m.reply(
      `*⪩ طريقة الاستخدام: ↯ •*\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
      `⦑ ➊ ⦒ ⦂ .${handler.command[0]} ↜ ⟦ الرقم ⟧\n` +
      `⦑ ➋ ⦒ ⦂ .${handler.command[0]} ↜ ⟦ all ⟧\n` +
      `⦑ ➌ ⦒ ⦂ مثال ↜ ⟦ .${handler.command[0]} 201012345678 ⟧\n\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
      `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`
    );

  const target = text.trim();
  const list = await sub.list();

  if (!list.length)
    return m.reply(
      `*⪩ مفيش بوتات فرعية: ↯ •*\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
      `⦑ ➊ ⦒ ⦂ ضيف بوت فرعي الأول\n\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
      `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`
    );

  if (target.toLowerCase() === 'all') {
    let deleted = 0;

    for (const bot of list) {
      try {
        await sub.remove(bot.phone);
        deleted++;
      } catch (e) {
        console.error(`فشل حذف البوت ${bot.phone}:`, e);
      }
    }

    return m.reply(
      `*⪩ نتيجة الحذف: ↯ •*\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
      `⦑ ➊ ⦒ ⦂ تم حذف ↜ ⟦ ${deleted} ⟧\n` +
      `⦑ ➋ ⦒ ⦂ من أصل ↜ ⟦ ${list.length} ⟧\n\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
      `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`
    );
  }

  const bot = list.find(bot => bot.phone === target);

  if (!bot)
    return m.reply(
      `*⪩ مفيش بوت فرعي بالرقم ده: ↯ •*\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
      `⦑ ➊ ⦒ ⦂ تأكد من الرقم ↜ ⟦ ${target} ⟧\n\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
      `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`
    );

  await sub.remove(target);

  return m.reply(
    `*⪩ تم الحذف بنجاح: ↯ •*\n` +
    `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
    `⦑ ➊ ⦒ ⦂ الاسم ↜ ⟦ ${bot.name || "بدون اسم"} ⟧\n` +
    `⦑ ➋ ⦒ ⦂ الرقم ↜ ⟦ ${bot.phone} ⟧\n\n` +
    `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
    `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`
  );
};

handler.command = ['فرعي_حذف'];
handler.owner = true;
handler.category = "subbots";
export default handler;