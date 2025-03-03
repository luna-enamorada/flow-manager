import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom"
import SideBar from './component/SideBar';

import Login from './pages/Login';
import ItemCollection from './pages/ItemCollection';
import Categories from './pages/Categories';
import ItemForm from './pages/ItemForm';
import ItemCard from './component/ItemCard';
import CategoryCard from './component/CategoryCard';
import CategoryForm from './pages/CategoryForm';
import OrderPage from './pages/OrderPage';
import UserPage from './pages/UserPage';
import SuccessScreen from './pages/SuccessScreen';

import "./stylesheets/App.css"

export const UserContext = React.createContext();
// export const CartContext = React.createContext();

function App() {
  const [ user, setUser ] = useState({})
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/authorized-session')
      .then(r => r.json())
      .then(data => {
        // console.log(data)
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
        setLoading(false);
      });

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
    
  return (
      <UserContext.Provider value={{ user, setUser }}>
    <div className="App" >
    {loading ? ( // Show loading message while fetching user data
          <div>Loading...</div>
        ) : (
          <BrowserRouter>
            <Routes>
              <Route path = "/" element = { <Login />} />
              <Route path = "/inventory" element = { <ItemCollection /> }/>
              <Route path = "/categories" element = { <Categories /> }/>
              <Route path = "/item-form" element = { <ItemForm /> }/>
              <Route path = "/inventory/:id" element = { <ItemCard /> }/>
              <Route path = "/categories/:id" element = { <CategoryCard /> }/>
              <Route path = "/category-form" element = { <CategoryForm /> }/>
              <Route path = "/order" element = { <OrderPage /> }/>
              <Route path = "/user-page" element = { <UserPage /> }/>
              <Route path = "/success" element = { <SuccessScreen /> }/>
            </Routes>
          </BrowserRouter>
        )}
        </div>
      </UserContext.Provider>
  );
}

export default App;

