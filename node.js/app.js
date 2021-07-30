
require('dotenv').config();
const path = require('path');
const http = require('http');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const sessionParser = require('express-session');
const qdb = require('quick.db');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/ejs'));

app.use(cors({
  origin: '*',
  // methods: ['GET','POST']
}));
app.use(flash());
app.use(sessionParser({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/'));

const route = fs.readdirSync('./route').filter(file => file.endsWith('.js'));
route.forEach((file) => {
  if (file !== 'go.js' && file !== 'https.js') app.use(require(`./route/${file.replace('.js', '')}`));
});

app.use(async function (req, res) {
  return res.status(404).render(`err`, {
    domain: process.env.DOMAIN,
    data: {
      text: `현재 제작중...`
    }
  });
});

app.listen(process.env.PORT, async function () {
  await listen(`NODEJS Route IS ONLINE`);
});

async function listen(text = '') {
  console.log(`${text}\nDOMAIN : ${process.env.DOMAIN}\nPORT: ${process.env.PORT}\nqdb: ${qdblog()}`);

  setInterval(() => {
    http.get(process.env.SLEEP/*replace(/\:.+/g, '')*/, (res) => {
      res.on('data', () => {
        console.log(`\n사이트가 정상작동 중입니다.\n주소 : ${process.env.DOMAIN}\nqdb: ${qdblog()}\n`);
      });

      res.on('error', () => {
        console.log(`사이트에 오류가 발생했습니다.\n주소 : ${process.env.DOMAIN}\nres: ${res.statusCode}`);
      });
    });
  }, (60 * 1000) * Number(process.env.SLEEP_TIME));
}

function qdblog() {
  var db_text = '';
  try {
    db_text = JSON.stringify(qdb.fetch(`db`));
  } catch (err) {
    db_text = '없음';
  }
  return `${(db_text) ? db_text : '없음'}`;
}
