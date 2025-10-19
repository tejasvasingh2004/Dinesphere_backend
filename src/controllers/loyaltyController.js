import { 
  getUserLoyaltyPoints, 
  createLoyaltyAccount, 
  addPoints, 
  deductPoints, 
  updateUserTier, 
  getPointsHistory as getPointsHistoryFromModel, 
  getAllRewards, 
  getRewardById, 
  getAvailableRewards as getAvailableRewardsFromModel, 
  redeemReward as redeemRewardFromModel, 
  getUserRedemptions as getUserRedemptionsFromModel, 
  updateRedemptionStatus 
} from '../models/loyaltyModel.js';

export const getUserPoints = async (req, res, next) => {
  try {
    let loyaltyAccount = await getUserLoyaltyPoints(req.user.id);
    
    // Create account if it doesn't exist
    if (!loyaltyAccount) {
      const [newAccount] = await createLoyaltyAccount(req.user.id);
      loyaltyAccount = newAccount;
    }

    res.json({ success: true, data: loyaltyAccount, message: 'Loyalty points fetched' });
  } catch (err) {
    next(err);
  }
};

export const getPointsHistory = async (req, res, next) => {
  try {
    const history = await getPointsHistoryFromModel(req.user.id);
    res.json({ success: true, data: history, message: 'Points history fetched' });
  } catch (err) {
    next(err);
  }
};

export const getRewards = async (req, res, next) => {
  try {
    const rewards = await getAllRewards();
    res.json({ success: true, data: rewards, message: 'Rewards fetched' });
  } catch (err) {
    next(err);
  }
};

export const getReward = async (req, res, next) => {
  try {
    const reward = await getRewardById(req.params.id);
    if (!reward) {
      return res.status(404).json({ success: false, message: 'Reward not found' });
    }
    res.json({ success: true, data: reward, message: 'Reward fetched' });
  } catch (err) {
    next(err);
  }
};

export const getAvailableRewards = async (req, res, next) => {
  try {
    const loyaltyAccount = await getUserLoyaltyPoints(req.user.id);
    if (!loyaltyAccount) {
      return res.json({ success: true, data: [], message: 'No loyalty account found' });
    }

    const rewards = await getAvailableRewardsFromModel(loyaltyAccount.points);
    res.json({ success: true, data: rewards, message: 'Available rewards fetched' });
  } catch (err) {
    next(err);
  }
};

export const redeemReward = async (req, res, next) => {
  try {
    const redemption = await redeemRewardFromModel(req.user.id, req.params.id);
    res.json({ success: true, data: redemption, message: 'Reward redeemed successfully' });
  } catch (err) {
    if (err.message === 'Insufficient points') {
      return res.status(400).json({ success: false, message: 'Insufficient points to redeem this reward' });
    }
    if (err.message === 'Reward not found or inactive') {
      return res.status(404).json({ success: false, message: 'Reward not found or inactive' });
    }
    next(err);
  }
};

export const getUserRedemptions = async (req, res, next) => {
  try {
    const redemptions = await getUserRedemptionsFromModel(req.user.id);
    res.json({ success: true, data: redemptions, message: 'User redemptions fetched' });
  } catch (err) {
    next(err);
  }
};

export const useRedemption = async (req, res, next) => {
  try {
    const redemption = await updateRedemptionStatus(req.params.id, 'used');
    if (!redemption) {
      return res.status(404).json({ success: false, message: 'Redemption not found' });
    }
    res.json({ success: true, data: redemption, message: 'Redemption marked as used' });
  } catch (err) {
    next(err);
  }
};

export const addPointsManual = async (req, res, next) => {
  try {
    const { user_id, points, action, reference_id, reference_type } = req.body;
    
    if (!user_id || !points || !action) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: user_id, points, action' 
      });
    }

    const updatedAccount = await addPoints(user_id, points, action, reference_id, reference_type);
    res.json({ success: true, data: updatedAccount, message: 'Points added successfully' });
  } catch (err) {
    next(err);
  }
};

