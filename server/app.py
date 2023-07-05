#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import Flask, request, make_response, session, jsonify
from flask_restful import Resource

# Local imports
from config import app, db, api
from models import User, Budget, OrderDetail, Order, Item, CategoryTag, Category, Stock

# Views go here!


@app.route('/')
def get():
    return "<h1> What's up! </h1>"

class Items( Resource ):
    def get(self):
        items = [ p.to_dict() for p in Item.query.all() ]
        response = make_response( items, 200 )
        return response


    def post( self ):
        rq = request.get_json()
        try:
            new_item = Item(
                name = rq['name'] ,
                price = rq['price'] ,
                par_level = rq['par_level'] ,
                user_id = rq['user_id']
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
            item = Item.find(id).to_dict()
            response = make_response( item, 200 )
            return response
        except:
            response = make_response( {"error": "item not found"}, 404 )
            return response


    def patch( self, id ):
        item = Item.find(id)
        if not item:
            response = make_response( {"error": "prompt not found"}, 404 )
            return response
        try:
            for attr in request.get_json():
                setattr( item, attr, request.get_json()[attr] )
            db.session.add(item)
            db.session.commit()


            item_dict = item.to_dict( )
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





if __name__ == '__main__':
    app.run( port = 5555, debug=True )
