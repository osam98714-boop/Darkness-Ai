const COOLDOWN = 20000;
const MAX_LENGTH = 40;
const last = new Map();

const normalize = (t) =>
  t
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/(.)\1{2,}/g, "$1")
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .trim();

const rules = [
  {
    match: /^(مع السلامه|سلام باي|باي|الى اللقاء|الي اللقاء|سلام)/,
    replies: ["مع السلامة 👋", "في أمان الله 🤍", "نورتنا، تيجي تاني 🌸"],
  },
  {
    match: /^(السلام عليكم|سلام عليكم|السلام)/,
    replies: [
      "وعليكم السلام ورحمة الله وبركاته 🤍",
      "وعليكم السلام ورحمة الله 🌸",
      "وعليكم السلام 🌼",
    ],
  },
  {
    match: /^صباح (الخير|النور|الفل|الورد)/,
    replies: ["صباح النور ☀️", "صباح الفل والياسمين 🌼", "صباح الورد 🌸"],
  },
  {
    match: /^مساء (الخير|النور|الفل|الورد)/,
    replies: ["مساء النور 🌙", "مساء الفل 🌼", "مساء الورد 🌸"],
  },
  {
    match: /^(تصبح|تصبحون|تصبحي) علي خير/,
    replies: ["وانت من أهل الخير 🌙", "تصبح على خير 🤍", "أحلام سعيدة 💤"],
  },
  {
    match: /^(ازيك|ازيكم|عامل ايه|عاملين ايه|كيفك|كيف حالك|شلونك|اخبارك ايه)/,
    replies: [
      "الحمد لله تمام، وانت؟ 🤍",
      "كله تمام الحمد لله، عامل ايه انت؟ 🌸",
      "بخير الحمد لله، يارب تكون بخير 🌼",
    ],
  },
  {
    match: /^(شكرا|شكرا ليك|شكرا جدا|مشكور|تسلم|يسلمو)/,
    replies: ["العفو 🌸", "ولا يهمك 🤍", "في الخدمة دايما 🌼"],
  },
  {
    match: /^(بوت|يا بوت|هاي بوت)$/,
    replies: ["نعم؟", "ايوه، تحت أمرك 🤍", "موجود 🌸"],
  },
];

export default {
  auto: true,

  run: async (m, { cli }) => {
    if (!m.sender || m.fromMe || m.isBaileys)
      return;

    if (cli?.config?.settings?.auto_reply === false)
      return;

    const raw = m.text || "";

    if (!raw || raw.length > MAX_LENGTH)
      return;

    if (/^[.!\/#]/.test(raw.trim()))
      return;

    const text = normalize(raw);

    if (!text)
      return;

    const index = rules.findIndex((rule) => rule.match.test(text));

    if (index === -1)
      return;

    const key = `${m.chat}:${m.sender}:${index}`;
    const now = Date.now();

    if (now - (last.get(key) || 0) < COOLDOWN)
      return;

    last.set(key, now);

    if (last.size > 500) {
      for (const [k, t] of last) {
        if (now - t > COOLDOWN) last.delete(k);
      }
    }

    const replies = rules[index].replies;

    try {
      await m.reply(replies[Math.floor(Math.random() * replies.length)]);
    } catch (e) {
      console.error("فشل الرد التلقائي:", e);
    }

    return "stop";
  },
};