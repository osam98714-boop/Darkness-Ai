const handler = async (m, { conn, cli }) => {
  const senderNumber = m.sender.split("@")[0].split(":")[0];

  const luckList = [
    '💰 حظك اليوم ممتاز! استغل الفرصة.',
    '😅 حظك ضعيف اليوم، خذ الأمور ببساطة.',
    '🎯 الحظ في صالحك اليوم!',
    '🤔 اليوم ربما يكون عادي، لا تتوقع الكثير.',
    '🔥 حظ رائع! يوم مناسب لتجربة شيء جديد.',
    '🌧 حظك متقلب، حاول أن تكون حذر.',
    '✨ الفرص قادمة، كن مستعد!',
    '😎 حظ جيد جدًا، ابتسم!',
    '💤 اليوم هادئ، حظك متوسط.',
    '💡 فكرة جديدة قد تأتيك اليوم!'
  ];

  const randomLuck = luckList[Math.floor(Math.random() * luckList.length)];

  await conn.sendMessage(
    m.chat,
    {
      text: `🖤: 🎲 @${senderNumber} ${randomLuck}`,
      mentions: [m.sender],
      contextInfo: cli?.config?.info?.channel,
    },
    { quoted: m },
  );
};

handler.usage = ["حظي"];
handler.command = ["حظي"];
handler.category = "games";
export default handler;