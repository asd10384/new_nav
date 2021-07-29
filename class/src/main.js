import Champion from "./class.js";

let nunu = new Champion('nunu', {
  name: '누누',
  date: '몰라',
  price: {
    BE: '1000',
    RP: '1000'
  },
  role: {
    main: '몰라',
    sub: '몰라'
  },
  skill: {
    passive: {
      name: '몰라',
      des: '몰라'
    },
    Q: {
      name: '몰라',
      des: '몰라'
    },
    W: {
      name: '몰라',
      des: '몰라'
    },
    E: {
      name: '몰라',
      des: '몰라'
    },
    R: {
      name: '몰라',
      des: '몰라'
    }
  }
});

document.querySelector('.t').innerHTML = JSON.stringify(nunu);
