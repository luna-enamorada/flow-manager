import { useNavigate, useLocation, useParams  } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { useFormik } from 'formik';
import { UserContext, CartContext } from '../App';
import * as yup from 'yup';
import { addToOrder, updatedTotal } from "../component/context/CartContext";

import "../stylesheets/ItemCard.css"

function ItemCard() {
  const { id } = useParams();
  const { user, setUser } = useContext(UserContext)
  const { cartOrder } = useContext(CartContext)

  const [ item, setItem ] = useState([])
  const { name, price, par_level, stock } = item


  useEffect(() => {
    fetchItem(id)
    }, [id])
  
  function fetchItem(id) {
      fetch(`http://127.0.0.1:5000/items/${id}`)
      .then(r => r.json())
      .then(data => {
        setItem(data)
        // console.log(data)
      })
  }
  function updateTotalValue(newTotal) {
    if (user) {
      updatedTotal(newTotal, user.id)
    }
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
      addToOrder(1, item.id, cartOrder[0].id)
        .then(() => {
          setItemAdded(true);
          updateTotalValue( price, user.id )
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
  

  const updateItemStock = () => {
    const updatedStock = stock - 1;
  
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
  
  const updateItem = () => {
    const updatedFields = {
      name: updateItemInfo.name,
      price: updateItemInfo.price, 
      unit: updateItemInfo.unit, 
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
          throw new Error("Failed to delete item.");
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
  <div className='item-details'>
    <div className="row-left">
      <img className='image' 
      src = "https://bellyfull.net/wp-content/uploads/2020/07/Homemade-Caramel-Sauce-Recipe-blog.jpg"
      alt = "super-cool"
      />
    </div>
    <div className="row-right">

    <div className="input">
      {editItemInfo ? (
        <input
        type="text"
        name="name"
        value={updateItemInfo.name}
        onChange={handleItemFieldChange}
        />
        ) : ( <h2>{name}</h2> )}
    </div>
    <button
      className='close-item-details'
      onClick={handleClick} > close </button>
    
    <div className="edit-button">
      {editItemInfo ? (
        <button
          className="default-button"
          onClick={updateItem}
          > Save Changes </button>
          ) : (
        <button
        className="default-button"
          onClick={toggleEditngItem}
          > Edit </button>
          )}
    </div>
        <p>Stock: {stock}</p>
        <button onClick={updateItemStock}>Remove 1</button>

    {/* Delete button functionality ~~~ */}
    <button className='delete-button' onClick={toDelete}>
      Delete
    </button>
    {showDelete && (
      <div className='delete-popup'>
        <h2 className='delete-confirmation'>Are you sure you want to delete "{name}"?</h2>
        <h3> ( It's permanent. ) </h3>
        <button className='confirm-delete' onClick={handleDelete}>
          Yes, I'm sure.
        </button>
        <button className='cancel-delete' onClick={closeDeletePopup}>
          Nevermind.
        </button>
      </div>
    )}
      <button className="btn" onClick={handleAdd} disabled={itemAdded}>
        {itemAdded ? "Added to Order" : "Add to Order"}
      </button>
    </div>
  </div>
);
}

export default ItemCard;
