import { useState, useEffect, useContext } from 'react';
import { useFormik } from 'formik';
import { UserContext } from '../App';
import * as yup from 'yup';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import SideBar from '../component/SideBar';

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
    par_level: yup.number().required('Par level is required.'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      price: 0,
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
      <SideBar />
      <div className="d-flex offset-md-2">
        <div className="flex-grow-1">

        <div className="card p-3">
            <div className="row">
              <div className="col-md-6 offset-md-3">
        <form className="form-horizontal" onSubmit={formik.handleSubmit}>
<fieldset>

<div class="col-md-6 text-center d-flex justify-content-center align-items-center">
        <h2 class="text-muted">Create New Item</h2>
      </div>

<div class="form-group">
  <label class="col-md-6 control-label" for="textinput">Name</label>  
  <div class="col-md-6">
  <input id="textinput" name="name" type="text" placeholder="name of new item" class="form-control input-md" 
  value={formik.values.name} onChange={formik.handleChange} />
  </div>
</div>
<div class="form-group">
  <label class="col-md-6 control-label" for="textinput">Price</label>  
  <div class="col-md-6">
  <input id="textinput" name="price" type="number" placeholder="price of new item" class="form-control input-md" 
  value={formik.values.price} onChange={formik.handleChange} />
    
  </div>
</div>
<div class="form-group">
  <label class="col-md-6 control-label" for="textinput">Par Level</label>  
  <div class="col-md-6">
  <input id="textinput" name="stock" type="number" placeholder="par level" class="form-control input-md" 
  value={formik.values.stock} onChange={formik.handleChange} />
  </div>
</div>
<div class="form-group">
  <label class="col-md-6 control-label" for="textinput">Current Stock</label>  
  <div class="col-md-6">
  <input id="textinput" name="stock" type="number" placeholder="current stock" class="form-control input-md"
  value={formik.values.stock} onChange={formik.handleChange}/>
  </div>
</div>
<div class="form-group">
  <label class="col-md-6 control-label" for="selectbasic">Category</label>
  <div class="col-md-6">
    <select value={formik.values.category_id} onChange={handleSelect} name="category_id" class="form-control">
    {categoriesDisplay}
  </select>
  </div>
</div>

{/* <!-- File Button -->  */}
{/* <div class="form-group">
  <label class="col-md-6 control-label" for="filebutton">Image</label>
  <div class="col-md-6">
    <input id="filebutton" name="filebutton" class="input-file" type="file" />
  </div>
</div> */}

<div className="form-group">
                      <label className="col-md-4 control-label" htmlFor="button1id"></label>
                      <div className="col-md-8">
                        <input type="submit" value="Create" className="btn btn-sm" 
                        style={{ backgroundColor: '#d58686', color: '#FCEFEF' }}
                        />
                        <Link to="/inventory">
                          <button className="btn btn-sm btn-outline-danger" role="button">
                            <span className="text">Cancel</span>
                          </button>
                        </Link>
                      </div>
                    </div>

                  </fieldset>
                </form>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
export default ItemForm

// <section>
// <form className="form" onSubmit={formik.handleSubmit}>
//   <h1>Create a New Item</h1>
//   <label>name</label>
//   <input value={formik.values.name} onChange={formik.handleChange} type="text" name="name" />
//   <label>price $</label>
//   <input value={formik.values.price} onChange={formik.handleChange} type="number" name="price" />
//   <label>par level</label>
//   <input value={formik.values.par_level} onChange={formik.handleChange} type="number" name="par_level" />
//   <label>current stock</label>
//   <input value={formik.values.stock} onChange={formik.handleChange} type="number" name="stock" />
//   <select value={formik.values.category_id} onChange={handleSelect} name="category_id">
//     {categoriesDisplay}
//   </select>
//   <input type="submit" value="create" className="button" />
//   <Link to={{ pathname: '/inventory' }}> Cancel </Link>
// </form>
// </section>
