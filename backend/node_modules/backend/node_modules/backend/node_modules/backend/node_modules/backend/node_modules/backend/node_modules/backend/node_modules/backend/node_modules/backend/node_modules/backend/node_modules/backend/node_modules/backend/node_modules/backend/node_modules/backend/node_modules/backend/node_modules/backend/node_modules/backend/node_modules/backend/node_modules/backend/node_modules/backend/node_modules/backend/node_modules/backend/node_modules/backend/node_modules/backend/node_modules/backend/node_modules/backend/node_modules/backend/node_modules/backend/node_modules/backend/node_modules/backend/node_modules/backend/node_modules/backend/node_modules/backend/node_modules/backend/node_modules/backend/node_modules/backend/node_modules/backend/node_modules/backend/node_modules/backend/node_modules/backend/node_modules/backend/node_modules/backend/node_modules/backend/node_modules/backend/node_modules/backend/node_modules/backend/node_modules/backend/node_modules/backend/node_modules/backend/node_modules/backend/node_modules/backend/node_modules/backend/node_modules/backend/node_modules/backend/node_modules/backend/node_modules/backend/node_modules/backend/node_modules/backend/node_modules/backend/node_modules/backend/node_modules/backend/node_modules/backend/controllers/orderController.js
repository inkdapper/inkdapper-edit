import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

//Placing Order using COD Method
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + 5);

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
      returnDate: returnDate
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });
    console.log(items)
    // Add credit points logic
    const creditPointsToAdd = items.length * 5;
    await userModel.findByIdAndUpdate(userId, {
        $inc: { creditPoints: creditPointsToAdd }
    });

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//Placing Order using Stripe Method
const placeOrderStripe = async (req, res) => {};

//Placing Order using Razorpay Method
const placeOrderRazorpay = async (req, res) => {};

//All order data from admin panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//User Order Data for Frontend
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//User Details for Profiles
const userDetails = async (req, res) => {
  try {
    const { userId } = req.body;

    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//update order status from admin panel
const updateStatus = async (req, res) => {
  try {
    const { orderId, status, deliveryDate } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status, deliveryDate });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Function to get credit points
const clearCreditPoints = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId);
    const creditPoints = await userData.creditPoints;

      await userModel.findByIdAndUpdate(userId, { creditPoints : 0 });
      res.json({ success: true, message: "Cleared Credit Points", creditPoints});
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
  userDetails,
  clearCreditPoints
};
