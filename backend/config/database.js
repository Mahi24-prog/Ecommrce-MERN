const mongoose = require("mongoose")

const connectDatabase = () => {
  mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true, dbName: 'Ecommerce', })
    .then(data => {
      console.log(`Mongodb Connected with server: ${data.connection.host}`)
    })
}

module.exports = connectDatabase
