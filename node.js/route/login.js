
require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database');
const go = require('./go');

// 로그인 시작
router.get('/login', async (req, res) => {
  return go(req, res, {
    code: 200,
    index: `login`,
    title: `로그인`,
    active: '로그인',
    domain: '/login'
  });
});
router.post('/login', async (req, res) => {
  const User = db.module.user();
  var { id, pw } = req.body;

  pw = await bcrypt.hash(pw, process.env.SALT);

  var idcheck = await User.findOne({ id: id });
  if (idcheck) {
    var pwcheck = await User.findOne({ id: id, pw: pw });
    if (pwcheck) {
      const token = jwt.sign({
        id: id,
        name: pwcheck.name,
        admin: false,
      }, process.env.JWT_SECRET, {
        expiresIn: '1h'
      });
      res.cookie(`token`, token, { maxAge: 12 * 60 * 60 * 1000 });
      console.log(`로그인 성공 : ${id}`);
      return res.status(200).send(`
        <script type=text/javascript>
          alert('로그인 성공');
          window.location='/';
        </script>
      `);
    } else {
      console.log(`로그인 실패 : ${id}`);
      return res.status(500).send(`
        <script type=text/javascript>
          alert('올바르지 않은 비밀번호');
          window.location='/login';
        </script>
      `);
    }
  }
  return res.status(500).send(`
    <script type=text/javascript>
      alert('아이디를 찾을수 없습니다.');
      window.location='/login';
    </script>
  `);
});
// 로그인 끝

module.exports = router;
