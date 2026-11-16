import axios from "axios";

const handler = async (m, { conn, text, cli }) => {
  const url = (text || "").trim();

  if (!url || !/tiktok\.com|vt\.tiktok/i.test(url)) {
    try { await m.react("❌"); } catch {}
    return m.reply("🖤: ابعت رابط تيك توك صحيح");
  }

  try { await m.react("🔍"); } catch {}

  try {
    const union = await (await import("meowsab")).Api.name("union-v");
    const data = await union.url("/download/tiktok", { url });

    if (!data?.status || !data?.url) {
      try { await m.react("❌"); } catch {}
      return m.reply("🖤: مش لاقي النتيجة في تيك توك");
    }

    let video = null;
    let contentType = "";

    try {
      const videoRes = await axios.get(data.url, {
        responseType: "arraybuffer",
        timeout: 120000,
        maxRedirects: 10,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
          Accept: "video/mp4,video/*;q=0.9,*/*;q=0.8",
          Referer: "https://www.tiktok.com/",
        },
      });

      contentType = videoRes.headers["content-type"] || "";

      if (
        contentType.includes("video") ||
        contentType.includes("octet-stream") ||
        contentType.includes("mp4")
      ) {
        video = Buffer.from(videoRes.data);
      }
    } catch (err) {
      console.error("فشل تحميل فيديو تيك توك:", err.message);
    }

    if (video && video.length > 1024) {
      await conn.sendMessage(
        m.chat,
        {
          video,
          caption: "🖤: تم التحميل من تيك توك",
          mimetype: "video/mp4",
          contextInfo: cli?.config?.info?.channel,
        },
        { quoted: m }
      );
    } else {
      await conn.sendMessage(
        m.chat,
        {
          text: `🖤: الفيديو جاهز على الرابط:\n${data.url}`,
          contextInfo: cli?.config?.info?.channel,
        },
        { quoted: m }
      );
    }

    try { await m.react("🖤"); } catch {}
  } catch (e) {
    console.error("خطأ في تيك توك:", e);
    try { await m.react("❌"); } catch {}
    return m.reply("🖤: حصل خطأ أثناء التحميل");
  }
};
handler.usage = ["تيكتوك"]
handler.command = ["تيك","تيكتوك", "tiktok", "tik"];
handler.category = "downloads";
export default handler;