const {
        inrl,
        isAdmin,
        isBotAdmin,
        add_Schedule,
        getPdm,
        setpdm,
        removePdm,
        getAntiLink,
        setAntiLink,
        removeAntiLink,
        GetWords,
        setAntiWord,
        GetFake,
        setFakeNum,
        removeAFake,
        removeWord,
        getAutomutes,
        dlt_Schedule,
        getAutoUnMutes,
        getListofFake,
        getListOfWord,
        getLang
} = require('../lib');
let lang = getLang()
const actions = ["null", "kick", "warn"];
inrl({
        pattern: 'amute',
        desc: lang.GROUP.AMUTE.DESC,
        react: "🙃",
        type: "manage",
        onlyGroup: true
}, async (message, match, {
        ADMIN_SUDO_ACCESS
}) => {
        let admin = await isAdmin(message);
        let BotAdmin = await isBotAdmin(message);
        if (!BotAdmin) return await message.reply(lang.GROUP.BOT_ADMIN)
        if (ADMIN_SUDO_ACCESS != "true" && !message.client.isCreator) return await message.reply(lang.BASE.NOT_AUTHR)
        if (!admin && !message.client.isCreator) return await message.reply(lang.BASE.NOT_AUTHR)
        if (!match.match(':')) return message.reply(lang.GROUP.AMUTE.NEED_TIME)
        let [hr, mn] = match.split(':');
        if (hr.length == 1) hr = '0' + hr;
        if (mn.length == 1) mn = '0' + mn;
        if (isNaN(hr) || isNaN(mn)) return message.reply(lang.GROUP.AMUTE.INVALID_FORMAT.format("amute 10:10"));
        await add_Schedule(message, `${hr}:${mn}`, 'mute')
        let ast = hr > 12 ? `${hr-12}:${mn}PM` : `${hr}:${mn}AM`;
        ast = lang.GROUP.AMUTE.SUCCESS.format(ast);
        return message.reply(ast)
});
inrl({
        pattern: 'aunmute',
        desc: lang.GROUP.AUTOUNMUTE.DESC,
        react: "😣",
        type: "manage",
        onlyGroup: true
}, async (message, match, {
        ADMIN_SUDO_ACCESS
}) => {
        let admin = await isAdmin(message);
        let BotAdmin = await isBotAdmin(message);
        if (!BotAdmin) return await message.reply(lang.GROUP.BOT_ADMIN)
        if (ADMIN_SUDO_ACCESS != "true" && !message.client.isCreator) return await message.reply(lang.BASE.NOT_AUTHR)
        if (!admin && !message.client.isCreator) return await message.reply(lang.BASE.NOT_AUTHR)
        if (!match.match(':')) return message.reply(lang.GROUP.AUTOUNMUTE.NEED_TIME)
        let [hr, mn] = match.split(':')
        if (hr.length == 1) hr = '0' + hr;
        if (mn.length == 1) mn = '0' + mn;
        if (isNaN(hr) || isNaN(mn)) return message.reply(lang.GROUP.AUTOUNMUTE.INVALID_FORMAT.format("aunmute 10:10"));
        await add_Schedule(message, `${hr}:${mn}`, 'unmute', message.client.user.number)
        let ast = hr > 12 ? `${hr-12}:${mn}PM` : `${hr}:${mn}AM`;
        ast = lang.GROUP.AUTOUNMUTE.SUCCESS.format(ast);
        return message.reply(ast)
})
inrl({
        pattern: 'pdm',
        desc: lang.GROUP.PDM.DESC,
        react: "😁",
        type: "manage",
        onlyGroup: true
}, async (message, match, {
        ADMIN_SUDO_ACCESS
}) => {
        let admin = await isAdmin(message);
        let BotAdmin = await isBotAdmin(message);
        if (!BotAdmin) return await message.reply(lang.GROUP.BOT_ADMIN)
        if (ADMIN_SUDO_ACCESS != "true" && !message.client.isCreator) return await message.reply(lang.BASE.NOT_AUTHR)
        if (!admin && !message.client.isCreator) return await message.reply(lang.BASE.NOT_AUTHR)
        if (!match) return message.reply(lang.GROUP.PDM.NEED_ACTION.format('pdm on/off'));
        if (match != 'on' && match != 'off') return message.reply(lang.GROUP.PDM.INVALID.format('pdm on'));
        if (match == "on") {
                let isPdmInDb = await getPdm(message)
                if (isPdmInDb == "true") return message.reply(lang.GROUP.PDM.ALREADY_ACTIVATED);
                await setpdm(message)
                return await message.reply(lang.GROUP.PDM.SUCCESS_ON)
        } else if (match == "off") {
                let isPdmInDb = await getPdm(message)
                if (isPdmInDb == "false") return message.reply(lang.GROUP.PDM.ALREADY_DEACTIVATED);
                await removePdm(message)
                return await message.reply(lang.GROUP.PDM.SUCCESS_OFF)
        }
});
inrl({
                        pattern: 'antilink',
                        desc: lang.GROUP.ANTILINK.DESC,
                        react: "🖕",
                        type: "manage",
                        onlyGroup: true
                }, async (message, match, {
                        ADMIN_SUDO_ACCESS
                }) => {
                        let admin = await isAdmin(message);
                        let BotAdmin = await isBotAdmin(message);
                        if (!BotAdmin) return await message.reply(lang.GROUP.BOT_ADMIN)
                        if (ADMIN_SUDO_ACCESS != "true" && !message.client.isCreator) return await message.reply(lang.BASE.NOT_AUTHR)
                        if (!admin && !message.client.isCreator) return await message.reply(lang.BASE.NOT_AUTHR)
                        if (!match) return message.reply(lang.GROUP.ANTILINK.NEED_ACTION.format("antilink on/off;null"));
                        if (!match.includes('on') && !match.includes('off')) return message.reply(lang.GROUP.ANTILINK.INVALID.format("antilink on|kick"));
                                let {
                                        values
                                } = await getAntiLink(message);
                                if (match.includes("on")) {
                                        if (!match.split(/[;|,]/)[1]) return message.send("Give me an action\nExample:- antilink on, warn");
                                        if (!actions.includes(match.split(/[;|,]/)[1].trim())) return await message.send("action must be kick, warn or null");
                                        if (values == "true") return message.reply(lang.GROUP.ANTILINK.ALREADY_ACTIVATED);
                                        await setAntiLink(message, match.split(/[;|,]/)[1].trim())
                                        return await message.reply(lang.GROUP.ANTILINK.SUCCESS_ON)
                                } else if (match.includes("off")) {
                                        if (values == "false") return message.reply(lang.GROUP.ANTILINK.ALREADY_DEACTIVATED);
                                        await removeAntiLink(message)
                                        return await message.reply(lang.GROUP.ANTILINK.SUCCESS_OFF)
                                }
                        }); inrl({
                                pattern: 'antiword',
                                desc: lang.GROUP.ANTI_WORD.DESC,
                                react: "🖕",
                                type: "manage",
                                onlyGroup: true
                        }, async (message, match, {
                                ADMIN_SUDO_ACCESS
                        }) => {
                                let admin = await isAdmin(message);
                                let BotAdmin = await isBotAdmin(message);
                                if (!BotAdmin) return await message.reply(lang.GROUP.BOT_ADMIN)
                                if (ADMIN_SUDO_ACCESS != "true" && !message.client.isCreator) return await message.reply(lang.BASE.NOT_AUTHR)
                                if (!admin && !message.client.isCreator) return await message.reply(lang.BASE.NOT_AUTHR)
                                if (!match) return message.reply(lang.GROUP.ANTI_WORD.NEED_WORD.format('```antiword idk;kick```'))
                                if (!match.split(/[;|,]/)[1]) return message.send("Give me an action\nExample:- antiword oo, warn");
                                if (!actions.includes(match.split(/[;|,]/)[1].trim())) return await message.send("action must be kick, warn or null");
                                        let data = await GetWords(message);
                                        if (data = "no data") {
                                                await setAntiWord(message, match.split(/[;|,]/)[0].trim(), match.split(/[;|,]/)[1].trim());
                                                return await message.reply(lang.BASE.SUCCESS);
                                        } else if (!data.includes(match.split(/[;|,]/)[0].trim())) {
                                                await setAntiWord(message, match.split(/[;|,]/)[0].trim(), match.split(/[;|,]/)[1].trim());
                                                return await message.reply(lang.BASE.SUCCESS);
                                        } else {
                                                return await message.reply(lang.GROUP.ANTI_WORD.ALLREADY);
                                        }
                                }); inrl({
                                pattern: 'antifake',
                                desc: lang.GROUP.ANTI_FAKE.DESC_ON,
                                react: "🖕",
                                type: "manage",
                                onlyGroup: true
                        }, async (message, match, {
                                ADMIN_SUDO_ACCESS
                        }) => {
                                let admin = await isAdmin(message);
                                let BotAdmin = await isBotAdmin(message);
                                if (!BotAdmin) return await message.reply(lang.GROUP.BOT_ADMIN)
                                if (ADMIN_SUDO_ACCESS != "true" && !message.client.isCreator) return await message.reply(lang.BASE.NOT_AUTHR)
                                if (!admin && !message.client.isCreator) return await message.reply(lang.BASE.NOT_AUTHR)
                                if (!match) return await message.reply(lang.GROUP.ANTI_FAKE.NEED_NUMBER.format("antifake 94"));
                                match = match.replace(/[^0-9]/g, "");
                                if (!match) return message.reply(lang.GROUP.ANTI_FAKE.NO_NUMBER);
                                let data = await GetFake(message);
                                if (data == "no data" || !data) {
                                        await setFakeNum(message, match);
                                        return await message.reply(lang.GROUP.ANTI_FAKE.SUCCESS);
                                } else if (!data.includes(match)) {
                                        await setFakeNum(message, match);
                                        return await message.reply(lang.GROUP.ANTI_FAKE.SUCCESS);
                                } else {
                                        return await message.reply(lang.GROUP.ANTI_FAKE.ALLREDY);
                                }
                        }); inrl({
                                pattern: 'delfake',
                                desc: lang.GROUP.ANTI_FAKE.DESC_DEL,
                                react: "🤥",
                                type: "manage",
                                onlyGroup: true
                        }, async (message, match, {
                                ADMIN_SUDO_ACCESS
                        }) => {
                                let admin = await isAdmin(message);
                                if (ADMIN_SUDO_ACCESS != "true" && !message.client.isCreator) return await message.reply(lang.BASE.NOT_AUTHR)
                                if (!admin && !message.client.isCreator) return await message.reply(lang.BASE.NOT_AUTHR)
                                if (!match) return message.reply(lang.GROUP.ANTI_FAKE.NEED_NUMBER.format("delfake 92"))
                                if (isNaN(match)) return message.reply(lang.GROUP.ANTI_FAKE.NO_NUMBER);
                                let data = await GetFake(message);
                                if (data == "no data" || !data) return await message.reply(lang.GROUP.ANTI_FAKE.NO_FAKE.format("getfake", "getfake all"));
                                if (!data.includes(match)) return await message.reply(lang.GROUP.ANTI_FAKE.NOT_EXIST.format("getfake", "getfake all"));
                                await removeAFake(message, match)
                                return await message.reply(lang.BASE.SUCCESS);
                        }); inrl({
                                pattern: 'delword',
                                desc: lang.GROUP.ANTI_WORD.DESC_DEL,
                                react: "🤦🏿‍♂️",
                                type: "manage",
                                onlyGroup: true
                        }, async (message, match, {
                                ADMIN_SUDO_ACCESS
                        }) => {
                                let admin = await isAdmin(message);
                                if (ADMIN_SUDO_ACCESS != "true" && !message.client.isCreator) return await message.reply(lang.BASE.NOT_AUTHR)
                                if (!admin && !message.client.isCreator) return await message.reply(lang.BASE.NOT_AUTHR)
                                if (!match) return message.reply(lang.GROUP.ANTI_WORD.NEED_WORD.format("delword ok"))
                                let {
                                        values
                                } = await GetWords(message);
                                if (values == "no data") return await message.reply(lang.BASE.FAILD);
                                if (!values.includes(match)) return await message.reply(lang.GROUP.ANTI_WORD.NOT_FOUND.format("getword", "getword all_"));
                                await removeWord(message, match)
                                return message.reply(lang.BASE.SUCCESS);
                        }); inrl({
                                pattern: 'delmute',
                                desc: lang.GROUP.AMUTE.DESC_DEL,
                                react: "🤥",
                                type: "manage",
                                onlyGroup: true
                        }, async (message, match, {
                                ADMIN_SUDO_ACCESS
                        }) => {
                                let admin = await isAdmin(message);
                                if (ADMIN_SUDO_ACCESS != "true" && !message.client.isCreator) return await message.reply(lang.BASE.NOT_AUTHR)
                                if (!admin && !message.client.isCreator) return await message.reply(lang.BASE.NOT_AUTHR)
                                if (!match) return message.reply(lang.GROUP.AMUTE.INVALID_FORMAT.format("delmute 22:15 for 10:15 PM"))
                                if (!match.includes(':')) return await message.reply(lang.GROUP.AMUTE.INVALID_FORMAT.format("delmute 22:15 for 10:15 PM"))
                                let [hr, mn] = match.replaceAll(' ', '').split(':');
                                if (!hr || !mn) return await message.reply(lang.GROUP.AMUTE.INVALID_FORMAT.format("delmute 12:15 for 12:15 AM"));
                                if (hr.length < 2) hr = '0' + hr;
                                if (mn.length < 2) hr = '0' + mn;
                                if (isNaN(hr) || isNaN(mn)) return await message.reply(lang.GROUP.AMUTE.INVALID_FORMAT.format("need time in number format"));
                                let data = await getAutomutes(message.client.user.number);
                                if (data == "no data") return await message.reply(lang.GROUP.AMUTE.NOT_FOUND.format("delmute 22:15", "getmute"));
                                let avb = false
                                await data.map(async ({
                                        jid,
                                        time
                                }) => {
                                        if (!jid.match(message)) return;
                                        if (!time) return await message.reply('*Not Found*\n*amute* 22:22  for 10:22PM');
                                        if (time == `${hr}:${mn}`) {
                                                avb = true;
                                                await dlt_Schedule(message, `${hr}:${mn}`, 'mute');
                                                return await message.reply(lang.BASE.SUCCESS)
                                        }
                                });
                                if (!avb) return await message.reply(lang.GROUP.AMUTE.NO_DATA)
                        }); inrl({
                                pattern: 'delunmute',
                                desc: lang.GROUP.AUTOUNMUTE.DESC_DEL,
                                react: "🥱",
                                type: "manage",
                                onlyGroup: true
                        }, async (message, match, {
                                ADMIN_SUDO_ACCESS
                        }) => {
                                let admin = await isAdmin(message);
                                if (ADMIN_SUDO_ACCESS != "true" && !message.client.isCreator) return await message.reply(lang.BASE.NOT_AUTHR)
                                if (!admin && !message.client.isCreator) return await message.reply(lang.BASE.NOT_AUTHR)
                                if (!match) return message.reply(lang.GROUP.AUTOUNMUTE.NEED_TIME)
                                if (!match.includes(':')) return await message.reply(lang.GROUP.AUTOUNMUTE.INVALID_FORMAT.format("delunmute 10:15 for 10:15 AM"))
                                let [hr, mn] = match.replaceAll(' ', '').split(':');
                                if (!hr || !mn) return await message.reply(lang.GROUP.AUTOUNMUTE.INVALID_FORMAT.format("delunmute 10:15 for 10:15 AM"));
                                if (hr.length < 2) hr = '0' + hr;
                                if (mn.length < 2) hr = '0' + mn;
                                if (isNaN(hr) || isNaN(mn)) return await message.reply('*_need time in number format_*');
                                let data = await getAutoUnMutes(message.client.user.number);
                                if (data == "no data") return await message.reply(lang.GROUP.AUTOUNMUTE.NOT_FOUND.format("delunmute 10:15", "getmute"));
                                let avb = false
                                await data.map(async ({
                                        jid,
                                        time
                                }) => {
                                        if (!jid.match(message)) return;
                                        if (!time) return await message.reply(lang.GROUP.AUTOUNMUTE.NO_DATA);
                                        if (time == `${hr}:${mn}`) {
                                                avb = false
                                                await dlt_Schedule(message, `${hr}:${mn}`, 'unmute', message.client.user.number);
                                                return await message.reply(lang.BASE.SUCCESS)
                                        }
                                });
                                if (!avb) return await message.reply(lang.GROUP.AUTOUNMUTE.NO_DATA)
                        }); inrl({
                                pattern: "getfake",
                                desc: lang.GROUP.ANTI_FAKE.DESC_GET,
                                react: "🥲",
                                type: "manage",
                                onlyGroup: true
                        }, async (message, match, {
                                ADMIN_SUDO_ACCESS
                        }) => {
                                let admin = await isAdmin(message);
                                if (ADMIN_SUDO_ACCESS != "true" && !message.client.isCreator) return await message.reply(lang.BASE.NOT_AUTHR)
                                if (!admin && !message.client.isCreator) return await message.reply(lang.BASE.NOT_AUTHR)
                                if (!match.includes('all') && match) return await message.reply(lang.GROUP.ANTI_FAKE.NOT_FOUND.format("getfake all", "getfake"));
                                if (match == "all") {
                                        let T_X_T = "";
                                        let data = await getListofFake(message.client.user.number);
                                        if (!data || data == "no data") return await message.reply(lang.GROUP.ANTI_FAKE.NO_DATA);
                                        await data.map(async ({
                                                data,
                                                jid
                                        }) => {
                                                if (data) {
                                                        T_X_T += `number: ${data} \njid : ${jid}\n\n`
                                                } else T_X_T = lang.GROUP.ANTI_FAKE.NO_DATA
                                        });
                                        return await message.reply(T_X_T);
                                } else {
                                        let data = await GetFake(message)
                                        if (!data) return await message.reply(lang.GROUP.ANTI_FAKE.NO_DATA);
                                        return await message.reply("```" + data + "```");
                                }
                        }); inrl({
                                pattern: "getword",
                                desc: lang.GROUP.ANTI_WORD.DESC_GET,
                                react: "🤪",
                                type: "manage",
                                onlyGroup: true
                        }, async (message, match, {
                                ADMIN_SUDO_ACCESS
                        }) => {
                                let admin = await isAdmin(message);
                                if (ADMIN_SUDO_ACCESS != "true" && !message.client.isCreator) return await message.reply(lang.BASE.NOT_AUTHR)
                                if (!admin && !message.client.isCreator) return await message.reply(lang.BASE.NOT_AUTHR)
                                if (match.includes('all') && match) return await message.reply(lang.GROUP.ANTI_FAKE.NOT_FOUND.format("getword all", "getword"));
                                if (match == "all") {
                                        let T_X_T = lang.GROUP.ANTI_FAKE.LIST_ALL
                                        let data = await getListOfWord(message.client.user.number);
                                        if (!data || data == "no data") return await message.reply(lang.GROUP.ANTI_FAKE.NO_DATA);
                                        await data.map(async ({
                                                data,
                                                jid
                                        }) => {
                                                T_X_T += `word: ${data} \njid : ${jid}\n\n`
                                        });
                                        return await message.reply(T_X_T);
                                } else {
                                        let data = await GetWords(message);
                                        if (!data) return await message.reply(lang.GROUP.ANTI_FAKE.NO_DATA);
                                        return await message.reply("_" + data + "_");
                                }
                        }); inrl({
                                pattern: "getmute",
                                desc: lang.GROUP.AMUTE.DESC_GET,
                                react: "🤯",
                                type: "manage",
                                onlyGroup: true
                        }, async (message, match, {
                                ADMIN_SUDO_ACCESS
                        }) => {
                                let admin = await isAdmin(message);
                                if (ADMIN_SUDO_ACCESS != "true" && !message.client.isCreator) return await message.reply(lang.BASE.NOT_AUTHR)
                                if (!admin && !message.client.isCreator) return await message.reply(lang.BASE.NOT_AUTHR)
                                if (match.includes('all') && match) return await message.reply(lang.GROUP.AMUTE.NOT_FOUND.format("getmute all", "getmute"));
                                if (match == "all") {
                                        let T_X_T = lang.GROUP.AMUTE.LIST_ALL
                                        let data = await getAutomutes(message.client.user.number);
                                        if (!data || data == "no data") return await message.reply(lang.GROUP.AMUTE.NO_DATA);
                                        await data.map(({
                                                jid,
                                                time,
                                                action
                                        }) => {
                                                T_X_T += `time : ${time}\naction: ${action} \njid : ${jid}\n\n`
                                        });
                                        return await message.reply(T_X_T);
                                } else {
                                        let T_X_T = lang.GROUP.AMUTE.LIST_ALL;
                                        let data = await getAutomutes(message.client.user.number);
                                        if (!data || data == "no data") return await message.reply(lang.GROUP.AMUTE.NO_DATA);
                                        await data.map(({
                                                jid,
                                                time,
                                                action
                                        }) => {
                                                if (jid == message.jid) {
                                                        T_X_T += `time : ${time}\naction : ${action} \n\n`
                                                } else T_X_T = lang.GROUP.AMUTE.NO_DATA
                                        })
                                        return await message.reply(T_X_T.replace(lang.GROUP.AMUTE.NO_DATA, ""));
                                }
                        }); inrl({
                                pattern: "getunmute",
                                desc: lang.GROUP.AUTOUNMUTE.DESC_GET,
                                react: "🥵",
                                type: "manage",
                                onlyGroup: true
                        }, async (message, match, {
                                ADMIN_SUDO_ACCESS
                        }) => {
                                let admin = await isAdmin(message);
                                if (ADMIN_SUDO_ACCESS != "true" && !message.client.isCreator) return await message.reply(lang.BASE.NOT_AUTHR)
                                if (!admin && !message.client.isCreator) return await message.reply(lang.BASE.NOT_AUTHR)
                                if (match.includes('all') && match) return await message.reply(lang.GROUP.AUTOUNMUTE.NOT_FOUND.format("getu nmute all", "getunmute"));
                                if (match == "all") {
                                        let T_X_T = lang.GROUP.AUTOUNMUTE.LIST_ALL;
                                        let data = await getAutoUnMutes(message.client.user.number);
                                        if (!data || data == "no data") return await message.reply(lang.GROUP.AUTOUNMUTE.NO_DATA);
                                        await data.map(async ({
                                                jid,
                                                time,
                                                action
                                        }) => {
                                                T_X_T += `time : ${time}\naction: ${action} \njid : ${jid}\n\n`
                                        });
                                        return await message.reply(T_X_T);
                                } else {
                                        let T_X_T = lang.GROUP.AUTOUNMUTE.LIST_ALL;
                                        let data = await getAutoUnMutes(message.client.user.number);
                                        if (!data || data == "no data") return await message.reply(lang.GROUP.AUTOUNMUTE.NO_DATA);
                                        await data.map(({
                                                jid,
                                                time,
                                                action
                                        }) => {
                                                if (jid == message.jid) {
                                                        T_X_T += `time : ${time}\naction : ${action} \n\n`
                                                } else T_X_T = lang.GROUP.AUTOUNMUTE.NO_DATA
                                        })
                                        return await message.reply(T_X_T);
                                }
                        });
