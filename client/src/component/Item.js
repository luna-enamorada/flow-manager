import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { useFormik } from 'formik';
import { UserContext } from '../App';
import * as yup from 'yup';
import { Link } from 'react-router-dom';


import "../stylesheets/Item.css"

function Item({ item }) {
  const { id, name, price, par_level, stock, created_at, image } = item
  const navigate = useNavigate(); 

  function handleClick() {
    navigate(`/inventory/${id}`)
  }



  return(
    <div className="container-fluid">
      <div className="row">
        <div className="col-10 mx-auto mt-3">
          <div className="card">
            <div className="card-horizontal">
              <img
                className="card-image"
                src= {image}
                alt= {name}
              />
              <div className="card-body" >
                <h3 className="display-6 py-2" style={{color: stock < par_level ? '#f92828' : 'inherit', }} >{name}</h3>
                <h4 className="card-price"> Price per unit: ${price} </h4>
                <button
                  className="btn mt-3"
                  style={{ backgroundColor: '#d58686', color: '#FCEFEF' }}
                  onClick={handleClick}
                >
                  Edit Details
                </button>
              </div>

              <div className="col-4 py-5" >
                <h3 className='card-price'>Par Level:  <span style={{ color: '#d58686' }}> {par_level}</span></h3>
                <h3 className='card-price'>Current Stock: <span style={{color: stock < par_level ? '#f92828' : 'inherit', }}> {stock}</span></h3>
              </div>
            </div>

            <div className="card-footer px-4 py-1" style={{ backgroundColor: '#FCEFEF'}}>
              <small className="text-muted">Created at: {created_at}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Item