const activeGames = new Map();

async function handler(m, { conn }) {
    if (activeGames.has(m.chat)) {
        clearTimeout(activeGames.get(m.chat).timeout);
        activeGames.delete(m.chat);
    }
    
    const res = await fetch("https://gist.githubusercontent.com/Kyutaka101/799d5646ceed992bf862026847473852/raw/dcbecff259b1d94615d7c48079ed1396ed42ef67/gistfile1.txt");
    const data = await res.json();
    const country = data[Math.floor(Math.random() * data.length)];
    
    const msg = await conn.sendMessage(m.chat, {
        image: { url: country.img },
        caption: "🌍 *خمن العلم*\n\nلديك 30 ثانيه لـ الإجابة رد علي الرساله ب اسم العلم"
    });
    
    activeGames.set(m.chat, {
        answer: country.name.toLowerCase(),
        image: country.img,
        msgId: msg.key.id,
        timeout: setTimeout(() => {
            const game = activeGames.get(m.chat);
            if (game) {
                activeGames.delete(m.chat);
                conn.sendMessage(m.chat, { text: `⏰ *أنتهي الوقت* الإجابة هي : *${game.answer}*` });
            }
        }, 30000)
    });
}

handler.before = async (m, { conn }) => {
    if (!m.quoted || !m.text) return;
    
    const game = activeGames.get(m.chat);
    if (!game) return;
    if (m.quoted.id !== game.msgId) return;
    
    if (m.text.toLowerCase().trim() === game.answer) {
        clearTimeout(game.timeout);
        activeGames.delete(m.chat);
        
        await conn.sendMessage(m.chat, {
            image: { url: game.image },
            caption: `🎉 *صحيح صحيح* عاش جبت اسم العلم صح\n💡 هل هتعرف تكمل؟\n\n> اكتب *${m.prefix || '.'}علم* عشان تلعب تاني`
        });
        return true;
    }
    
    await m.reply("*❌ إجابة غلط رد جرب تاني*");
    return true;
};

handler.usage = ["علم"];
handler.category = "games";
handler.command = ['علم', 'country'];

export default handler;
