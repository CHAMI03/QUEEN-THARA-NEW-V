const {
    inrl,
    fetchJson,
    getBuffer,
    sendUrl,
    tinyUrl,
    webSs,
    pdfGen,
    AudioMetaData,
    getLang,
    toAudio
} = require('../lib');
let lang = getLang()

const fs = require('fs');
const {
    readFile,
    writeFile
} = require('fs/promises')
inrl({
    pattern: 'url',
    desc: lang.GENERAL.URL_DESC,
    react: "⛰️",
    type: "converter"
}, async (message, match) => {
    if (!message.client.isMedia) return message.reply(lang.BASE.NEED.format('image/sticker/video/audio'));
    return await sendUrl(message, message.client);
});
inrl({
    pattern: 'tinyurl',
    desc: lang.GENERAL.TINY_DESC,
    react: "😛",
    type: "converter"
}, async (message, match) => {
    if (!match) return message.reply(lang.BASE.ERROR.format('tinyurl https://github.com/inrl-official'));
    return await tinyUrl(message, message.client);
});
inrl({
    pattern: 'webss',
    desc: lang.GENERAL.WEB_SS,
    react: "⚒️",
    type: "misc"
}, async (message, match) => {
    if (!match) return message.reply(lang.BASE.ERROR.format('webss https://github.com/inrl-official'));
    return await webSs(message, message.client);
});
inrl({
    pattern: 'take',
    desc: lang.GENERAL.TAKE_DESC,
    react: "⚒️",
    type: "utility"
}, async (message, match, data) => {
    let {
        AUDIO_DATA,
        STICKER_DATA
    } = data;
    try {
        if (!message.quoted.sticker && !message.quoted.audio) return message.reply('reply to a sticker/audio');
        if (message.quoted.stickerMessage) {
            let pack;
            if (match.split(/[|,;]/)[1]) {
                let i = match.split(/[|,;]/);
                pack = i[0] ? i[0] : STICKER_DATA.split(/[|,;]/)[0];
            } else {
                pack = match || STICKER_DATA.split(/[|,;]/)[0];
            }
            let media = await message.quoted.download();
            return await message.client.sendFile(message.from, media, "", message, {
                asSticker: true,
                packname: pack,
                categories: ["😄"],
            });
        } else if (message.quoted.audioMessage) {
            let text = message.client.text;
            let img = AUDIO_DATA.split(/[|,;]/)[2];
            img = text.split(/[|,;]/)[2] ? text.split(/[|,;]/)[2] : img;
            if(!img) return await message.send(lang.GENERAL.IMG_NEED.format("adata get","adata name;name;url"));
            img = img.trim()
            let imgForaUdio = await getBuffer(img);
            const AudioMeta = await AudioMetaData(imgForaUdio, await toAudio(await message.quoted.download()), text, data);
            return await message.conn.sendMessage(message.jid, {
                audio: AudioMeta,
                mimetype: 'audio/mpeg',
                fileName: text.replaceAll(' ', '-') + ".mp3"
            }, {
                quoted: message
            });
        }
    } catch (e) {
        return await message.reply(e.toString());
    }
})
inrl({
    pattern: 'emix',
    desc: lang.GENERAL.EMIX_DESC,
    react: "🤌",
    type: "create"
}, async (message, match, data) => {
    let {
        STICKER_DATA
    } = data;
    if (!match) return message.send(lang.GENERAL.NEED_EMOJI.format("emix"));
    if (!match.includes(/[|,;]/)) return message.send(lang.GENERAL.NEED_EMOJI.format("emix"));
    let emoji1, emoji2;
    if (match.includes(/[|,;]/)) {
        let split = match.split(/[|,;]/);
        emoji1 = split[0];
        emoji2 = split[1];
    }
    let md = await fetchJson(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`)
    for (let res of md.results) {
        await message.client.sendFile(message.from, await getBuffer(res.url), "",message, {
          asSticker: true,
          author: STICKER_DATA.split(/[|,;]/)[0],
          packname: STICKER_DATA.split(/[|,;]/)[1],
          categories: ["😄", "😊"],
        });
    }
})
