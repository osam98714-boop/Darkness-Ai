export default {
  event: 'group-participants.update',

  async run(data, { conn, cli }) {
    const { id, participants, action } = data;

    if (!['add', 'remove'].includes(action)) return;

    if (global.db?.groups?.[id]?.welcome !== true) return;

    const now = Date.now();
    if (!global.startupTime) global.startupTime = now;
    
    if (now - global.startupTime < 10000) return;

    const contextInfo = cli?.config?.info?.channel;
    let groupName = 'Our Group';
    let groupMembers = 0;

    try {
      const metadata = await conn.groupMetadata(id);
      groupName = metadata?.subject || groupName;
      groupMembers = metadata?.participants?.length || 0;
    } catch (error) {
      console.error('Metadata error:', error);
    }

    for (const participant of participants || []) {
      const jid = typeof participant === 'string' ? participant : participant?.id || participant?.jid;
      if (!jid) continue;

      const num = jid.split('@')[0].split(':')[0];

      try {
        if (action === 'add') {
          const text = `*⪩ تـم الانـضـمـام ↯ •*\n` +
                       `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
                       `*『 🖤 اهـلا بـك فـي الـجـروب 』*\n\n` +
                       `⦑ ➊ ⦒ ⦂ الـعـضـو ↜ ⟦ @${num} ⟧\n` +
                       `⦑ ➋ ⦒ ⦂ الـجـروب ↜ ⟦ ${groupName} ⟧\n` +
                       `⦑ ➌ ⦒ ⦂ الاعـضـاء ↜ ⟦ ${groupMembers} ⟧\n\n` +
                       `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
                       `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`;

          await conn.linkPreview(id, {
            text,
            url: "https://i.ibb.co/1tqtGjTs/0f66403b55e38f7d0614e1c7f6b9b94c.jpg",
            height: 438,
            width: 734,
            title: "𝐃 𝐀 𝐑 𝐊 — 𝐋𝐋𝐎𝐘𝐃 🖤 | 𝐖𝐞𝐥𝐜𝐨𝐦𝐞",
            description: `اهـلا بـك فـي ${groupName} 🖤`,
            mentions: [jid],
            contextInfo: contextInfo
          }, { quoted: null });

        } else if (action === 'remove') {
          const text = `*⪩ تـم الـخـروج ↯ •*\n` +
                       `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
                       `*『 🖤 وداعـاً لـك 』*\n\n` +
                       `⦑ ➊ ⦒ ⦂ الـعـضـو ↜ ⟦ @${num} ⟧\n` +
                       `⦑ ➋ ⦒ ⦂ الـجـروب ↜ ⟦ ${groupName} ⟧\n` +
                       `⦑ ➌ ⦒ ⦂ الاعـضـاء ↜ ⟦ ${groupMembers} ⟧\n\n` +
                       `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
                       `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`;

          await conn.linkPreview(id, {
            text,
            url: "https://i.ibb.co/1tqtGjTs/0f66403b55e38f7d0614e1c7f6b9b94c.jpg",
            height: 438,
            width: 734,
            title: "𝐃 𝐀 𝐑 𝐊 — 𝐋𝐋𝐎𝐘𝐃 🖤 | 𝐆𝐨𝐨𝐝𝐛𝐲𝐞",
            description: `وداعـاً لـك مـن ${groupName} 🖤`,
            mentions: [jid],
            contextInfo: contextInfo
          }, { quoted: null });
        }

      } catch (error) {
        console.error(`Welcome event error for ${jid}:`, error);
      }
    }
  }
};