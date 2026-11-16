import { Client } from "meowsab";
import { subBots, subs } from "./system/sub.js";
import "meowsab/safe";
import "./system/database.js";
import * as baileys from "baileys";
import notifications from "./system/notifications.js";
import path from "node:path";

/* ========== Client Config ======== */

const client = new Client({
  // commands
  plugsdir: "plugins",
  prefix: [".", "!"],

  // baileys
  library: [baileys],

  // session
  sessionStorage: {
    type: "sqlite",          
    path: "./session",
  },

  // pairing code
  login: {
    method: "pair",
    number: "حط رقم البوت هنا",
    code: "LOYD1234",
  },

  // owners
  owners: [
    { jid: "966576041803@s.whatsapp.net", lid: "185800855674961@lid" },
    { username: "" },  
  ],

  // control settings
  settings: {
    message_owner_only: false,
    private_mode: false,
    message_group_only: false,
    no_message_baileys: false,
    from_me: false,
  },
});

/* ========== Config Info ======== */

const { config } = client;

config.info = {
  nameBot: "𝐃𝐚𝐫𝐤𝐧𝐞𝐬𝐬 𝐁𝐨𝐭",
  title: "𝐃 𝐀 𝐑 𝐊 — 𝐋𝐋𝐎𝐘𝐃 🖤 | 𝐁𝐨𝐭 𝐢𝐬 𝐛𝐮𝐢𝐥𝐭 𝐨𝐧 𝐭𝐡𝐞 𝐌𝐄𝐎𝐖𝐒𝐀𝐁 𝐅𝐫𝐚𝐦𝐞𝐰𝐨𝐫𝐤",
  channel: {
    isForwarded: true,
    forwardingScore: 1,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "@newsletter",
      newsletterName: "𝐔𝐧𝐢𝐨𝐧 ~ 𝐋𝐋𝐎𝐘𝐃",
      serverMessageId: 0,
    },
  },
  newsletter: {
    name: "𝐔𝐧𝐢𝐨𝐧 ~ 𝐋𝐋𝐎𝐘𝐃",
    jid: "@newsletter",
  },
  images: [
    "https://i.ibb.co/qLRp7r12/65e419debc598d38cb394469e8129f07.jpg",
    "https://i.ibb.co/1tqtGjTs/0f66403b55e38f7d0614e1c7f6b9b94c.jpg",
    "https://i.ibb.co/d48gQM0P/8c9f4acc2be93dc29b65723cbafa6b38.jpg",
    "https://i.ibb.co/1tqtGjTs/0f66403b55e38f7d0614e1c7f6b9b94c.jpg",
  ],
};

/* ========== Send the error to owner ======== */

const conn = client.sock;
const owner = client.owners?.[0]?.jid;

client.on("error", async (err) => {
  if (!conn || !owner) return;

  const errorText = String(err?.stack || err?.message || err).slice(0, 3500);

  try {
    await conn.sendMessage(owner, { text: errorText });
  } catch (e) {
    console.error("Failed to send error:", e);
  }
});

/* ========== Notification ======== */

const plugins = client.plug();
plugins.notification(notifications);

/* ========== Starting ======== */

const start = async () => {
  await client.connect();
  await subBots(client);
  await subs.start();
};

start().catch((err) => {
  console.error("❌ Startup error:", err.message);
});