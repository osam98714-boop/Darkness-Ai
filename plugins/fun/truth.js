const questions = [
  "مين آخر شخص قلت عليه كلام وراه؟",
  "إيه أكتر حاجة بتندم عليها؟",
  "لو هتغير حاجة في شكلك هتغير إيه؟",
  "مين الشخص اللي بتتمنى تتكلم معاه دلوقتي؟",
  "إيه أكبر كدبة كدبتها ومحدش عرف؟",
  "لو هتمسح شخص واحد من حياتك مين؟",
  "إيه أكتر موقف محرج حصلك؟",
  "بتحب مين في الجروب أكتر حاجة؟",
  "مين في الجروب بتحس إنه بيكرهك؟",
  "إيه أكتر حاجة بتخاف منها؟",
  "آخر مرة عيطت كانت إمتى وليه؟",
  "لو معاك مليون جنيه هتعمل بيهم إيه أول حاجة؟",
  "إيه أسوأ عادة عندك؟",
  "مين أكتر واحد في الجروب بتتضايق منه؟",
  "عمرك قلت لحد بحبك وإنت مش قصدها؟",
  "إيه السر اللي مخبيه ومحدش يعرفه؟",
  "مين في الجروب تتجوزه لو مضطر؟",
  "إيه أغرب حاجة بتعملها وإنت لوحدك؟",
  "لو هتسيب الجروب هيكون ليه؟",
  "إيه أكتر حاجة بتكدب فيها كل يوم؟",
];

async function handler(m, { conn }) {
  if (!m.isGroup) return m.reply("❌ الأمر ده للجروبات بس");

  const meta = await conn.groupMetadata(m.chat);
  const botId = conn.user?.id?.split(":")[0]?.split("@")[0];

  const members = meta.participants
    .map((p) => p.id || p.jid)
    .filter((id) => id && id.split(":")[0].split("@")[0] !== botId);

  if (!members.length) return m.reply("❌ مفيش أعضاء");

  const target = members[Math.floor(Math.random() * members.length)];
  const q = questions[Math.floor(Math.random() * questions.length)];

  await conn.sendMessage(
    m.chat,
    {
      text: `🎯 *صراحة*\n\n@${target.split("@")[0]}\n\n❓ ${q}\n\n⏳ جاوب بصراحة من غير لف ودوران`,
      mentions: [target],
    },
    { quoted: m }
  );
}

handler.command = ["صراحة", "sara7a"];
handler.category = "fun";
handler.usage = [".صراحة"];

export default handler;