import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
const { hash, compare } = bcrypt;


const userSchema = new Schema({
  name: String,
  email: { type: String, unique: true },
  username: { type: String, unique: true },
  pwd: String,
  secret: String,
  has2FA: { type: Boolean, default: false },
  role: { type: String, default: 'user' },
  lastLogin: { type: Date, default: Date.now },
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('pwd')) return next();
        // Hash the password
    this.pwd = hash(this.pwd, 10);
    next();
});

userSchema.methods.validatePassword = async function(password) {
    return await compare(password, this.pwd);
};



export default model('User', userSchema);
