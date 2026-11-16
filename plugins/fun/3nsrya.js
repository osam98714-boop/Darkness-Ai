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

  if (!target) {
    await conn.sendMessage(
      m.chat,
      {
        text: "🖤: لازم تعمل منشن او ترد على رسالته.\nمثال: .عنصريه @شخص",
        contextInfo: cli?.config?.info?.channel,
      },
      { quoted: m },
    );
    return;
  }

  const { key: mention } = await resolveIds(m, conn, target);
  const name = `@${mention.split("@")[0].split(":")[0]}`;

  const ردود = [
    `😏 شوف مين... ${name}، نسخة بشرية فاشلة.`,
    `🤡 ${name}؟ حتى الذكاء الصناعي يتحاشاك.`,
    `📉 حتى السيرفرات رفضتك يا ${name}.`,
    `👑 ${name}؟ أنا ما بتعامل مع الفئة المطفية.`,
    `😂 مجرد وجودك يقلل من ذكاء المجموعة.`,
    `🥱 ${name}، لو الغباء كان بطارية كان زمانك منور الكوكب كله.`,
    `🗑️ حاولت ألاقي لك فايدة في الجروب يا ${name} بس طلع لي Error 404.`,
    `🐢 سرعة استيعابك يا ${name} أبطأ من نت الجيل الأول.`,
    `🔇 بالله يا ${name} خليك صامت، هيبتك في سكوتك أصلاً معدومة.`,
    `🎭 ${name}، أنت الدليل الحي إن الصبر له حدود.`,
    `📡 حتى الواي فاي بيفصل لما يشوف رسايلك يا ${name}.`,
    `🧊 دمك ثقيل لدرجة إن السيرفر بيهنج لما تكتب يا ${name}.`,
    `🚫 ${name}؟ مستواي البرمجي ما يسمحلي أرد على هذي العينات.`,
    `🪫 طاقتي بتخلص بمجرد ما أقرأ اسمك يا ${name}.`,
    `🌵 وجودك في الشات يا ${name} زي الإعلان اللي ما يتخطى.`,
  ];

  const عشوائي = ردود[Math.floor(Math.random() * ردود.length)];

  await conn.sendMessage(
    m.chat,
    {
      text: `🖤: ${عشوائي}`,
      mentions: [mention],
      contextInfo: cli?.config?.info?.channel,
    },
    { quoted: m },
  );
};

handler.usage = ["عنصريه"];
handler.command = ["عنصريه", "عنصرية"];
handler.category = "games";

export default handler;
