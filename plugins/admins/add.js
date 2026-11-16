const add = async (m, {conn, text}) => {
    const number = text.trim();
    const  jid = number + "@s.whatsapp.net";
    if (!text) {
        m.reply("🖤: اكتب الرقم بعد الرمز مثاال .اضافة 966*********")
        return
    } else {
        await conn.groupParticipantsUpdate(m.chat, [jid], "add")
        m.reply("🖤: تم خلاص ضفته يالشيخ")
    }
};

add.usage = [ "اضافه"];
add.command = ["اضافة", "اضافه"];
add.admin = true;
add.category = "admins";
add.botAdmin = true;
export default add;
