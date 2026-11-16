import axios from "axios";

const handler = async (m, { conn, text, cli }) => {
  const url = (text || "").trim();

  if (!url || !/spotify\.com|spoti\.fi/i.test(url)) {
    try { await m.react("❌"); } catch {}
    return m.reply("🖤: ابعت رابط سبوتي فاي صحيح\nمثال: .سبوتي https://open.spotify.com/track/...");
  }

  try { await m.react("🔍"); } catch {}

  try {
    const union = await (await import("meowsab")).Api.name("union-v");
    const data = await union.url("/download/Spotify", { url });

    if (!data?.status || !data?.url) {
      try { await m.react("❌"); } catch {}
      return m.reply("🖤: مش لاقي النتيجة في سبوتي فاي");
    }

    const audioRes = await axios.get(data.url, { responseType: "arraybuffer" });
    const audio = Buffer.from(audioRes.data);

    let image;
    if (data.image) {
      try {
        const imgRes = await axios.get(data.image, { responseType: "arraybuffer" });
        image = Buffer.from(imgRes.data);
      } catch {}
    }

    const caption =
      `*⪩ تـحـمـيـل سـبـوتـي فـاي ↯ •*\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
      `⦑ 🎵 ⦒ ⦂ الاسم ↜ ⟦ ${data.name} ⟧\n` +
      `⦑ 🎤 ⦒ ⦂ الفنان ↜ ⟦ ${data.artist} ⟧\n` +
      `⦑ ⏱️ ⦒ ⦂ المدة ↜ ⟦ ${data.duration} ⟧\n\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
      `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`;

    if (image) {
      await conn.sendMessage(
        m.chat,
        { image, caption, contextInfo: cli?.config?.info?.channel },
        { quoted: m }
      );
    } else {
      await conn.sendMessage(
        m.chat,
        { text: caption, contextInfo: cli?.config?.info?.channel },
        { quoted: m }
      );
    }

    await conn.sendMessage(
      m.chat,
      {
        audio,
        mimetype: "audio/mpeg",
        contextInfo: cli?.config?.info?.channel,
      },
      { quoted: m }
    );

    try { await m.react("🖤"); } catch {}
  } catch (e) {
    console.error("خطأ في سبوتي فاي:", e);
    try { await m.react("❌"); } catch {}
    return m.reply("🖤: حصل خطأ أثناء التحميل");
  }
};
handler.usage = ["سبوتيفاي"]
handler.command = ["سبوتي", "spotify"];
handler.category = "downloads";
export default handler;