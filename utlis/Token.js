const jwt = require('jsonwebtoken')
require('dotenv').config()
const AccessToken = (user) => jwt.sign({id: user.id},process.env.ACCES_TOKEN, {expiresIn: '2M'})

module.exports = AccessToken