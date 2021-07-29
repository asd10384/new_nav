
export default class Champion {
  constructor(id = String, data = {
    name: String,
    date: String,
    role: {
      main: String,
      sub: String
    },
    price: {
      RP: Number,
      BE: Number
    },
    skill: {
      passive: {
        name: String,
        des: String
      },
      Q: {
        nam: String,
        des: String,
      },
      W: {
        name: String,
        des: String,
      },
      E: {
        name: String,
        des: String,
      },
      R: {
        name: String,
        des: String,
      }
    }
  }) {
    this.id = id;
    this.name = data.name;
    this.date = data.date;
    this.role = data.role;
    this.price = data.price;
    this.skill = data.skill;
  }
}
