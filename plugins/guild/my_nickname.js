const handler = async (m, { conn }) => {
    const data = global.db.group?.[m.chat]?.nicknames;
    if (!data) return m.reply('❌ لا يوجد ألقاب في هذا الجروب');

    const mentioned = m.mentionedJid?.[0];
    const target = mentioned || m.lid;
    const nick = data[target] || data[m.sender];

    if (!nick) {
        return m.reply(
            mentioned 
                ? `❌ @${target.split('@')[0]} لا يملك لقباً` 
                : `❌ أنت لا تملك لقباً في هذا الجروب`,
            mentioned ? { mentions: [target] } : null
        );
    }

    await m.reply(
        `*⪩ الـلـقـب ↯ •*\n` +
        `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
        `⦑ ➊ ⦒ ⦂ الـعـضـو ↜ ⟦ @${target.split('@')[0]} ⟧\n` +
        `⦑ ➋ ⦒ ⦂ الـلـقـب ↜ ⟦ ${nick} ⟧\n\n` +
        `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
        `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`,
        { mentions: [target] }
    );
};

handler.command = ["لقبي"];
handler.usage = ["لقبي"];
handler.category = "nicknames";
handler.group = true;

export default handler;