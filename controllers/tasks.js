// const router = require("../routes/tasks")
const {Task} = require("../models/Tasks");
const asyncWrapper = require("../middleware/async");
const { createCustomError } = require("../errors/custom-error");

const getAllTasks = asyncWrapper(async (req, res) => {
  const userId = req.user.userId;
  console.log(req.user);
  console.log('getting',userId);
  const tasks = await Task.find({ userId }); // Fetch tasks specific to the logged-in user
  res.status(200).json({ tasks, amount: tasks.length });
});


const createTask = asyncWrapper(async (req, res) => {
  const userId = req.user.userId; 
  if (!req.body.name) {
    return res.status(400).json({ error: 'Task name is required.' });
  }
  const task = await Task.create({ ...req.body, userId });
  res.status(201).json({ success: true, data: task });
});




const getTask = asyncWrapper(async (req, res, next) => {
  const { id: taskID } = req.params;
  const userId = req.user.userId;
  const task = await Task.findOne({ _id: taskID, userId }); // Filter by taskID and userId
  if (!task) {
    return next(createCustomError(`No task found for this user with id: ${taskID}`, 404));
  }

  res.status(200).json({ task });
});
////-----

const updateTask = asyncWrapper(async (req, res) => {
  try {
    const { id: taskID } = req.params;
    const task = await Task.findOneAndUpdate({ _id: taskID }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) {
      return next(createCustomError(`no task with id: ${taskID}`, 404));
    }
    res.status(200).json({ task });
  } catch (error) {
    console.log(error);
  }
});

const deleteTask = asyncWrapper(async (req, res) => {
  const { id: taskID } = req.params;
  console.log(taskID,'love');
  const task = await Task.findOneAndDelete({ _id: taskID });
  if (!task) {
    return res.status(404).json({ msg: `no task with id: ${taskID}` });
  }
  res.status(200).json({ task: null, status: "success" });
});


const getNotes = asyncWrapper(async (req, res) => {
  const { userId } = req.params;  // Destructure userId from params

  try {
 
    const tasks = await Task.find({ userId: userId });

    const notes = tasks.map(task => task.notes); 
    res.status(200).json({ notes });
    console.log(notes);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Server error while creating notes' });
  }
});
const createNotes = asyncWrapper(async (req, res) => {
  const { userId } = req.params; // Extract userId from the request parameters
  try {
    const tasks = await Task.find({ userId });
    const notes = tasks.map(task => task.notes);
    res.status(200).json({ success: true, notes });
  } catch (error) {
    console.error('Error creating notes:', error);
    res.status(500).json({ message: 'Server error while creating notes' });
  }
});




module.exports = {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
  getNotes,
  createNotes,
  // deleteUserAccount,
};


