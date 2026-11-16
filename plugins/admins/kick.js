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

  let key = clean(raw);

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
      key = clean(p.id || key);
    }
  } catch {}

  return { key, all: [...all] };
};

const kick = async (m, { conn, cli }) => {
  const target = m.quoted?.sender || m.mentionedJid?.[0];

  if (!target) {
    await conn.sendMessage(
      m.chat,
      {
        text: "🖤: رد على الرساله او منشنه الاول بلاش عبط",
        contextInfo: cli.config.info.channel,
      },
      { quoted: m },
    );
    return;
  }

  const { key } = await resolveIds(m, conn, target);
  const id = key;

  await m.kick(id);
  await conn.sendMessage(
    m.chat,
    { text: "🖤: تم يالشيخ طردته لك", contextInfo: cli.config.info.channel },
    { quoted: m },
  );

  if (m.quoted) {
    m.quoted.delete();
    m.delete();
  }
};

kick.usage = ["طرد"];
kick.category = "admins";
kick.command = ["طرد", "kick"];
kick.admin = true;
kick.botAdmin = true;
export default kick;