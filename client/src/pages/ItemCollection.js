import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { useFormik } from 'formik';
import { UserContext } from '../App';
import * as yup from 'yup';

import Item from '../component/Item';
import SideBar from '../component/SideBar';

import "../stylesheets/ItemCard.css"
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

const itemDisplay = filteredItems.map((item) => (
  <div className='cards'>
    <Item
      item={item}
    />
  </div>
));

    return (
      <div className='item-collection'>
        {/* <SideBar />  */}
          <Link 
          to={{ pathname: `/categories`}}
          > Categories </Link>
          <Link 
          to={{ pathname: `/order`}}
          > Order Page </Link>
          <Link 
          to={{ pathname: `/user-page`}}
          > User Page </Link>

          <h1> All items </h1>
          <Link 
          to={{ pathname: `/item-form`}}
          > Create New Item </Link>
          <Link 
          to={{ pathname: `/category-form`}}
          > Create New Category </Link>
          <input
          type="text"
          className="search"
          value={searchValue}
          placeholder="Find what you're looking for."
          onChange={(e) => handleSearch(e)}
          />
          {itemDisplay}
      </div>
    )}
export default ItemCollection
