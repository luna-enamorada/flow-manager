from flask import Flask, request, make_response, session, jsonify
from flask_restful import Resource, abort

from config import app, db, api
from models import User, OrderDetail, Order, Item, Category
from werkzeug.exceptions import NotFound, UnprocessableEntity, Unauthorized
from secret import key

app.secret_key = key

@app.route('/')
def get():
    return "<h1> What's up! </h1>"

@app.route('/logout', methods=["GET"])
def logout():
    session['user_id'] = None 
    return make_response('' , 204)

# @app.before_request
# def check_session():
#     print(f'before request {session}')

# @app.after_request
# def check_session(response):
#     print(f'after request {session}')
#     return response 

@app.route('/authorized-session', methods=["GET"])
def authorize():
    try:
        user = User.query.filter_by(id=session.get('user_id')).first()
        return make_response( user.to_dict(rules = ('-_password_hash', ) ) , 200)
    except:
        raise Unauthorized("invalid credentials")

@app.route('/dark-mode', methods=["GET"])
def mode():
    return make_response(jsonify(
        {
            "cookies": request.cookies["mode"]
        }
    ), 200)

class Signup( Resource ):
    def post(self):
        rq = request.get_json()
        new_user = User(
            name = rq.get('name'),
            username = rq.get('username'),
            email = rq.get('email'),
            )
        new_user.password_hash = rq.get('password')
        db.session.add(new_user)
        db.session.commit()
        session['user_id'] = new_user.id
        return make_response(new_user.to_dict(rules = ('-_password_hash', )), 200)
    
api.add_resource(Signup, '/signup')

class Login(Resource):
    def post(self):
        try:
            rq = request.get_json()
            user = User.query.filter_by(username = rq.get('username')).first()
            if user.authenticate(rq.get('password')):
                session['user_id'] = user.id 
                return make_response(user.to_dict(rules = ('-_password_hash', )), 200)
        except:
            abort(401, "Unauthorized")

api.add_resource(Login, '/login')            



class Users( Resource ):
    def get(self):
        users = [ user.to_dict() for user in User.query.all() ]
        response = make_response( users, 200 )
        return response

api.add_resource( Users, '/users')

class UsersByID( Resource ):
    def get( self, id ):
        try:
            user = User.find(id).to_dict( )
            response = make_response( user, 200 )
            return response
        except:
            response = make_response( {"error": "user not found"}, 404 )
            return response

    def patch( self, id ):
        user = User.find(id)
        if not user:
            response = make_response( {"error": "user not found"}, 404 )
            return response
        try:
            for attr in request.get_json():
                setattr( user, attr, request.get_json()[attr] )
            db.session.add(user)
            db.session.commit()


            user_dict = user.to_dict(  )
            response = make_response( jsonify(user_dict), 200 )
            return response


        except:
            response = make_response( {"errors": ["validation errors"]}, 400)
            return response

    def delete( self, id ):
        user = User.find(id)
        try:
            db.session.delete( user )
            db.session.commit()
            response = make_response( ' ', 204 )
            return response
        except:
            response = make_response( {"error": "user not found"}, 404 )
            return response
        
api.add_resource( UsersByID, '/users/<int:id>' )


class Items( Resource ):
    def get(self):
        items = [ item.to_dict() for item in Item.query.all() ]
        response = make_response( items, 200 )
        return response


    def post( self ):
        rq = request.get_json()
        try:
            new_item = Item(
                name = rq['name'] ,
                price = rq['price'] ,
                par_level = rq['par_level'] ,
                user_id = rq['user_id'],
                category_id = rq['category_id'],
                stock = rq['stock']
            )
            db.session.add(new_item)
            db.session.commit()
            new_item_dict = new_item.to_dict()
            response = make_response( new_item_dict, 201 )
            return response
        except:
            response = make_response( { "error": ["validation errors"]}, 400)
            return response
api.add_resource( Items, '/items')


class ItemsByID( Resource ):
    def get( self, id ):
        try:
            item = Item.find(id).to_dict( )
            response = make_response( item, 200 )
            return response
        except:
            response = make_response( {"error": "item not found"}, 404 )
            return response


    def patch( self, id ):
        item = Item.find(id)
        if not item:
            response = make_response( {"error": "item not found"}, 404 )
            return response
        try:
            for attr in request.get_json():
                setattr( item, attr, request.get_json()[attr] )
            db.session.add(item)
            db.session.commit()


            item_dict = item.to_dict(  )
            response = make_response( item_dict, 200 )
            return response


        except:
            response = make_response( {"errors": ["validation errors"]}, 400)
            return response


    def delete( self, id ):
        item = Item.find(id)
        try:
            db.session.delete( item )
            db.session.commit()
            response = make_response( ' ', 204 )
            return response
        except:
            response = make_response( {"error": "item not found"}, 404 )
            return response
        
api.add_resource( ItemsByID, '/items/<int:id>' )

class ItemsByUserId (Resource):
    def get(self, id):
        items = [ item.to_dict() for item in Item.query.filter_by(user_id=id) ]
        response = make_response( items, 200 )
        return response
api.add_resource( ItemsByUserId, '/ItemsByUserId/<int:id>')

#### category routes

class Categories( Resource ):
    def get(self):
        categories = [ cat.to_dict() for cat in Category.query.all() ]
        response = make_response( categories, 200 )
        return response


    def post( self ):
        rq = request.get_json()
        try:
            new_category = Category(
                name = rq['name'] ,
            )
            db.session.add(new_category)
            db.session.commit()
            new_category_dict = new_category.to_dict()
            response = make_response( new_category_dict, 201 )
            return response
        except:
            response = make_response( { "error": ["validation errors"]}, 400)
            return response
api.add_resource( Categories, '/categories')


class CategoriesByID( Resource ):
    def get( self, id ):
        try:
            category = Category.find(id).to_dict()
            response = make_response( category, 200 )
            return response
        except:
            response = make_response( {"error": "category not found"}, 404 )
            return response

    def patch( self, id ):
        category = Category.find(id)
        if not category:
            response = make_response( {"error": "category not found"}, 404 )
            return response
        try:
            for attr in request.get_json():
                setattr( category, attr, request.get_json()[attr] )
            db.session.add(category)
            db.session.commit()


            category_dict = category.to_dict( )
            response = make_response( category_dict, 200 )
            return response
        except:
            response = make_response( {"errors": ["validation errors"]}, 400)
            return response
        
    def delete( self, id ):
        order = Category.find(id)
        try:
            db.session.delete( order )
            db.session.commit()
            response = make_response( ' ', 204 )
            return response
        except:
            response = make_response( {"error": "Category not found"}, 404 )
            return response


api.add_resource( CategoriesByID, '/categories/<int:id>' )

class ItemsByCategoryId (Resource):
    def get(self, id):
        items = [ item.to_dict() for item in Item.query.filter_by(category_id=id) ]
        response = make_response( items, 200 )
        return response
api.add_resource( ItemsByCategoryId, '/itemsByCategoryId/<int:id>')


### orders
class Orders( Resource ):
    def get(self):
        orders = [ order.to_dict() for order in Order.query.all() ]
        response = make_response( orders, 200 )
        return response
    
    def post( self ):
        rq = request.get_json()
        try:
            new_order = Order(
                total = rq['total'] ,
                user_id = rq['user_id']
            )
            db.session.add(new_order)
            db.session.commit()
            new_order_dict = new_order.to_dict()
            response = make_response( new_order_dict, 201 )
            return response
        except:
            response = make_response( { "error": ["validation errors"]}, 400)
            return response

api.add_resource( Orders, '/orders')


class OrderByID( Resource ):
    def get( self, id ):
        try:
            order = Order.find(id).to_dict( )
            response = make_response( order, 200 )
            return response
        except:
            response = make_response( {"error": "order not found"}, 404 )
            return response


    def patch( self, id ):
        order = Order.find(id)
        if not order:
            response = make_response( {"error": "order not found"}, 404 )
            return response
        try:
            for attr in request.get_json():
                setattr( order, attr, request.get_json()[attr] )
            db.session.add(order)
            db.session.commit()


            order_dict = order.to_dict( )
            response = make_response( order_dict, 200 )
            return response


        except:
            response = make_response( {"errors": ["validation errors"]}, 400)
            return response


    def delete( self, id ):
        order = Order.find(id)
        try:
            db.session.delete( order )
            db.session.commit()
            response = make_response( ' ', 204 )
            return response
        except:
            response = make_response( {"error": "order not found"}, 404 )
            return response
        
api.add_resource( OrderByID, '/orders/<int:id>' )

class OrderByUserId (Resource):
    def get(self, id):
        order = [ order.to_dict() for order in Order.query.filter_by(user_id=id) ]
        response = make_response( order, 200 )
        return response
    

    def patch( self, id ):
        order = Order.query.filter_by(user_id=id).first()
        if not order:
            response = make_response({"error": "order not found"}, 404)
            return response

        try:
            data = request.get_json()
            for attr in data:
                if attr in order.__dict__:
                    setattr(order, attr, data[attr])
            
            db.session.commit()
            
            order_dict = order.to_dict()
            response = make_response( order_dict, 200)
            return response
        except Exception as e:
            response = make_response({"errors": [str(e)]}, 400)
            return response

api.add_resource( OrderByUserId, '/orderByUserId/<int:id>')


### order detail

class OrderDetails( Resource ):
    def get( self ):
        order_details = [ order.to_dict() for order in OrderDetail.query.all() ]
        response = make_response( order_details, 200 )
        return response
    
    def post( self ):
        rq = request.get_json()
        try:
            new_order = OrderDetail(
                quantity = rq['quantity'] ,
                order_id = rq['order_id'] ,
                item_id = rq['item_id']
            )
            db.session.add(new_order)
            db.session.commit()
            new_order_dict = new_order.to_dict()
            response = make_response( new_order_dict, 201 )
            return response
        except:
            response = make_response( {"errors": ["validation errors"]}, 400)
            return response

api.add_resource( OrderDetails, '/order_details' )

class OrderDetailsByID( Resource ):
    def get( self, id ):
        try:
            order_detail = OrderDetail.find(id).to_dict()
            response = make_response( order_detail, 200 )
            return response
        except:
            response = make_response( {"error": "order detail not found"}, 404 )
            return response


    def patch( self, id ):
        order_detail = OrderDetail.find(id)
        if not order_detail:
            response = make_response( {"error": "order detail not found"}, 404 )
            return response
        try:
            for attr in request.get_json():
                setattr( order_detail, attr, request.get_json()[attr] )
            db.session.add(order_detail)
            db.session.commit()

            order_detail_dict = order_detail.to_dict( )
            response = make_response( order_detail_dict, 200 )
            return response

        except:
            response = make_response( {"errors": ["validation errors"]}, 400)
            return response


    def delete( self, id ):
        order_detail = OrderDetail.find(id)
        try:
            db.session.delete( order_detail )
            db.session.commit()
            response = make_response( ' ', 204 )
            return response
        except:
            response = make_response( {"error": "order detail not found"}, 404 )
            return response
        
api.add_resource( OrderDetailsByID, '/order_details/<int:id>' )

class OrderDetailsByOrderID (Resource):
    def get(self, id):
        order = [ order.to_dict() for order in OrderDetail.query.filter_by(order_id=id) ]
        response = make_response( order, 200 )
        return response
api.add_resource( OrderDetailsByOrderID, '/orderDetailsByOrderID/<int:id>')

class OrderDetailsByItemID (Resource):
    def get(self, id):
        order = [ order.to_dict() for order in OrderDetail.query.filter_by(item_id=id) ]
        response = make_response( order, 200 )
        return response
    
    def patch( self, id ):
        order_detail = OrderDetail.query.filter_by(item_id=id).first() 
        if not order_detail:
            response = make_response( {"error": "order detail not found"}, 404 )
            return response
        try:
            for attr in request.get_json():
                setattr( order_detail, attr, request.get_json()[attr] )
            db.session.add(order_detail)
            db.session.commit()

            order_detail_dict = order_detail.to_dict( )
            response = make_response( order_detail_dict, 200 )
            return response
        except:
            response = make_response( {"errors": ["validation errors"]}, 400)
            return response
        
    def delete(self, id):
        order_detail = OrderDetail.query.filter_by(item_id=id).first() 
        try:
            if order_detail:
                db.session.delete(order_detail)
                db.session.commit()
                response = make_response('', 204)
                return response
            else:
                response = make_response({"error": "order detail not found"}, 404)
                return response
        except:
            response = make_response({"error": "An error occurred while deleting the order detail"}, 500)
            return response

api.add_resource( OrderDetailsByItemID, '/orderDetailsByItemID/<int:id>')

if __name__ == '__main__':
    app.run( port = 5000, debug=True )
