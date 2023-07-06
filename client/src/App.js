import { useState, useEffect, useContext } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { UserContext } from './component/UserContext';

import Login from './component/Login';


function App() {
  const { user, setUser } = useContext(UserContext)

  useEffect(() => {
    fetch("/authorized-session").then((response) => {
      if (response.ok) {
        response.json().then((user) => setUser(user));
      }
    });

  }, []);

  const updateUser = (userData) => {
    setUser(userData);
  };


  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path = "/" element = { <Login setUser={updateUser} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
