import os from "os";

const handler = async (m, { conn, bot, config, cli }) => {
  const b = bot || {};
  const usedRam = (process.memoryUsage().rss / 1024 / 1024).toFixed(1);
  const heapUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1);
  const heapTotal = (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(1);
  const totalRam = (os.totalmem() / 1024 / 1024 / 1024).toFixed(1);
  const freeRam = (os.freemem() / 1024 / 1024 / 1024).toFixed(1);

  const cpuList = os.cpus() || [];
  const cpuCores = cpuList.length || 1;
  const cpuModel = cpuList[0]?.model || "Unknown";
  const cpuSpeed = ((cpuList[0]?.speed || 0) / 1000).toFixed(1);

  let totalIdle = 0;
  let totalTick = 0;
  for (const cpu of cpuList) {
    for (const t in cpu.times) totalTick += cpu.times[t];
    totalIdle += cpu.times.idle;
  }
  const cpuUsage = cpuList.length
    ? (100 - (100 * totalIdle) / totalTick).toFixed(1)
    : "0.0";

  const platform = os.platform();
  const arch = os.arch();
  const hostname = os.hostname();
  const uptime = process.uptime();
  const uptimeHours = Math.floor(uptime / 3600);
  const uptimeMins = Math.floor((uptime % 3600) / 60);
  const uptimeSecs = Math.floor(uptime % 60);

  const isTermux = platform === "android" || !!process.env.TERMUX_VERSION;
  const envName = isTermux ? "Termux" : "Hosting";

  const groups = await conn.groupFetchAllParticipating();
  const groupCount = Object.values(groups).length;

  const subBots = global.subBots;
  const subCount = subBots?.list().length || 0;
  const subConnected = subBots?.list().filter(x => x.connected).length || 0;

  const owners = b.owners || cli?.owners || cli?.config?.owners || [];

  const msg =
    `*⪩ مـعـلـومـات الـبـوت ↯ •*\n` +
    `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
    `⦑ 🎪 ⦒ ⦂ الاسم ↜ ⟦ ${conn.user.name || b.config?.info?.nameBot || cli?.config?.info?.nameBot || "User"} ⟧\n` +
    `⦑ ⏱️ ⦒ ⦂ شغال منذ ↜ ⟦ ${uptimeHours.toString().padStart(2, '0')}:${uptimeMins.toString().padStart(2, '0')}:${uptimeSecs.toString().padStart(2, '0')} ⟧\n` +
    `⦑ 🌐 ⦒ ⦂ البيئة ↜ ⟦ ${envName} ⟧\n\n` +
    `⦑ 💻 ⦒ ⦂ النظام ↜ ⟦ ${platform} ${arch} ⟧\n` +
    `⦑ 🖥️ ⦒ ⦂ الجهاز ↜ ⟦ ${hostname} ⟧\n` +
    `⦑ ⚙️ ⦒ ⦂ المعالج ↜ ⟦ ${cpuModel.slice(0, 30)}... ⟧\n` +
    `⦑ 🧩 ⦒ ⦂ النوى ↜ ⟦ ${cpuCores} نواة @ ${cpuSpeed}GHz ⟧\n` +
    `⦑ 📈 ⦒ ⦂ الحمل ↜ ⟦ ${cpuUsage}% ⟧\n\n` +
    `⦑ 🧠 ⦒ ⦂ الرام المستخدم ↜ ⟦ ${usedRam}MB / ${totalRam}GB ⟧\n` +
    `⦑ 🆓 ⦒ ⦂ الرام الفارغ ↜ ⟦ ${freeRam}GB ⟧\n` +
    `⦑ 📦 ⦒ ⦂ Heap ↜ ⟦ ${heapUsed}MB / ${heapTotal}MB ⟧\n\n` +
    `⦑ 📊 ⦒ ⦂ المجموعات ↜ ⟦ ${groupCount} ⟧\n\n` +
    `⦑ 🎪 ⦒ ⦂ البوتات الفرعية ↜ ⟦ ${subCount} ⟧\n` +
    `⦑ 🟢 ⦒ ⦂ المتصل ↜ ⟦ ${subConnected} ⟧\n` +
    `⦑ 🔴 ⦒ ⦂ المنفصل ↜ ⟦ ${subCount - subConnected} ⟧\n\n` +
    `⦑ 👑 ⦒ ⦂ المالكين ↜ ⟦ ${owners.length} ⟧\n\n` +
    `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
    `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`;

  await conn.linkPreview(
    m.chat,
    {
      text: msg,
      url: "https://i.ibb.co/d48gQM0P/8c9f4acc2be93dc29b65723cbafa6b38.jpg",
      height: 438,
      width: 734,
      title:
        "𝐃 𝐀 𝐑 𝐊 — 𝐋𝐋𝐎𝐘𝐃 🖤 | 𝐁𝐨𝐭 𝐢𝐬 𝐛𝐮𝐢𝐥𝐭 𝐨𝐧 𝐭𝐡𝐞 𝐌𝐄𝐎𝐖𝐒𝐀𝐁 𝐅𝐫𝐚𝐦𝐞𝐰𝐨𝐫𝐤",
      description: "𝙰 𝚋𝚘𝚝 𝚝𝚘 𝚝𝚎𝚜𝚝 𝚝𝚑𝚎 𝚗𝚎𝚠 𝚏𝚛𝚊𝚖𝚎𝚠𝚘𝚛𝚔",
    },
    { quoted: m }
  );
};

handler.command = ["معلومات", "info", "botinfo", "حالة"];
handler.category = "info";
handler.usage = ["معلومات"];
export default handler;