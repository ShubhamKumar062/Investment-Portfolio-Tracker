const mongoose = require("mongoose")

const connectDB = mongoose.connect(process.env.MONGODB_URI)
.then(()=> console.log("Mongodb is Connected"))
.catch((err) => console.log("Mongodb is not Connected", err))

module.exports = connectDB ;