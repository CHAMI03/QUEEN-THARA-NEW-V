const axios = require('axios');
const {inrl} = require('../lib');
inrl({
	on: "text"
}, async (m, match, {PREFIX,AUTO_CHAT_PM,AUTO_CHAT_GRP}) => {
  if((m.key.id.startsWith("BAE5") && m.key.id.length == 16)) return;
  if(m?.fromMe) return;
  const prefix = PREFIX=='false'?'':PREFIX;
  let isFalseOrNot = prefix==''?'i£':prefix;
  if(m.client.body.startsWith(isFalseOrNot)) return;
  if(AUTO_CHAT_PM == "true" && !m.isGroup){
  let {data} = await axios(`http://api.brainshop.ai/get?bid=172372&key=nbjE0YAlyw3cpoMl&uid=[${m.sender}]&msg=[${m.client.body}]`)
  return await m.reply(data.cnt)
  } else if(!m.client.body.startsWith(isFalseOrNot) && AUTO_CHAT_GRP == "true" && m.isGroup){
  let {data} = await axios(`http://api.brainshop.ai/get?bid=172372&key=nbjE0YAlyw3cpoMl&uid=[${m.sender}]&msg=[${m.client.body}]`)
  return await m.reply(data.cnt)
  }
});
