
require('dotenv').config();
const express = require('express');
const router = express.Router();
const func = require('../func');
const go = require('./go');

// 시작
router.get('/api/covid', async (req, res) => {
  const covidobj = await func.getCovid();
  return go(req, res, {
    code: 200,
    index: `api/covid`,
    active: ``,
    title: `코로나`,
    domain: '/api/covid',
    data: {
      '확진자': covidobj['확진자'],
      '국내발생': covidobj['국내발생'],
      '해외유입': covidobj['해외유입']
    }
  });
});
// 끝

module.exports = router;