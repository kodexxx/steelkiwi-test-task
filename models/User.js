const mongoose = require('mongoose')
const bcrypt = require('bcrypt')


let Schema = mongoose.Schema


let UserSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  id_type: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
})

UserSchema.pre('save', () => (next) =>  {
  if(!this.isModified('password')) return next()

  bcrypt.hash(this.password, 10)
  .then(hash => {
    this.password = hash
    next()
    return
  })
  .catch(err => {
    next(err)
  })
})

UserSchema.statics = {
  checkCorrect(id, password) {
    return new Promise((resolve, reject) => {
      this.findOne({ id: id })
        .then(user => bcrypt.compare(password, user.password))
        .then((d) => {
          if(d) resolve()
          else reject('incorect password')
          return
        })
        .catch(e => {
          reject('incorect id')
        })
    })
  }
}

module.exports = mongoose.model('users', UserSchema)