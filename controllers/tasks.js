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
  console.log('cook',userId);

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
  const task = await Task.findOneAndDelete({ _id: taskID });
  if (!task) {
    return res.status(404).json({ msg: `no task with id: ${taskID}` });
  }
  res.status(200).json({ task: null, status: "success" });
});

module.exports = {
  getAllTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
  // deleteUserAccount,
};


