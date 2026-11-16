const MENU_IMG = "https://i.ibb.co/1tqtGjTs/0f66403b55e38f7d0614e1c7f6b9b94c.jpg";

const handler = async (m, { conn, args, command, cli }) => {
  const senderNum = m.sender.split("@")[0].split(":")[0];
  const status = {
    key: {
      participant: `${senderNum}@s.whatsapp.net`,
      remoteJid: "status@broadcast",
      fromMe: false,
    },
    message: {
      contactMessage: {
        displayName: `${m.pushName || "User"}`,
        vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${m.pushName || "User"}\nitem1.TEL;waid=${senderNum}:${senderNum}\nEND:VCARD`,
      },
    },
    participant: "0@s.whatsapp.net",
  };

  const CATEGORIES = [
    [1, "التـحـمـيـل", "downloads", "📂"],
    [2, "الـمـجـمـوعـات", "groups", "🐞"],
    [3, "الـمـلـصـقـات", "sticker", "🌄"],
    [4, "الـمـطـوريـن", "owners", "🇩🇪"],
    [5, "الادمــن", "admins", "👨🏻‍⚖️"],
    [6, "الالــعـاب", "games", "🎮"],
    [7, "الـتـرفـيـه والـمـرح", "fun", "🎭"],
    [8, "الـلـوجـو والـتـصـمـيـم", "logos", "🎨"],
    [9, "الـبـحـث", "search", "🔍"],
    [10, "الـذكـاء الاصـطـنـاعـي", "ai", "🤖"],
    [11, "الادوات والـتـحـويـلات", "tools", "🛠️"],
    [12, "الـبـوتـات الـفـرعـي", "sub", "♥️"],
    [13, "الـمـعـلـومـات", "info", "ℹ️"],
    [14, "الـجـيـف", "gif", "🎞️"],
    [15, "كـل الأوامـر", "all", "🖤"],
  ];

  const CATEGORY_ALIASES = {
    download: "downloads",
    downloads: "downloads",
    group: "groups",
    groups: "groups",
    general: "groups",
    sticker: "sticker",
    stickers: "sticker",
    owner: "owners",
    owners: "owners",
    admin: "admins",
    admins: "admins",
    game: "games",
    games: "games",
    fun: "fun",
    logo: "logos",
    logos: "logos",
    search: "search",
    sarech: "search",
    ai: "ai",
    tool: "tools",
    tools: "tools",
    sub: "sub",
    subs: "sub",
    subbot: "sub",
    subbots: "sub",
    info: "info",
    information: "info",
    gif: "gif",
    gifs: "gif",
  };

  const resolveCategory = (c) => {
    const rawCat = typeof c.category === "string" ? c.category.trim().toLowerCase() : "";
    if (rawCat && CATEGORY_ALIASES[rawCat]) {
      return CATEGORY_ALIASES[rawCat];
    }
    if (rawCat) return rawCat;
    if (c.owner) return "owners";
    return "tools";
  };

  const getCat = (n) => CATEGORIES.find((c) => c[0] === n);
  const selected = parseInt(args[0]);

  if (!selected && !args[0]) {
    const sections = [
      {
        title: "🖤 ~ الاقـسـام ~ 🖤",
        rows: CATEGORIES.map((c) => ({
          title: `⦑ ${c[0]} ⦒ ⦂ ${c[1]} ${c[3]}`,
          description: `↳ اضغط لعرض ${c[2] === "all" ? "جميع أوامر البوت" : `أوامر قسم ${c[1]}`}`,
          id: `.${command} ${c[0]}`,
        })),
      },
    ];

    const menuText = `
رَبَّنَا اغْفِرْ لَنَا وَلِإِخْوَانِنَا الَّذِينَ سَبَقُونَا بِالْإِيمَانِ
وَلَا تَجْعَلْ فِي قُلُوبِنَا غِلًّا لِّلَّذِينَ آمَنُوا رَبَّنَا إِنَّكَ رَءُوفٌ رَّحِيمٌ

  .─ִ╾ׄ─ִ─ִ╾ ࣪🖤.─ִ╾ׄ─ִ─ִ╾ ࣪
  
  *『 🖤 اهـلا → [ @${senderNum} ] 』*
  
  .─ִ╾ׄ─ִ─ִ╾ ࣪🖤.─ִ╾ׄ─ִ─ִ╾ ࣪

*🖤 ⇢ قـائـمـة الأوامـر*
_↳ اختار قسم من القائمة عشان يبعتلك اوامر القسم_`;

    await conn.buttonV3(
      m.chat,
      {
        image: MENU_IMG,
        text: menuText,
        footer: "Darkness ⇆ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃",
        buttons: [
          {
            name: "single_select",
            params: {
              title: "الاوامر",
              sections: sections,
            },
          },
          {
            name: "quick_reply",
            params: {
              display_text: "القناة",
              url: "https://whatsapp.com/channel/0029VbE9okHHFxOsc1shj71J",
            },
          },
        ],
        mentions: [m.sender],
        contextInfo: cli?.config?.info?.channel,
      },
      { quoted: status },
    );
    return;
  }

  const cat = getCat(selected);
  if (!cat) {
    await conn.sendMessage(
      m.chat,
      {
        text: `🖤: اختار رقم صحيح من 1 لـ ${CATEGORIES.length}`,
        contextInfo: cli?.config?.info?.channel,
      },
      { quoted: status },
    );
    return;
  }

  const cmds = await cli.commands();
  const categoryCmds = cmds.filter((c) => {
    const cmdList = Array.isArray(c.command) ? c.command : [c.command];
    if (cmdList.includes("اوامر") || cmdList.includes("menu")) return false;
    if (cat[2] === "all") return true;
    return resolveCategory(c) === cat[2];
  });

  const cmdsList = categoryCmds
    .flatMap((c) => {
      const rawUsage = c.usage ?? c.useg ?? [];
      const list = Array.isArray(rawUsage) ? rawUsage : [rawUsage];
      return list
        .filter((u) => typeof u === "string" && u.trim())
        .map((cmd) => {
          const cleanCmd = cmd.trim().replace(/^[./]/, "");
          return `⦑ ${cat[3]} ⦒ ⦂ .${cleanCmd}`;
        });
    })
    .join("\n");

  if (!cmdsList.length) {
    await conn.sendMessage(
      m.chat,
      { text: "🖤: القسم فاضي", contextInfo: cli?.config?.info?.channel },
      { quoted: status },
    );
    return;
  }

  const sectionText = `*⪩ ${cat[2] === "all" ? "كـل أوامـر الـبـوت" : `قـسـم ${cat[1]}`} ${cat[3]} ↯ •*
── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── 

${cmdsList}

── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── 
⦑ 🖤 ⦒ ⦂ ~ ${cli?.config?.info?.nameBot || "Darkness_bot"} ↜ ⟦ رَبَّنَا اغْفِرْ لَنَا وَلِإِخْوَانِنَا ❤️ ⟧
> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`.trim();

  await conn.linkPreview(
    m.chat,
    {
      text: sectionText,
      url: MENU_IMG,
      height: 438,
      width: 734,
      title: "𝐃 𝐀 𝐑 𝐊 — 𝐋𝐋𝐎𝐘𝐃 🖤 | 𝐁𝐨𝐭 𝐢𝐬 𝐛𝐮𝐢𝐥𝐭 𝐨𝐧 𝐭𝐡𝐞 𝐌𝐄𝐎𝐖𝐒𝐀𝐁 𝐅𝐫𝐚𝐦𝐞𝐰𝐨𝐫𝐤",
      description: cat[2] === "all" ? "قـائـمـة جـمـيـع أوامـر الـبـوت 🖤" : `قـائـمـة أوامـر قـسـم ${cat[1]} ${cat[3]}`,
    },
    { quoted: status },
  );
};

handler.command = ["اوامر", "menu"];
export default handler;
