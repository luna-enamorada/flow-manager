import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../App';

import "../stylesheets/OrderItem.css"


function OrderItem({item, quantity, updateTotalValue, removeFromOrder }) {
  const { user } = useContext(UserContext)
  const { id, name, price, par_level, stock, image } = item

  const [ updatedPrice, setUpdatedPrice ] = useState(quantity * price);
  const [ editQuantity, setEditQuantity ] = useState(false);

  const [ updateQuantityField, setUpdatedQuantityField ] = useState({
    quantity: quantity,
  })

  const toggleQuantityField = () => {
    setEditQuantity(!editQuantity);
  }

  function handleRemove() {
    removeFromOrder( id )
    const updatedTotalValue = -updatedPrice;
    updateTotalValue(updatedTotalValue, user.id );
  }

  const changeQuantity = (newQuantity, id) => {  
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

  const pickQuantity = (event) => {
    const { name, value } = event.target;
    setUpdatedQuantityField((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = () => {
    const newQuantity = {
      quantity: updateQuantityField.quantity,
    };
    changeQuantity(newQuantity, id)
      .then(() => {
        const updatedTotalValue = newQuantity.quantity * price;
        updateTotalValue(updatedTotalValue);
        setUpdatedPrice(updatedTotalValue);
        setEditQuantity(false);
      })
      .catch(error => {
        console.error(error);
      });
  }

  return (
    <div class="card-body">
    <div class="row">
      <div class="col-md-2">
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
          <div className='quantity-input'>
            { editQuantity ? (
              <div>
              <input 
              className='quantity-input'
              type='number'
              name='quantity'
              value={updateQuantityField.quantity}
              onChange={pickQuantity}
              />
              <button
              className="btn mt-3"
              onClick={handleSave}
              > save
              </button>
              </div>
              // come back to change style of input and button :)
            ) : (
              <label class="text-muted mb-0 small" onClick={toggleQuantityField}> 
              Qty: {quantity} </label>
            )}
            
          </div>
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