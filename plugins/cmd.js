const {
    inrl,
    setCmd,
    DeleteCmd,
    getCmd,
    getLang
} = require("../lib")
let lang = getLang()

inrl({
    pattern: 'setcmd',
    desc: lang.MEDIA_CMD.SET_DESC,
    react: "😛",
    type: "action",
    fromMe :true
}, async (message, match) => {
    if (!message.reply_message.sticker) return await message.reply(lang.MEDIA_CMD.NOT_A_STICKER.format("setcmd ping,reply to a media message"));
    if (!message.reply_message.msg.fileSha256) return message.send(lang.MEDIA_CMD.CMD_ERROR)
    if (!match) return await message.send(lang.MEDIA_CMD.NO_CMD)
    await setCmd(message.quoted.msg.fileSha256.join(""), match,message.client.user.number)
    return await message.reply(lang.BASE.SUCCESS)
});
inrl({
    pattern: 'dltcmd',
    desc: lang.MEDIA_CMD.DEL_DESC,
    react: "💥",
    type: "action",
    fromMe :true
}, async (message, match) => {
    if (!match) return await message.send(lang.MEDIA_CMD.NO_CMD)
    await DeleteCmd(match,message.client.user.number)
    return await message.reply(lang.BASE.SUCCESS)
});
inrl({
    pattern: 'getcmd',
    desc: lang.MEDIA_CMD.GET_DESC,
    react: "💥",
    type: "action",
    fromMe :true
}, async (message, match) => {
    let data = await getCmd(message.client.user.number),
        cmds = lang.MEDIA_CMD.CMD_LIST;
    if (data == "no data") return message.send(lang.MEDIA_CMD.NOT_FOUND)
    let n = 1;
    data.map((b) => {
        cmds += '```'+`${n++}  ${b.cmd}`+'```'+`\n`;
    })
    return await message.reply(cmds)
});
