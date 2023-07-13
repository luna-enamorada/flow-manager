import { useState, useEffect, useContext } from 'react';
import { useFormik } from 'formik';
import { UserContext } from '../App';
import * as yup from 'yup';
import { Link, useNavigate, useLocation } from 'react-router-dom';


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
    <div className="body">
      <section>
        <form className="form" onSubmit={formik.handleSubmit}>
          <h1>Create a New Category</h1>
          <label>name</label>
          <input value={formik.values.name} onChange={formik.handleChange} type="text" name="name" />
          <input type="submit" value="create" className="button" />
          <Link to={{ pathname: '/categories' }}> Cancel </Link>
        </form>
      </section>
    </div>
  );
}
export default CategoryForm