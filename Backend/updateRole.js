require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function updateUserRole() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const user = await User.findOne({ email: 'a@gmail.com' });
    if (!user) {
      console.log('User not found');
      return;
    }

    user.role = 'admin';
    await user.save();
    console.log('User role updated to admin successfully');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

updateUserRole(); 