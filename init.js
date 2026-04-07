db = db.getSiblingDB('tasksdb');

db.tasks.insertMany([
  { id: 1, name: "Study", status: "done" },
  { id: 2, name: "Gym", status: "pending" }
  { id: 7, name: Tea, status: "pending" }
]);
