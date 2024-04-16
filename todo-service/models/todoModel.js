var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var todoSchema = new Schema({
  id: String,
  description: String,
  completed: Boolean
})

var TodoModel = mongoose.model('todo', todoSchema);

module.exports = TodoModel 