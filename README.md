# Manage Flow
Manage Flow is designed specifically with managers in mind who want to efficiently track their stock levels and effortlessly create orders based on optimal par quantities.


## Features ✨
Users will be able to
- Sign up/Log in to create an inventory of items.
- Users can sort items into catagories. 
- Provide up-to-date information on inventory levels. Set par levels for each item in your inventory, ensuring that you never run out of critical items or overstock unnecessarily
- When items reach their par levels, the app will automatically generate optimized purchase orders

// Stretch Goals 🏆
- Receive alerts when stock becomes low and when order dates come up
- Email alerts to Users
- Get valuable insights, identify high-demand items, track slow-moving stock, and optimize your inventory strategy with comprehensive reports

## Database Schema 📝

<img src=imgs/dbmanage-flow.png>


## API Routes
| API Route  	| Request<br>Method 	| Body                                                            	| Response                                                            	|
|------------	|-------------------	|-----------------------------------------------------------------	|---------------------------------------------------------------------	|
| /login     	| POST               	| { username, password}                                             | { id, name, username, password, email }                               |
| /logout     	| DELETE              	|                                                              	    | { }                                                                	|
| /items     	| POST              	| { name, price, par_level, user_id }                       	    | { id, name, price, par_level, user_id, created_at, updated_at }    	|
| /items/:id    | PATCH              	| {[...]}                                                   	    | { id, name, price, par_level, user_id, created_at, updated_at }    	|
| /items/:id    | DELETE              	|                                                              	    | { }                                                                	|
| /ItemsByUserId/:id  | GET           	|                                                                   | [{ id, name, price, par_level, user_id, created_at, updated_at }]     |
| /categories   | POST               	| { name, user_id }                                                 | { id, items, name, user_id }                                          |
| /categories/:id | DELETE             	|                                                                	| { }                                                                   |
| /itemsByCategoryId/:id | GET      	|                                                              	    | [{ id, name, price, image, par_level, stock }]                    	|
| /CategoriesByUserID/:id | GET      	| { item_id, user_id, quantity }                               	    | [{ id, items, name, user_id }]                                	    |
| /orderByUserId/:id   | GET          	|                                                              	    | [{ id, order_detail: [], total, user, user_id }]                  	|
| /orderByUserId/:id   | PATCH         	| {[...]}                                                   	    | [{ id, order_detail: [], total, user, user_id }]                  	|
| /orderDetailsByOrderID/:id   | GET    |                                                              	    | [{ id, item_id, order_id, quantity }]                             	|
| /orderDetailsByOrderID/:id   | PATCH  | {[...]}                                                   	    | { id, item_id, order_id, quantity }                                	|
| /orderDetailsByOrderID/:id   | DELETE |                                                              	    | { }                                                                	|

## Routes

| Route              	| Component        	|
|---------------------	|------------------	|
| /                     | Login/Signup.js   |
| /inventory          	| ItemCollection.js |
| /categories           | Categories.js     |
| /item-form            | ItemForm.js       |
| /inventory/:id        | ItemCard.js       |
| /categories/:id       | CategoryCard.js   |
| /category-form        | CategoryForm.js   |
| /order            	| OrderPage.js      |
| /user-page            | UserPage.js       |


# Original Concepts 
### Component Hierarchy  
<img src=imgs/components.png>

### WireFrame 
<img src=imgs/Manage_Flow_WireFrame.png>

### Kanban Board
<img src=imgs/trello.png>
