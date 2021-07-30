
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
router.get('/setting', async (req, res) => {
  return go(req, res, {
    code: 200,
    index: `setting`,
    active: `설정`,
    title: `설정`,
    domain: '/setting'
  });
});
// 끝

module.exports = router;