require('dotenv').config()

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3001

// eslint-disable-next-line no-undef
const MONGO_URL = process.env.MONGO_URL

module.exports = {
  MONGO_URL,
  PORT
}