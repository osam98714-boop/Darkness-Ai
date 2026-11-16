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

const demote = async (m, { conn }) => {
  const target = m.quoted?.sender || m.mentionedJid?.[0];
  if (!target) {
    m.reply("🖤: رد علي رسالته او منشنه الاول بلاش عبط");
    return;
  } else {
    const { key } = await resolveIds(m, conn, target);
    const user = key;
    await m.demote(user);
    m.reply("🖤: تم نفذت الطلب لك يا شيخ شلت اشرافه الحين");
  }
};

demote.usage = ["خفض"];
demote.command = ["خفض", "demote"];
demote.category = "admins";
demote.admin = true;
demote.botAdmin = true;

export default demote;
