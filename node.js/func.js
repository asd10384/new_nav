
require('dotenv').config();
const axios = require('axios');
const { load } = require('cheerio');

const weeklist = ['일', '월', '화', '수', '목', '금', '토'];

module.exports = {
  now_date,
  now_date_addtime,
  az,
  getCovid
};
async function now_date(time = new Date) {
  var year = time.getFullYear();
  var month = time.getMonth() + 1;
  var day = time.getDate();
  var wday = time.getDay();
  var hour = time.getHours();
  var min = time.getMinutes();
  var sec = time.getSeconds();
  var week = weeklist[wday];
  if (hour >= 24) {
    hour = hour - 24;
    day = day + 1;
    wday = wday + 1;
    week = (wday > 6) ? weeklist[wday - 6] : weeklist[wday];
  }
  console.log(week);
  var nowtime = {
    'year': year,
    'month': month,
    'day': day,
    'hour': hour,
    'min': min,
    'sec': sec,
    'week': week,
    'time': {
      '1': `${year}년 ${month}월 ${day}일 ${hour}시 ${min}분 ${sec}초`,
      '2': `${year}년 ${az(month, 2)}월 ${az(day, 2)}일 ${az(hour, 2)}시 ${az(min, 2)}분 ${az(sec, 2)}초`,
    },
  };
  return nowtime;
}
function now_date_addtime(time = new Date) {
  var year = time.getFullYear();
  var month = time.getMonth() + 1;
  var day = time.getDate();
  var wday = time.getDay();
  var hour = time.getHours() + Number(process.env.ADDHOUR);
  var min = time.getMinutes();
  var sec = time.getSeconds();
  var week = weeklist[wday];
  if (hour >= 24) {
    hour = hour - 24;
    day = day + 1;
    wday = wday + 1;
    week = (wday >= 6) ? weeklist[wday - 6] : weeklist[wday];
  }
  var nowtime = {
    'year': year,
    'month': month,
    'day': day,
    'hour': hour,
    'min': min,
    'sec': sec,
    'week': week,
    'time': {
      '-_az': `${year}-${az(month, 2)}-${az(day, 2)} ${az(hour, 2)}:${az(min, 2)}:${az(sec, 2)}`,
      '1': `${year}년 ${month}월 ${day}일 ${hour}시 ${min}분 ${sec}초`,
      '2': `${year}년 ${az(month, 2)}월 ${az(day, 2)}일 ${az(hour, 2)}시 ${az(min, 2)}분 ${az(sec, 2)}초`,
    },
  };
  return nowtime;
}

function az(num = Number, digit = Number) {
  var zero = '';
  for (i = 0; i < digit - num.toString().length; i++) {
    zero += '0';
  }
  return zero + num;
}

async function getCovidHtml() {
  try {
    return await axios.get(`http://ncov.mohw.go.kr/bdBoardList_Real.do?brdId=1&brdGubun=11&ncvContSeq=&contSeq=&board_id=&gubun=`);
  } catch (err) {
    console.log(err);
  }
}

let covidhtml = '';
async function getCovid() {
  if (!covidhtml) {
    covidhtml = await getCovidHtml();
  }
  const $ = load(covidhtml.data);
  let smp = {};
  const $bodyList = $('.wrap.nj form .container .content .caseTable .ca_body li').children('dl');
  $bodyList.each(function (i, elem) {
    let text = $(this).find('dd').text().trim().replace(/([\t|\n])/gi, '');
    if (text.slice(0,2) == '소계') {
      text = text.replace(/(소계|국내발생|해외유입)/g, (val) => {
        return '#@#'+val+'#@#';
      });
      text = text.split('#@#').slice(1);
      for (let i=0; i<text.length; i++) {
        if (text[i] == '소계') text[i] = '확진자';
        smp[text[i]] = text[++i];
      }
    }
  });
  return smp;
}