#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, Budget, OrderDetail, Order, Item, Category, Stock

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        # Seed code goes here!
        User.query.delete()
        Budget.query.delete()
        OrderDetail.query.delete()
        Order.query.delete()
        Item.query.delete()
        Category.query.delete()
        Stock.query.delete()

        user = User(
            name = 'melissa',
            username = 'starbiesmanager',
            _password_hash = 'password',
            email = 'melissaelizn@gmail.com'
        )
        db.session.add(user)
        db.session.commit()

        b = Budget(
            budget = 6000,
            user_id = 1
        )
        db.session.add(b)
        db.session.commit()

        od = Order(
            total = 9000,
            user_id = 1
        )
        db.session.add(od)
        db.session.commit()

        i1 = Item(
            name = 'caramel',
            price = 7,
            par_level = 10,
            user_id = 1,
            category_id = 1
        )

        i2 = Item(
            name = 'mocha',
            price = 5,
            par_level = 10,
            user_id = 1,
            category_id = 1
        )

        i3 = Item(
            name = 'turtle',
            price = 8,
            par_level = 7,
            user_id = 1,
            category_id = 1
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

        s1 = Stock(
            quantity = 3,
            item_id = 1,
            user_id = 1
        )

        s2 = Stock(
            quantity = 6,
            item_id = 2,
            user_id = 1
        )

        s3 = Stock(
            quantity = 4,
            item_id = 3,
            user_id = 1
        )
        db.session.add_all([ s1, s2, s3 ])
        db.session.commit()
