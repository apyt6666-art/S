const mongoose = require('mongoose');

module.exports = mongoose.model('User', new mongoose.Schema({
  userId: String,
  guildId: String,
  messages: { type: Number, default: 0 },
  completed: { type: Boolean, default: false }
}));
