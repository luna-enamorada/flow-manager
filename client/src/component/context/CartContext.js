import { createContext, useEffect, useState } from "react";

// no actual context is happening here whoopsie

export function addToOrder(quantity, item_id, order_id) {
  const newItem = {
    quantity,
    item_id,
    order_id
  };
  return fetch('http://127.0.0.1:5000/order_details', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newItem),
  })
  .then(response => response.json())
  .catch(error => {
    console.error(error);
  });
}

// export function changeQuantity(quantity, item_id) {
//   const newQuantity = { quantity: quantity  };

//   return fetch(`http://127.0.0.1:5000/orderDetailsByItemID/${item_id}`, {
//     method: 'PATCH',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(newQuantity),
//   })
//     .then(response => response.json())
//     .catch(error => {
//       console.error(error);
//     });
// }

// export function removeFromOrder( id ) {
//   return fetch(`http://127.0.0.1:5000/orderDetailsByItemID/${id}`, {
//     method: 'DELETE',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   })
//     .then(response => response.json())
//     .catch(error => {
//       console.error(error);
//     });
// }

// export function newOrder( user_id, total ) {
//   const newOrder = {
//     user_id,
//     total: 0,
//   };

//   return fetch('http://127.0.0.1:5000/order_details', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(newOrder),
//   })
//     .then(response => response.json())
//     .catch(error => {
//       console.error(error);
//     });
// }

export function updatedTotal( total, user_id ) {
  const newTotal = {
    total
  }
  return fetch(`http://127.0.0.1:5000/orderByUserId/${user_id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newTotal),
  })
    .then(response => response.json())
    .catch(error => {
      console.error(error);
    });
}

// export function getTotal(user_id) {
//   return fetch(`http://127.0.0.1:5000/orderByUserId/${user_id}`)
//     .then(response => response.json())
//     .catch(error => {
//       console.error(error);
//     });
// }

