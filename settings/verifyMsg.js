import {initial} from '../config/config.js'
export const verifyMsg= (msg)=>{
    if(msg[0]===initial){
        msg= msg.split(initial)[1].split(/(?<=^\S+)\s/);
        return {cmd:msg[0].toLowerCase(),msg:msg[1]}
    }
    return false;
}