import { getUserById, updateUser } from '../models/userModel.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user, message: 'Profile fetched' });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const updates = req.body;
    const [user] = await updateUser(req.user.id, updates);
    res.json({ success: true, data: user, message: 'Profile updated' });
  } catch (err) {
    next(err);
  }
};
