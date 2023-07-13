import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { useFormik } from 'formik';
import { UserContext } from '../App';
import * as yup from 'yup';
import { Link } from 'react-router-dom';


import "../stylesheets/Item.css"

function Item({ item }) {
  const { id, name, price, unit, par_level, stock } = item
  const navigate = useNavigate(); 

  function handleClick() {
    navigate(`/inventory/${id}`)
  }

  return(
    <div className='item'>
      <div className='card-text'>
        <h2 className='name'> {name} </h2>
        <h2 className= 'price'> ${price} </h2>
        <h3 className='stock'> current stock: {stock} </h3>
      </div>
      <button className='show-details-button'
        onClick={handleClick}>
        more info
      </button>
    </div>
  )
}

export default Item