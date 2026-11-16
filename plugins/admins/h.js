const h = async (m, { text, cli, conn }) => {
  const sock = conn || cli?.sock || cli?.conn || cli;

  try {
    const groupMetadata = await sock.groupMetadata(m.chat);
    const participants = groupMetadata.participants.map(v => v.id);

    if (m.quoted) {
      const q = m.quoted;
      const ctx =
        m.msg?.contextInfo ||
        m.message?.extendedTextMessage?.contextInfo ||
        {};

      let forward;

      if (typeof q.fakeObj === "function") {
        forward = q.fakeObj();
      } else if (q.fakeObj && typeof q.fakeObj === "object") {
        forward = q.fakeObj;
      } else if (q.vM) {
        forward = q.vM;
      } else {
        const message = q.message || ctx.quotedMessage;
        if (message) {
          forward = {
            key: {
              remoteJid: m.chat,
              fromMe: false,
              id: q.id || ctx.stanzaId,
              participant: q.sender || ctx.participant
            },
            message
          };
        }
      }

      if (!forward)
        return await m.reply("*❌ مقدرتش أقرأ الرسالة اللي رديت عليها*");

      return await sock.sendMessage(m.chat, {
        forward,
        mentions: participants
      });
    }

    await sock.sendMessage(m.chat, {
      text: text || "ﷺ",
      mentions: participants
    });
  } catch (err) {
    await m.reply(err.message);
  }
};

h.usage = ["مخفي"];
h.category = "admin";
h.command = ['مخفي', 'h'];
h.group = true;
h.admin = true;
h.usePrefix = false;

export default h;