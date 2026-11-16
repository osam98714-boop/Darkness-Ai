const mute_Ghorub = async (m, {conn, command}) => {
    if (command === "قفل") {
        await conn.groupSettingUpdate(m.chat, "announcement")
        m.reply("🖤: تم يا الشيخ قفلت القروب")
    } else if (command === "فتح") {
        await conn.groupSettingUpdate(m.chat, "not_announcement")
        m.reply("🖤: تم يا الشيخ فتحت القروب")
    }
}

mute_Ghorub.usage = ["فتح", "قفل"];
mute_Ghorub.category = "admins";
mute_Ghorub.command = ["فتح", "قفل"];
mute_Ghorub.admin = true;
mute_Ghorub.botAdmin = true;

export default mute_Ghorub;
