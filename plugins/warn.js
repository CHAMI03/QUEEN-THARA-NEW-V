//created by @inrl

const {
    inrl,
    isAdmin,
    isBotAdmin,
    setWarn,
    ResetWarn,
    ListWarn,
    getLang
} = require('../lib');
let lang = getLang()


inrl({
    pattern: 'warn',
    desc: lang.WARN.DESC,
    react: "😑",
    type: "action",
    fromMe :true,
    onlyGroup :true
}, async (message, match, data) => {
await message.send
if(!match && !message.quoted.sender) return await message.send(lang.WARN.METHODE.format("warn","warn","warn"));
if(match == "get"){
let lists = await ListWarn(message), msg =lang.WARN.LIST;
if(!lists[0]) return await message.send('*_Not Found_*');
lists.map((list)=>{
msg += lang.WARN.INFO.format(list.user,list.reason,list.group);
});
return await message.send(msg);
} else if(match == "reset"){
if(!message.reply_message.sender) return await message.send(lang.BASE.NEED.format("user"));
        const d = await ResetWarn(message.quoted.sender, message)
        return await message.send(lang.BASE.SUCCESS);
        } else {
        const BotAdmin = await isBotAdmin(message);
        const admin = await isAdmin(message);
        if (!BotAdmin) return await message.reply(lang.GROUP.BOT_ADMIN);
        if(data.ADMIN_SUDO_ACCESS != "true" && !message.client.isCreator) return await message.reply(lang.BASE.NOT_AUTHR)
        if (!admin && !message.client.isCreator) return await message.reply(lang.BASE.NOT_AUTHR)
    let {
        WARNCOUND
    } = data
    if(!message.reply_message.sender) return await message.send(lang.BASE.NEED.format("user"));
        const t = match || "warning";
        const d = await setWarn(message.quoted.sender, message, t)
        let remains = WARNCOUND - d.count;
        let warnmsg = `❏─────[ ᴡᴀʀɴɪɴɢ ]─────❏
│ User :-${d.user}
❏───────────────────❏
┏─────── INFO ───────❏
│ Reason :- ${d.reason}
│ Count :- ${d.count}
│ Remaining :- ${remains}
┗•─────────────────❏`
        await message.reply(warnmsg)
        if (remains <= 0) {
            const d = await ResetWarn(message.reply_message.sender, message)
            if(BotAdmin){
            await message.client.groupParticipantsUpdate(message.from, [message.quoted.sender], "remove");
            return await message.reply(lang.WARN.MAX)
            };
        };
    };
})
