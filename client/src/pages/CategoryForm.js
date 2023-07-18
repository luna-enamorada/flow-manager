import { useState, useEffect, useContext } from 'react';
import { useFormik } from 'formik';
import { UserContext } from '../App';
import * as yup from 'yup';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import SideBar from '../component/SideBar';


function CategoryForm(){
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const formSchema = yup.object({
    name: yup.string().required('Name is required.'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: formSchema,
    onSubmit: (values, actions) => {
      fetch('http://127.0.0.1:5000/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })
      .then((r) => r.json())
      .then((data) => {
        actions.resetForm();
        console.log(data);
        navigate('/categories');
      })
      .catch((error) => alert(error));
    },
  });

  return (
    <div>
      <SideBar />
      <div className="d-flex offset-md-2">
        <div className="flex-grow-1">
        <div className="container py-5">
        <div className="row">
        <div className="col-9 mx-auto mt-3 ">
          <div className='card' >
            <form onSubmit={formik.handleSubmit}>
              <div class="form-outline mb-4">
                <label class="form-label" for="form1Example1">
                  Name of New Category
                </label>
                <input
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  type="text"
                  name="name"
                  id="form1Example1"
                  class="form-control"
                />
                {formik.touched.name && formik.errors.name ? (
                  <div className="text-danger">{formik.errors.name}</div>
                ) : null}
              </div>
              <input
                type="submit"
                value="Create"
                className="button btn btn-sm btn-block"
                style={{ backgroundColor: '#d58686', color: '#FCEFEF' }}
              />
              <Link to="/categories">
                <button className="btn btn-sm btn-outline-danger" role="button">
                  <span className="text">Cancel</span>
                </button>
              </Link>
            </form>
          </div>
          </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default CategoryForm

      // <div className="body">
      //   <section>
      //     <form className="form" onSubmit={formik.handleSubmit}>
      //       <h1>Create a New Category</h1>
      //       <label>name</label>
      //       <input value={formik.values.name} onChange={formik.handleChange} type="text" name="name" />
      //       <input type="submit" value="create" className="button" />
      //       <Link to={{ pathname: '/categories' }}> Cancel </Link>
      //     </form>
      //   </section>
      // </div>