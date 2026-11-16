const cash = async (m, { cli }) => {
  const deleted = await cli.session.clear();
  const memory =
    (process.memoryUsage().rss / 1024 / 1024).toFixed(1) + " MB";
  return m.reply(
    `✅ تم تنظيف الجلسة.\n` +
    `📊 العدد المحذوف: ${deleted}\n` +
    `🧠 استهلاك الرام الحالي: ${memory}`
  );
};
cash.usage = ["تنظيف"]
cash.command = ["تنظيف"];
cash.owner = true;
cash.category = "owners";
export default cash;