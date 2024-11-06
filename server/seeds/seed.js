const db = require('../config/connection');
const { User } = require('../models');
const bcrypt = require('bcrypt');
const userData = require('./userData.json');
const cleanDB = require('./cleanDB');

db.once('open', async () => {
  try {
    // Clean the User collection
    await cleanDB('User', 'users');

    // Hash the passwords in userData
    const hashedUserData = await Promise.all(userData.map(async (user) => {
      const hashedPassword = await bcrypt.hash(user.password, 10); // 10 is the salt rounds
      return {
        ...user,
        password: hashedPassword,
      };
    }));

    // Insert seed user data
    await User.insertMany(hashedUserData);

    console.log('Seed complete!');
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    // Close the database connection
    process.exit(0);
  }
});