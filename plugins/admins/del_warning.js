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

const handler = async (m, { conn, cli, command }) => {
  global.db ??= {};
  global.db.groups ??= {};
  global.db.groups[m.chat] ??= {};
  global.db.groups[m.chat].warning ??= {};

  const warn = global.db.groups[m.chat].warning;
  const target = m.quoted?.sender || m.mentionedJid?.[0];

  if (!target) {
    try { await m.react("🖤"); } catch {}
    return conn.sendMessage(
      m.chat,
      {
        text:
          `\u200F*⪩ طريقة الاستخدام: ↯ •*\n` +
          `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
          `\u200F⦑ ➊ ⦒ ⦂ رد على رسالة العضو أو منشنه\n` +
          `\u200F⦑ ➋ ⦒ ⦂ .${command} @العضو ↜ ⟦ تصفير جميع الإنذارات ⟧\n\n` +
          `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
          `\u200E> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ by : 𝐋𝐋𝐎𝐘𝐃 ╷`,
        contextInfo: cli?.config?.info?.channel,
      },
      { quoted: m }
    );
  }

  try { await m.react("⚙️"); } catch {}

  const ids = await resolveIds(m, conn, target);
  const currentCount = Math.max(0, ...ids.map((id) => warn[id] ?? 0));

  if (currentCount <= 0) {
    try { await m.react("🖤"); } catch {}
    return conn.sendMessage(
      m.chat,
      {
        text: `🖤: العضو @${target.split("@")[0].split(":")[0]} معندوش أي إنذارات أصلاً.`,
        mentions: [target],
        contextInfo: cli?.config?.info?.channel,
      },
      { quoted: m }
    );
  }

  for (const id of ids) {
    delete warn[id];
  }

  if (global.saveDB) global.saveDB();

  try { await m.react("🖤"); } catch {}
  await conn.sendMessage(
    m.chat,
    {
      text:
        `*⪩ ✅ تصفير الإنذارات ↯ •*\n` +
        `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
        `⦑ 👤 ⦒ ⦂ @${target.split("@")[0].split(":")[0]}\n` +
        `⦑ 📊 ⦒ ⦂ الإنذارات الآن ↜ ⟦ 0 من 3 ⟧\n\n` +
        `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
        `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ by : 𝐋𝐋𝐎𝐘𝐃 ╷`,
      mentions: [target],
      contextInfo: cli?.config?.info?.channel,
    },
    { quoted: m }
  );
};

handler.usage = ["ازالة_انذار"];
handler.useg = ["ازالة_انذار"];
handler.command = ["ازالة_انذار", "حذف_انذار", "تصفير_انذارات", "unwarn", "delwarn"];
handler.category = "admins";
handler.group = true;
handler.admin = true;

export default handler;