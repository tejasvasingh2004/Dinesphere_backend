export const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
};

export const sendResponse = (res, { success = true, data = null, message = '' }, status = 200) => {
  res.status(status).json({ success, data, message });
};
