import db from './db.js';

export const getUserById = async (id) => {
  return await db('users').where({ id }).first();
};

export const updateUser = async (id, userData) => {
  return await db('users').where({ id }).update(userData).returning('*');
};
