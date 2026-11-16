const del = async (m, { conn, cli }) => {
  const user = m.quoted?.sender;
  if (!user) {
    await conn.sendMessage(
      m.chat,
      {
        text: "🖤: رد على الرساله الاول بلاش عبط",
        contextInfo: cli.config.info.channel,
      },
      { quoted: m },
    );
    return;
  } else {
    await m.quoted.delete(user);
    await m.delete();
    await conn.sendMessage(
      m.chat,
      {
        text: "🖤: خلاص حذفت لك رسالته يا شيخ",
        contextInfo: cli.config.info.channel,
      },
      { quoted: m },
    );
  }
};

del.usage = ["حذف"];
del.command = ["حذف"];
del.category = "admins";
del.admin = true;
del.botAdmin = true;

export default del;
