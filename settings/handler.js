import { verifyMsg } from "./verifyMsg.js";
import { studentData } from "../config/config.js";

export const handleMsg = (m) => {
  const { cmd, msg } = verifyMsg(m.body);
  function rep(str) {
    m.reply(str);
  }

  if (cmd === "hello") {
    rep("hi !");
  } else if (cmd === "addstudent") {
    try {
      const studentdata = JSON.parse(msg);
      if (
        "name" in studentdata &&
        "roll" in studentdata &&
        "id" in studentdata &&
        "dob" in studentdata
      ) {
        if (studentData.findIndex((val) => val.id == studentdata.id) == -1) {
          studentData.push(studentdata);
          m.reply("Student data added 😃");
        } else {
          m.reply("Student already exist 😒");
        }
      }
    } catch (e) {
      m.reply(
        'Please specify student data properly\ni.e. $addstdent {"name":"Full Name",\n"roll":"full roll no",\n"id":"last two digit of roll",\n"reg_no":"registration no"\n"dob":"dd/mm/yyyy"}'
      );
    }
  } else if (cmd === "getstdnt") {
    if (msg === undefined) {
      m.reply('Please specify student id');
    } else {
      try {
        if (studentData.findIndex((val) => val.id == msg) == -1) {
          m.reply("Invalid student id or data not available");
        } else {
          let repl = studentData[studentData.findIndex((val) => val.id == msg)];
          m.reply(
            "Name : " +
              repl.name +
              "\nRoll : " +
              repl.roll +
              "\nReg No : " +
              repl.reg_no +
              "\nDOB : " +
              repl.dob
          );
        }
      } catch (e) {}
    }
  }
};
