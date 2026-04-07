const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

const MONGO_URI = process.env.MONGO_URI || "mongodb://mongo:27017/tasksdb";

// Function to connect to MongoDB with retry
async function connectWithRetry() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log("MongoDB connection failed, retrying in 2s...", err);
    setTimeout(connectWithRetry, 2000); // wait 2 seconds and retry
  }
}

connectWithRetry();

const taskSchema = new mongoose.Schema({
  id: Number,
  name: String,
  status: String
});

const Task = mongoose.model('Task', taskSchema);

// Add a new task automatically for CI/CD testing
async function addTestTask() {
  try {
    const exists = await Task.findOne({ id: 7 });
    if (!exists) {
      const newTask = new Task({ id: 7, name: 'Tea', status: 'pending' });
      await newTask.save();
      console.log("Test task 'Tea' added");
    }
  } catch (err) {
    console.log("Error adding test task, retrying in 2s...", err);
    setTimeout(addTestTask, 2000);
  }
}

// Wait a few seconds after MongoDB connects, then add task
mongoose.connection.once('open', () => {
  addTestTask();
});

app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
