const handler = async (m, { conn, text, command, cli }) => {
  const filePath = (text || "").trim();

  if (!filePath) {
    try { await m.react("🖤"); } catch {}
    return m.reply(`\u200F🖤: مثال:\n\u200E.${command} test.js\u200F`);
  }

  try { await m.react("⚙️"); } catch {}

  try {
    await cli.plug().remove(filePath);
    
    m.reply(`\u200F🖤: تم حذف وإيقاف الملف بنجاح ↜ ⟦ \u200E${filePath}\u200F ⟧`);
    try { await m.react("🖤"); } catch {}
  } catch (error) {
    try { await m.react("❌"); } catch {}
    m.reply(`\u200F🖤: حصل خطأ أثناء حذف الملف\n\u200E${error.message}`);
  }
};
handler.usage = ["حذف_ملف"]
handler.command = ["حذف_ملف", "delplugin"];
handler.category = "owners";
handler.owner = true;

export default handler;