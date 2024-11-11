const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

// Define the schema for an embedded clip within the User model
const embeddedClipSchema = new Schema({
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
    required: true
  },
  duration: {
    type: Number, // duration in seconds
    required: true
  },
  audioURL: {
    type: String, // URL to the audio file
    required: true
  },
  format: {
    type: String,
    enum: ['mp3', 'wav', 'ogg'], // acceptable audio formats
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Define the user schema, embedding `savedClips` as an array of `embeddedClipSchema`
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must use a valid email address'],
    },
    password: {
      type: String,
      required: true,
    },
    // `savedClips` will now contain embedded clip data directly
    savedClips: [embeddedClipSchema],
    isSubscribed: {
      type: Boolean,
      default: false
    }
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// Hash the user password before saving
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// Custom method to compare and validate password for logging in
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Virtual field for getting the number of saved clips
userSchema.virtual('clipCount').get(function () {
  return this.savedClips.length;
});

// Compile the User model
const User = model('User', userSchema);

module.exports = User;