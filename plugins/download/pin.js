import axios from "axios";

const handler = async (m, { conn, text, cli }) => {
  const url = (text || "").trim();

  if (!url || !/pinterest\.com|pin\.it/i.test(url)) {
    try { await m.react("❌"); } catch {}
    return m.reply("🖤: ابعت رابط بنترست صحيح");
  }

  try { await m.react("🔍"); } catch {}

  try {
    const union = await (await import("meowsab")).Api.name("union-v");
    const data = await union.url("/download/pinterest", { url });

    if (!data?.status || !data?.media?.length) {
      try { await m.react("❌"); } catch {}
      return m.reply("🖤: مش لاقي النتيجة في بنترست");
    }

    for (const item of data.media) {
      try {
        const r = await axios.get(item.url, {
          responseType: "arraybuffer",
          timeout: 120000,
        });
        const buf = Buffer.from(r.data);

        if (item.type === "image") {
          await conn.sendMessage(
            m.chat,
            { image: buf, contextInfo: cli?.config?.info?.channel },
            { quoted: m }
          );
        } else if (item.type === "video") {
          await conn.sendMessage(
            m.chat,
            {
              video: buf,
              mimetype: "video/mp4",
              contextInfo: cli?.config?.info?.channel,
            },
            { quoted: m }
          );
        }
      } catch (err) {
        console.error("خطأ في عنصر بنترست:", err);
      }
    }

    try { await m.react("🖤"); } catch {}
  } catch (e) {
    console.error("خطأ في بنترست:", e);
    try { await m.react("❌"); } catch {}
    return m.reply("🖤: حصل خطأ أثناء التحميل");
  }
};
handler.usage = ["بينترست"]
handler.command = ["بنتر","بنترست", "pinterest", "pin"];
handler.category = "downloads";
export default handler;