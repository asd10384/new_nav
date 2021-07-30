
require('dotenv').config();
const express = require('express');
const router = express.Router();

// http -> https
router.all('*', async (req, res, next) => {
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  if (protocol == 'https' || req.hostname == 'localhost') {
    next();
  } else {
    res.redirect(`https://${req.hostname}${req.url}`);
  }
});

module.exports = router;