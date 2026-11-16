const handler = async (m, { cli, text }) => {
if (text === 'on') {
cli.config.settings.message_owner_only = true;
  return m.reply("تم تفعيل وضع رسأل الاونر");
}
  else if (text === 'off') {
    cli.config.settings.message_owner_only = false;
    return m.reply('تم ايقاف وضع الرسائل للأونر');
  }
  else if (!text) {
    const status = cli.config.settings.message_owner_only
    ? 'مفعل'
    : 'معطل';

  return m.reply(`حالة وضع الأونر: ${status}`);
  }
  else {
  return m.reply(
    ' ❌طريقة الاستخدام:\n' +
    '.مود_اونر on\n' +
    '.مود_اونر off\n' +
    '.مود_اونر عرض الحالة'
  );
  }
};
handler.usage = ["مود_اونر"]
handler.command = ['مود_اونر'];
handler.owner = true;
handler.category = "owners";
export default handler;