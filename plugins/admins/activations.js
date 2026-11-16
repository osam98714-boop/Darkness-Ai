const handler = async (m, { conn, command, args }) => {
  const group = global.db?.groups?.[m.chat] || {};
  if (!global.db.groups) global.db.groups = {};
  if (!global.db.groups[m.chat]) global.db.groups[m.chat] = {};

  if (command === "التفعيلات") {
    if (!args[0]) {
      await conn.buttonV2(m.chat, {
        text: `*⪩ الـتـفـعـيـلات ↯ •*\n` +
              `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
              `*『 🖤 اختار التفعيل اللي عايزه من الزرار 』*\n\n` +
              `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
              `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`,
        footer: "Darkness ⇆ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃",
        buttons: [
          {
            name: "single_select",
            buttonParamsJson: JSON.stringify({
              title: "الاعدادات",
              sections: [
                {
                  title: "🖤 ~ الاقـسـام ~ 🖤",
                  highlight_label: "Popular",
                  rows: [
                    {
                      title: `⦑ ➊ ⦒ ⦂ مـنـع الـروابـط`,
                      description: `↳ الـحـالـة: ${group.no_links ? "مـفـعـل ✅" : "مـعـطـل ❌"}`,
                      id: `.${command} no_links`
                    },
                    {
                      title: `⦑ ➋ ⦒ ⦂ الادمـن فـقـط`,
                      description: `↳ الـحـالـة: ${group.onlyAdmin ? "مـفـعـل ✅" : "مـعـطـل ❌"}`,
                      id: `.${command} onlyAdmin`
                    },
                    {
                      title: `⦑ ➌ ⦒ ⦂ الـمـطـور فـقـط`,
                      description: `↳ الـحـالـة: ${group.onlyOwner ? "مـفـعـل ✅" : "مـعـطـل ❌"}`,
                      id: `.${command} onlyOwner`
                    },
                    {
                      title: `⦑ ➍ ⦒ ⦂ الـتـرحـيـب`,
                      description: `↳ الـحـالـة: ${group.welcome ? "مـفـعـل ✅" : "مـعـطـل ❌"}`,
                      id: `.${command} welcome`
                    }
                  ]
                }
              ]
            })
          }
        ],
        newsletter: {
          name: '𝐋𝐋𝐎𝐘𝐃 ~ 𝐂𝐡𝐚𝐧𝐧𝐞𝐥 🕷️',
          jid: '@newsletter'
        }
      }, { quoted: m });
      return;
    }

    const type = args[0];
    if (!["no_links", "onlyAdmin", "onlyOwner", "welcome"].includes(type)) return;

    const names = {
      no_links: "مـنـع الـروابـط",
      onlyAdmin: "الادمـن فـقـط",
      onlyOwner: "الـمـطـور فـقـط",
      welcome: "الـتـرحـيـب"
    };

    global.db.groups[m.chat][type] = !global.db.groups[m.chat][type];
    global.saveDB();

    return m.reply(
      `*⪩ تـم الـتـغـيـيـر ↯ •*\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
      `⦑ ➊ ⦒ ⦂ ${names[type]}\n` +
      `⦑ ➋ ⦒ ⦂ الـحـالـة ↜ ⟦ ${global.db.groups[m.chat][type] ? "مـفـعـل ✅" : "مـعـطـل ❌"} ⟧\n\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
      `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`
    );
  }

  if (command === "بان") {
    const mentioned = m.mentionedJid?.[0];
    if (!mentioned) return m.reply(
      `*⪩ لازم تـعـمـل مـنـشـن ↯ •*\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
      `⦑ ➊ ⦒ ⦂ .بـان @شـخـص\n\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
      `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`
    );

    if (!global.db.users) global.db.users = {};
    global.db.users[mentioned] = global.db.users[mentioned] || {};
    global.db.users[mentioned].banned = true;
    global.saveDB();

    await conn.sendMessage(m.chat, { 
      text: `*⪩ تـم الـحـظـر ↯ •*\n` +
            `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
            `⦑ ➊ ⦒ ⦂ الـمـسـتـخـدم ↜ ⟦ @${mentioned.split('@')[0]} ⟧\n` +
            `⦑ ➋ ⦒ ⦂ الـحـالـة ↜ ⟦ مـحـظـور 🚫 ⟧\n\n` +
            `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
            `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`, 
      mentions: [mentioned] 
    }, { quoted: m });
    return;
  }

  if (command === "فك_بان") {
    const mentioned = m.mentionedJid?.[0];
    if (!mentioned) return m.reply(
      `*⪩ لازم تـعـمـل مـنـشـن ↯ •*\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
      `⦑ ➊ ⦒ ⦂ .فـك_بـان @شـخـص\n\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
      `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`
    );

    if (global.db.users?.[mentioned]) {
      global.db.users[mentioned].banned = false;
      global.saveDB();
    }
    
    await conn.sendMessage(m.chat, { 
      text: `*⪩ تـم فـك الـحـظـر ↯ •*\n` +
            `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
            `⦑ ➊ ⦒ ⦂ الـمـسـتـخـدم ↜ ⟦ @${mentioned.split('@')[0]} ⟧\n` +
            `⦑ ➋ ⦒ ⦂ الـحـالـة ↜ ⟦ مـفـعـول ✅ ⟧\n\n` +
            `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
            `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`, 
      mentions: [mentioned] 
    }, { quoted: m });
    return;
  }
};

handler.command = ["التفعيلات", "بان", "فك_بان"];
handler.usage = ["التفعيلات", "بان", "فك_بان"];
handler.category = "admins";
handler.admin = true;
handler.group = true;

export default handler;