const clean = (j) =>
  typeof j === "string" ? j.replace(/:\d+(?=@)/, "").trim() : "";

const isValidId = (v) => typeof v === "string" && v.includes("@") && v.length > 5;

const resolveIds = async (m, conn, raw) => {
  const all = new Set();
  if (isValidId(raw)) {
    all.add(raw);
    all.add(clean(raw));
  }

  try {
    const jid = typeof m.lid2jid === "function" ? m.lid2jid(raw) : null;
    if (isValidId(jid)) {
      all.add(jid);
      all.add(clean(jid));
    }
  } catch {}

  let key = clean(raw);

  try {
    const meta = await conn.groupMetadata(m.chat);
    const p = meta.participants.find((x) =>
      [x.id, x.lid, x.jid]
        .filter(isValidId)
        .some((v) => all.has(clean(v)))
    );

    if (p) {
      for (const v of [p.id, p.lid, p.jid]) {
        if (isValidId(v)) {
          all.add(v);
          all.add(clean(v));
        }
      }
      if (isValidId(p.jid)) key = clean(p.jid);
      else if (isValidId(p.id)) key = clean(p.id);
    }
  } catch {}

  const validList = [...all].filter(isValidId);
  return { key, all: validList };
};

const handler = async (m, { conn, cli, command, args }) => {
  global.db.marriages ??= {};
  const marriages = global.db.marriages;

  const { key: sender, all: senderIds } = await resolveIds(m, conn, m.sender);

 
  if (command === "طلاق") {
    const entry = Object.entries(marriages).find(
      ([k, pair]) =>
        Array.isArray(pair) &&
        pair.length === 2 &&
        (senderIds.includes(clean(k)) ||
          senderIds.includes(clean(pair[0])) ||
          senderIds.includes(clean(pair[1])))
    );

    if (!entry) {
      await conn.sendMessage(
        m.chat,
        {
          text: "🖤: أنت غير متزوج أصلاً عشان تطلق.",
          contextInfo: cli?.config?.info?.channel,
        },
        { quoted: m },
      );
      return;
    }

    const [husbandKey, pair] = entry;
    const isFirstSender = senderIds.includes(clean(pair[0]));
    const partner = isFirstSender ? pair[1] : pair[0];

    delete marriages[husbandKey];
    if (typeof global.saveDB === "function") global.saveDB();

    await conn.sendMessage(
      m.chat,
      {
        text:
          `*⪩ 💔 تم الطلاق رسمياً ↯ •*\n` +
          `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
          `⦑ 🤵 ⦒ ⦂ الطرف الأول ↜ ⟦ @${sender.split("@")[0].split(":")[0]} ⟧\n` +
          `⦑ 👰 ⦒ ⦂ الطرف الثاني ↜ ⟦ @${partner.split("@")[0].split(":")[0]} ⟧\n\n` +
          `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
          `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`,
        mentions: [sender, partner],
        contextInfo: cli?.config?.info?.channel,
      },
      { quoted: m },
    );
    return;
  }

  // أمر الزواج
  let rawTarget = m.quoted?.sender || m.mentionedJid?.[0] || null;

  if (!rawTarget && args?.length > 0) {
    const number = args[0].replace(/\D/g, "");
    if (number.length >= 7) {
      rawTarget = number + "@s.whatsapp.net";
    }
  }

  if (!rawTarget) {
    await conn.sendMessage(
      m.chat,
      {
        text: "🖤: يرجى الرد على رسالة شخص أو منشنه أو كتابة رقمه بعد الأمر.",
        contextInfo: cli?.config?.info?.channel,
      },
      { quoted: m },
    );
    return;
  }

  const { key: target, all: targetIds } = await resolveIds(m, conn, rawTarget);

  if (
    !target ||
    target === sender ||
    senderIds.includes(target) ||
    targetIds.some((id) => senderIds.includes(id))
  ) {
    await conn.sendMessage(
      m.chat,
      {
        text: "🖤: لا يمكنك الزواج من نفسك.",
        contextInfo: cli?.config?.info?.channel,
      },
      { quoted: m },
    );
    return;
  }

 
  const senderMarriage = Object.values(marriages).find(
    (pair) =>
      Array.isArray(pair) &&
      pair.length === 2 &&
      (senderIds.includes(clean(pair[0])) || senderIds.includes(clean(pair[1])))
  );

  if (senderMarriage) {
    const senderPartner = senderIds.includes(clean(senderMarriage[0]))
      ? senderMarriage[1]
      : senderMarriage[0];

    await conn.sendMessage(
      m.chat,
      {
        text:
          `*⪩ 💔 لا يمكن إتمام الزواج ↯ •*\n` +
          `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
          `⦑ ⚠️ ⦒ ⦂ أنت متزوج بالفعل!\n` +
          `⦑ 💍 ⦒ ⦂ [@${sender.split("@")[0].split(":")[0]}] متزوج بـ [@${senderPartner.split("@")[0].split(":")[0]}]\n` +
          `_↳ الرجاء الطلاق أولاً عبر كتابة .طلاق_\n\n` +
          `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
          `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`,
        mentions: [sender, senderPartner],
        contextInfo: cli?.config?.info?.channel,
      },
      { quoted: m },
    );
    return;
  }

 
  const targetMarriage = Object.values(marriages).find(
    (pair) =>
      Array.isArray(pair) &&
      pair.length === 2 &&
      (targetIds.includes(clean(pair[0])) || targetIds.includes(clean(pair[1])))
  );

  if (targetMarriage) {
    const targetPartner = targetIds.includes(clean(targetMarriage[0]))
      ? targetMarriage[1]
      : targetMarriage[0];

    await conn.sendMessage(
      m.chat,
      {
        text:
          `*⪩ 💔 لا يمكن إتمام الزواج ↯ •*\n` +
          `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
          `⦑ ⚠️ ⦒ ⦂ الشخص الذي اخترته متزوج بالفعل!\n` +
          `⦑ 💍 ⦒ ⦂ [@${target.split("@")[0].split(":")[0]}] متزوج بـ [@${targetPartner.split("@")[0].split(":")[0]}]\n` +
          `_↳ الرجاء الطلاق أولاً عبر كتابة .طلاق_\n\n` +
          `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
          `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`,
        mentions: [target, targetPartner],
        contextInfo: cli?.config?.info?.channel,
      },
      { quoted: m },
    );
    return;
  }

 
  marriages[sender] = [sender, target];
  if (typeof global.saveDB === "function") global.saveDB();

  
  await conn.sendMessage(
    m.chat,
    {
      text:
        `*⪩ 💞🌟 ✨ مبروك الزواج ✨ 🌟💞 ↯ •*\n` +
        `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
        `⦑ 👰 ⦒ ⦂ الزوجة ↜ ⟦ @${target.split("@")[0].split(":")[0]} ⟧\n` +
        `⦑ 🤵 ⦒ ⦂ الزوج ↜ ⟦ @${sender.split("@")[0].split(":")[0]} ⟧\n\n` +
        `❤️ *نتمنى لكم حياة مليئة بالحب والسعادة والوفاق.* ❤️\n\n` +
        `🌹 *بارك الله لكما وبارك عليكما وجمع بينكما في خير.* 🌹\n\n` +
        `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
        `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`,
      mentions: [sender, target],
      contextInfo: cli?.config?.info?.channel,
    },
    { quoted: m },
  );
};

handler.usage = ["زواج", "طلاق"];
handler.command = ["زواج", "طلاق"];
handler.category = "games";
export default handler;
