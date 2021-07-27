
require('dotenv').config();
const { Schema, model, models, connect } = require('mongoose');

connect(process.env.DBURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const out = {
  module: {
    user: module_user,
    server: module_server,
  },
  object: {
    user: {
      name: String,
      id: String,
      pw: String,
      admin: Boolean,
      birthday: {
        year: String,
        month: String,
        day: String
      },
      selfcheck: {
        area: String,
        school: {
          name: String,
          nameEn: String,
          city: String,
          address: String,
          endpoint: String,
          schoolCode: String
        },
        token: String,
        pw: String,
        time: {
          hour: String,
          min: String
        },
        onoff: Boolean,
      },
      notice: {
        endpoint: String,
        expirationTime: String,
        keys: {
          p256dh: String,
          auth: String
        }
      }
    },
    server: {
      id: String,
      name: String,
      time: {
        hour: String,
        min: String
      }
    }
  }
};

module.exports = out;

function module_user() {
  var dataSchema = Schema(out.object.user);
  return models.namil_selfcheck_user || model('namil_selfcheck_user', dataSchema);
}

function module_server() {
  var dataSchema = Schema(out.object.server);
  return models.namil_selfcheck_server || model('namil_selfcheck_server', dataSchema);
}
