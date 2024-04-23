import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { useFormik } from 'formik';
import { UserContext } from '../App';

import "../stylesheets/Success.css"

// Screen that'll tell the user that their item has been created/deleted successfully 

function SuccessScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const {data} = location.state;


  const handleSubmit = () => {
    navigate('/inventory')
  }
  
return (
  <div class="container-fluid vh-100">
  <div class="row justify-content-center align-items-center h-100">
      <div class="col-auto">
  <div class="fade-in-text" style={{width: 250 }}>
    <div class="card text-center" >
      <div class="card-body">
        <h2 class="card-title" >Success!</h2>
          <span style={{ color: '#d58686' }}> {data.name} </span> 
            <p class="card-text"> has been added successfully.</p>
            <button  
              className="btn mt-3"
              style={{ backgroundColor: '#d58686', color: '#FCEFEF' }}
              type="submit"
              onClick={handleSubmit}> Okay! </button>
      </div>
    </div>
  </div>
  </div>
  </div>
  </div>

)

}

export default SuccessScreen;