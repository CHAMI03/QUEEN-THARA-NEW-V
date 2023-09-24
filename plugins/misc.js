//created by @inrl
const {
    inrl,
    add,
    subtract,
    multiply,
    division,
    qrcode,
    base64e,
    base64d,
    age,
    getLang
} = require('../lib');
let lang = getLang()


inrl({
    pattern: 'calc',
    desc: lang.MISC.CALC_DESC,
    react : "🤥",
    type: 'info'
}, (async (message, match) => {
    if (match.includes('+')) {
        let split = match.split('+');
        let number2 = split[1];
        let number1 = split[0]
        let result = add(number1, number2)
        try {
            return await message.send(result);
        } catch (err) {
            return await message.send(lang.BASE.FAILD);
        }
    } else if (match.includes('-')) {
        let split = match.split('-'),
            inrlsub1 = split[1],
            inrlsub2 = split[0]
        let result = subtract(inrlsub2, inrlsub1)
        try {
            return await message.send(result);
        } catch (err) {
            return await message.send(lang.BASE.FAILD);
        }
    } else if (match.includes('×')) {
        let split = match.split('×'),
            inrlbotswa = split[1],
            inrl1 = split[0]
        let result = multiply(inrl1, inrlbotswa)
        try {
            return await message.send(result);
        } catch (err) {
            return await message.send(lang.BASE.FAILD);
        }
    } else if (match.includes('/')) {
        let split = match.split('/'),
            inrldiv1 = split[1],
            inrldiv2 = split[0]
        let result = division(inrldiv2, inrldiv1)
        try {
            return await message.send(result);
        } catch (err) {
            return await message.send(lang.BASE.FAILD);
        }
    }
}));
inrl({
    pattern: 'base64e',
    desc: lang.MISC.BS64_DESC,
    react : "🤌",
    type: 'converter'
}, (async (message, match) => {
    const text = match || message.quoted.text;
    if (!text) return await message.send(lang.MISC.BS_NEED);
    let encodedString = base64e(text);
    return await message.send(encodedString);
}));
inrl({
    pattern: 'base64d',
    desc: lang.MISC.BS_DEC_DESC,
    react : "🤥",
    type: 'converter'
}, (async (message, match) => {
    const text = match || message.quoted.text;
    if (!text) return await message.send(lang.MISC.BS_DEC_NEED);
    let decodedString = base64d(text);
    return await message.send(decodedString);
}));
inrl({
    pattern: 'qr',
    desc: lang.MISC.QR_DESC,
    react : "💗",
    type: 'create'
}, async (message, match) => {
    if (!match) return await message.send(lang.BASE.TEXT);
    let text = match;
    let ttinullimage = qrcode(text);
    return await message.sendReply(ttinullimage,{},"image");
});
inrl({
    pattern: 'age',
    desc: lang.MISC.AGE_DESC,
    react : "💗",
    type: 'info'
}, async (message, match) => {
    if (!match) return await message.send(lang.MISC.AGE_FORMAT.format("age"));
    let text = match;
    let year, month, day;
    if (text.includes('/')) {
        let split = text.split('/');
        year = split[0];
        month = split[1];
        day = split[2];
    }
    let ageOfYou = age(new Date(year, month, day));
    return await message.send(ageOfYou);
});
