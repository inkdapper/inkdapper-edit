import express from 'express'
import { placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus, userDetails, clearCreditPoints } from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'

const orderRouter = express.Router()

//Admin Features
orderRouter.post('/list', adminAuth, allOrders)
orderRouter.post('/status', adminAuth, updateStatus)

// Payment Features
orderRouter.post('/place',authUser, placeOrder)
orderRouter.post('/stripe',authUser, placeOrderStripe)
orderRouter.post('/razorpay',authUser, placeOrderRazorpay)

//User Feature
orderRouter.post('/userorders', authUser, userOrders)

//User Details
orderRouter.post('/userdetails', authUser, userDetails)

// Route to get credit points
orderRouter.post('/credit-clear', authUser , clearCreditPoints);

export default orderRouter