import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { useFormik } from 'formik';
import { UserContext } from '../App';
import * as yup from 'yup';

import Item from '../component/Item';
import SideBar from '../component/SideBar';

// import "../stylesheets/ItemCard.css"
import "../stylesheets/ItemCollection.css"


function ItemCollection() {
  const { user, setUser } = useContext(UserContext)

  const [ items, setItems ] = useState([])
  const [searchValue, setSearchValue] = useState(" ");

  useEffect(() => {
    fetchItems()
    handleSearch()
    }, [])
  
  function fetchItems(id) {
      fetch(`http://127.0.0.1:5000/ItemsByUserId/${user.id}`)
      .then(r => r.json())
      .then(data => setItems(data))
  }

  function handleSearch(e) {
    const searchValue = e ? e.target.value : "";
    setSearchValue(searchValue);
  }

  const filteredItems = [...items].filter((item) => 
    item.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const itemCount = items.length 

const itemDisplay = filteredItems.map((item) => (
  <div className='cards'>
    <Item
      item={item}
    />
  </div>
));

return (
  <div className="item-collection">
    <SideBar />
    <div className="d-flex offset-md-2">
    <div className="flex-grow-1">
      <h1 className="title" > INVENTORY </h1>
      <div className='search-container'>

        <div className="search-bar">
        <input
          type="text"
          className="search"
          value={searchValue}
          placeholder="Find what you're looking for."
          onChange={(e) => handleSearch(e)}
          />
        </div>

        <Link to="/item-form">
            <button className="button-48" role="button">
              <span className="text">Create New Item</span>
            </button>
          </Link>
          </div>
      <p className="lead text-muted offset-md-1 font-weight-light" > Total Items: {itemCount} </p>
        {itemDisplay}
      </div>
    </div>
  </div>
);
}
export default ItemCollection
