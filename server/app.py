#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import Flask, request, make_response, session, jsonify
from flask_restful import Resource

# Local imports
from config import app, db, api
from models import User, Budget, OrderDetail, Order, Item, CategoryTag, Category, Stock

# Views go here!

if __name__ == '__main__':
    app.run( port = 5555, debug=True )

@app.route('/')
def get():
    return "<h1> What's up! </h1>"



