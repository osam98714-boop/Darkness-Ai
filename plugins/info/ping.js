const handler = async (m, { conn, cli }) => {
  const start = process.hrtime.bigint();
  await conn.sendMessage(m.chat, { text: "🏓 msg test" });
  const end = process.hrtime.bigint();
  const ping = Number(end - start) / 1e6;

  const msg =
    `*⪩ سـرعـة الـبـوت ↯ •*\n` +
    `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
    `⦑ ⚡ ⦒ ⦂ الاسـتـجـابـة ↜ ⟦ ${ping.toFixed(2)}ms ⟧\n\n` +
    `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
    `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`;

  await conn.linkPreview(
    m.chat,
    {
      text: msg,
      url: "https://i.ibb.co/1tqtGjTs/0f66403b55e38f7d0614e1c7f6b9b94c.jpg",
      height: 438,
      width: 734,
      title:
        "𝐃 𝐀 𝐑 𝐊 — 𝐋𝐋𝐎𝐘𝐃 🖤 | 𝐁𝐨𝐭 𝐢𝐬 𝐛𝐮𝐢𝐥𝐭 𝐨𝐧 𝐭𝐡𝐞 𝐌𝐄𝐎𝐖𝐒𝐀𝐁 𝐅𝐫𝐚𝐦𝐞𝐰𝐨𝐫𝐤",
      description: "𝚃𝚎𝚜𝚝𝚒𝚗𝚐 𝚝𝚑𝚎 𝚋𝚘𝚝'𝚜 𝚜𝚙𝚎𝚎𝚍: 𝙸𝚜 𝚒𝚝 𝚏𝚊𝚜𝚝 𝚘𝚛 𝚗𝚘𝚝?",
      contextInfo: cli?.config?.info?.channel,
    },
    { quoted: m }
  );
};

handler.command = ["بنج", "ping"];
handler.category = "info";
handler.usage = ["بنج"];
export default handler;