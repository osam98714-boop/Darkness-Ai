const handler = async (m, { conn, text, command, cli }) => {
  const rawText = text || (m.quoted && m.quoted.text ? m.quoted.text : "");

  if (!rawText.includes(" ")) {
    try { await m.react("🖤"); } catch {}
    return m.reply(
      `\u200F*⪩ طريقة الاستخدام: ↯ •*\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
      `\u200F⦑ ➊ ⦒ ⦂ .${command} مسار_الملف الكود\n` +
      `\u200F⦑ ➋ ⦒ ⦂ أو رد على الكود واكتب ↜ ⟦ .${command} \u200Etest.js\u200F ⟧\n\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
      `\u200E> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`
    );
  }

  try { await m.react("⚙️"); } catch {}

  try {
    const parts = rawText.split(" ");
    const filePath = parts[0];
    const code = parts.slice(1).join(" ").trim();

    await cli.plug().add(filePath, code);
    
    m.reply(`\u200F🖤: تم إضافة وتفعيل الملف بنجاح ↜ ⟦ \u200E${filePath}\u200F ⟧`);
    try { await m.react("🖤"); } catch {}
  } catch (error) {
    try { await m.react("❌"); } catch {}
    m.reply(`\u200F🖤: حصل خطأ أثناء إضافة الملف\n\u200E${error.message}`);
  }
};
handler.usage = ["اضافة_ملف"]
handler.command = ["اضافة_ملف", "addplugin"];
handler.category = "owners";
handler.owner = true;

export default handler;