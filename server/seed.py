#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, OrderDetail, Order, Item, Category

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        # Seed code goes here!
        # User.query.delete()
        OrderDetail.query.delete()
        Order.query.delete()
        Item.query.delete()
        Category.query.delete()

        od = Order(
            total = 9000,
            user_id = 1
        )
        db.session.add(od)
        db.session.commit()

        i1 = Item( name = 'caramel', price = 7, par_level = 10, user_id = 1, category_id = 1, stock = 7 )

        i2 = Item(
            name = 'mocha',
            price = 5,
            par_level = 10,
            user_id = 1,
            category_id = 1,
            stock = 3
        )

        i3 = Item(
            name = 'turtle',
            price = 8,
            par_level = 7,
            user_id = 1,
            category_id = 1,
            stock = 12
        )

        db.session.add_all([ i1, i2, i3 ])
        db.session.commit()

        o = OrderDetail(
            quantity = 21,
            item_id = 1,
            order_id = 1
        )
        db.session.add(o)
        db.session.commit()

        c1 = Category( 
            name = 'syrup'
        )
        db.session.add(c1)
        db.session.commit()