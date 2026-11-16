import { Api } from "meowsab";
import axios from "axios";
import { exec } from "child_process";
import fs from "fs";

const reactionsMap = {
  "airkiss": "بوسة",
  "angrystare": "غضب",
  "bite": "عض",
  "bleh": "لسان",
  "blush": "خجل",
  "brofist": "سلام",
  "celebrate": "احتفال",
  "cheers": "نخب",
  "clap": "تصفيق",
  "confused": "ارتباك",
  "cool": "كول",
  "cry": "عياط",
  "cuddle": "حضن",
  "dance": "رقص",
  "drool": "لعاب",
  "evillaugh": "ضحكة",
  "facepalm": "كف",
  "handhold": "إيد",
  "happy": "سعادة",
  "headbang": "رأس",
  "hug": "حضن",
  "huh": "هاه",
  "laugh": "ضحك",
  "love": "حب",
  "mad": "غضب",
  "nervous": "توتر",
  "no": "رفض",
  "nuzzle": "احتضان",
  "nyah": "دلع",
  "pat": "بطح",
  "peek": "تطل",
  "pinch": "قرصة",
  "poke": "نكز",
  "pout": "عبوس",
  "punch": "لكمة",
  "roll": "تقلب",
  "run": "جري",
  "sad": "حزن",
  "scared": "خوف",
  "shout": "صياح",
  "shrug": "كتف",
  "shy": "خجل",
  "sigh": "تنهيدة",
  "sing": "غنا",
  "sip": "رشفة",
  "slap": "قلم",
  "sleep": "نوم",
  "slowclap": "تصفيق",
  "smack": "صفعة",
  "smile": "ابتسامة",
  "smug": "تعجرف",
  "sneeze": "عطسة",
  "sorry": "اعتذار",
  "stare": "تحديق",
  "stop": "توقف",
  "surprised": "مفاجأة",
  "sweat": "عرق",
  "thumbsup": "تحية",
  "tickle": "دغدغة",
  "tired": "تعب",
  "wave": "تلويح",
  "wink": "غمزة",
  "woah": "واو",
  "yawn": "تثاؤب",
  "yay": "ياي",
  "yes": "موافقة"
};

const commandMap = {};
Object.entries(reactionsMap).forEach(([key, value]) => {
  if (commandMap[value]) {
    commandMap[value].push(key);
  } else {
    commandMap[value] = [key];
  }
});

const arabicCommands = Object.keys(commandMap);

let handler = async (m, { conn, command }) => {
  const mentioned = m.mentionedJid && m.mentionedJid[0];

  if (!mentioned)
    return m.reply(
      `*⪩ لازم تعمل منشن: ↯ •*\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
      `⦑ ➊ ⦒ ⦂ .${command} @شخص ↜ ⟦ لعمل ${command} ⟧\n` +
      `⦑ ➋ ⦒ ⦂ مثال ↜ ⟦ .${command} @user ⟧\n\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
      `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`
    );

  const apiKey = commandMap[command][0];

  try {
    const union = await (await import("meowsab")).Api.name("ota");
    const result = await union.url("/gif", { reaction: apiKey, format: "gif" });
    const url = typeof result === "string" ? result : (result.url || result.image || result.data);
    if (!url) throw new Error("مفيش رابط");

    const res = await axios.get(url, { responseType: "arraybuffer" });
    const tmpGif = `${process.cwd()}/tmp/tmp_${Date.now()}.gif`;
    const tmpMp4 = `${process.cwd()}/tmp/tmp_${Date.now()}.mp4`;
    
    if (!fs.existsSync(`${process.cwd()}/tmp`)) fs.mkdirSync(`${process.cwd()}/tmp`, { recursive: true });
    
    fs.writeFileSync(tmpGif, Buffer.from(res.data));

    await new Promise((resolve, reject) => {
      exec(`ffmpeg -y -i "${tmpGif}" -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" "${tmpMp4}"`, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    const buffer = fs.readFileSync(tmpMp4);

    await conn.sendMessage(
      m.chat,
      {
        video: buffer,
        gifPlayback: true,
        mimetype: "video/mp4",
        caption:
          `*⪩ ${command}: ↯ •*\n` +
          `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
          `⦑ ➊ ⦒ ⦂ من ↜ ⟦ @${m.sender.split("@")[0]} ⟧\n` +
          `⦑ ➋ ⦒ ⦂ إلى ↜ ⟦ @${mentioned.split("@")[0]} ⟧\n\n` +
          `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
          `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`,
        mentions: [m.sender, mentioned],
      },
      { quoted: m }
    );

    fs.unlinkSync(tmpGif);
    fs.unlinkSync(tmpMp4);

  } catch (error) {
    m.reply(
      `*⪩ حصل خطأ: ↯ •*\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
      `⦑ ➊ ⦒ ⦂ ${error.message}\n\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
      `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`
    );
  }
};

handler.command = arabicCommands;
handler.category = "gif";
handler.useg = arabicCommands;
handler.usage = arabicCommands;

export default handler;