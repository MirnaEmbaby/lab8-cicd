const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

const MONGO_URI = process.env.MONGO_URI || "mongodb://mongo:27017/tasksdb";

mongoose.connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log(err));

const taskSchema = new mongoose.Schema({
  id: Number,
  name: String,
  status: String
});

const Task = mongoose.model('Task', taskSchema);

// Add a new task automatically for CI/CD testing
async function addTestTask() {
  const exists = await Task.findOne({ id: 7 });
  if (!exists) {
    const newTask = new Task({ id: 7, name: 'Tea', status: 'pending' });
    await newTask.save();
    console.log("Test task 'Tea' added");
  }
}

addTestTask().catch(err => console.log(err));

app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
