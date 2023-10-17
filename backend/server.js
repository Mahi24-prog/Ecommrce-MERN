const app = require('./app')
const dotenv = require('dotenv')
const connectDatabase = require("./config/database")

//Handeling Uncaught Exceptions
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exceptions`);
  process.exit(1)
})


//Config
dotenv.config({ path: 'backend/config/config.env' })

//Database Connection
connectDatabase()

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is Working on http://localhost${process.env.PORT}`);
})

//Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to unhandled Promise Rejection`);

  server.close(() => {
    process.exit(1)
  })
})