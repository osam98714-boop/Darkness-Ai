const toGif = async (m, { conn, command }) => {
  try {
    if (!m.quoted)
      return m.reply(
        `*⪩ لازم ترد على فيديو: ↯ •*\n` +
        `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
        `⦑ ➊ ⦒ ⦂ .${command} ↜ ⟦ رد على فيديو ⟧\n` +
        `⦑ ➋ ⦒ ⦂ مثال ↜ ⟦ .${command} (بالرد على فيديو) ⟧\n\n` +
        `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
        `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`
      );

    const buffer = await m.quoted.download();

    await conn.sendMessage(m.chat, {
      video: buffer,
      gifPlayback: true,
      caption:
        `*⪩ تم التحويل بنجاح: ↯ •*\n` +
        `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
        `⦑ ➊ ⦒ ⦂ النوع ↜ ⟦ فيديو ← جيف ⟧\n\n` +
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

toGif.usage = ["لجيف"];
toGif.category = "tools";
toGif.command = ["لجيف", "togif", "لچيف"];
export default toGif;