import React from "react";
import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation, useParams  } from 'react-router-dom';
import { UserContext } from '../App';

import Item from "./Item";
import SideBar from "./SideBar";

function CategoryCard(){
  const { user, setUser } = useContext(UserContext)
  const [ items, setItems ] = useState([])
  const [categories, setCategories] = useState([])

  const { id } = useParams();

  useEffect(() => {
    fetchItems(id)
    }, [id])

  const fetchItems = (id) => {
    fetch(`http://127.0.0.1:5000/itemsByCategoryId/${id}`)
      .then((res) => res.json())
      .then((res) => {
        setItems(res)
        console.log(res)
      })
  }
  

  const itemDisplay = Array.isArray(items)
  ? items.map((item) => (
    <div className='cards'>
      <Item
      item={item}
      />
      </div>
    ))
  : null;


  return(
    <div>
      <SideBar />
      <div className="d-flex offset-md-2">
        <div className="flex-grow-1">
          
          <div className="category-link">
            {items.length > 0 ? (
              <>
                {items[0].category ? (
                  <>
                    <h1 className="title">{items[0].category.name}</h1>
                    {items[0].category.item?.length !== undefined && (
                      <p className="lead text-muted offset-md-1 font-weight-light">Items: {items[0].category.item.length}</p>
                    )}
                  </>
                ) : (
                  <h1 className="title">Category Not Found</h1>
                )}
              </>
            ) : (
              <h1 className="title">There's nothing here :( </h1>
            )}
            {itemDisplay}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryCard