import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { useFormik } from 'formik';
import { UserContext } from '../App';

function UserPage() {
  const { user } = useContext(UserContext);
  const { id, name, username, budget } = user;
  const [updatedBudget, setUpdatedBudget] = useState(0);
  const navigate = useNavigate();

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
        setUpdatedBudget(data.budget);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

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
      <h2> Welcome back, {name}! </h2>
      <h3> Current Budget: {budget} </h3>
      <form onSubmit={handleFormSubmit}>
        <input
          type='number'
          name='budget'
          value={updatedBudget}
          onChange={handleBudgetChange}
        />
        <button className="default-button" type="submit">
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default UserPage;
