
require('dotenv').config();
const express = require('express');
const router = express.Router();

// 로그아웃 시작
router.get('/logout', async (req, res) => {
  res.clearCookie('token');
  return res.status(200).send(`
    <script type=text/javascript>
      window.location='/';
    </script>
  `);
});
// 로그아웃 끝

module.exports = router;