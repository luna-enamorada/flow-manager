import React from "react";
import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../App';
import { addToOrder } from "../component/context/CartContext";

import SideBar from "../component/SideBar";
import OrderItem from "../component/OrderItem";

import "../stylesheets/OrderPage.css"

function OrderPage() {
  const { user, setUser } = useContext(UserContext)

  const [ orderItems, setOrderItems ] = useState([])
  const [currSubtotal, setCurrSubtotal] = useState(0)
  const {budget} = user 

  const cartOrder = user.order[0] 

  useEffect(() => {
    if (user) {
      fetchOrderDetails();
      const initialSubtotal = orderItems.reduce((total, item) => total + item.item.price * item.quantity, 0);
      setCurrSubtotal(initialSubtotal)
    }
  },  [user, orderItems] )
  
  const fetchOrderDetails = () => {
    if (user) {
      fetch(`http://127.0.0.1:5000/orderDetailsByOrderID/${user.order[0].id}`)
        .then((r) => r.json())
        .then((data) => {
          // console.log( data)
          setOrderItems(data);
        })
        .catch((error) => {
          console.error('Error fetching order details:', error);
        });
    } else {
      console.warn('Unable to fetch order details. cartOrder is not valid.');
    }
  }



  const removeFromOrder = ( id ) => {
    return fetch(`http://127.0.0.1:5000/orderDetailsByItemID/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .catch(error => {
        console.error(error);
      })
  }
  

  const updatedTotal = ( total ) => {
    const newTotal = {
      total
    }
    return fetch(`http://127.0.0.1:5000/orderByUserId/${user.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTotal),
    })
      .then(response => response.json())
      .catch(error => {
        console.error(error);
      });
  }
  

  const updateTotalValue = (newTotal) => {
    updatedTotal(newTotal, user.id)
      .then(r => {
        updatedTotal(newTotal)
        fetchOrderDetails()
        setCurrSubtotal(newTotal);
      })
      .catch(error => {
        console.error(error);
      })
  }
    
  const ordItemsDisplay = orderItems.map((item) => {
    if (item.quantity > 0) {
      return (
        <div key={item.id}>
          <OrderItem
            item={item.item}
            quantity={item.quantity}
            updateTotalValue={updateTotalValue}
            removeFromOrder = {removeFromOrder}
          />
        </div>
      );
    } else {
      removeFromOrder(item.item_id)
        .then(response => {
          setOrderItems(orderItems.filter(i => i.id !== item.id));
          // console.log(response)
        })
        .catch(error => {
          console.error(error);
        });
      return null
    }
  })
  
  const totalQuantity = orderItems.reduce((total, item) => total + item.quantity, 0);

  const subtotal = orderItems.reduce((total, item) => total + item.item.price * item.quantity, 0);
  const difference = budget - subtotal
  const differenceStyle = {
    color: subtotal > budget ? "#f92828" : "inherit",
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
        // console.log(data)
      })  
  }
    
  const updateInventoryStock = () => {
    orderItems.forEach((orderItem) => {
      const { item, quantity } = orderItem;
      const updatedStock = item.stock + quantity;
      updateInventory(updatedStock, item.id);
      removeFromOrder(item.id);
    });
    fetchOrderDetails()
    updateTotalValue(0)
  }


  /// generate order

  const [ items, setItems ] = useState([])

  useEffect(() => {
    fetchItems()
    }, [])
  
  function fetchItems() {
      fetch(`http://127.0.0.1:5000/ItemsByUserId/${user.id}`)
      .then(r => r.json())
      .then(data => setItems(data))
  }

  function generateOrder() {
    items.forEach((item) => {
      if (item.stock < item.par_level) {
        const gen_order = item.par_level - item.stock
        addToOrder(gen_order, item.id, cartOrder.id);
        const newTot = item.price * gen_order
        updateTotalValue(newTot, user.id);
      }
    })
  }

    return (
    <div>
    <SideBar />
    <div className="d-flex offset-md-2">
        <div className="flex-grow-1">
          {/* Content of order page */}
          {orderItems.length > 0 ? ( 
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8">
          <div className="card" style={{ borderRadius: '10px' }}>
            <div className="card-header px-4 py-3">
              <h5 className="text-muted mb-0">Let's review your order, <span style={{ color: '#d58686' }}>{user.name}</span>!</h5>
            </div>
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <p className="lead fw-normal mb-0 " style={{ color: '#d58686' }}>Receipt</p>
                <button onClick={generateOrder} className="btn btn-sm mt-5" style={{ backgroundColor: '#d58686', color: '#FCEFEF' }} >Generate Order </button>
                <p className="small text-muted mb-0">Item Count: {totalQuantity} </p>
              </div>
              <div className="card shadow-0 border mb-4">
                {ordItemsDisplay}
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card position-sticky top-0" style={{ borderRadius: '10px' }}>
            <div className="p-3 bg-light bg-opacity-10">
              <h6 className="card-title mb-3">Summary</h6>
              <div className="d-flex justify-content-between mb-1 small">
                <span>Subtotal</span> <span> ${currSubtotal}</span>
              </div>
              <div className="d-flex justify-content-between mb-1 small">
                <span>Budget</span> <span>${budget}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4 small">
                <span style={differenceStyle} >{differenceText}</span> <strong style={differenceStyle} >${difference}</strong>
              </div>
              <div className="form-check mb-3 small" >
                <input className="form-check-input" type="checkbox" value=" " id="subscribe" />
                <label className="form-check-label" htmlFor="subscribe">
                I understand that none of the items are being ordered, and when I click the button below, it only updates the item information I've submitted instead of placing the order for me.
                </label>
              </div>
              <button onClick={updateInventoryStock} className="btn w-100 mt-2" style={{ backgroundColor: '#d58686', color: '#FCEFEF' }} >Update Inventory</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    ) : (
      <div className="d-flex flex-column align-items-center">
      <h4 className="title mb-3">No order here, start by adding items to cart or click  </h4>
        <button onClick={generateOrder} className="btn btn-sm" style={{ backgroundColor: '#d58686', color: '#FCEFEF' }} >Generate Order </button>
      </div>
    )}    
  </div>
  </div> 
  </div>
  )
}

export default OrderPage