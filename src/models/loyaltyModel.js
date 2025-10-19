import db from './db.js';

// Loyalty Points (account)
export async function getUserLoyaltyPoints(userId) {
  return await db('loyalty_points')
    .where({ user_id: userId })
    .first();
}

export async function createLoyaltyAccount(userId) {
  const [created] = await db('loyalty_points')
    .insert({ user_id: userId, points: 0, tier: 'bronze' })
    .returning(['id', 'user_id', 'points', 'tier', 'created_at', 'updated_at']);
  return [created];
}

export async function updateUserTier(userId, tier) {
  const [updated] = await db('loyalty_points')
    .where({ user_id: userId })
    .update({ tier })
    .returning(['id', 'user_id', 'points', 'tier', 'created_at', 'updated_at']);
  return updated;
}

// Points history helpers
async function recordPointsHistory({ userId, points, action, referenceId, referenceType }) {
  await db('points_history').insert({
    user_id: userId,
    points,
    action,
    reference_id: referenceId || null,
    reference_type: referenceType || null
  });
}

export async function getPointsHistory(userId) {
  return await db('points_history')
    .where({ user_id: userId })
    .orderBy('created_at', 'desc');
}

// Points mutation
export async function addPoints(userId, points, action, referenceId, referenceType) {
  return await db.transaction(async (trx) => {
    const current = await trx('loyalty_points').where({ user_id: userId }).first();
    if (!current) {
      await trx('loyalty_points').insert({ user_id: userId, points: 0, tier: 'bronze' });
    }
    const { points: currentPoints } = current || { points: 0 };
    const newPoints = (currentPoints || 0) + Math.max(0, Number(points) || 0);

    const [updated] = await trx('loyalty_points')
      .where({ user_id: userId })
      .update({ points: newPoints })
      .returning(['id', 'user_id', 'points', 'tier', 'created_at', 'updated_at']);

    await trx('points_history').insert({
      user_id: userId,
      points: Math.max(0, Number(points) || 0),
      action: action || 'manual_add',
      reference_id: referenceId || null,
      reference_type: referenceType || null
    });

    return updated;
  });
}

export async function deductPoints(userId, points, action, referenceId, referenceType) {
  return await db.transaction(async (trx) => {
    const current = await trx('loyalty_points').where({ user_id: userId }).first();
    const currentPoints = current?.points || 0;
    const amount = Math.max(0, Number(points) || 0);
    if (currentPoints < amount) {
      throw new Error('Insufficient points');
    }
    const newPoints = currentPoints - amount;

    const [updated] = await trx('loyalty_points')
      .where({ user_id: userId })
      .update({ points: newPoints })
      .returning(['id', 'user_id', 'points', 'tier', 'created_at', 'updated_at']);

    await trx('points_history').insert({
      user_id: userId,
      points: -amount,
      action: action || 'manual_deduct',
      reference_id: referenceId || null,
      reference_type: referenceType || null
    });

    return updated;
  });
}

// Rewards
export async function getAllRewards() {
  return await db('rewards').where({ is_active: true }).orderBy('created_at', 'desc');
}

export async function getRewardById(rewardId) {
  return await db('rewards').where({ id: rewardId }).first();
}

export async function getAvailableRewards(currentPoints) {
  return await db('rewards')
    .where({ is_active: true })
    .andWhere('points_required', '<=', currentPoints)
    .orderBy('points_required', 'asc');
}

export async function redeemReward(userId, rewardId) {
  return await db.transaction(async (trx) => {
    const reward = await trx('rewards').where({ id: rewardId, is_active: true }).first();
    if (!reward) {
      throw new Error('Reward not found or inactive');
    }

    const account = await trx('loyalty_points').where({ user_id: userId }).first();
    if (!account || (account.points || 0) < reward.points_required) {
      throw new Error('Insufficient points');
    }

    const newPoints = account.points - reward.points_required;
    await trx('loyalty_points').where({ user_id: userId }).update({ points: newPoints });

    const expiresAt = reward.valid_days
      ? trx.raw(`now() + interval '${reward.valid_days} days'`)
      : null;

    const [redemption] = await trx('reward_redemptions')
      .insert({
        user_id: userId,
        reward_id: reward.id,
        points_spent: reward.points_required,
        status: 'active',
        expires_at: expiresAt
      })
      .returning(['id', 'user_id', 'reward_id', 'points_spent', 'status', 'redeemed_at', 'expires_at', 'used_at', 'created_at', 'updated_at']);

    await trx('points_history').insert({
      user_id: userId,
      points: -reward.points_required,
      action: 'redeem_reward',
      reference_id: redemption.id,
      reference_type: 'reward_redemption'
    });

    return redemption;
  });
}

export async function getUserRedemptions(userId) {
  return await db('reward_redemptions')
    .where({ user_id: userId })
    .orderBy('redeemed_at', 'desc');
}

export async function updateRedemptionStatus(redemptionId, status) {
  const valid = ['active', 'used', 'expired', 'cancelled'];
  if (!valid.includes(status)) {
    throw new Error('Invalid redemption status');
  }
  const [updated] = await db('reward_redemptions')
    .where({ id: redemptionId })
    .update({
      status,
      used_at: status === 'used' ? db.fn.now() : null
    })
    .returning(['id', 'user_id', 'reward_id', 'points_spent', 'status', 'redeemed_at', 'expires_at', 'used_at', 'created_at', 'updated_at']);
  return updated;
}


