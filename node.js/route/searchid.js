
require('dotenv').config();
const express = require('express');
const router = express.Router();
const db = require('../database');
const go = require('./go');

// 시작
router.get('/searchid', async (req, res) => {
  return go(req, res, {
    code: 200,
    index: `searchid`,
    active: ``,
    title: `아이디찾기`,
    domain: '/searchid',
    data: {
      name: '',
      id: ''
    }
  });
});
router.post('/searchid', async (req, res) => {
  const User = db.module.user();
  let { name, selfpw } = req.body;

  let checkname = await User.findOne({ name: name });
  if (!checkname) {
    return res.status(200).send(`
      <script type=text/javascript>
        alert('${name} (이)라는 유저를\\n찾을수없습니다.');
        window.location='/searchid';
      </script>
    `);
  }
  let getuser = await User.findOne({ name: name, 'selfcheck.pw': selfpw });
  if (!getuser) {
    return res.status(200).send(`
      <script type=text/javascript>
        alert('올바르지 않은 비밀번호');
        window.location='/searchid';
      </script>
    `);
  }
  return go(req, res, {
    code: 200,
    index: `searchid`,
    active: ``,
    title: `아이디찾기`,
    domain: '/searchid',
    data: {
      name: getuser.name,
      id: getuser.id
    }
  });
});
// 끝

module.exports = router;