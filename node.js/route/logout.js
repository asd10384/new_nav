
require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../database');
const go = require('./go');

// 로그아웃, 계정삭제 시작
router.get('/logout', async (req, res) => {
  res.cookie(`token`, null);
  return res.status(200).send(`
    <script type=text/javascript>
      alert('로그아웃 되셨습니다.');
      window.location='/';
    </script>
  `);
});

router.get('/delete', async (req, res) => {
  return go(req, res, {
    code: 200,
    index: `delete`,
    title: `계정삭제`,
    domain: '/delete',
    check: true
  });
});
router.post('/delete', async (req, res) => {
  const User = db.module.user();
  const token = req.cookies['token'];
  var decode = await jwt.decode(token);
  if (!decode || !decode.id) {
    return res.status(200).send(`
      <script type=text/javascript>
        alert('로그인후 이용해주세요.');
        window.location='/login';
      </script>
    `);
  }
  User.findOneAndDelete({ id: decode.id }).then(async (db1) => {
    var udb = db.object.user;
    udb = db1;
    if (udb && udb.name) {
      res.cookie(`token`, null);
      return res.status(200).send(`
        <script type=text/javascript>
          alert('${udb.name}님 계정 삭제 완료.');
          window.location='/';
        </script>
      `);
    } else {
      res.cookie(`token`, null);
      return res.status(500).send(`
        <script type=text/javascript>
          alert('계정삭제중 오류가 발생했습니다.');
          window.location='/';
        </script>
      `);
    }
  });
});
// 로그아웃, 계정삭제 끝

module.exports = router;