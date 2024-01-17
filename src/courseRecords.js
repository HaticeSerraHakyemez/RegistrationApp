const mongoose = require('mongoose')

const courses = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
      },
      credits: {
        type: Number,
        required: true
      },
      code: {
        type: String,
        required: true,
        unique: true
      },
      __v: { type: Number, select: false}
  })
  
module.exports = mongoose.model('courses', courses) 