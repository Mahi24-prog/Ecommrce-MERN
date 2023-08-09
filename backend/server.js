const app = require('./app')
const dotenv = require('dotenv')
const connectDatabase = require("./config/database")

//Config
dotenv.config({path:'backend/config/config.env'})

//Database Connection
connectDatabase()

app.listen(process.env.PORT,() => {
  console.log(`Server is Working on http://localhost${process.env.PORT}`);
})