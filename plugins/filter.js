const {
    inrl,
    addFilterV2,
    getFilterV2,
    removeFilter,
    getLang
} = require('../lib');
let lang = getLang()

const Config = require("../config");
inrl({
    pattern: 'filter',
    desc: lang.FILTERS.DESC,
    react: "🌝",
    type: 'info',
    onlyGroup: true,
    fromMe : true
}, async (m) => {
    const text = m.client.text;
    const conn = m.conn;
    if (text == "get" || text == "getall") {
        if (text == "getall") {
            const res = await getFilterV2(m.from, true, m.client.user.number);
            return await m.send(res);
        } else {
            const res = await getFilterV2(m.from, false, m.client.user.number);
            return await m.send(res);
        }
    } else if ((text.includes("del") || text.includes("dlt")) && !text.includes('=')) {
        if (!text.replace("dlt","").replace("del","").trim()) return m.send('*Failed*');
        const res = removeFilter(m.from, text.replace("dlt","").replace("del","").trim(), m.client.user.number);
        if (!res) return await m.send(lang.FILTERS.NOT_FOUND.format("*filter get*"));
        return await m.send("successfull");
    }
    if (!text.includes('=')) return await m.reply(lang.FILTERS.INVALID.format("*filter 💗=https://example.webp/sticker*\n\n"));
    const response = await addFilterV2(m.from, text, m.client.user.number);
    return await m.reply(`${response?"_success_":"*Failed*\n"+lang.FILTERS.INVALID.format("*filter 💗=https://example.webp/sticker*\n\n")}`);
});
