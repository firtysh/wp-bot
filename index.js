import qrcode from 'qrcode-terminal'
import pkg from 'whatsapp-web.js';
import {handleMsg} from './settings/handler.js'
import { range } from './config/config.js';
const {Client,LocalAuth} =pkg;

const client = new Client({
    authStrategy: new LocalAuth({dataPath:"./auth_data"}) // ./auth_data is the path where session data is stored for session restoration
});

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});
client.on('message',async (message)=>{
    console.log("meaasage is ",message,"\n");
    const chat = await message.getChat();
    console.log("chat is ",chat,"\n");
    if(message.body==='$addthischat'){
        range.push(chat.id._serialized)
    }
    if((range.find(elm=>elm===chat.id._serialized))!==undefined){
        handleMsg(message,chat);
    }
})


client.initialize();