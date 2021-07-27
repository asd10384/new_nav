
require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database');
const qdb = require('quick.db');
const func = require('../func');
const go = require('./go');

// http -> https
// router.all('*', async (req, res, next) => {
//   const protocol = req.headers['x-forwarded-proto'] || req.protocol;
//   if (protocol == 'https' || req.hostname == 'localhost') {
//     next();
//   } else {
//     res.redirect(`https://${req.hostname}${req.url}`);
//   }
// });

// 메인 시작
router.get('/', async (req, res) => {
  return go(req, res, {
    code: 200,
    index: `index`,
    title: `메인`,
    check: true,
    nologin: true
  });
});
// 메인 끝


module.exports = router;
