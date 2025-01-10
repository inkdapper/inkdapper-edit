import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'
import { FaEdit } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa';

export const ShopContext = createContext()

const ShopContextProvider = (props) => {

  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '')
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const [orders, setOrders] = useState([])
  const edit = <FaEdit />
  const trash = <FaTrash />

  const fetchAllOrders = async () => {
    if (!token) {
      return null
    }

    try {
      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } })
      if (response.data.success) {
        setOrders(response.data.orders.reverse())
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const statusHandler = async (event, orderId, deliveryDate) => {

    try {
      const response = await axios.post(backendUrl + '/api/order/status', {
        orderId,
        status: event.target.value,
        deliveryDate : Date.now()
      }, { headers: { token } })
      console.log(response.data)
      if (response.data.success) {
        await fetchAllOrders()
      }
    } catch (error) {
      console.log(error)
      toast.error(response.data.message)
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  const value = {
    token, orders, statusHandler,
    edit, trash, backendUrl
  }
  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  )
}

export default ShopContextProvider