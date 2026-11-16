const handler = async (m, { conn }) => { 
  const q = m.quoted || m;
    const mime = q.mimetype || '';
  if(!/image/.test(mime)) {
    return m.reply("رد  على صورة الاول")
  }
  const jid = conn.user.id.split(":")[0] + "@s.whatsapp.net";
  const media = await q.download();
        await conn.updateProfilePicture(jid, media);
        m.reply('✅ ~ تم تغيير صورة بروفايل البوت');
return   m.react("✅")
}
handler.usage = ["بروفايل_البوت"]
handler.command = ["بروفايل_البوت"];
handler.owner = true ;
handler.category = "owners";
export default handler;