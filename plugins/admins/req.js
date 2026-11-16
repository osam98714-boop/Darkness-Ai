const req = async (m, { conn, command, text, cli }) => {
  const arg = (text || "").trim().toLowerCase();
  const res = await conn.groupRequestParticipantsList(m.chat);

  if (command === "ريكوستات") {
    if (!res.length) {
      await conn.sendMessage(
        m.chat,
        { text: "🖤: مفيش ريكوستات حاليا", contextInfo: cli.config.info.channel },
        { quoted: m },
      );
      return;
    }

    const list = res
      .map((user, i) => `⦑ ${i + 1} ⦒ ⦂ @${user.jid.split("@")[0]} ↜ ⟦ ${user.username || user.phone_number || user.jid.split("@")[0]} ⟧`)
      .join("\n");

    await conn.sendMessage(
      m.chat,
      {
        text:
          `*⪩ قـائـمـة الـريـكـوسـتـات ↯ •*\n` +
          `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
          `${list}\n\n` +
          `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
          `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`,
        mentions: res.map((u) => u.jid),
        contextInfo: cli.config.info.channel,
      },
      { quoted: m },
    );
  } else if (
    command === "قبول_ريكوستات" ||
    ((command === "قبول_ريكوست" || command === "ريكوست") && (arg === "all" || arg === "الكل"))
  ) {
    if (!res.length) {
      await conn.sendMessage(
        m.chat,
        { text: "🖤: مفيش ريكوستات حاليا", contextInfo: cli.config.info.channel },
        { quoted: m },
      );
      return;
    }

    for (const user of res) {
      await conn.groupRequestParticipantsUpdate(m.chat, [user.jid], "approve");
    }

    await conn.sendMessage(
      m.chat,
      { text: "🖤: تم يالشيخ قبول كل الريكوستات", contextInfo: cli.config.info.channel },
      { quoted: m },
    );
  } else if (command === "قبول_ريكوست") {
    if (!arg) {
      await conn.sendMessage(
        m.chat,
        {
          text:
            `*⪩ طريقة الاستخدام: ↯ •*\n` +
            `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
            `⦑ ➊ ⦒ ⦂ .ريكوستات ↜ ⟦ عـرض طـلـبـات الانـضـمـام ⟧\n` +
            `⦑ ➋ ⦒ ⦂ .قبول_ريكوستات ↜ ⟦ قـبـول كـل الـطـلـبـات ⟧\n` +
            `⦑ ➌ ⦒ ⦂ .قبول_ريكوست all / الكل ↜ ⟦ قـبـول كـل الـطـلـبـات ⟧\n` +
            `⦑ ➍ ⦒ ⦂ .قبول_ريكوست 1 ↜ ⟦ قـبـول طـلـب بـالـرقـم ⟧\n\n` +
            `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
            `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`,
          contextInfo: cli.config.info.channel,
        },
        { quoted: m },
      );
      return;
    }

    const user = res[Number(text) - 1];
    if (!user) {
      await conn.sendMessage(
        m.chat,
        { text: "🖤: مفيش يوزر", contextInfo: cli.config.info.channel },
        { quoted: m },
      );
      return;
    }

    await conn.groupRequestParticipantsUpdate(m.chat, [user.jid], "approve");
    await conn.sendMessage(
      m.chat,
      { text: "🖤: تم يالشيخ قبول الريكوست بالرقم", contextInfo: cli.config.info.channel },
      { quoted: m },
    );
  } else {
    await conn.sendMessage(
      m.chat,
      {
        text:
          `*⪩ طريقة الاستخدام: ↯ •*\n` +
          `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
          `⦑ ➊ ⦒ ⦂ .ريكوستات ↜ ⟦ عـرض طـلـبـات الانـضـمـام ⟧\n` +
          `⦑ ➋ ⦒ ⦂ .قبول_ريكوستات ↜ ⟦ قـبـول كـل الـطـلـبـات ⟧\n` +
          `⦑ ➌ ⦒ ⦂ .قبول_ريكوست all / الكل ↜ ⟦ قـبـول كـل الـطـلـبـات ⟧\n` +
          `⦑ ➍ ⦒ ⦂ .قبول_ريكوست 1 ↜ ⟦ قـبـول طـلـب بـالـرقـم ⟧\n\n` +
          `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
          `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`,
        contextInfo: cli.config.info.channel,
      },
      { quoted: m },
    );
  }
};

req.usage = ["ريكوستات"];
req.command = ["ريكوستات", "قبول_ريكوستات", "قبول_ريكوست", "ريكوست"];
req.category = "admins";
req.admin = true;
req.botAdmin = true;
export default req;
