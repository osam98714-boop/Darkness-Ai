const fff = async (m, { conn, text,}) => {
await conn.linkPreview(m.chat, {
      text: `𝐃𝐚𝐫𝐤𝐧𝐞𝐬𝐬 𝐛𝐨𝐭 𝐜𝐨𝐧𝐧𝐞𝐜𝐭𝐞𝐝 🖤`,
  url: 'https://i.ibb.co/1tqtGjTs/0f66403b55e38f7d0614e1c7f6b9b94c.jpg',
     height: 438,
      width: 734,  
      title: "𝐃 𝐀 𝐑 𝐊 — 𝐋𝐋𝐎𝐘𝐃 🖤 | 𝐁𝐨𝐭 𝐢𝐬 𝐛𝐮𝐢𝐥𝐭 𝐨𝐧 𝐭𝐡𝐞 𝐌𝐄𝐎𝐖𝐒𝐀𝐁 𝐅𝐫𝐚𝐦𝐞𝐰𝐨𝐫𝐤",
      description: "𝙰 𝚋𝚘𝚝 𝚝𝚘 𝚝𝚎𝚜𝚝 𝚝𝚑𝚎 𝚗𝚎𝚠 𝚏𝚛𝚊𝚖𝚎𝚠𝚘𝚛𝚔"
    }, {quoted:  m});
};
fff.usage = ["تست"]
fff.command = ["تست"];
fff.prefixe = false;
fff.category = "group";
export default fff;