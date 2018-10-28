const express = require('express')
const ping = require('ping')

let router = express.Router()

const UserModel = require('../models/User')
const TokenModel = require('../models/Token')

const TokenController = require('../controllers/Token')

router.post('/signup', (req, res) => {
  let respData = { error: null, responce: {} }

  let id = req.body.id
  let password = req.body.password

  if (id == undefined || password == undefined) {
    respData.error = 'required parameters not passed'
    res.status(400)
    res.json(respData)
  }

  let idtype = TokenController.idDetect(id)

  if (idtype == null) {
    respData.error = 'wrong id format'
    
    res.json(respData)
    return
  }

  let userModel = new UserModel({
    id: id,
    password: password,
    id_type: idtype
  })
  userModel.save()
    .then(userInfo => TokenModel.getToken(userInfo.id))
    .then(token => {
      respData.responce = {
        token: token
      }
      res.json(respData)
    })
    .catch((e) => {
      respData.error = e
      res.json(respData)
    })
})

router.post('/signin', (req, res) => {
  let respData = { error: null, responce: {} }

  let id = req.body.id
  let password = req.body.password

  if (id == undefined || password == undefined) {
    respData.error = 'required parameters not passed'
    res.status(400)
    res.json(respData)
    return
  }

  UserModel.checkCorrect(id, password)
    .then(() => TokenModel.getToken(id))
    .then(token => {
      respData.responce = token
      res.json(respData)
    })
    .catch(e => {
      respData.error = e
      res.json(respData)
    })
})

router.get('/info', TokenController.tokenValid, (req, res) => {
  let respData = { error: null, responce: {} }

  UserModel.findOne({ id: req.tokenInfo.user_id })
    .then(info => {
      respData.responce = { id: info.id, id_type: info.id_type }
      res.json(respData)
      return
    })
    .catch(e => {
      res.json(e)
      return
    })
})


router.get('/logout', TokenController.tokenValid, (req, res) => {
  let respData = { error: null, responce: {} }
  let all = false
  if (req.body.all == 'true') all = true

  if (all) {
    TokenModel.deleteMany({ user_id: req.tokenInfo.user_id })
      .then(d => {
        respData.responce = {
          success: true
        }
        res.json(respData)
        return
      })
      .catch(e => {
        respData.error = e
        res.json(respData)
        return
      })
  }
  else {
    TokenModel.deleteOne({ token: req.tokenInfo.token })
      .then(d => {
        respData.responce = {
          success: true
        }
        res.json(respData)
        return
      })
      .catch(e => {
        respData.error = e
        res.json(respData)
        return
      })
  }
})

module.exports = router