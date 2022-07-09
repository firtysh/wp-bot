import { verifyMsg } from "./verifyMsg.js";
import { studentData } from "../config/config.js";
import pkg from 'whatsapp-web.js'
const {MessageMedia}= pkg;
import axios from "axios";
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
    try {
      const studentdata = JSON.parse(msg);
      console.log(studentdata);
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
  } else if (cmd === "updtstud") {                    // cmd= update student
    if(msg === undefined){
      rep("Please provide data in correct format.")
      send("For updating student data send in this format :")
      send('$updtstud {"name":"Suman Mandal",\n"roll":"2010110XXXX",\n"id":"XX",\n"reg_no":"2010101002100XX",\n"dob":"XX/XX/2003"}\n')
      send('This will update the student data corresponding to the ID you provide')
    }else{
      try {
        const studentdata = JSON.parse(msg)
        console.log('update student');
        console.log(studentdata.id);
        let index =studentData.findIndex((val) => val.id == studentdata.id)
        if ( index == -1) {
            rep("Plese add data using $addstdnt before updating")
        } else {
          studentData[index]=studentdata;
          rep('Student Data updated 🙃')
        }
      } catch (error) {}
    }
  } else if (cmd === "result") {                      // cmd = get result from jgec website
      if(msg===undefined) {
        rep('Please provide data in cdorrect format')
        send('Get semester results using :')
        send('$result semester(number between 1 to 8) department(abbreviation) roll no\n eg:')
        send('$result 3 IT 20101106050')
      } else {
        const [sem,dept,roll] = msg.split(' ');
        axios.get(`https://jgec.ac.in/php/coe/results/${sem}/${dept}_SEM${sem}_${roll}.pdf`,{
          responseType: 'arraybuffer'
        })
        .then(response => {
          const media = new MessageMedia('application/pdf',Buffer.from(response.data, 'binary').toString('base64'),`${dept}_SEM${sem}_${roll}.pdf`)
          send(media)
      })
      .catch(error => {
        console.log(error)
        send("Invalid Data entered")
      });
      
      }
  } else if (cmd === "commands") {
    rep("addstdnt : for adding student data\ngetstdnt : for viewing student data \nupdtstud : for updating student data\nresult : for viewng semester results of jgec\nabout : details about the bot")
  } else if (cmd === "about") {
    rep("Owner : Suman Mandal\nGithub : https://github.com/firtysh/wp-bot\nReport issues here : https://github.com/firtysh/wp-bot/issues\nDo give it a 🌟")
  }
  // else {                                           // cmd=
  //   rep("INVALID COMMAND");
  // }
};
