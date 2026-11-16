const link = async (m,{conn, cli, text})=> {
  m.react("⏳")
  const code = await conn.groupInviteCode(m.chat);
  const url = `https://chat.whatsapp.com/${code}`;
  await conn.buttonV2(m.chat ,
                         {text:`رابط الجروب 🔗 :\n${url} `,
  contextInfo: cli.config.info.channel,
   buttons: [
    {
      name: "cta_copy",
      buttonParamsJson: JSON.stringify({
        display_text: "𝐂𝐨𝐩𝐲",
        copy_code: url
      })
    }
  ],
},
     { quoted: m },  
   )
  m.react("✅")
}
link.command = ["لينك"];
link.usage = ["لينك"];
link.category = "admins";
link.admin = true;
link.botAdmin = true;
  export default link;