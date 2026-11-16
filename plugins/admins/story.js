const STATUS_COLORS = [
    0xFF5B5BD6,
    0xFF0F766E,
    0xFF2563EB,
    0xFF7C3AED,
    0xFFDB2777,
    0xFFEA580C,
    0xFF16A34A,
    0xFF334155
];

const cleanJid = (jid = '') => String(jid).split('@')[0].split(':')[0];
const sameUser = (a, b) => {
    const first = cleanJid(a);
    const second = cleanJid(b);
    return Boolean(first && second && first === second);
};

const randomStatusColor = () => STATUS_COLORS[Math.floor(Math.random() * STATUS_COLORS.length)];

const unwrapMessage = (message = {}) => {
    if (!message || typeof message !== 'object') return {};
    return (
        message.ephemeralMessage?.message ||
        message.viewOnceMessage?.message ||
        message.viewOnceMessageV2?.message ||
        message.documentWithCaptionMessage?.message ||
        message
    );
};

const MEDIA_TYPES = ['imageMessage', 'videoMessage', 'audioMessage'];

const getQuotedMedia = (m) => {
    const rawMessage = m.quoted?.message || {};
    const unwrapped = unwrapMessage(rawMessage);
    const directContent = m.quoted?.msg && typeof m.quoted.msg === 'object' ? m.quoted.msg : null;
    const candidates = [unwrapped, rawMessage, directContent].filter(Boolean);

    for (const candidate of candidates) {
        const type = MEDIA_TYPES.find((key) => candidate?.[key]);
        if (type) {
            return {
                type,
                content: candidate[type] || {},
                rawMessage: rawMessage[type] ? rawMessage : unwrapped,
                quoted: m.quoted
            };
        }
    }

    if (MEDIA_TYPES.includes(m.quoted?.mtype)) {
        return {
            type: m.quoted.mtype,
            content: directContent || unwrapped[m.quoted.mtype] || {},
            rawMessage,
            quoted: m.quoted
        };
    }

    return null;
};

const toBuffer = async (value) => {
    if (!value) return null;
    if (Buffer.isBuffer(value)) return value;
    if (value instanceof Uint8Array) return Buffer.from(value);
    if (typeof value.arrayBuffer === 'function') return Buffer.from(await value.arrayBuffer());
    return null;
};

const downloadQuotedMedia = async (conn, media) => {
    const quoted = media.quoted || {};

    if (typeof quoted.download === 'function') {
        const buffer = await toBuffer(await quoted.download());
        if (buffer?.length) return buffer;
    }

    if (typeof conn.downloadMediaMessage === 'function') {
        const buffer = await toBuffer(await conn.downloadMediaMessage(quoted, 'buffer', {}));
        if (buffer?.length) return buffer;
    }

    return null;
};

const buildMediaContent = (media, buffer) => {
    const content = media.content || {};
    const caption = content.caption || media.quoted?.caption || '';

    if (media.type === 'imageMessage') {
        return {
            image: buffer,
            caption,
            mimetype: content.mimetype || 'image/jpeg'
        };
    }

    if (media.type === 'videoMessage') {
        return {
            video: buffer,
            caption,
            mimetype: content.mimetype || 'video/mp4',
            gifPlayback: Boolean(content.gifPlayback)
        };
    }

    return {
        audio: buffer,
        mimetype: content.mimetype || 'audio/ogg; codecs=opus',
        ptt: Boolean(content.ptt ?? media.quoted?.ptt)
    };
};

const uploadMediaStory = async (conn, chat, media) => {
    const attempts = [];
    const buffer = await downloadQuotedMedia(conn, media).catch(() => null);

    if (buffer?.length) attempts.push(buildMediaContent(media, buffer));
    if (media.rawMessage) attempts.push(media.rawMessage);

    let lastError = null;
    for (const payload of attempts) {
        try {
            await conn.groupStatusV2(chat, payload);
            return;
        } catch (e) {
            lastError = e;
        }
    }

    throw lastError || new Error('تعذر تجهيز الوسائط للرفع');
};

const getStoryText = (m, text, args) => {
    if (Array.isArray(args) && args.length) return args.join(' ').trim();
    if (text) return String(text).trim();

    const prefix = m.prefix || '.';
    let body = String(m.text || '').trim();
    if (prefix && body.startsWith(prefix)) body = body.slice(prefix.length).trim();

    const commands = ['ستوري', 'استوري', 'story', 'groupstory'];
    if (commands.includes(body.toLowerCase())) return '';

    for (const command of commands) {
        if (body.toLowerCase().startsWith(`${command} `)) {
            return body.slice(command.length).trim();
        }
    }

    return body;
};

const checkGroupAdmin = async (conn, chat, sender) => {
    try {
        const metadata = await conn.groupMetadata(chat);
        const participant = metadata?.participants?.find((p) =>
            [p.id, p.jid, p.phoneNumber].some((id) => sameUser(id, sender))
        );
        return participant?.admin === 'admin' || participant?.admin === 'superadmin';
    } catch {
        return false;
    }
};

async function handler(m, { conn, isAdmin, isOwner, isROwner, text, args }) {
    try {
        const isGroupChat = Boolean(m.isGroup || m.chat?.endsWith('@g.us'));
        if (!isGroupChat) {
            return await m.reply('الأمر ده يشتغل في الجروب فقط');
        }

        if (typeof conn.groupStatusV2 !== 'function') {
            return await m.reply('خاصية استوري الجروب مش مفعلة في البوت');
        }

        const botJid = conn.decodeJid ? conn.decodeJid(conn.user?.id || '') : conn.user?.id;
        const ownerByMessage = Boolean(isOwner || isROwner || m.isOwner || m.fromMe || sameUser(m.sender, botJid));
        const adminByGroup = typeof isAdmin === 'boolean'
            ? isAdmin
            : await checkGroupAdmin(conn, m.chat, m.sender);

        if (!adminByGroup && !ownerByMessage) {
            return await m.reply('الأمر ده متاح لأدمن الجروب والاونر فقط');
        }

        const quotedMedia = getQuotedMedia(m);
        if (quotedMedia) {
            await uploadMediaStory(conn, m.chat, quotedMedia);
            return await m.reply('تم رفع الاستوري في الجروب');
        }

        const storyText = getStoryText(m, text, args);
        if (!storyText) {
            return await m.reply('رد على صورة أو فيديو أو صوت، أو اكتب النص بعد الأمر');
        }

        await conn.groupStatusV2(m.chat, {
            extendedTextMessage: {
                text: storyText,
                backgroundArgb: randomStatusColor(),
                textArgb: 0xFFFFFFFF,
                font: 1
            }
        });

        return await m.reply('تم رفع النص كاستوري للجروب');
    } catch (e) {
        console.error('[Group Story]', e?.stack || e);
        return await m.reply('حصل خطأ أثناء رفع الاستوري');
    }
}

handler.usage = ['ستوري'];
handler.category = 'admins';
handler.command = ['ستوري', 'استوري', 'story', 'groupstory'];
handler.group = true;

export default handler;
