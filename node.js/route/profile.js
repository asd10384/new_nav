
require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database');
const qdb = require('quick.db');
const func = require('../func');
const go = require('./go');

// 시작
router.get('/profile(/change/:chdata)?', async (req, res) => {
  const token = req.cookies['token'];
  let decode = jwt.decode(token);
  if (!decode) return res.status(200).send(`
    <script type=text/javascript>
      alert('로그인후 이용해주세요.');
      window.location='/login';
    </script>
  `);
  if (req.params.chdata) {
    if (req.params.chdata == 'id') {
      return go(req, res, {
        code: 200,
        index: `profile`,
        active: ``,
        title: `아이디변경`,
        domain: '/profile',
        check: true,
        data: {
          change: req.params.chdata,
          check: true,
          name: decode.name,
          id: decode.id
        }
      });
    }
    if (req.params.chdata == 'pw') {
      return go(req, res, {
        code: 200,
        index: `profile`,
        active: ``,
        title: `비밀번호변경`,
        domain: '/profile',
        check: true,
        data: {
          change: req.params.chdata,
          check: true,
          name: decode.name,
          id: decode.id
        }
      });
    }
  }
  return go(req, res, {
    code: 200,
    index: `profile`,
    active: `내정보`,
    title: `내정보`,
    domain: '/profile',
    check: true,
    data: {
      change: '',
      check: false,
      name: decode.name,
      id: decode.id
    }
  });
});
router.post('/profile', async (req, res) => {
  const User = db.module.user();
  const token = req.cookies['token'];
  let decode = jwt.decode(token);
  if (req.body.pw) {
    let pw = await bcrypt.hash(req.body.pw, process.env.SALT);
    let pwcheck = await User.findOne({ id: decode.id, pw: pw });
    if (pwcheck) {
      return go(req, res, {
        code: 200,
        index: `profile`,
        active: `내정보`,
        title: `내정보`,
        domain: '/profile',
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
  if (req.body.chid) {
    let user = User.findOne({ name: decode.name, id: decode.id });
    if (user) {
      return user.then(async (db1) => {
        var udb = db.object.user;
        udb = db1;
        udb.id = req.body.chid;
        udb.save().catch(() => {
          return res.status(500).send(`
            <script type=text/javascript>
              alert('오류가 발생했습니다.');
              window.location='/profile';
            </script>
          `);
        });
        const token = jwt.sign({
          id: req.body.chid,
          name: decode.name
        }, process.env.JWT_SECRET, {
          expiresIn: '1h'
        });
        res.cookie(`token`, token, { maxAge: 12 * 60 * 60 * 1000 });
        return res.status(500).send(`
          <script type=text/javascript>
            alert('아이디변경 성공');
            window.location='/profile';
          </script>
        `);
      });
    }
  }
  if (req.body.chpw) {
    if (String(req.body.chpw).length < 8) {
      return res.status(500).send(`
        <script type=text/javascript>
          alert('비밀번호는 8자리 이상으로 내정보해야합니다.');
          window.location='/profile/change/pw';
        </script>
      `);
    }
    let user = User.findOne({ name: decode.name, id: decode.id });
    if (user) {
      return user.then(async (db1) => {
        var udb = db.object.user;
        udb = db1;
        let changepw = await bcrypt.hash(req.body.chpw, process.env.SALT);
        udb.pw = changepw;
        udb.save().catch(() => {
          return res.status(500).send(`
            <script type=text/javascript>
              alert('오류가 발생했습니다.');
              window.location='/profile';
            </script>
          `);
        });
        return res.status(500).send(`
          <script type=text/javascript>
            alert('비밀번호변경 성공');
            window.location='/profile';
          </script>
        `);
      });
    }
  }
  return res.status(500).send(`
    <script type=text/javascript>
      alert('오류가 발생했습니다.');
      window.location='/profile';
    </script>
  `);
});
// 끝

module.exports = router;