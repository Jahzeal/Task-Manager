import mongoose, { Types } from 'mongoose'
const mongoose = require('mongoose.')

const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'must provide name'],
    trim:true,
    maxlenght: [20, 'name can not be more than 20']
  },
  completed: {
    type: Boolean,
    default: false,
  }
})

module.exports = mongoose.model('Task', TaskSchema)


//if you dont specify here it wont work


