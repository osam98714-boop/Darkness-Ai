import axios from "axios";

const handler = async (m, { conn, text, cli }) => {
  const url = (text || "").trim();

  if (!url || !/instagram\.com|instagr\.am/i.test(url)) {
    try { await m.react("❌"); } catch {}
    return m.reply("🖤: ابعت رابط انستجرام صحيح");
  }

  try { await m.react("🔍"); } catch {}

  try {
    const union = await (await import("meowsab")).Api.name("union-v");
    const data = await union.url("/download/instagram", { url });

    if (!data?.status || !data?.url) {
      try { await m.react("❌"); } catch {}
      return m.reply("🖤: مش لاقي النتيجة في انستجرام");
    }

    const mediaRes = await axios.get(data.url, {
      responseType: "arraybuffer",
      timeout: 120000,
    });
    const media = Buffer.from(mediaRes.data);

    await conn.sendMessage(
      m.chat,
      {
        video: media,
        caption: "🖤: تم التحميل من انستجرام",
        mimetype: "video/mp4",
        contextInfo: cli?.config?.info?.channel,
      },
      { quoted: m }
    );

    try { await m.react("🖤"); } catch {}
  } catch (e) {
    console.error("خطأ في انستجرام:", e);
    try { await m.react("❌"); } catch {}
    return m.reply("🖤: حصل خطأ أثناء التحميل");
  }
};
handler.usage = ["انستجرام"]
handler.command = ["انستا", "انستجرام", "instagram", "ig"];
handler.category = "downloads";
export default handler;