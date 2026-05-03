const mongoose = require('mongoose');

module.exports = mongoose.model('Config', new mongoose.Schema({
  guildId: String,
  roleId: String,
  channelId: String,
  image: String,
  color: Number,
  doneMsg: String,
  notDoneMsg: String
}));
