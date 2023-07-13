import React from "react";
import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation, useParams  } from 'react-router-dom';
import { UserContext, CartContext } from '../App';
import { removeFromOrder, updatedTotal } from "../component/context/CartContext";

import SideBar from "../component/SideBar";
import Item from "../component/Item";
import OrderItem from "../component/OrderItem";

function OrderPage() {
  const { user, setUser } = useContext(UserContext)
  const { cartOrder } = useContext(CartContext)
  const [ orderItems, setOrderItems ] = useState([])
  
  useEffect(() => {
    if (user) {
      fetch(`http://127.0.0.1:5000/orderDetailsByOrderID/${cartOrder[0].id}`)
        .then(r => r.json())
        .then(data => {
          setOrderItems(data);
          // console.log(data)
        });
    }
  }, []);

  function updateTotalValue(newTotal) {
    if (user) {
      updatedTotal(newTotal, user.id)
    }
  }
  
  const ordItemsDisplay = orderItems.map( (item) => (
    <div>
      <OrderItem 
        item = {item.item}
        quantity = {item.quantity}
        updateTotalValue = {updateTotalValue}
      />
    </div>
  ))
  
  const subtotal = cartOrder[0].total;
  const budget = user.budget;
  const difference = budget - subtotal;

  const differenceStyle = {
    color: subtotal > budget ? "red" : "inherit",
  };
  const differenceText = subtotal > budget ? "Over" : "Remaining Budget";

  function updateInventory( stock, item_id ) {
    const newStock = {
      stock: stock
    }
    return fetch(`http://127.0.0.1:5000/items/${item_id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newStock),
    })
      .then(response => {response.json()})
      .then(data => {
        console.log(data)
      })  
  }
  
  const updateInventoryStock = () => {
    orderItems.forEach((orderItem) => {
      const { item, quantity } = orderItem;
      const updatedStock = item.stock + quantity;
      console.log(updatedStock, item.id);
      updateInventory(updatedStock, item.id);
      removeFromOrder( item.id )
    })
  }
    
  return (
    <div>
      <h1> Order </h1>
      {ordItemsDisplay}
      <h2>Sub-Total: ${subtotal}</h2>
      <h2>Budget: ${budget}</h2>
      <h2 style={differenceStyle}>{differenceText}: ${difference}</h2>
      <button onClick={updateInventoryStock}> Update Inventory </button>
    </div>
  )
}

export default OrderPage
