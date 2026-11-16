const toimg = async (m, { conn, command }) => {
  try {
    if (!m.quoted)
      return m.reply(
        `*⪩ لازم ترد على استيكر: ↯ •*\n` +
        `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
        `⦑ ➊ ⦒ ⦂ .${command} ↜ ⟦ رد على استيكر ⟧\n` +
        `⦑ ➋ ⦒ ⦂ مثال ↜ ⟦ .${command} (بالرد على استيكر) ⟧\n\n` +
        `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
        `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`
      );

    const buffer = await m.quoted.download();

    await conn.sendMessage(m.chat, {
      image: buffer,
      caption:
        `*⪩ تم التحويل بنجاح: ↯ •*\n` +
        `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
        `⦑ ➊ ⦒ ⦂ النوع ↜ ⟦ استيكر ← صورة ⟧\n\n` +
        `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
        `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`
    }, { quoted: m });
  } catch (e) {
    await conn.sendMessage(m.chat, {
      text:
        `*⪩ حصل خطأ: ↯ •*\n` +
        `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
        `⦑ ➊ ⦒ ⦂ ${e.message}\n\n` +
        `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
        `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`
    }, { quoted: m });
  }
};

toimg.usage = ["لصوره"];
toimg.category = "tools";
toimg.command = ["لصوره", "toimage", "toimg"];
export default toimg;