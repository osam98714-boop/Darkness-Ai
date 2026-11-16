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

const mute = async (m, { conn, cli, command }) => {
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

  const { key, all } = await resolveIds(m, conn, target);
  const user = key;

  global.db.groups ??= {};
  global.db.groups[m.chat] ??= {};
  global.db.groups[m.chat].mute ??= {};

  if (command === "كتم") {
    global.db.groups[m.chat].mute[user] = true;
    global.saveDB();

    await conn.sendMessage(
      m.chat,
      { text: "🖤: خلاص كذا تم كتمه يا شيخ", contextInfo: cli.config.info.channel },
      { quoted: m },
    );
  } else if (command === "فك_كتم") {
    for (const id of all) delete global.db.groups[m.chat].mute[id];
    delete global.db.groups[m.chat].mute[user];
    global.saveDB();

    await conn.sendMessage(
      m.chat,
      {
        text: "🖤: خلاص كذا تم فك كتمه يالشيخ",
        contextInfo: cli.config.info.channel,
      },
      { quoted: m },
    );
    
  }
};


mute.usage = ["كتم", "فك_كتم"];
mute.command = ["كتم", "mute", "فك_كتم", "unmute"];
mute.admin = true;
mute.botAdmin = true;

mute.category = "admins";
export default mute;