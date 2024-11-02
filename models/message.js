// models/Message.js
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  chatSession: { type: String, required: true },
  messageDate: { type: String },
  sentDate: { type: String },
  type: { type: String },
  senderId: { type: String },
  senderName: { type: String },
  status: { type: String },
  replyingTo: { type: String },
  text: { type: String }
});

module.exports = mongoose.model('Message', MessageSchema);
