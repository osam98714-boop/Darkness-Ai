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

const handler = async (m, { conn, cli }) => {
  const target = m.quoted?.sender || m.mentionedJid?.[0];

  if (!target)
    return m.reply("🖤: يرجى منشن الشخص أو الرد على رسالته");

  global.db.groups ??= {};
  global.db.groups[m.chat] ??= {};
  global.db.groups[m.chat].warning ??= {};

  const warn = global.db.groups[m.chat].warning;
  const { key, all } = await resolveIds(m, conn, target);
  const user = key;

  const old = Math.max(0, ...all.map((id) => warn[id] ?? 0));
  for (const id of all) delete warn[id];
  warn[user] = old + 1;

  global.saveDB();

  await conn.sendMessage(
    m.chat,
    {
      text:
        `*⪩ تم إعطاء إنذار ↯ •*\n` +
        `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
        `⦑ 👤 ⦒ ⦂ @${user.split("@")[0].split(":")[0]}\n` +
        `⦑ 📊 ⦒ ⦂ عدد الإنذارات ↜ ⟦ ${warn[user]} ⟧\n\n` +
        `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
        `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`,
      mentions: [user],
      contextInfo: cli.config.info.channel,
    },
    { quoted: m },
  );

  if (warn[user] < 3) return;

  await conn.sendMessage(
    m.chat,
    {
      text: `🖤: @${user.split("@")[0].split(":")[0]} انت خالفت القوانين، دلوقتي هنطردك`,
      mentions: [user],
      contextInfo: cli.config.info.channel,
    },
    { quoted: m },
  );

  try {
    await conn.groupParticipantsUpdate(m.chat, [user], "remove");
    delete warn[user];
    global.saveDB();
  } catch (e) {
    console.error("فشل طرد العضو:", e);
  }
};

handler.command = ["انذار", "تحذير", "warn"];
handler.usage = ["انذار"];
handler.category = "admins";
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
