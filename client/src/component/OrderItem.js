import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation, useParams  } from 'react-router-dom';
import { UserContext } from '../App';
// import { changeQuantity, removeFromOrder, newOrder, updatedTotal } from "./context/CartContext";

import SideBar from "./SideBar";
import Item from "./Item";

import "../stylesheets/OrderItem.css"


function OrderItem({item, quantity, updateTotalValue, removeFromOrder }) {
  const { user } = useContext(UserContext)
  const { id, name, price, par_level, stock, image } = item

  const [updatedPrice, setUpdatedPrice] = useState(quantity * price);

  function handleRemove() {
    removeFromOrder( id )
    const updatedTotalValue = -updatedPrice;
    updateTotalValue(updatedTotalValue, user.id );
  }

  const changeQuantity = (quantity, id) => {
    const newQuantity = { quantity: quantity  };
  
    return fetch(`http://127.0.0.1:5000/orderDetailsByItemID/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newQuantity),
    })
      .then(response => response.json())
      .catch(error => {
        console.error(error);
      })
  }  

  function addOne() {
    const newQuantity = quantity + 1;
    changeQuantity(newQuantity, id);
    const updatedTotalValue = newQuantity * price;
    updateTotalValue(updatedTotalValue);
    setUpdatedPrice(updatedTotalValue)
  }
  
  function subOne() {
    const newQuantity = quantity - 1;
    changeQuantity(newQuantity, id);
    const updatedTotalValue = newQuantity * price;
    updateTotalValue(updatedTotalValue, user.id);
    setUpdatedPrice(updatedTotalValue)
  }

  return (
    <div class="card-body">
    <div class="row">
      <div class="col-md-2">
        {/* Change the Image please <33 */}
        <img src={image}
          className='order-image' alt={name} />
      </div>
      <div class="col-md-2 text-center d-flex justify-content-center align-items-center">
        <p class="text-muted mb-0">{name}</p>
      </div>
      <div class="col-md-2 text-center d-flex justify-content-center align-items-center">
        <p class="text-muted mb-0 small">Unit Price: ${price} </p>
      </div>
      <div class="col-md-2 text-center d-flex justify-content-center align-items-center">
      </div>
      <div class="col-md-2 text-center d-flex justify-content-center align-items-center">
        <button onClick={subOne} type="button" className='remove-button'>-</button>
          <p class="text-muted mb-0 small">Qty: {quantity} </p>
        <button onClick={addOne} type="button" className='add-button'>+</button>
      </div>
      <div class="col-md-2 text-center d-flex justify-content-center align-items-center">
      <strong className="text-dark" >${updatedPrice} </strong>
      </div>
    </div>
    <hr class="mb-3" />
    <div class="row d-flex align-items-center">
    <button onClick={handleRemove} type="button" class="btn btn-sm btn-outline-danger" >Remove from Order</button>
  </div>
</div> 
)
}

export default OrderItem