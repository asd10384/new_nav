
require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database');
const go = require('./go');

// 시작
router.get('/setting(/:opt)?', async (req, res) => {
  const token = req.cookies['token'];
  let decode = jwt.decode(token);
  if (!decode) return res.status(200).send(`
    <script type=text/javascript>
      alert('로그인후 이용해주세요.');
      window.location='/login';
    </script>
  `);
  if (req.params.opt) {
    if (req.params.opt == 'delete') {
      return go(req, res, {
        code: 200,
        index: `setting`,
        active: ``,
        title: `계정삭제`,
        domain: '/setting',
        check: true,
        data: {
          opt: req.params.opt,
          check: true,
          id: decode.id
        }
      });
    }
  }
  return go(req, res, {
    code: 200,
    index: `setting`,
    active: `설정`,
    title: `설정`,
    domain: '/setting',
    check: true,
    data: {
      opt: '',
      check: false,
      id: decode.id
    }
  });
});
router.post('/setting', async (req, res) => {
  const User = db.module.user();
  const token = req.cookies['token'];
  let decode = jwt.decode(token);
  if (req.body.pw) {
    let pw = await bcrypt.hash(req.body.pw, process.env.SALT);
    let pwcheck = await User.findOne({ id: decode.id, pw: pw });
    if (pwcheck) {
      return go(req, res, {
        code: 200,
        index: `setting`,
        active: `설정`,
        title: `설정`,
        domain: '/setting',
        check: true,
        data: {
          check: true,
          name: decode.name,
          id: decode.id
        }
      });
    } else {
      return res.status(500).send(`
        <script type=text/javascript>
          alert('올바르지 않은 비밀번호');
          window.location='/profile';
        </script>
      `);
    }
  }
  return res.status(500).send(`
    <script type=text/javascript>
      alert('오류가 발생했습니다.');
      window.location='/setting';
    </script>
  `);
});
// 끝

module.exports = router;