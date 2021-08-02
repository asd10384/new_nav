
require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../database');
const hcs = require('hcs.js');
const go = require('./go');

// 회원가입 시작
router.get('/signup', async (req, res) => {
  return go(req, res, {
    code: 200,
    index: `signup`,
    title: `회원가입`,
    active: '회원가입',
    domain: '/signup',
    data: {
      err: ''
    }
  });
});
router.post('/signup', async (req, res) => {
  const User = db.module.user();
  var { name, id, pw, birthday, area, school, selfpw } = req.body;

  if (
    (String(pw).length < 8)
    || (school.indexOf('학교') === -1)
    || (String(selfpw).length < 4 || String(selfpw).length > 4)
  ) {
    return go(req, res, {
      code: 200,
      index: `signup`,
      title: `회원가입`,
      active: '회원가입',
      domain: '/signup',
      data: {
        err: `입력사항을 다시한번 확인해주세요.`
      }
    });
  }

  birthday = birthday.split('-');
  let birthday6 = `${birthday[0].slice(-2)}${birthday[1]}${birthday[2]}`;
  var check = await User.findOne({ id: id });
  if (check) {
    return res.send(`
      <script type=text/javascript>
        alert('이미 존재하는 아이디 입니다.\\n다른 아이디를 사용해주세요.');
        window.location='/signup';
      </script>
    `);
  }
  const schools = await hcs.searchSchool(school);
  if (!schools) return res.send(`
    <script type=text/javascript>
      alert('${school}이라는 학교를 찾을수 없습니다.');
      window.location='/signup';
    </script>
  `);
  const login = await hcs.login(schools[0].endpoint, schools[0].schoolCode, name, birthday6);
  if (!login.token) return res.send(`
    <script type=text/javascript>
      alert('회원가입 오류\\n자가진단오류 : ${login.message || '입력된 정보의 유저를 찾을수없습니다.'}');
      window.location='/signup';
    </script>
  `);
  const login2 = await hcs.secondLogin(schools[0].endpoint, login.token, selfpw);
  if (!login2.success) return res.send(`
    <script type=text/javascript>
      alert('회원가입 오류\\n자가진단오류 : 자가진단 비밀번호가 다릅니다.');
      window.location='/signup';
    </script>
  `);
  await hcs.updateAgreement(schools[0].endpoint, login.token);

  new User({
    name: name,
    id: id,
    pw: await bcrypt.hash(pw, process.env.SALT),
    admin: false,
    birthday: {
      year: birthday[0].slice(-2),
      month: birthday[1],
      day: birthday[2]
    },
    selfcheck: {
      area: area,
      school: schools[0],
      pw: selfpw,
      time: {
        hour: '',
        min: ''
      },
      onoff: false
    },
    notice: {
      endpoint: '',
      expirationTime: null,
      keys: {
        p256dh: '',
        auth: ''
      }
    }
  }).save().catch(() => {
    return res.send(`
      <script type=text/javascript>
        alert('회원가입 실패\\n오류발생: 다시시도해주세요.');
        window.location='/signup';
      </script>
    `);
  }).then(() => {
    console.log(`${name}님 회원가입 성공!\n아이디: ${id}`);
    return res.send(`
      <script type=text/javascript>
        alert('${name}님 회원가입 성공!');
        window.location='/login';
      </script>
    `);
  });
});
// 회원가입 끝

module.exports = router;
