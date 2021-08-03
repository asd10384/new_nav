
require('dotenv').config();
const hcs = require('hcs.js');
const db = require('./database');
const func = require('./func');

const User = db.module.user();
const Server = db.module.server();

let _webpush;

module.exports = {
  timer: selfcheck_timer,
  run: selfcheck_run
};
async function selfcheck_timer(webpush) {
  _webpush = webpush;
  console.log(`자동 자가진단 타이머 실행중`);
  setInterval(async function () {
    Server.find().then(async (obj) => {
      for (i in obj) {
        var sdb = db.object.server;
        sdb = obj[i];
        var { week, hour, min, sec } = func.now_date_addtime(new Date());
        if (week === '토' || week === '일') return;
        if (Number(sdb.time.hour) == hour && Number(sdb.time.min) == min && sec == 0) {
          selfcheck_run(sdb);
        }
      }
    });
  }, 1000);
}

async function selfcheck_run(sdb = db.object.server) {
  await User.findOne({ name: sdb.name, id: sdb.id }).then(async (db1) => {
    var udb = db.object.user;
    udb = db1;
    const login = await hcs.login(udb.selfcheck.school.endpoint, udb.selfcheck.school.schoolCode, udb.name, udb.birthday.year + udb.birthday.month + udb.birthday.day);
    const login2 = await hcs.secondLogin(udb.selfcheck.school.endpoint, login.token, udb.selfcheck.pw);
    const val = await hcs.registerSurvey(
      udb.selfcheck.school.endpoint,
      login2.token,
      { Q1: false, Q2: false, Q3: false }
    );
    var emoj;
    if (val) {
      emoj = {
        msg: {
          success: `성공`,
          data: val.registeredAt
        },
        payload: {
          title: `님 자동 자가진단 성공`,
          body: `시간: ${val.registeredAt}`,
          icon: '/image/icon.png',
          badge: `/image/badge.png`,
          vibrate: [200, 100, 200, 100, 200, 100, 200],
          tag: 'notice',
          url: `${process.env.DOMAIN}`
        }
      };
    } else {
      emoj = {
        msg: {
          success: `실패`,
          data: 'error'
        },
        payload: {
          title: `님 자동 자가진단 실패`,
          body: `자가진단 오류`,
          icon: '/image/icon.png',
          badge: `/image/badge.png`,
          vibrate: [200, 100, 200, 100, 200, 100, 200],
          url: `${process.env.DOMAIN}`
        }
      };
    }
    if (_webpush) {
      emoj.payload.title = `${udb.name}${emoj.payload.title}`;
      _webpush.sendNotification(udb.notice, JSON.stringify(emoj.payload)).then(() => {
        console.log(`${udb.name}님 자동자가진단 ${emoj.msg.success} : ${emoj.msg.data}`);
        return console.log(`${udb.name}님 자동자가진단 메세지 : 전송 성공`);
      }).catch((err) => {
        console.log(`${udb.name}님 자동자가진단 ${emoj.msg.success} : ${emoj.msg.data}`);
        return console.log(`${udb.name}님 자동자가진단 메세지 : 전송 실패`);
      });
    }
  });
}
