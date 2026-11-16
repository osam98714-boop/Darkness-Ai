import axios from "axios";
import FormData from "form-data";
import { Api } from "meowsab";

const voiceMap = {
  "فويس1": 1, "فويس2": 2, "فويس3": 3, "فويس4": 4, "فويس5": 5,
  "فويس6": 6, "فويس7": 7, "فويس8": 8, "فويس9": 9, "فويس10": 10,
  "فويس11": 11, "فويس12": 12, "فويس13": 13, "فويس14": 14, "فويس15": 15,
  "فويس16": 16, "فويس17": 17, "فويس18": 18, "فويس19": 19, "فويس20": 20,
  "فويس21": 21, "فويس22": 22, "فويس23": 23, "فويس24": 24, "فويس25": 25,
  "فويس26": 26, "فويس27": 27, "فويس28": 28, "فويس29": 29, "فويس30": 30
};

const handler = async (m, { conn, command }) => {
  if (!m.quoted)
    return m.reply(
      `*⪩ لازم ترد على ملف صوتي: ↯ •*\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
      `⦑ ➊ ⦒ ⦂ .${command} ↜ ⟦ رد على صوت ⟧\n` +
      `⦑ ➋ ⦒ ⦂ مثال ↜ ⟦ .${command} (بالرد على صوت) ⟧\n\n` +
      `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
      `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`
    );

  try {
    const voiceId = voiceMap[command];
    if (!voiceId) return;

    const buffer = await m.quoted.download();

    const form = new FormData();
    form.append("file", buffer, {
      filename: "vu.mp3",
      contentType: "audio/mpeg",
    });

    const uploadRes = await axios.post(
      "https://c.termai.cc/api/upload?key=AIzaBj7z2z3xBjsk",
      form,
      {
        headers: form.getHeaders(),
        timeout: 30000,
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      }
    );

    if (!uploadRes.data?.status || !uploadRes.data?.path)
      return m.reply(
        `*⪩ فشل رفع الملف: ↯ •*\n` +
        `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
        `⦑ ➊ ⦒ ⦂ حاول تاني بعد شوية\n\n` +
        `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
        `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`
      );

    const audioUrl = uploadRes.data.path;
    const union = await Api.name("auralix");

    const result = await union.url("/tools/voice-changer", {
      voice: voiceId,
      url: audioUrl,
    });

    if (!result?.ok || !result?.data?.audio)
      return m.reply(
        `*⪩ فشل تغيير الصوت: ↯ •*\n` +
        `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n\n` +
        `⦑ ➊ ⦒ ⦂ حاول تاني بعد شوية\n\n` +
        `── ⋅ ⋅ ── 🖤 ── ⋅ ⋅ ── \n` +
        `> ⦂ 𝐝𝐚𝐫𝐤𝐧𝐞𝐬𝐬 ↚ 𝐛𝐲 : 𝐋𝐋𝐎𝐘𝐃 ╷`
      );

    const audioBuffer = Buffer.from(result.data.audio, "base64");

    await conn.sendMessage(
      m.chat,
      {
        audio: audioBuffer,
        mimetype: "audio/mpeg",
        ptt: true,
      },
      { quoted: m }
    );
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

const cmd = Object.keys(voiceMap);
handler.command = cmd;
handler.category = "voice";
handler.usage = cmd;

export default handler;