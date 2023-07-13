import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation, useParams  } from 'react-router-dom';
import { UserContext, CartContext } from '../App';
import { changeQuantity, removeFromOrder, newOrder, updatedTotal } from "./context/CartContext";

import SideBar from "./SideBar";
import Item from "./Item";

function OrderItem({item, quantity, updateTotalValue}) {
  const { user, setUser } = useContext(UserContext)
  const { cartOrder } = useContext(CartContext)
  const { id, name, price, par_level, stock } = item

  function handleRemove() {
    removeFromOrder( id )
    const updatedTotalValue = (quantity * price) - item.total;
    updateTotalValue(updatedTotalValue, user.id );
  }

  function addOne() {
    const newQuantity = quantity + 1;
    changeQuantity(newQuantity, id);
    const updatedTotalValue = newQuantity * price;
    updateTotalValue(updatedTotalValue);
  }
  
  function subOne() {
    const newQuantity = quantity - 1;
    changeQuantity(newQuantity, id);
    const updatedTotalValue = newQuantity * price;
    updateTotalValue(updatedTotalValue, user.id);
  }
  
  const updatedPrice = quantity * price 

    return (
    <div className='order-item-container'>
      <div>
        <h2> {name} -  ${price} --- [${updatedPrice}] </h2>
        <button className='btn' onClick={handleRemove}>
          Remove From Order
        </button>
        <p> Quantity: {quantity} </p>
        <button className='btn' onClick={addOne}>
          add +
        </button>
        <button className='btn' onClick={subOne}>
          subtract -
        </button>

      </div>
    </div>
  )
}

export default OrderItem