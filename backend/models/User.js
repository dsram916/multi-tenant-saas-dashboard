import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'customer'], // 'admin' = Tenant, 'customer' = Buyer
    required: true,
  },
  // --- PS: Data Isolation Key ---
  // A customer's tenantId is the store they are buying from.
  // An admin's tenantId is their *own* store.
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Tenant',
  },
}, { timestamps: true });

// Password hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (p) {
  return await bcrypt.compare(p, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;