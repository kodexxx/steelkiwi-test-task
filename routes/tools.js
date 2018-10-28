const express = require('express')
const ping = require('ping')

let router = express.Router()

const TokenController = require('../controllers/Token')

router.get('/latency', TokenController.tokenValid, (req, res) => {
  let respData = { error: null, responce: {} }

  ping.promise.probe('google.com', {
    timeout: 5
  })
    .then((pingInfo) => {
      console.log(pingInfo)
      respData.responce = pingInfo.avg
      res.json(respData)
    })
    .catch((e) => {
      if (e.noaccess) {
        respData.error = 'no access'
        res.status(403)
        res.json(respData)
      }
      else {
        respData.error = e
        res.json(e)
      }
    })
})

module.exports = router