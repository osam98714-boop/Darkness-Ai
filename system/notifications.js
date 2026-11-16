const notif_ = async (ctx, { m, conn }) => {
  const senderJid = m?.jid ?? "966576041803";
  const senderNumber = senderJid ? senderJid.split("@")[0] : "966576041803";

  const quoted = {
    key: {
      participant: `867051314767696@bot`,
      remoteJid: "status@broadcast",
      fromMe: false,
    },
    message: {
      contactMessage: {
        displayName: "ᡣ𐭩🖤 𝐃 𝐀 𝐑 𝐊 — 𝐋𝐋𝐎𝐘𝐃 ૮₍ ˃ ⤙ ˂ ₎ა",
        verifiedName: "ᡣ𐭩🖤 𝐃 𝐀 𝐑 𝐊 — 𝐋𝐋𝐎𝐘𝐃 ૮₍ ˃ ⤙ ˂ ₎ა",
        vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:Anti Theft Bot\nitem1.TEL;waid=${senderNumber}:${senderNumber}\nEND:VCARD`,
      },
    },
    participant: "867051314767696@bot",
  };

  const captions = {
    admin:
      `*⪩ الأمـر ده للادمـن فـقـط: ↯ •*\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
      `⦑ ➊ ⦒ ⦂ اسـتـخـدمـه وانـت ادـمـن يـاعـبـد\n\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
      `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`,

    owner:
      `*⪩ الأمـر ده للـمـطـوريـن فـقـط: ↯ •*\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
      `⦑ ➊ ⦒ ⦂ اسـتـخـدمـه وانـت مـطـور يـاعـبـد\n\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
      `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`,

    group:
      `*⪩ الأمـر ده للـجـروبـات فـقـط: ↯ •*\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
      `⦑ ➊ ⦒ ⦂ اسـتـخـدمـه داخـل الـجـروب يـاعـبـد\n\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
      `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`,

    private:
      `*⪩ الأمـر ده للـخـاص فـقـط: ↯ •*\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
      `⦑ ➊ ⦒ ⦂ اسـتـخـدمـه فـي الـخـاص يـاعـبـد\n\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
      `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`,

    botAdmin:
      `*⪩ الـبـوت لازم يـكـون ادـمـن: ↯ •*\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
      `⦑ ➊ ⦒ ⦂ ارفـع الـبـوت ادـمـن الأول يـاعـبـد\n\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
      `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`,

    cooldown:
      `*⪩ اسـتـنـى شـويـة: ↯ •*\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
      `⦑ ➊ ⦒ ⦂ الأمـر فـي وقـت تـهـديـئـة\n` +
      `⦑ ➋ ⦒ ⦂ الـمـتـبـقـي ↜ ⟦ {TIME} ⟧\n\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
      `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`,

    disabled:
      `*⪩ الأمـر مـتـعـطـل: ↯ •*\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
      `⦑ ➊ ⦒ ⦂ الأمـر ده مـتـوقـف مـؤقـتـًا يـاعـبـد\n\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
      `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`,

    exclusive:
      `*⪩ الأمـر مـشـغـول: ↯ •*\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
      `⦑ ➊ ⦒ ⦂ الأمـر ده مـسـتـخـدم مـن حـد قـبـلـك\n` +
      `⦑ ➋ ⦒ ⦂ اسـتـنـى شـويـة وجـرب تـانـي\n\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
      `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`,
  };

  const sendWarning = async (caption) => {
    return conn.docThumb(
      m.chat,
      {
        image:
          "https://i.ibb.co/d48gQM0P/8c9f4acc2be93dc29b65723cbafa6b38.jpg",
        size: 1024000,
        fileName: "𝐒𝐲𝐬𝐭𝐞𝐦 : 𝐖𝐚𝐫𝐧𝐢𝐧𝐠",
        caption,
      },
      quoted
    );
  };

  ctx.admin(() => sendWarning(captions.admin));
  ctx.owner(() => sendWarning(captions.owner));
  ctx.group(() => sendWarning(captions.group));
  ctx.private(() => sendWarning(captions.private));
  ctx.botAdmin(() => sendWarning(captions.botAdmin));
  ctx.exclusive(() => sendWarning(captions.exclusive));
  ctx.cooldown((remaining) => {
    const secs = Math.ceil(remaining / 1000);
    const minutes = (secs / 60).toFixed(1);
    return sendWarning(captions.cooldown.replace("{TIME}", `${minutes} دقـيـقـة`));
  });

  ctx.disabled(() => sendWarning(captions.disabled));
};

export default notif_;