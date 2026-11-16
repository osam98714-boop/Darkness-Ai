import fs from "fs/promises";

const handler = async (m, { conn, command, cli }) => {
  try {
    await m.react("⚙️");
    
    const cmds = await cli.commands();
    let updatedCount = 0;

    for (const c of cmds) {
      if (!c.category && c.file) {
        const filePath = c.file;
        const parts = filePath.replace(/\\/g, "/").split("/");
        const pluginsIndex = parts.indexOf("plugins");
        
        let catName = "other";
        
        if (pluginsIndex !== -1 && parts.length > pluginsIndex + 2) {
          catName = parts[pluginsIndex + 1].trim().toLowerCase();
        } else {
          catName = parts[parts.length - 1].replace(".js", "");
        }

        try {
          let content = await fs.readFile(filePath, "utf-8");
          
          if (!content.includes(".category =") && !content.includes("category:")) {
            const varMatch = content.match(/export\s+default\s+([A-Za-z0-9_$]+)\s*;?/);

            if (varMatch && varMatch[1] !== "function" && varMatch[1] !== "async") {
              const varName = varMatch[1];
              content = content.replace(
                varMatch[0],
                `${varName}.category = "${catName}";\n${varMatch[0]}`
              );
            } else if (content.match(/export\s+default\s*\{/)) {
              content = content.replace(
                /export\s+default\s*\{/,
                `export default {\n  category: "${catName}",`
              );
            } else {
              continue;
            }
            
            await fs.writeFile(filePath, content, "utf-8");
            updatedCount++;
            
            c.category = catName;
          }
        } catch (err) {}
      }
    }

    if (updatedCount === 0) {
      try { await m.react("🖤"); } catch {}
      return m.reply("🖤: كل الأوامر متصنفة وجاهزة، مفيش حاجة محتاجة تتصنف.");
    }

    try { await m.react("🖤"); } catch {}
    m.reply(
      `\u200F*⪩ ⚙️ تـصـنـيـف الأوامـر ↯ •*\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
      `\u200F⦑ 📌 ⦒ ⦂ تـم تـصـنـيـف ↜ ⟦ \u200E${updatedCount}\u200F أمـر بنجاح ⟧\n` +
      `\u200F⦑ ⚠️ ⦒ ⦂ يرجى عمل ↜ ⟦ .ريستارت ⟧ لتحديث القائمة\n\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
      `\u200E> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`
    );

  } catch (error) {
    try { await m.react("❌"); } catch {}
    m.reply(`\u200F🖤: حصل خطأ أثناء التصنيف\n\u200E${error.message}`);
  }
};
handler.usage = ["تصنيف"]
handler.command = ["تصنيف"];
handler.category = "owners";
handler.owner = true;

export default handler;