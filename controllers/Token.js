const TokenModel = require('../models/Token')

let getBearer = (req) => {
    if (req.headers.authorization == undefined) return undefined

    let token = req.headers.authorization.split('Bearer ')[1]

    if (token == undefined) return undefined

    return token
}


module.exports = {
    idDetect(id) {
        let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        let mail = re.test(id)

        if (mail) {
            return 'mail'
        }

        let re2 = /^\d{10}$/
        let phone = re2.test(id)

        if (phone) {
            return 'phone'
        }

        return null
    },
    tokenValid(req, res, next) {
        let respData = { error: null, responce: {} }

        let token = getBearer(req)

        if (token == undefined) {
            respData.error = 'no access'
            res.status(403)
            res.json(respData)
            return
        }

        TokenModel.checkCorrect(token)
            .then((tokenInfo) => {
                req.tokenInfo = tokenInfo
                next()
                return
            })
            .catch(() => {
                respData.error = 'no access'
                res.status(403)
                res.json(respData)
                return
            })
    }
}