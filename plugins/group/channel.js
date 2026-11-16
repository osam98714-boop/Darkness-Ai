const handler = async (m, { conn, text, command }) => {
  if (!text)
    return m.reply(
      `*⪩ طريقة الاستخدام: ↯ •*\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
      `⦑ ➊ ⦒ ⦂ .${command} ↜ ⟦ رابط_القناة أو كود الدعوة ⟧\n` +
      `⦑ ➋ ⦒ ⦂ مثال ↜ ⟦ .${command} https://whatsapp.com/channel/CODE ⟧\n\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
      `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`
    );

  try {
    const invite = text.includes("https")
      ? text.split("/").pop().split("?")[0]
      : text.trim();

    const res = await conn.newsletterMetadata("invite", invite);
    const meta = res.thread_metadata;

    const name = meta.name?.text || "غير معروف";
    const desc = meta.description?.text || "مفيش وصف";
    const subs = meta.subscribers_count || "0";
    const created = meta.creation_time
      ? new Date(parseInt(meta.creation_time) * 1000).toLocaleString("ar-EG")
      : "غير معروف";
    const status = res.state?.type || "غير معروف";
    const verify = meta.verification || "غير معروف";
    const jid = res.id;

    let msg = `*⪩ معلومات القناة: ↯ •*\n`;
    msg += `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n`;
    msg += `⦑ ➊ ⦒ ⦂ الاسم ↜ ⟦ ${name} ⟧\n`;
    msg += `⦑ ➋ ⦒ ⦂ المشتركين ↜ ⟦ ${subs} ⟧\n`;
    msg += `⦑ ➌ ⦒ ⦂ تاريخ الإنشاء ↜ ⟦ ${created} ⟧\n`;
    msg += `⦑ ➍ ⦒ ⦂ الحالة ↜ ⟦ ${status} ⟧\n`;
    msg += `⦑ ➎ ⦒ ⦂ التوثيق ↜ ⟦ ${verify} ⟧\n\n`;
    msg += `*⪩ الوصف: ↯ •*\n`;
    msg += `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n`;
    msg += `⦑ ➊ ⦒ ⦂ ${desc}\n\n`;
    msg += `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n`;
    msg += `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`;

    const img = meta.preview?.direct_path
      ? "https://mmg.whatsapp.net" + meta.preview.direct_path
      : null;

    return await conn.buttonV2(
      m.chat,
      {
        text: msg,
        footer: "𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐋𝐋𝐎𝐘𝐃",
        image: img,
        buttons: [
          {
            name: "cta_copy",
            buttonParamsJson: JSON.stringify({
              display_text: "Copy JID 💌",
              copy_code: jid,
            }),
          },
        ],
        newsletter: {
          name: "Channel",
          jid: "120363409527479223@newslette",
        },
      },
      { quoted: m }
    );
  } catch (e) {
    m.reply(
      `*⪩ حصل خطأ: ↯ •*\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
      `⦑ ➊ ⦒ ⦂ تأكد من الرابط أو الكود\n\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
      `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`
    );
  }
};

handler.usage =  ["قناة"];
handler.category = "group";
handler.command = ["قناة"];
export default handler;