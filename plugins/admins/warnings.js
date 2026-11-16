const clean = (j) =>
  typeof j === "string" ? j.replace(/:\d+(?=@)/, "") : j;

const resolveIds = async (m, conn, raw) => {
  const all = new Set([raw, clean(raw)]);

  try {
    const jid = typeof m.lid2jid === "function" ? m.lid2jid(raw) : null;
    if (jid) {
      all.add(jid);
      all.add(clean(jid));
    }
  } catch {}

  try {
    const meta = await conn.groupMetadata(m.chat);
    const p = meta.participants.find((x) =>
      [x.id, x.lid, x.jid, x.phoneNumber].some((v) => v && all.has(clean(v)))
    );

    if (p) {
      for (const v of [p.id, p.lid, p.jid, p.phoneNumber]) {
        if (v) {
          all.add(v);
          all.add(clean(v));
        }
      }
    }
  } catch {}

  return [...all];
};

const handler = async (m, { conn, cli }) => {
  const user = m.quoted?.sender || m.mentionedJid?.[0] || m.sender;
  const warn = global.db?.groups?.[m.chat]?.warning || {};
  const ids = await resolveIds(m, conn, user);
  const count = Math.max(0, ...ids.map((id) => warn[id] ?? 0));
  const isSelf = user === m.sender;

  await conn.sendMessage(
    m.chat,
    {
      text:
        `*⪩ 📊 ${isSelf ? "إنذاراتك" : "إنذارات العضو"} ↯ •*\n` +
        `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
        `⦑ 👤 ⦒ ⦂ @${user.split("@")[0].split(":")[0]}\n` +
        `⦑ ⚠️ ⦒ ⦂ عدد الإنذارات ↜ ⟦ ${count} من 3 ⟧\n\n` +
        `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
        `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`,
      mentions: [user],
      contextInfo: cli.config.info.channel,
    },
    { quoted: m },
  );
};

handler.command = ["انذاراتي", "انذارات", "warns"];
handler.usage = ["انذاراتي"];
handler.group = true;

handler.category = "admins";
export default handler;
