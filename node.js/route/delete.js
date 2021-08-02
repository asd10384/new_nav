
require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../database');
const go = require('./go');

router.post('/delete', async (req, res) => {
  const User = db.module.user();
  const token = req.cookies['token'];
  var decode = jwt.decode(token);
  if (!decode || !decode.id) {
    return res.status(200).send(`
      <script type=text/javascript>
        alert('로그인후 이용해주세요.');
        window.location='/login';
      </script>
    `);
  }
  User.findOneAndDelete({ id: decode.id }).then(async (db1) => {
    if (db1 && db1.id) {
      return res.status(200).send(`
        <script type=text/javascript>
          alert('${decode.name}님 계정 삭제 완료.');
          window.location='/logout';
        </script>
      `);
    } else {
      return res.status(500).send(`
        <script type=text/javascript>
          alert('계정삭제중 오류가 발생했습니다.');
          window.location='/';
        </script>
      `);
    }
  });
});

module.exports = router;