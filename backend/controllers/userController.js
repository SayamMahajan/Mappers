import User from '../models/User.js';

export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password'); // Excludes password field
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserDetails = async (req, res) => {
  const { name, state, phoneNumber, country } = req.body; 

  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.name = name || user.name;
    user.state = state || user.state;
    user.country = country || user.country;

    if (phoneNumber && phoneNumber !== user.phoneNumber) {
      user.phoneNumber = phoneNumber;
      user.isPhoneVerified = false;
      user.phoneVerificationToken = Math.floor(100000 + Math.random() * 900000);
      user.phoneVerificationTokenExpiresAt = Date.now() + 10 * 60 * 1000;
    }

    await user.save();

    return res.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};
