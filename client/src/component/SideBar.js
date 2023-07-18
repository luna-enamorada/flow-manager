import React from "react";
import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext, CartContext } from '../App';

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/js/dist/dropdown'

import "../stylesheets/SideBar.css"

function SideBar() {
  const { user, setUser } = useContext(UserContext)

  return (
    <div className="col-md-2 d-flex justify-content-between flex-column SideBar" >
      <div>
        <a className='text-decoration-none text-white d-flex align-itemcenter ms-3 mt-2'>
          <i className="fs-4 bi"> </i>
          {/* <Link to = "/order" className="ms-1 fs-2 fw-light"> </Link> */}
          <span className="ms-1 fs-2 fw-light" > Manage Flow </span>
        </a>
        <hr className="text-white" />
          <ul class="nav nav-pills flex-column">
            <li class="nav-item text-white fs-4 my-1">
              <Link to = "/inventory" class = "nav-link text-white fs-5" aria-current="page"> 
                <i className="bi bi-box-seam"/>
                <span className="ms-3"> Inventory </span>
              </Link>
            </li>
            <li class="nav-item text-white fs-4 my-1">
              <Link to = "/categories" class = "nav-link text-white fs-5" aria-current="page"> 
                <i className="bi bi-grid"/>
                <span className="ms-3"> Categories </span>
              </Link>
            </li>
            <li class="nav-item text-white fs-4 my-1">
              <Link to = "/order" class = "nav-link text-white fs-5" aria-current="page"> 
                <i className="bi bi-cart3"/>
                <span className="ms-3"> Order </span>
              </Link>
            </li>
          </ul>
      </div>
      <div class="pb-3">
        <Link to = "/user-page" class="dropdown-item">
        <a class="text-decpration-none text-white p-3 ">
              <i className="bi bi-person-circle ms-1"  > </i> 
              <span className="ms-2 fs-4"> {user.username} </span>
            </a>
            </Link>
      </div>
      </div>
  );
}

export default SideBar;