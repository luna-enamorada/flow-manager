import { useState, useEffect, useContext } from 'react';
import { useFormik } from 'formik';
import { UserContext } from '../App';
import * as yup from 'yup';
import { Link, useNavigate, useLocation } from 'react-router-dom';


function ItemForm(){
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories();
  }, []);

  function getCategories() {
    fetch('http://127.0.0.1:5000/categories')
      .then((r) => r.json())
      .then((data) => {
        setCategories(data);
      });
  }

  
  const formSchema = yup.object({
    name: yup.string().required('Name is required.'),
    price: yup.number().required('Price is required.'),
    units: yup.number().required('Unit number is required.').positive().integer(),
    par_level: yup.number().required('Par level is required.'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      price: 0,
      units: 0,
      par_level: 0,
      stock: 0,
      user_id: user.id,
      category_id: null, 
    },
    validationSchema: formSchema,
    onSubmit: (values, actions) => {
      fetch('http://127.0.0.1:5000/items', {
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
        navigate('/inventory');
      })
      .catch((error) => alert(error));
    },
  });

  const categoriesDisplay = Array.isArray(categories)
    ? categories.map((category) => (
        <option value={category.id} key={category.id}>
          {category.name}
        </option>
      ))
    : null;

    function handleSelect(e) {
      Number(formik.setFieldValue("category_id", e.target.value));
    }
    

  return (
    <div className="body">
      <section>
        <form className="form" onSubmit={formik.handleSubmit}>
          <h1>Create a New Item</h1>
          <label>name</label>
          <input value={formik.values.name} onChange={formik.handleChange} type="text" name="name" />
          <label>price $</label>
          <input value={formik.values.price} onChange={formik.handleChange} type="number" name="price" />
          <label>units</label>
          <input value={formik.values.units} onChange={formik.handleChange} type="number" name="units" />
          <label>par level</label>
          <input value={formik.values.par_level} onChange={formik.handleChange} type="number" name="par_level" />
          <label>current stock</label>
          <input value={formik.values.stock} onChange={formik.handleChange} type="number" name="stock" />
          <select value={formik.values.category_id} onChange={handleSelect} name="category_id">
            {categoriesDisplay}
          </select>
          <input type="submit" value="create" className="button" />
          <Link to={{ pathname: '/inventory' }}> Cancel </Link>
        </form>
      </section>
    </div>
  );
}
export default ItemForm