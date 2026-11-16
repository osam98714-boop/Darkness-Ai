const handler = async (m, { cli }) => {
  try {
    const ctx =
      m.msg?.contextInfo ||
      m.message?.extendedTextMessage?.contextInfo;

    const target =
      m.mentionedJid?.[0] ||
      ctx?.mentionedJid?.[0] ||
      m.quoted?.sender ||
      ctx?.participant;

    if (!target)
      return m.reply("*❌ منشن الشخص أو رد على رسالته*");

    const num = target.split("@")[0].split(":")[0];

    const msgs = [
      `🦢 @${num} أنا آسف جداً، ما كان قصدي أزعلك.. سامحني 💔`,
      `🌸 @${num} آسف من قلبي، وعد أحاول ما أكررها.. تسامحني؟ 🤍`,
      `🌼 @${num} زعلك صعب عليّ، أنا آسف وأتمنى تسامحني 💐`,
    ];

    const sock = cli?.sock || cli?.conn || cli;
    const chat = m.chat || m.key?.remoteJid;

    await sock.sendMessage(
      chat,
      {
        text: msgs[Math.floor(Math.random() * msgs.length)],
        mentions: [target]
      },
      { quoted: m }
    );
  } catch (e) {
    console.error("خطأ في أمر اعتذر:", e);
  }
};
handler.usage = ["اعتذر"]
handler.command = ['اعتذر'];
handler.category = "fun";
export default handler;