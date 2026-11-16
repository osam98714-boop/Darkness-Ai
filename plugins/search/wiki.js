import axios from "axios";

const handler = async (m, { conn, text, command, cli }) => {
  const query = (text || "").trim();

  if (!query) {
    try { await m.react("🖤"); } catch {}

    return m.reply(
      `*⪩ طريقة الاستخدام: ↯ •*\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
      `⦑ ➊ ⦒ ⦂ .${command} ↜ ⟦ ابـحـث عـن أي مـعـلـومـة ⟧\n` +
      `⦑ ➋ ⦒ ⦂ مثال ↜ ⟦ .${command} مصر ⟧\n\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
      `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`
    );
  }

  try { await m.react("🔍"); } catch {}

  try {
    const union = await (await import("meowsab")).Api.name("union-v");
    const data = await union.url("/search/wikipedia", { q: query });

    if (!data?.status || !data?.description) {
      try { await m.react("❌"); } catch {}
      return m.reply("🖤: ملقتش معلومات عن البحث ده في ويكيبيديا.");
    }

    const msgText =
      `*⪩ 📚 بـحـث ويـكـيـبـيـديـا ↯ •*\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
      `⦑ 📌 ⦒ ⦂ الـعـنـوان ↜ ⟦ ${data.title || query} ⟧\n\n` +
      `${data.description.trim()}\n\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
      `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`;

    if (data.image) {
      try {
        const imgRes = await axios.get(data.image, {
          responseType: "arraybuffer",
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
          },
        });

        await conn.sendMessage(
          m.chat,
          {
            image: Buffer.from(imgRes.data),
            caption: msgText,
            contextInfo: cli?.config?.info?.channel,
          },
          { quoted: m }
        );

        try { await m.react("🖤"); } catch {}
        return;
      } catch {}
    }

    await conn.sendMessage(
      m.chat,
      {
        text: msgText,
        contextInfo: cli?.config?.info?.channel,
      },
      { quoted: m }
    );

    try { await m.react("🖤"); } catch {}
  } catch (error) {
    try { await m.react("❌"); } catch {}
    m.reply("🖤: حصل خطأ أثناء البحث في ويكيبيديا.");
  }
};
handler.usage = ["ويكيبيديا"]
handler.command = ["ويكيبيديا", "ويكي", "wikipedia", "wiki"];
handler.category = "search";
export default handler;