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

await Task.updateOne(
  { id: 7 },
  { id: 7, name: 'Tea', status: 'pending' },
  { upsert: true } // ensures Tea exists
);

app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
