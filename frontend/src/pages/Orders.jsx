import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import axios from 'axios'
import { assets } from '../assets/assets'
import OrderProgress from '../components/OrderProgress'
import OrderStatus from '../components/OrderStatus'

const Orders = () => {

  const { backendUrl, token, currency, delivery_fee } = useContext(ShopContext)

  const [orderData, setOrderData] = useState([])
  const [orderStatus, setOrderStatus] = useState('')
  const [isLoading, setIsLoading] = useState(false);
  const [orderStatusLoading, setOrderStatusLoading] = useState('hidden')

  const loadOrderData = async () => {
    try {
      if (!token) {
        return null
      }
      const response = await axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } })
      if (response.data.success) {
        let allOrdersItem = []
        response.data.orders.map((order) => {
          order.items.map((item) => {
            item['status'] = order.status
            item['payment'] = order.payment
            item['paymentMethod'] = order.paymentMethod
            item['date'] = order.date
            allOrdersItem.push(item)
            setOrderStatus(order.status)
            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
            }, 2000);
          })
        })
        setOrderData(allOrdersItem.reverse())
      }
    } catch (error) {

    }
  }

  const handleClick = () => {
    loadOrderData();
    setOrderStatusLoading(isLoading ? 'block' : 'hidden');
  };

  useEffect(() => {
    loadOrderData()
  }, [token])

  // Calculate opacities based on order status
  const getOpacities = (status) => {
    const opacities = [20, 20, 20, 20];
    if (status === 'Packing') {
      opacities[0] = 100;
    } else if (status === 'Shipped') {
      opacities[0] = 100;
      opacities[1] = 100;
    } else if (status === 'Out for delivery') {
      opacities[0] = 100;
      opacities[1] = 100;
      opacities[2] = 100;
    } else if (status === 'Delivered') {
      opacities[0] = 100;
      opacities[1] = 100;
      opacities[2] = 100;
      opacities[3] = 100;
    }
    return opacities;
  };

  return (
    <div className='border-t pt-6 md:pt-16'>

      <div className='text-2xl'>
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      <div className=''>
        {
          orderData.map((item, index) => {
            const [iconOpacityOne, iconOpacityTwo, iconOpacityThree, iconOpacityFour] = getOpacities(item.status);

            return (
              <div key={index} className='py-4 border-t text-gray-700 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
                <div className='flex items-start gap-6 text-sm'>
                  <img className='w-16 h-20 sm:w-20 sm:h-24' src={item.image[0]} alt="" />
                  <div className=''>
                    <p className='sm:text-base font-medium'>{item.name}</p>
                    <div className='flex items-center gap-3 mt-1 text-base text-gray-700'>
                      <p className='text-sm md:text-base'> <b>{currency} {item.price}</b></p>
                      <p className='text-xs md:text-sm'>Quantity: <span className='font-medium'>{item.quantity}</span></p>
                      <p className='text-xs md:text-sm'>Size: <span className='font-medium'>{item.size}</span></p>
                    </div>
                    <p className='mt-1 text-xs md:text-sm'>Date: <span className='text-gray-400'>{new Date(item.date).toDateString()}</span></p>
                    <p className='mt-1 text-xs md:text-sm'>Payment: <span className='text-gray-400'>{item.paymentMethod}</span></p>
                    {/* <p className='mt-2'>Total Price : <span className='font-semibold bg-gray-800 p-1 text-white rounded-md'>{currency} {item.price * item.quantity + delivery_fee}</span></p> */}
                  </div>
                </div>
                <div className={`h-1 rounded-full w-[300px] md:w-80 mt-6 ml-[6%] mb-4 bg-neutral-200 dark:bg-slate-300 top-4 relative lg:block ${orderStatusLoading}`}>
                  <span className='absolute top-[-30px] -left-3'><img src={assets.shopping_icon} alt="" className='w-6' /></span>
                  <span className={`absolute top-[-30px] left-[42px] md:left-[52px] opacity-${item.status === 'Order placed' ? '100' : '100'}`}>
                    <img src={assets.order_placed} alt="Order placed icon" className='w-6' />
                  </span>
                  <span className={`absolute top-[-30px] left-[102px] md:left-[115px]`}>
                    <img src={assets.packing_icon} alt="Packing icon"
                      style={{ opacity: `${iconOpacityOne}%`, transition: 'opacity 0.5s ease-in-out' }} className='w-6' />
                  </span>
                  <span className={`absolute top-[-30px] left-[167px] md:left-[180px]`}>
                    <img src={assets.shipped_icon} alt="Shipped icon"
                      style={{ opacity: `${iconOpacityTwo}%`, transition: 'opacity 0.5s ease-in-out' }} className='w-6' />
                  </span>
                  <span className={`absolute top-[-30px] left-[229px] md:left-[242px]`}>
                    <img src={assets.out_for_delivery_icon} alt="Out for delivery icon"
                      style={{ opacity: `${iconOpacityThree}%`, transition: 'opacity 0.5s ease-in-out' }} className='w-6' />
                  </span>
                  <span className={`absolute top-[-30px] right-[-10px]`}>
                    <img src={assets.delivered_icon} alt="Delivered icon"
                      style={{ opacity: `${iconOpacityFour}%`, transition: 'opacity 0.5s ease-in-out' }} className='w-6' />
                  </span>
                  <OrderProgress
                    item={item}/>
                </div>
                <div className='lg:w-1/4 flex justify-between'>
                  <OrderStatus item={item}
                    orderStatusLoading={orderStatusLoading}  />
                  <button onClick={handleClick} className='border px-4 py-2 text-sm font-medium rounded-sm'>Track Order</button>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default Orders