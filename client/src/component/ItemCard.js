import { useNavigate, useLocation, useParams  } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { useFormik } from 'formik';
import { UserContext } from '../App';
import * as yup from 'yup';
import { addToOrder, updatedTotal } from "../component/context/CartContext";

import SideBar from './SideBar';

import "../stylesheets/ItemCard.css"

function ItemCard() {
  const { id } = useParams();
  const { user, setUser } = useContext(UserContext)

  const [ item, setItem ] = useState([])
  const { name, price, par_level, stock } = item

  const cartOrder =  user.order[0]

  useEffect(() => {
    fetchItem(id)
    })
  
  function fetchItem(id) {
      fetch(`http://127.0.0.1:5000/items/${id}`)
      .then(r => r.json())
      .then(data => {
        setItem(data)
        // console.log(data)
      })
  }

  function updateTotalValue(newTotal ) {
      updatedTotal( newTotal, user.id)
    }
  

  const navigate = useNavigate(); 

  function handleClick() {
    navigate(`/inventory`)
  }
  const [itemAdded, setItemAdded] = useState(false)


  function handleAdd() {
    // if (cartOrder && cartOrder.order_detail) {
    //   const existingItem = cartOrder.order_detail.find(item => item.item_id === item.id);
    //   console.log(existingItem);
    //   if (existingItem) {
    //     const newQuantity = existingItem.quantity + 1;
    //     changeQuantity(newQuantity, existingItem.id)
    //       .then(updatedItem => console.log(updatedItem))
    //       .catch(error => console.log(error));
    //     return;
    //   }
    // } else {
      addToOrder(1, item.id, cartOrder.id)
        .then(() => {
          setItemAdded(true);
          updateTotalValue(cartOrder.total + price)
          // console.log(cartOrder.total)
        })
        .catch(error => console.log(error));
    //}
  }

  const [showDelete, setShowDelete ] = useState(false);
  const [ editItemInfo, setEditItemInfo ] = useState(false)
  const [updatedStock, setUpdatedStock] = useState(0);
  const [ updateItemInfo, setUpdateItemInfo ] = useState({
    name: name,
    price: price, 
    par_level: par_level, 
    stock: stock
    })
    
    const toggleEditngItem = () => {
    setEditItemInfo(!editItemInfo);
  };

  const handleItemFieldChange = (event) => {
    const { name, value } = event.target;
    setUpdateItemInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  

  const updateItemStock = (updatedStock) => {
    fetch(`http://127.0.0.1:5000/items/${id}`, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
      body: JSON.stringify({ stock: updatedStock }),
    })
      .then((response) => response.json())
      .then((data) => {
        setUpdatedStock(data.stock);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  function addStock() {
    const updatedStock = stock + 1;
    updateItemStock(updatedStock)
  }

  function removeStock() {
    const updatedStock = stock - 1;
    updateItemStock(updatedStock)
  }
  
  const updateItem = () => {
    const updatedFields = {
      name: updateItemInfo.name,
      price: updateItemInfo.price, 
      par_level: updateItemInfo.par_level, 
      };

    fetch(`http://127.0.0.1:5000/items/${id}`, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',    
      },    
      body: JSON.stringify(updatedFields),
    })
      .then((response) => response.json())
      .then(() => {
        toggleEditngItem();
      })
      .catch((error) => {
        console.error("Error:", error)
      });
  }
  const confirmDeletion = () => {
    window.alert(`${name} has been deleted successfully.`)
  }
  const handleDelete = () => {
    fetch(`http://127.0.0.1:5000/items/${id}`, {
      method: "DELETE",
    })
    .then((response) => {
        // console.log(response)
        if (!response.ok) {
          return console.log("Failed to delete item.")
        }
        confirmDeletion() 
    })
    .catch((error) => {
        console.error(error);
    });
};

const toDelete = () => {
  setShowDelete(true);
};

const closeDeletePopup = () => {
  setShowDelete(false);
};

return (
  <div>
  <SideBar />
  <div className="d-flex offset-md-2">
    <div className="flex-grow-1">      
    <h1 className="title" > VIEWING: {name} </h1>

    <div className="container-fluid">
      <div className="row">
        <div className="col-10 mx-auto mt-3">
              <button
                className='close-item-details'
                onClick={handleClick} > X </button>
          <div className="card">
            <div className="card-horizontal">
              <img
                className="card-image"
                src="https://bellyfull.net/wp-content/uploads/2020/07/Homemade-Caramel-Sauce-Recipe-blog.jpg"
                alt="Card image cap"
              />

              <div className="card-body" >
                <div className="item-input">
                  {editItemInfo ? (
                    <div>
                      <p > Item Name: </p>
                    <input
                    className='item-input'
                    type="text"
                    name="name"
                    value={updateItemInfo.name}
                    onChange={handleItemFieldChange}
                    />
                      <p > New Price: </p>
                    <input
                    className='item-input'
                    type="number"
                    name="price"
                    value={updateItemInfo.price}
                    onChange={handleItemFieldChange}
                    />
                      <p > New Par Level: </p>
                    <input
                    className='item-input'
                    type="number"
                    name="par_level"
                    value={updateItemInfo.par_level}
                    onChange={handleItemFieldChange}
                    />
                    </div>

                    ) : ( 
                      <div> 

                      <h3 className="display-6 py-2" style={{color: stock < par_level ? '#f92828' : 'inherit', }} >
                      {name}</h3>
                      <h3 className="card-price"> Price per unit: ${price} </h3>
                      <h3 className='card-price'>Par Level:  <span style={{ color: '#d58686' }}> {par_level}</span></h3>

                      </div>
                        )}
                </div>
                <div className="edit-button">
                {editItemInfo ? (
                  <button
                    className="btn mt-3"
                    onClick={updateItem}
                    style={{ backgroundColor: '#d58686', color: '#FCEFEF' }}
                    > Save Changes </button>
                    ) : (
                  <button
                  className="btn mt-3"
                    onClick={toggleEditngItem}
                    style={{ backgroundColor: '#d58686', color: '#FCEFEF' }}
                    > Edit </button>
                    )}
              </div>
              </div>
              <div className="col-4 py-5" >
                <h3 className='card-price'>Current Stock: <span style={{color: stock < par_level ? '#f92828' : 'inherit', }}> {stock}</span></h3>
                <button className='btn btn-outline-success' onClick={addStock} > Add 1</button>
                <button className='btn btn-outline-danger' onClick={removeStock} > Remove 1</button>

              </div>
            </div>
              <button className="btn" onClick={handleAdd} disabled={itemAdded}>
                {itemAdded ? "Added to Order" : "Add to Order"}
              </button>
          </div>
                  <button className='delete-button' onClick={toDelete}>
                    Delete
                  </button>
                  {showDelete && (
                    <div className='delete-popup'>
                      <h2 className='card-price'>Are you sure you want to delete "{name}"?</h2>
                      <h3 className='card-price' style={{ color: '#d58686' }} > ( It's permanent. ) </h3>
                      <button className='btn btn-outline-danger' onClick={handleDelete}>
                        Yes, I'm sure.
                      </button>
                      <button className='btn btn-outline-secondary' onClick={closeDeletePopup}>
                        Nevermind.
                      </button>
                    </div>
                  )}
        </div>
      </div>
    </div>

  </div>
  </div>
  </div>
);
}

export default ItemCard;

// <div className='item-details'>
// <div className="row-left">
//   <img className='image' 
//   src = "https://bellyfull.net/wp-content/uploads/2020/07/Homemade-Caramel-Sauce-Recipe-blog.jpg"
//   alt = "super-cool"
//   />
// </div>
// <div className="row-right">


//     <p>Stock: {stock}</p>
    

// </div>
// </div>
