import User from '../models/User.js';
import Tenant from '../models/Tenant.js';
import generateToken from '../utils/generateToken.js';

// 1. Check Email (No Change)
export const checkEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  res.status(200).json({ exists: !!user });
};

// 2. Register (No Change)
export const registerUser = async (req, res) => {
  const { name, email, password, role, storeName } = req.body;
  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'User already exists' });
    }
    let tenant;
    if (role === 'admin') {
      tenant = new Tenant({ storeName: storeName || `${name}'s Bookstore` });
      await tenant.save();
    } else {
      tenant = await Tenant.findOne({ storeName: 'Main Bookstore' });
      if (!tenant) {
        tenant = new Tenant({ storeName: 'Main Bookstore' });
        await tenant.save();
      }
    }
    const user = await User.create({
      name, email, password, role, tenantId: tenant._id,
    });
    generateToken(res, user._id, user.tenantId, user.role);
    res.status(201).json({
      user: {
        _id: user._id, name: user.name, email: user.email, role: user.role, tenantId: user.tenantId,
      },
      tenant: tenant,
    });
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

// 3. Login (No Change)
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    const tenant = await Tenant.findById(user.tenantId);
    generateToken(res, user._id, user.tenantId, user.role);
    res.status(200).json({
      user: {
        _id: user._id, name: user.name, email: user.email, role: user.role, tenantId: user.tenantId,
      },
      tenant: tenant,
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// 4. GetMe (No Change)
export const getMe = async (req, res) => {
  res.status(200).json({ user: req.user, tenant: req.tenant });
};

// 5. Update user profile (No Change)
export const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    
    const tenant = await Tenant.findById(updatedUser.tenantId);

    res.status(200).json({
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        tenantId: updatedUser.tenantId,
      },
      tenant: tenant,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// --- 6. ADD LOGOUT FUNCTION ---
// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0), // Set cookie expiration to the past
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
  });
  res.status(200).json({ message: 'User logged out' });
};