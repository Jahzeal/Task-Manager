const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Task Schema
const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Must provide a name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 20 characters'],
  },
  completed: {
    type: Boolean,
    default: false,
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true // Ensure every task is linked to a user
  },
  deadline: {
    type: Date,
    required: [true, 'Deadline is required'],
    validate: {
      validator: function (value) {
        return value >= new Date(); 
      },
      message: 'Deadline must be a future date',
    },
  },
  notes: {
    type: String
  }

});
const User = mongoose.model('User', userSchema);
const Task = mongoose.model('Task', taskSchema);

// Export Models
module.exports = { User, Task };
