const { Schema, model } = require('mongoose');

const voiceClipSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',  // assuming you have a User model
    required: true
  },
  duration: {
    type: Number,  // duration in seconds
    required: true
  },
  audioUrl: {
    type: String,  // URL to the file if stored in cloud storage (e.g., AWS S3)
    required: true
  },
  format: {
    type: String,
    enum: ['mp3', 'wav', 'ogg'],  // acceptable audio formats
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
});

module.exports = model('VoiceClip', voiceClipSchema);
