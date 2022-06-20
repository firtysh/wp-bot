import { verifyMsg } from "./verifyMsg.js";
import { studentData } from "../config/config.js";

export const handleMsg = (m, chat) => {
  const { cmd, msg } = verifyMsg(m.body);
  // console.log(m);
  function rep(str) {                                 // function for replying to chat
    m.reply(str);
  }
  function send(str) {                                //function to send msg in a chat
    chat.sendMessage(str);
  }
  function setBirthdayReminder(bday, name) {          // set birthday reminder
    const delay_lim = 0x7fffffff;
    function wish(day, month, year, name) {
      send("Happy Birthday " + name);
      setTimeout(() => {
        setWish(day + "/" + month + "/" + year, name, year + 1);
      }, delay_lim);
    }
    function setWish(date_str, name, yr) {
      const d = new Date();
      const [day, month] = date_str.split("/");
      let year = d.getFullYear();
      if (
        d.getMonth() > month - 1 ||
        (d.getMonth() === month - 1 && d.getDate() >= day)
      ) {
        year = year + 1;
      }
      const date2 = new Date(yr || year, month - 1, day);
      let dif = Math.abs(date2.getTime() - d.getTime());
      if (dif > delay_lim)
        //setTimeout limit is MAX_INT32=(2^31-1)
        setTimeout(function () {
          setWish(date_str, name, year);
        }, delay_lim);
      else
        setTimeout(() => {
          wish(day, month, year, name);
        }, dif+100);
    }
    setWish(bday, name);
  }
  if (cmd === "hello") {                              // cmd= hello
    rep("hi !");
    // send("Hello 2");
  } else if (cmd === "addstdnt") {                    // cmd= add student
    console.log(msg);
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
          console.log(studentdata.dob);
          rep("Student data added 😃");
          setBirthdayReminder(studentdata.dob, studentdata.name);
        } else {
          rep("Student already exist 😒");
        }
      }
    } catch (e) {
      console.log(e);
      rep(
        'Please specify student data properly\ni.e. $addstdnt {"name":"Full Name",\n"roll":"full roll no",\n"id":"last two digit of roll",\n"reg_no":"registration no",\n"dob":"dd/mm/yyyy"}'
      );
      send('Just copy and edit 😉');
      send('$addstdnt {"name":"Suman Mandal",\n"roll":"2010110XXXX",\n"id":"XX",\n"reg_no":"2010101002100XX",\n"dob":"XX/XX/2003"}')
    }
  } else if (cmd === "getstdnt") {                    // cmd= get student
    if (msg === undefined) {
      rep("Please specify student id");
    } else {
      try {
        if (studentData.findIndex((val) => val.id == msg) == -1) {
          rep("Invalid student id or data not available");
        } else {
          let repl = studentData[studentData.findIndex((val) => val.id == msg)];
          rep(
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
  // else {                                           // cmd=
  //   rep("INVALID COMMAND");
  // }
};
