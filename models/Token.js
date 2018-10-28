const mongoose = require('mongoose')
const randomstring = require('randomstring')

let Schema = mongoose.Schema

let Token = new Schema({
  user_id: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  expired: {
    type: Date,
    required: true,
    default: () => {
      let now = new Date()
      now.setMinutes(now.getMinutes() + 10)
      return now
    }
  }
})

Token.statics = {
  getToken(userID) {
    return new Promise((resolve, reject) => {
      let token = new this({
        user_id: userID,
        token: randomstring.generate()
      })
      token.save()
        .then((info) => resolve(info.token))
        .catch((e) => reject(e))

    })
  },
  checkCorrect(token) {
    return new Promise((resolve, reject) => {
      this.findOne({ token: token })
        .then((info) => {
          if (info == null) {
            reject({ noaccess: true })
            return
          }
          let now = new Date()
          now.setMinutes(now.getMinutes() + 10)
          info.expired = now
          return info.save()
        })
        .then((saved) => {
          resolve(saved)
        })
        .catch((e) => {
          reject({ noaccess: true })
        })
    })
  }
}

module.exports = mongoose.model('tokens', Token)