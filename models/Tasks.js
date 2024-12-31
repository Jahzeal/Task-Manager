const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: {type: String, required:true}
})

const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'must provide name'],
    trim: true,
    maxlength: [20, 'name can not be more than 20 characters'],
  },
  completed: {
    type: Boolean,
    default: false,
  },
})




const User = mongoose.model('User', userSchema);
const Task = mongoose.model('Task', TaskSchema);

// Export Models
module.exports = { User, Task };