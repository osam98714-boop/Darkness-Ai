export default {
    auto: true,

    run: async (m, { conn, isAdmin }) => {
        if (!m.sender || m.fromMe) return;

        const user = global.db?.users?.[m.lid];
        if (user?.banned === true) return "stop";

        if (m.isGroup) {
            const group = global.db?.groups?.[m.chat];

            if (group?.no_links === true && m.text && /chat\.whatsapp\.com|wa\.me|https?:\/\/\S+/i.test(m.text)) {
                if (!m.isOwner && isAdmin) {
                    await m.delete();
                    return "stop";
                }
            }

            if (group?.onlyAdmin === true && !m.isAdmin && !m.isOwner) {
                return "stop";
            }
        }

        if (global.db?.onlyOwner === true && !m.isOwner) {
            return "stop";
        }

        if (m.isGroup) {
            const muteList = global.db?.groups?.[m.chat]?.mute;
            if (muteList?.[m.lid]) {
                await m.delete();
                return "stop";
            }
        }
    }
}