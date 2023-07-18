import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { useFormik } from 'formik';
import { UserContext } from '../App';

import SideBar from '../component/SideBar';

import "../stylesheets/UserPage.css"

function UserPage() {
  const { user, setUser } = useContext(UserContext);
  const { id, name, username, budget } = user;
  const [updatedBudget, setUpdatedBudget] = useState(0);
  const navigate = useNavigate();

  function handleLogout() {
    fetch('http://127.0.0.1:5000/logout').then((r) => {
        if (r.ok) {
            setUser(null);
            navigate("/")
        }
    })
}

const updateUserBudget = () => {
  const newBudget = {
    budget: updatedBudget
  };
  fetch(`http://127.0.0.1:5000/users/${id}`, {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
    body: JSON.stringify(newBudget),
  })
  .then((response) => response.json())
  .then((data) => {
    setUser((prevUser) => ({
      ...prevUser,
      budget: data.budget,
    }));
    setUpdatedBudget(data.budget); 
  })
  .catch((error) => {
    console.error("Error:", error);
  });
}

  const handleFormSubmit = (event) => {
    event.preventDefault();
    updateUserBudget();
  };

  const handleBudgetChange = (event) => {
    const { value } = event.target;
    setUpdatedBudget(value);
  };

  return (
    <div>
      <SideBar />
      <div className="d-flex offset-md-2">
        <div className="flex-grow-1">
        <h1 className="title" > Welcome back, <span style={{ color: '#d58686' }}>{name}</span>! </h1>

        <div class="page-content page-container" id="page-content">
    <div class="pad">
        <div class="row container d-flex justify-content-center">
<div class="col-xl-10 col-md-12">
  <div class="user-card user-card-full">
      <div class="row m-l-0 m-r-0">
          <div class="col-sm-4 bg-c-lite-green user-profile">
              <div class="card-block text-center text-white">
                  <div class="m-b-25">
                      {/* <img className="profile-image" src="https://i.pinimg.com/564x/eb/4b/10/eb4b10f0a6f4432f7c79f09c35344098.jpg" class="img-radius" alt="User-Image" /> */}
                      <i className="bi bi-person-circle ms-1" style={{ fontSize: "80px" }}  > </i> 
                  </div>
                  <h3 class="f-w-600">{name}</h3>
                  <p>{username}</p>
                  <i class=" mdi mdi-square-edit-outline feather icon-edit m-t-10 f-16"></i>
              </div>
          </div>
          <div class="col-sm-8">
              <div class="card-block">
                  <div class="row">
                      <div class="col-sm-7">
                          <h3 class="">Current Budget: <span style={{ color: '#d58686' }}>{budget}</span> </h3>
                          <h6 class="text-muted f-w-400">
                            <form onSubmit={handleFormSubmit}>
                              <input
                                type='number'
                                name='budget'
                                value={updatedBudget}
                                onChange={handleBudgetChange}
                              />
                              <button  
                              className="btn mt-3"
                              style={{ backgroundColor: '#d58686', color: '#FCEFEF' }}
                              type="submit">
                                Update Budget
                              </button>
                            </form>
                          </h6>
                      </div>
                  </div>
                  <div class="row">
                      <div class="col-sm-6">
                      <h6 class="m-b-20 m-t-40 p-b-5 b-b-default f-w-600">-</h6>
                      <h6 class="m-b-20 m-t-40 p-b-5 b-b-default f-w-600">Info:</h6>
                          <h6 class="text-muted f-w-400">Inventory: {user.item.length} </h6>
                      </div>
                  </div>
                  <button  
                    className="btn btn-outline-danger"
                    type="submit"
                    onClick={handleLogout}>
                      LogOut
                    </button>
              </div>
          </div>
      </div>
  </div>
  </div>
  </div>
  </div>
  </div>
      </div>
    </div>
    </div>
  );
}

export default UserPage;