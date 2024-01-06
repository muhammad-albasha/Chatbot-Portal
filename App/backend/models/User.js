import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  name: String,
  email: { type: String, unique: true },
  username: { type: String, unique: true },
  pwd: String,
  has2FA: { type: Boolean, default: false },
  secret: String,
  active: { type: Boolean, default: false },
  role: { type: String, default: 'user' }
});

userSchema.pre('save', async function (next) {
  if (this.isModified('pwd')) {
    this.pwd = bcrypt.hash(this.pwd, 10);
  }
  next();
});

userSchema.methods.validatePassword = async function (password) {
  return bcrypt.compare(password, this.pwd);
};

export default mongoose.model('User', userSchema);
