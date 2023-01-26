let dotenv = require('dotenv')
let dotenvExpand = require('dotenv-expand')


let myEnv = dotenv.config()

process.env.MONGO_PASSWORD = "gabriel"

dotenvExpand.expand(myEnv)

const env = process.argv.slice(2)


let b = process.env.MONGO_URL


console.log(b)

console.log(env)