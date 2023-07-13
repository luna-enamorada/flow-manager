import React from "react";
import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation, useParams  } from 'react-router-dom';
import { UserContext } from '../App';

import Item from "./Item";

function CategoryCard(){
  const { user, setUser } = useContext(UserContext)
  const [ items, setItems ] = useState([])
  const [categories, setCategories] = useState([])

  const { id } = useParams();

  useEffect(() => {
    fetchItems(id)
    }, [id])

  const fetchItems = (id) => {
    fetch(`http://127.0.0.1:5000/itemsByCategoryId/${id}`)
      .then((res) => res.json())
      .then((res) => {
        setItems(res)
        console.log(res)
      })
  }

  const itemDisplay = Array.isArray(items)
  ? items.map((item) => (
    <div className='cards'>
      <Item
      item={item}
      />
      </div>
    ))
  : null;


  return(
    <div className="category-card">
      <h2> {categories.name} </h2>
      {itemDisplay}
    </div>
  )
}

export default CategoryCard