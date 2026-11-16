const MAX_ROUNDS = 10;

const NAMES = [
  "ايرين","نيزوكو","سوكونا","موازن","كيلوا","غون","ايتاتشي","ساسكي","دابي","اوبيتو",
  "نوبارا","ليفاي","يوتا","فريدا","شيده","ياماتو","نامي","ايمو","انيا","جينبي",
  "بوروتو","شانكس","لاو","لوفي","زورو","اكازا","ميكاسا","رين","دوما","كانيكي",
  "غوجو","ساي","نيجي","انمي","ساكورا","اوريتشمارو","ماهيتو","جيرايا","روبين",
  "سانجي","ميهوك","كايدو","مايكي","كورابيكا","شيغاراكي","تينغن","تانجيرو",
  "ميدوريا","كونان","الكيورا","شوتو","غاتارو","بارو","غارا","باكوغو","ماكيما",
  "توجا","باين","كوراما"
];

const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);
const activeGames = new Map();

const handler = async (m, { conn }) => {
  const chatId = m.chat;
  let g = activeGames.get(chatId);
  
  if (g?.current) return await conn.sendMessage(chatId, {
    image: { url: g.current.img },
    caption: g.current.caption
  });

  if (!g || g.round >= MAX_ROUNDS) {
    if (g) {
      await conn.sendMessage(chatId, {
        text: `🏆 *انتهت اللعبة*`
      });
    }
    g = { round: 0, current: null };
    activeGames.set(chatId, g);
  }

  g.round++;
  
  const data = await fetch("https://raw.githubusercontent.com/fjfilhfjjg-boop/Pomni-AI/refs/heads/main/%D8%B9%D9%8A%D9%86.md").then(r => r.json());
  const char = data[Math.floor(Math.random() * data.length)];
  
  const wrong = shuffle([...NAMES]).filter(n => n !== char.name).slice(0, 3);
  const opts = shuffle([char.name, ...wrong]);
  
  const caption = `👁 خمن الشخصية (${g.round}/${MAX_ROUNDS})\n\n1. ${opts[0]}\n2. ${opts[1]}\n3. ${opts[2]}\n4. ${opts[3]}`;
  
  const msg = await conn.sendMessage(chatId, {
    image: { url: char.img },
    caption
  });
  
  g.current = {
    answer: char.name.toLowerCase(),
    opts: opts.map(o => o.toLowerCase()),
    img: char.img,
    caption,
    id: msg.key.id,
    timer: setTimeout(async () => {
      const game = activeGames.get(chatId);
      if (game?.current) {
        const ans = game.current.answer;
        game.current = null;
        await conn.sendMessage(chatId, { text: `⏰ الوقت انتهى! الاجابة: *${ans}*\nاكتب .عين للبدء من جديد` });
      }
    }, 30000)
  };
};

handler.before = async (m, { conn }) => {
  if (!m.text) return;
  
  const g = activeGames.get(m.chat);
  if (!g?.current) return;
  
  const cur = g.current;
  if (m.quoted?.id !== cur.id && m.text?.toLowerCase() !== cur.answer) return;
  
  const answer = m.text.toLowerCase().trim();
  if (!cur.opts.includes(answer)) return m.reply("❌ غلط");
  
  clearTimeout(cur.timer);
  g.current = null;
  
  if (answer === cur.answer) {
    await conn.sendMessage(m.chat, {
      text: `✅ صح!\nانتظر الجولة القادمة...`,
      mentions: [m.sender]
    });
    setTimeout(() => handler(m, { conn }), 200);
  } else {
    await m.reply("❌ غلط");
  }
  return true;
};
handler.usage = ["عين"]
handler.command = ['عين', 'eye'];
handler.category = "games";
export default handler;
