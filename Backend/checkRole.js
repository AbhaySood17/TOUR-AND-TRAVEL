require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function checkUserRole() {
  try {

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

 
    const user = await User.findOne({ email: 'a@gmail.com' });
    if (!user) {
      console.log('User not found');
      return;
    }

    console.log('User found:', {
      email: user.email,
      role: user.role,
      id: user._id
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

checkUserRole(); 