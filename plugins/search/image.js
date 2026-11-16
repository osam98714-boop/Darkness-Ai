const handler = async (m, { conn, text, command, cli }) => {
  const query = (text || "").trim();

  if (!query) {
    try { await m.react("🖤"); } catch {}
    return m.reply(
      `*⪩ طريقة الاستخدام: ↯ •*\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
      `⦑ ➊ ⦒ ⦂ .${command} ↜ ⟦ ابـحـث عـن أي صـورة ⟧\n` +
      `⦑ ➋ ⦒ ⦂ مثال ↜ ⟦ .${command} ريزي ⟧\n\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
      `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`
    );
  }

  try { await m.react("🔍"); } catch {}

  try {
    const union = await (await import("meowsab")).Api.name("auralix");
    const res = await union.url("/search/pinterest", { q: query });

    if (!res?.data?.status || !res?.data?.data || res.data.data.length === 0) {
      try { await m.react("❌"); } catch {}
      return m.reply("🖤: ملقتش صور للبحث ده.");
    }

    const items = res.data.data.slice(0, 5);

    const cards = items.map((item, index) => {
      let cleanTitle = (item.title || "بدون عنوان").trim();
      if (cleanTitle.length > 30) cleanTitle = cleanTitle.substring(0, 27) + "...";

      return {
        title: cleanTitle,
        body: `نتيجة رقم ${index + 1} لـ: ${query}`,
        footer: `بواسطة: ${item.owner || "غير معروف"}`,
        image: { url: item.url },
        buttons: [
          {
            name: "cta_url",
            params: {
              display_text: "القناة",
              url: "https://whatsapp.com/channel/0029VaQim2bAu3aPsRVaDq3v",
              merchant_url: "https://whatsapp.com/channel/0029VaQim2bAu3aPsRVaDq3v"
            }
          }
        ]
      };
    });

    await conn.buttonCarousel(m.chat, {
      text: `*⪩ 📌 بـحـث صـور ↯ •*\n── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n⦑ 🔍 ⦒ ⦂ نـتـائـج بـحـث ↜ ⟦ ${query} ⟧`,
      footer: "Darkness ⇆ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃",
      cards: cards,
      contextInfo: cli?.config?.info?.channel
    }, { quoted: m });

    try { await m.react("🖤"); } catch {}
  } catch (error) {
    try { await m.react("❌"); } catch {}
    m.reply("🖤: حصل خطأ أثناء البحث عن الصور.");
  }
};
handler.usage = ["صورة"]
handler.command = ["صورة", "صوره", "image", "img"];
handler.category = "search";

export default handler;
