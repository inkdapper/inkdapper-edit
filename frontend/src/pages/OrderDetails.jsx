import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import Title from '../components/Title';

const OrderDetails = () => {
  const { productId } = useParams();
  const { backendUrl, token, currency, delivery_fee } = useContext(ShopContext)
  const [orderData,setOrderData] = useState([])
  const [productData, setProductData] = useState([]);
  const [isReturnExpired, setIsReturnExpired] = useState(false); // State to track return status

  const fetchOrderDetailsAndProducts = async () => {
    try {
      if (!token) {
        return null;
      }
      const response = await axios.post(backendUrl + '/api/order/userdetails', {}, { headers: { token } });
      if (response.data.success) {
        setOrderData(response.data.orders);
        const order = response.data.orders.find(order => order._id === productId);
        if (order) {
          setProductData([order]);
          // Check if the return date has expired
          const currentDate = new Date();
          const returnDate = new Date(order.returnDate);
          if (currentDate > returnDate) {
            setIsReturnExpired(true); // Set to true if the return date has passed
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  useEffect(() => {
    fetchOrderDetailsAndProducts();
    console.log(productData)
  }, [token, productId]);

  return (
    <div>
      <div className='text-2xl'>
        <Title text1={'ORDER'} text2={'DETAILS'}/>
      </div>
      <div>
      {
        productData.map((order, index) => { 
          return (
            <div key={index}>
              <p className='text-gray-500'>Ordered On <span className='text-gray-700'>{new Date(order.date).toDateString()}</span></p>
              <p className='text-gray-500'>Return Date: <span className='text-gray-700'>{new Date(order.returnDate).toDateString()}</span></p>
                <p className='text-gray-500'>{isReturnExpired ? "Return period has expired." : "Return period is valid."}</p> {/* Display return status */}
              <div className='w-full border mt-4 p-8 border-gray-400 rounded-lg flex justify-between'>
                <div className='first-sec flex gap-8'>
                  <div  className='ordered-image'>
                    <img className='w-56 h-64' src={order.items[0].image[0]} alt={order.items[0].name} />
                  </div>
                  <div className=''>
                    <div className='mt-1'>
                      <p className='font-medium text-xl'>Shipped Address</p>
                      <p className='text-base mt-1'>{order.address.firstName},</p>
                      <p className='text-base'>{order.address.street},</p>
                      <p className='text-base'>{order.address.city} - <span>{order.address.zipcode},</span></p>
                      <p className='text-base'>{order.address.state},</p>
                      <p className='text-base'>{order.address.country}.</p>
                      <p className='text-base'>Mob : {order.address.phone}</p>
                    </div>
                    <div className='mt-6'>
                      <p className='font-medium text-xl'>Payment Method</p>
                      <p className='text-base mt-1'>{order.paymentMethod}</p>
                    </div>
                  </div>
                </div>
                <div>
                <div className='mt-1'>
                  <p className='font-medium text-xl'>Order Quantity</p>
                  <div className='flex gap-28'>
                    <div className='left'>
                      <p className='text-base mt-1'>No.Of Order Placed :</p>
                    </div>
                    <div className='right'>
                      <p className='text-base mt-1'>{order.items[0].quantity}</p>
                    </div>
                  </div>
                </div>
                <div className='mt-6'>
                  <p className='font-medium text-xl'>Order Summary</p>
                  <div className='flex gap-40'>
                    <div className='left'>
                      <p className='text-base mt-1'>Items Subtotal :</p>
                      <p className='text-base mt-1'>Shipping :</p>
                      <p className='text-base mt-1'>Total :</p>
                      <p className='font-medium text-lg mt-1'>Grand Total :</p>
                    </div>
                    <div className='right'>
                      <p className='text-base mt-1'>{currency} {order.items[0].price}</p>
                      <p className='text-base mt-1'>{currency} {delivery_fee}</p>
                      <p className='text-base mt-1'>{currency} {order.amount}</p>
                      <p className='font-medium text-lg mt-1'>{currency} {order.amount}</p>
                    </div>
                  </div>
                </div>
              </div>
              </div>
              <div className='mt-4'>
                <p className='text-gray-500 flex items-center gap-2'>Order Status : <span className='text-gray-700 text-xl'>{order.status}</span></p>
              </div>
              {console.log(order)}
              <div className='mt-3'>
                <Link to={`/product/${order.items[0]._id}`}>
                  <button type="button" className='bg-black text-white px-10 py-3 text-xl'>Buy It Again</button>
                </Link>
              </div>
            </div>
          )
        })
      }
      </div>
      <div>
      {
        productData.map((order, index) => { 
          console.log(order)
        })
      }
      </div>
    </div>
  )
}

export default OrderDetails