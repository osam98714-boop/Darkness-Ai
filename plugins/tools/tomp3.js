import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const execAsync = promisify(exec);

const toAudio = async (m, { conn, usedPrefix, command }) => {
  try {
    if (!m.quoted)
      return m.reply(
        `*⪩ لازم ترد على فيديو: ↯ •*\n` +
        `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
        `⦑ ➊ ⦒ ⦂ .${command} ↜ ⟦ رد على فيديو أو صوت ⟧\n` +
        `⦑ ➋ ⦒ ⦂ مثال ↜ ⟦ .${command} (بالرد على فيديو) ⟧\n\n` +
        `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
        `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`
      );

    const tmp = path.join(process.cwd(), "tmp");
    if (!fs.existsSync(tmp)) fs.mkdirSync(tmp, { recursive: true });

    const video = path.join(tmp, `${Date.now()}.mp4`);
    const audio = path.join(tmp, `${Date.now()}.mp3`);

    fs.writeFileSync(video, await m.quoted.download());

    await execAsync(`ffmpeg -i "${video}" -vn -acodec libmp3lame "${audio}" -y`);

    await conn.sendMessage(
      m.chat,
      { audio: fs.readFileSync(audio), mimetype: "audio/mpeg" },
      { quoted: m }
    );

    try { fs.unlinkSync(video); } catch {}
    try { fs.unlinkSync(audio); } catch {}
  } catch (e) {
    await conn.sendMessage(m.chat, {
      text:
        `*⪩ حصل خطأ: ↯ •*\n` +
        `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
        `⦑ ➊ ⦒ ⦂ ${e.message}\n\n` +
        `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
        `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`
    }, { quoted: m });
  }
};

toAudio.usage = ["لصوت"];
toAudio.category = "tools";
toAudio.command = ["لصوت", "tomp3"];
export default toAudio;