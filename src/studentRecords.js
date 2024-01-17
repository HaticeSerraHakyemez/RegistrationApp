const mongoose = require('mongoose')

const students = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  __v: { type: Number, select: false}
})

module.exports = mongoose.model('students', students)
