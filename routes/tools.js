const express = require('express')
const ping = require('ping')

let router = express.Router()

const TokenController = require('../controllers/Token')

router.get('/latency', TokenController.tokenValid, (req, res) => {
  let respData = { error: null, responce: {} }

  console.log('start ping')
  ping.promise.probe('google.com', {
    timeout: 5
  })
    .then((pingInfo) => {      
      respData.responce = pingInfo.avg
      res.json(respData)
    })
    .catch((e) => {
      respData.responce = 'ping to support on current OS'
      res.json(respData)
      
    })
})

module.exports = router