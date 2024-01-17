const mongoose = require('mongoose')

const courselists = new mongoose.Schema({
    student: {
      type: String,
      required: true
      } ,
    course: {
      type: String,
      required: true
    } ,
    grade: {
      type: Number,
      required: false
    },
    __v: { type: Number, select: false}
  })

module.exports = mongoose.model('courselists', courselists)