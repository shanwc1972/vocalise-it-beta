//Setup our imports
const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    //Get all users
    users: async () => {
      return User.find({});
    },
    
    //Get the details of the logged-in user
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select('-__v -password') //Exclude the version key
          .populate('savedClips'); // Populate the savedClips field (if necessary)

        return userData;
      }

      throw new AuthenticationError;
    },

    // Get a single user by their username
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .select('-__v -password') //Exclude both the version key and the password 
        .populate('savedClips'); // Populate the savedClips field (if necessary)
    },

    // Get all clips for logged on user
    getClips: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id).select('savedClips');
        return user ? user.savedClips : [];
      }
      throw new AuthenticationError('Not authenticated');
    }
  },

  Mutation: {
    // Create a new user and return auth token
    createUser: async (parent, { username, email, password }) => {
      console.log(`createUser called with parameters ${username}, ${email} and ${password}`); //For the benefit of our diagnostic logging
      try {
        // Create the user in the database
        const user = await User.create({ username, email, password });

        // Generate a token for the new user
        const token = signToken(user);

        // Return the token and user data as expected by the client
        return { token, user };
      } catch (err) {
        console.error("Error in createUser resolver:", err);
        throw new AuthenticationError;
      }
    },

    // Login user and return auth token
    login: async (parent, { email, password }) => {
      console.log(`login called with parameter ${email} and ${password}`); //For the benefit of our diagnostic logging
      const user = await User.findOne({ email });

      if (!user) {
        //throw new AuthenticationError('Incorrect email or username');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError;
      }

      const token = signToken(user);
      return { token, user };
    },

    // Save a new clip to the user's savedClips array (if authenticated)
    saveClip: async (parent, { input }, context) => {
      console.log(`saveClip called with paramater ${input}`); //For the benefit of our diagnostic logging
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $addToSet: { savedClips: input } }, // Using addToSet to avoid duplicate entries
          { new: true, runValidators: true }
        ).populate('savedClips');

        return updatedUser;
      }

      throw new AuthenticationError;
    },

    // Delete a clip from the user's savedClips array (if authenticated)
    removeClip: async (parent, { clipId }, context) => {
      console.log(`removeClips called with parameter ${voiceClipId}`); //For the benefit of our diagnostic logging
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $pull: { savedClips: { voiceClipId } } }, // Pull the voiceClip with the matching clipId
          { new: true }
        ).populate('savedClips');

        return updatedUser;
      }

      throw new AuthenticationError;
    },

  },
};

module.exports = resolvers;
