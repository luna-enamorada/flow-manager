import React from "react";
import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../App';
import { Link } from 'react-router-dom';

import CategoryCard from "../component/CategoryCard";

function Categories(){
  const navigate = useNavigate();
  
  const { user, setUser } = useContext(UserContext)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    getCategories()
  }, []);

  function getCategories () {
    fetch('http://127.0.0.1:5000/categories')
    .then(r => r.json())
    .then(data => {
      setCategories(data)
      console.log(data)
    })
  }


  const categoriesDisplay = Array.isArray(categories)
  ? categories.map((categories) => (
    <div className='category-card-container'>
      <Link
        to={{ pathname: `/categories/${categories.id}`}}
        key={categories.id}
      > {categories.name} </Link>
    </div>
    ))
  : null;


  return(
    <div>
      {categoriesDisplay}
    </div>
  )
}

export default Categories