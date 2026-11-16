import axios from "axios";

const handler = async (m, { conn, text, cli }) => {
  const url = (text || "").trim();

  if (!url || !/facebook\.com|fb\.watch|fb\.com/i.test(url)) {
    try { await m.react("❌"); } catch {}
    return m.reply("🖤: ابعت رابط فيسبوك صحيح");
  }

  try { await m.react("🔍"); } catch {}

  try {
    const union = await (await import("meowsab")).Api.name("union-v");
    const data = await union.url("/downloader/facebook", { url });

    if (!data?.status || !data?.downloads?.length) {
      try { await m.react("❌"); } catch {}
      return m.reply("🖤: مش لاقي النتيجة في فيسبوك");
    }

    const best = data.downloads[0];
    const videoRes = await axios.get(best.url, {
      responseType: "arraybuffer",
      timeout: 120000,
    });
    const video = Buffer.from(videoRes.data);

    const caption =
      `*⪩ تـحـمـيـل فـيـسـبـوك ↯ •*\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
      `⦑ 🎬 ⦒ ⦂ العنوان ↜ ⟦ ${data.title || "Facebook Video"} ⟧\n` +
      `⦑ ⏱️ ⦒ ⦂ المدة ↜ ⟦ ${data.duration || "?"} ⟧\n` +
      `⦑ 🎞️ ⦒ ⦂ الجودة ↜ ⟦ ${best.quality} ⟧\n\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
      `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`;

    await conn.sendMessage(
      m.chat,
      {
        video,
        caption,
        mimetype: "video/mp4",
        contextInfo: cli?.config?.info?.channel,
      },
      { quoted: m }
    );

    try { await m.react("🖤"); } catch {}
  } catch (e) {
    console.error("خطأ في فيسبوك:", e);
    try { await m.react("❌"); } catch {}
    return m.reply("🖤: حصل خطأ أثناء التحميل");
  }
};
handler.usage = ["فيسبوك"]
handler.command = ["فيسبوك", "facebook", "fb","فيس"];
handler.category = "downloads";
export default handler;