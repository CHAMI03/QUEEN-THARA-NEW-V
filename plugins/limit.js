//https://g.v.com/db/user/verify?key=98272_ueuy_1637
const {
    inrl,
    GenrateOtp,
    isVerified,
    IsMailed,
    isValidMailid,
    sendMail,
    clearUserFromMail,
    getVerifiedUsers,
    verifyUser,
    giveLimit,
    resetLimit,
    getLimitV2,
    removeUserLimit,
    getLang
} = require('../lib');
let lang = getLang()

inrl({
    pattern: 'permit',
    desc: lang.PERMIT.DESC,
    type: "action",
    onlyPm: true,
    fromMe: 'public'
}, async (m, match) => {
    const user = m.sender.split('@')[0];
    if (!match && !m.client.isCreator) return await m.send(lang.PERMIT.INVALID_FORMAT);
    if (match == "remove") {
        if(m.client.isCreator  && !m.reply_message.sender) return await m.send(lang.BASE.NEED.format("user"));
        const va = await clearUserFromMail(user, m.client.user.number);
        return await m.send(`${va?"_user removed from mail-db_": "_this user not found in mail-db_"}`);
    } else if (match == "get") {
        if(!m.client.isCreator) return await m.send(lang.BASE.NOT_AUTHR);
        const list = await getVerifiedUsers(m.client.user.number);
        return await m.send(list);
    }
    if(m.client.isCreator) return await m.send(lang.PERMIT.SUDO);
    const ver = await IsMailed(user, m.client.user.number);
    if (ver) return await m.send("_already mailed_\n```permit remove to remove your data```");
    let valid = await isValidMailid(match);
    if (!valid) return await m.send("_invalid mail_");
    const key = GenrateOtp();
    const res = await sendMail(match, key, user, m.client.user.number);
    return await m.reply("```successfull```\nuse *otp* key _to verify_\n*_eg:- otp Hx54Gf_*");
});
inrl({
    pattern: 'otp',
    desc: 'To give permission for some (`$`) cmds',
    type: "action",
    onlyPm: true,
    fromMe: 'public'
}, async (m, match) => {
    const user = m.sender.split('@')[0];
    const ver = await IsMailed(user, m.client.user.number);
    if (!ver) return await m.send("_not mailed yet!_");
    if (!match) return await m.send("_give me your code_");
    if (match.length != 6) return await m.send("_invalid key_\n key length nust be 6");
    const vr = await verifyUser(match, user, m.client.user.number);
    return await m.send(`${vr?"_*user verified*_": "*_Failed_*"}`)
});
inrl({
    pattern: 'limit',
    desc: 'To give permission for some (`$`) cmds',
    type: "action",
    onlyPm: true,
    fromMe: true
}, async (m, match) => {
    if (!m.quoted.sender) return await m.reply('*_reply to a user_*\n*_eg:- limit get_* _<reply to a user>_\n*_limit reset_* _to reset limit_\n*_limit kick_* _to remove user permanently_');
    const user = m.quoted.sender.split('@')[0];
    const valid = await isVerified(user, m.client.user.number);
    if (!valid) return await m.reply('```user must be verified befor giving limit```');
    if (!match) return m.reply('filed\nex:- *limit* ```reset``` _to reset_\n*limit* ```kick``` _to remove user_\n*limit* ```get``` _to get limit_\n*limit* 5 _to give limit_');
    if (match == "reset") {
        await resetLimit(user, m.client.user.number);
        return await m.send('```requested to DB```')
    } else if (match == "kick") {
        const res = await removeUserLimit(user, m.client.user.number);
        return await m.send(`_${res?"user removed": "*Failed*"}_`)
    } else if (match == "get") {
        const res = await getLimitV2(user, m.client.user.number);
        return await m.send(res);
    }
    let limit = match.replace(/[^0-9]/gi, '');
    if (!limit) return await m.send('*Failed*\n*eg:- limit 10*');
    if (limit > 20) return await m.reply('*_maximum limit upto 20_*\n_after thet limit try to limit reset_');
    await giveLimit(user, limit, m.client.user.number);
    return m.send("successfull");
});
