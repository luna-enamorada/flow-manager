import React from "react";
import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../App';
import { Link } from 'react-router-dom';

import CategoryCard from "../component/CategoryCard";
import SideBar from "../component/SideBar";

import "../stylesheets/Categories.css"

function Categories(){
  const navigate = useNavigate();
  
  const { user, setUser } = useContext(UserContext)
  const [categories, setCategories] = useState([])
  const [searchValue, setSearchValue] = useState(" ");

  useEffect(() => {
    getCategories()
    handleSearch()
  }, []);

  function getCategories () {
    fetch('http://127.0.0.1:5000/categories')
    .then(r => r.json())
    .then(data => {
      setCategories(data)
      console.log(data)
    })
  }

  function handleSearch(e) {
    const searchValue = e ? e.target.value : "";
    setSearchValue(searchValue);
  }

  const filteredItems = [...categories].filter((item) => 
    item.name.toLowerCase().includes(searchValue.toLowerCase())
  );



  const categoriesDisplay = filteredItems.map((category) => (
      <div className="content">
        <div className="category-card">
          <div className="card_title">
            <p className="padding"> 000</p>
            <p className="padding"> 000</p>
            <Link
              to={{ pathname: `/categories/${category.id}` }}
              key={category.id}
              style={{ color: '#007bff', textDecoration: 'none' }}
            >
              <p className="cat-name" >{category.name}</p>
            </Link>
            {category.item?.length !== undefined && (
              <p className="item-count">Items: {category.item.length}</p>
            )}
          </div>
          <div className="card_image">
          {category.item[0] && category.item[0].image && (
          <img src={category.item[0].image} alt="Category" /> )}
            <img src="https://i.stack.imgur.com/1hCKa.png" alt="transparent" />
          </div>
        </div>
      </div>
    ))

  return (
    <div>
      <SideBar />
      <div className="d-flex offset-md-2">
        <div className="flex-grow-1">
          <h1 className="title" > CATEGORIES </h1>
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
          <Link to="/category-form">
            <button className="button-48" role="button">
              <span className="text">Create New Category</span>
            </button>
          </Link>
          </div>
          <hr className="text-white" />
          <div className="container">
            <div className="cards-list">
              {categoriesDisplay}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Categories