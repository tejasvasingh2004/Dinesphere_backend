import { 
  getAllPayments, 
  getPaymentById, 
  createPayment, 
  updatePayment, 
  deletePayment, 
  getPaymentsByOrder, 
  getPaymentsByUser 
} from '../models/paymentModel.js';

export const getPayments = async (req, res, next) => {
  try {
    const payments = await getAllPayments();
    res.json({ success: true, data: payments, message: 'Payments fetched' });
  } catch (err) {
    next(err);
  }
};

export const getPayment = async (req, res, next) => {
  try {
    const payment = await getPaymentById(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }
    res.json({ success: true, data: payment, message: 'Payment fetched' });
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    // Validate required fields
    const { order_id, amount, currency, provider } = req.body;
    if (!order_id || !amount || !currency || !provider) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: order_id, amount, currency, provider' 
      });
    }

    // Validate amount
    if (amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Amount must be greater than 0' 
      });
    }

    // Validate currency
    const validCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];
    if (!validCurrencies.includes(currency.toUpperCase())) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid currency. Supported currencies: USD, EUR, GBP, CAD, AUD' 
      });
    }

    // Validate provider
    const validProviders = ['stripe', 'paypal', 'square', 'cash', 'card'];
    if (!validProviders.includes(provider.toLowerCase())) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid provider. Supported providers: stripe, paypal, square, cash, card' 
      });
    }

    const paymentData = {
      order_id,
      amount,
      currency: currency.toUpperCase(),
      provider: provider.toLowerCase(),
      status: req.body.status || 'pending',
      transaction_id: req.body.transaction_id || null,
      payment_method: req.body.payment_method || null,
      notes: req.body.notes || null
    };

    const [payment] = await createPayment(paymentData);
    res.status(201).json({ success: true, data: payment, message: 'Payment created' });
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const [payment] = await updatePayment(req.params.id, req.body);
    res.json({ success: true, data: payment, message: 'Payment updated' });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    await deletePayment(req.params.id);
    res.json({ success: true, message: 'Payment deleted' });
  } catch (err) {
    next(err);
  }
};

export const getPaymentsByOrderId = async (req, res, next) => {
  try {
    const payments = await getPaymentsByOrder(req.params.order_id);
    res.json({ success: true, data: payments, message: 'Payments for order fetched' });
  } catch (err) {
    next(err);
  }
};

export const getPaymentHistory = async (req, res, next) => {
  try {
    const payments = await getPaymentsByUser(req.params.user_id);
    res.json({ success: true, data: payments, message: 'Payment history fetched' });
  } catch (err) {
    next(err);
  }
};

