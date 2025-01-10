import React, { useContext, useEffect, useState } from 'react';
import { currency } from '../App';
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios'
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const Orders = () => {
  const { orders, statusHandler, backendUrl, token } = useContext(ShopContext);
  const[ orderData, setOrderData ] = useState([])
    console.log(orders)

  return (
    <div>
      <h3 className='font-semibold mt-3 text-2xl mb-3'>Order Page</h3>
      <div>
        {
          orders.map((order, index) => (
            order.status !== "Delivered" && (
              <div key={index} className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700'>
                <img className='w-12' src={assets.parcel_icon} alt="" />
                <div>
                  <div>
                    {
                      order.items.map((item, index) => {
                        if (index === order.items.length - 1) {
                          return <p className='py-0.5' key={index}> {item.name} x {item.quantity} <span> {item.size} </span></p>
                        } else {
                          return <p className='py-0.5' key={index}> {item.name} x {item.quantity} <span> {item.size} </span>,</p>
                        }
                      })
                    }
                  </div>
                  <p className='mt-3 mb-2 font-medium'>{order.address.firstName + " " + order.address.lastName}</p>
                  <div>
                    <p>{order.address.street + ","}</p>
                    <p>{order.address.city + "," + order.address.state + "," + order.address.country + "," + order.address.zipcode}</p>
                  </div>
                  <p>{order.address.phone}</p>
                </div>
                <div>
                  <p className='text-sm sm:text-[15px]'>Items : {order.items.length}</p>
                  <p className='mt-3'>Method : {order.paymentMethod}</p>
                  <p className='mt-2'>Payment : {order.payment ? 'Done' : 'Pending'}</p>
                  <p className='mt-2'>Order Placed Date : <span>{new Date(order.date).toLocaleDateString()}</span></p>
                  {order.status === "Delivered" && (
                    <p>Delivered Date: {new Date(order.deliveryDate).toLocaleDateString()}</p>
                  )}
                </div>
                <div>
                  <p className='text-sm sm:text-[15px]'>Total Amount :</p>
                  <p className='text-2xl pt-1 font-medium'>{currency} {order.amount}</p>
                </div>

                <FormControl sx={{ m: 0, minWidth: 200 }} size="small">
                  <Select onChange={(event) => statusHandler(event, order._id)} value={order.status}>
                    <MenuItem value="Order Placed">Order Placed</MenuItem>
                    <MenuItem value="Packing">Packing</MenuItem>
                    <MenuItem value="Shipped">Shipped</MenuItem>
                    <MenuItem value="Out for delivery">Out for delivery</MenuItem>
                    <MenuItem value="Delivered">Delivered</MenuItem>
                  </Select>
                </FormControl>
              </div>
            )
          ))
        }
      </div>
    </div>
  )
}

export default Orders