import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { useFormik } from 'formik';
import { UserContext } from '../App';
import * as yup from 'yup';

import "../stylesheets/Login.css"


function Login() {
  const { user, setUser } = useContext(UserContext)

  const [signup, setSignup] = useState(true);
  const toggleSignup = () => setSignup((prev) => !prev);

  const navigate = useNavigate();

  const handleSuccess = (user) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user))
    console.log('login sucess', user )
    if (signup) {
      newOrder(user);
    }
  }

  function newOrder(user, total) {
    if (!user.id) {
      console.error('Cannot create order: User ID is missing.');
    }
  const newOrder = {
    user_id: user.id,
    total: 0,
  };

  return fetch('http://127.0.0.1:5000/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newOrder),
  })
    .then(response => response.json())
    .catch(error => {
      console.error(error);
    });
}


  const formSchema = yup.object({
    name: yup.string(),
    email: yup.string(),
    username: yup.string(),
    password: yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      username: '',
      password: '',
      budget: 0
    },
    validationSchema: formSchema,
    onSubmit: (values, actions) => {
      fetch(signup ? 'http://127.0.0.1:5000/signup' : 'http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })
        .then((res) => res.json())
        .then((data) => {
          actions.resetForm();
          handleSuccess(data)
          navigate('/user-page');
        })
        .catch(error => alert(error))
    },
  });

  

  return (
    <div>
    <div className="form-body">
      <h1 className='title text-white py-1 fw-normal'> Manage Flow </h1>
      <h2 className='title text-white py-1'> Keep track of inventory with ease. </h2>
      <section>
        {signup ? (
          <form className='form' onSubmit={formik.handleSubmit}>
            <h1 className='title text-white'>signup</h1>
            <h4 className='title text-white py-1' >name</h4>
            <input value={formik.values.first_name} onChange={formik.handleChange} type='text' name='name' className='input' />
            <h4 className='title text-white py-1' >email</h4 >
            <input value={formik.values.email} onChange={formik.handleChange} type='text' name='email' className='input' />
            <h4 className='title text-white py-1'>username</h4 >
            <input value={formik.values.username} onChange={formik.handleChange} type='text' name='username' className='input' />
            <h4 className='title text-white py-1' >password</h4 >
            <input value={formik.values.password} onChange={formik.handleChange} type='password' name='password' className='input' />
            <input type='submit' value='Sign Up' className='button' />
          </form>
        ) : (
          <form className='form' onSubmit={formik.handleSubmit}>
            <h1 className='title text-white' >login</h1>
            <h4 className='title text-white py-1'>username</h4 >
            <input value={formik.values.username} onChange={formik.handleChange} type='text' name='username' className='input' />
            <h4 className='title text-white py-1'>password</h4 >
            <input value={formik.values.password} onChange={formik.handleChange} type='password' name='password' className='input' />
            <input type='submit' value='Login' className='button mb-1' />
          </form>
        )}
          <div className='form'>
            <p className='title text-white my-2' >{signup ? "Returning?" : "Don't have an account?"}</p>
            <button className="button" onClick={toggleSignup}>
              {signup ? "Login" : "Sign Up"}
            </button>
          </div>
        </section>
    </div>
    </div>
  )
}

export default Login
