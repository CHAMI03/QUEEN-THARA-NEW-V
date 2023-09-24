const {
    inrl,
    commands,
    send_alive,
    send_menu,
    getLang,
    UpdateVariable
} = require('../lib')
const Config = require("../config");
let lang = getLang()
inrl({
    pattern: 'list',
    desc: lang.LIST.DESC,
    react: "💯",
    type: 'info'
}, async (message) => {
    let b=1,c="";commands.map((e=>{e.pattern&&e.desc?c+=`${b++} *${e.pattern.replace(/[^a-zA-Z0-9,-]/g,"")}*\n_${e.desc}_\n\n`:c+=`${b++} *${e.pattern?e.pattern.replace(/[^a-zA-Z0-9,-]/g,""):''}*\n`}));
    return await message.send(c);
});

inrl({
    pattern: "menu",
    desc: lang.MENU.DESC,
    react: "📰",
    type: 'whatsapp'
}, async (message, match, data) => {
    return await send_menu(message, data);
});

inrl({
    pattern: "alive",
    desc: lang.ALIVE.DESC,
    react: "🥰",
    type: 'info',
    usage:lang.ALIVE.HELP
}, async (message, match, data) => {
    if(match == "get" && message.client.isCreator){
    return await message.send(data.ALIVE_DATA);
    } else if(match && message.client.isCreator){
    await UpdateVariable("ALIVE_DATA", match.trim(), message.conn.user.number);
    return await message.send('*success*');
    }
    return await send_alive(message, data);
});

inrl({
    pattern: "cmd",
    react: "🆗",
    type: 'info'
}, async (message, match) => {
    return await message.client.sendMessage(message.from, {
        text: commands.length.toString()
    }, {
        quoted: message
    });
});
