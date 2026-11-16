async function handler(m, { conn, args }) {
  const mentioned =
    m.mentionedJid?.[0] ||
    m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] ||
    m.quoted?.sender ||
    m.sender;

  const word = args
    .filter((a) => !/^@\d+$/.test(a))
    .join(" ")
    .trim();

  if (!word) return m.reply("❌ اكتب الكلمة\nمثال: .نسبة غباء @شخص");

  const percent = Math.floor(Math.random() * 101);
  const filled = Math.round(percent / 10);
  const bar = "█".repeat(filled) + "░".repeat(10 - filled);

  let comment;
  if (percent >= 90) comment = "🔥 مفيش بعد كده";
  else if (percent >= 70) comment = "😂 عالي أوي";
  else if (percent >= 50) comment = "😏 نص نص";
  else if (percent >= 25) comment = "🙂 شوية بس";
  else comment = "😇 تقريباً ولا حاجة";

  const tag = mentioned.split("@")[0];

  await conn.sendMessage(
    m.chat,
    {
      text: `📊 نسبة ${word} عند @${tag}\n\n${bar} ${percent}%\n\n${comment}`,
      mentions: [mentioned],
    },
    { quoted: m }
  );
}

handler.command = ["نسبة", "nesba"];
handler.category = "fun";
handler.usage = [".نسبة <كلمة> @شخص"];

export default handler;