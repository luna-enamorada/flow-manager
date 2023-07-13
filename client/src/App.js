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

export const UserContext = React.createContext();
export const CartContext = React.createContext();

function App() {
  const [ user, setUser ] = useState({})
  const [ cartOrder, setCartOrder ] = useState(null)

  useEffect(() => {
    fetch('http://127.0.0.1:5000/authorized-session')
      .then(r => r.json())
      .then(data => {
        console.log(data)
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data)); 
      })
      .catch(error => console.log(error))
    // const storedUser = localStorage.getItem('user');
    // if (storedUser) {
    //   setUser(JSON.parse(storedUser));
    // }
  }, []);

  useEffect(() => {
    if (user) {
      fetch(`http://127.0.0.1:5000/orderByUserId/${user.id}`)
        .then(r => r.json())
        .then(data => {
          setCartOrder(data);
          console.log(data)
        });
    }
  }, [user]);
    
  return (
      <UserContext.Provider value={{ user, setUser }}>
    <div className="App" >
        <CartContext.Provider value={{ cartOrder, setCartOrder }}>
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
            </Routes>
          </BrowserRouter>
        </CartContext.Provider>
    </div>
      </UserContext.Provider>
  );
}

export default App;

