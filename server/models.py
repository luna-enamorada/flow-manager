from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property

from config import db, bcrypt


# ~~~~~~~~~~~~~~~~~~~ Model Tables ~~~~~~~~~~~~~~~~~~~
# User, Budget, OrderDetail, Order, Item, Category, Stock

# ~~~~~~~~~~~~~~~~~~~ User Table ~~~~~~~~~~~~~~~~~~~
class User( db.Model, SerializerMixin ):
    __tablename__ = 'users'

    serialize_rules = (
        '-budget.user',
        '-order.user',
        '-item.user',
        '-stock.user',
        '-updated_at',
        '-budget.user.budget',
        '-order.user.order',
        '-item.user.item',
        '-stock.user.stock'
    )

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    username = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String(15), nullable=False)
    # pfp = db.Column(db.LargeBinary )
    email = db.Column(db.String, unique=True, nullable=False)

    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())
    
    #### relationships
    budget = db.relationship( 'Budget', back_populates = 'user', cascade = 'all, delete-orphan' )
    order = db.relationship( 'Order', back_populates = 'user', cascade = 'all, delete-orphan' )
    item = db.relationship( 'Item', back_populates = 'user', cascade = 'all, delete-orphan' )
    stock = db.relationship( 'Stock', back_populates = 'user', cascade = 'all, delete-orphan' )

    @classmethod
    def find(cls, id):
        user = User.query.filter(User.id == id).first()
        return user

# //////////////////// Password hashing ////////////////////
    @hybrid_property
    def password_hash(self):
        raise AttributeError("Password hashes may not be viewed")

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(
            self._password_hash, password )

    def __repr__(self):
        return f"<User {self.username}>"
    
# //////////////////// Validations ////////////////////


# ~~~~~~~~~~~~~~~~~~~ Budget Table ~~~~~~~~~~~~~~~~~~~

class Budget( db.Model, SerializerMixin ):
    __tablename__ = 'budgets'

    serialize_rules = (
        '-user.budget',
        '-user.budget.user',
        '-created_at',
        '-updated_at',
    )

    id = db.Column(db.Integer, primary_key=True)
    budget = db.Column(db.Integer)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    #### relationships
    user = db.relationship( 'User', back_populates = 'budget')

    @classmethod
    def find(cls, id):
        budget = Budget.query.filter(Budget.id == id).first()
        return budget

    def __repr__(self):
        return f"<Budget: {self.budget}>"


# ~~~~~~~~~~~~~~~~~~~ Order Table ~~~~~~~~~~~~~~~~~~~

class Order( db.Model, SerializerMixin ):
    __tablename__ = 'orders'

    serialize_rules = (
        '-order_detail.order',
        '-user.order',
        '-order_detail.order.order_detail',
        '-user.order.user',
        '-created_at',
        '-updated_at',
    )

    id = db.Column(db.Integer, primary_key=True)
    total = db.Column(db.Integer)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    #### relationships
    order_detail = db.relationship( 'OrderDetail', back_populates = 'order', cascade = 'all, delete-orphan'  )
    user = db.relationship( 'User', back_populates = 'order' )
    item = association_proxy( 'order_detail', 'item' )

    @classmethod
    def find(cls, id):
        order = Order.query.filter(Order.id == id).first()
        return order

    def __repr__(self):
        return f"<OrderDetail: Total: {self.total}>"


# ~~~~~~~~~~~~~~~~~~~ OrderDetail Table ~~~~~~~~~~~~~~~~~~~

class OrderDetail( db.Model, SerializerMixin ):
    __tablename__ = 'order_details'

    serialize_rules = (
        '-order.order_detail',
        '-item.order_detail',
        '-order.order_detail.order',
        '-item.order_detail.item',
        '-created_at',
        '-updated_at',
    )

    id = db.Column(db.Integer, primary_key=True)
    quantity = db.Column(db.Integer, nullable=False)

    item_id = db.Column(db.Integer, db.ForeignKey('items.id'), nullable=False)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)

    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    #### relationships
    order = db.relationship( 'Order', back_populates = 'order_detail' )
    item = db.relationship( 'Item', back_populates = 'order_detail' )

    @classmethod
    def find(cls, id):
        order_detail = OrderDetail.query.filter(OrderDetail.id == id).first()
        return order_detail

    def __repr__(self):
        return f"<Order quantity: {self.quantity}>"

# ~~~~~~~~~~~~~~~~~~~ Item Table ~~~~~~~~~~~~~~~~~~~

class Item( db.Model, SerializerMixin ):
    __tablename__ = 'items'

    serialize_rules = (
        '-user.item',
        '-stock.item',
        '-order_detail.item',
        '-category.item',
        '-user.item.user',
        '-stock.item.stock',
        '-order_detail.item.order_detail',
        '-category.item.category',
        '-created_at',
        '-updated_at',
    )

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    price = db.Column(db.Integer, nullable=False)
    # image = db.Column(db.LargeBinary )
    par_level = db.Column(db.Integer, nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)

    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    #### relationships
    user = db.relationship( 'User', back_populates = 'item')
    stock = db.relationship( 'Stock', back_populates = 'item' )
    order_detail = db.relationship( 'OrderDetail', back_populates = 'item', cascade = 'all, delete-orphan' )
    order = association_proxy( 'order_detail', 'order' )
    category = db.relationship( 'Category', back_populates = 'item' )

    @classmethod
    def find(cls, id):
        item = Item.query.filter(Item.id == id).first()
        return item

    def __repr__(self):
        return f"<Item: {self.name}>"

# ~~~~~~~~~~~~~~~~~~~ Category Table ~~~~~~~~~~~~~~~~~~~

class Category( db.Model, SerializerMixin ):
    __tablename__ = 'categories'

    serialize_rules = (
        '-item.category',
        '-item.category.item',
        '-created_at',
        '-updated_at',
    )

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable = False )

    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    #### relationships
    item = db.relationship( 'Item', back_populates = 'category' )

    @classmethod
    def find(cls, id):
        category = Category.query.filter(Category.id == id).first()
        return category

    def __repr__(self):
        return f"<Category {self.name}>"
    
# ~~~~~~~~~~~~~~~~~~~ Stock Table ~~~~~~~~~~~~~~~~~~~

class Stock( db.Model, SerializerMixin ):
    __tablename__ = 'stocks'

    serialize_rules = (
        'item.stock',
        'user.stock',
        'item.stock.item',
        'user.stock.user',
        '-created_at',
    )

    id = db.Column(db.Integer, primary_key=True)
    quantity = db.Column(db.Integer) 

    item_id = db.Column(db.Integer, db.ForeignKey('items.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    @classmethod
    def find(cls, id):
        stock = Stock.query.filter(Stock.id == id).first()
        return stock

    #### relationships
    item = db.relationship( 'Item', back_populates = 'stock' )
    user = db.relationship( 'User', back_populates = 'stock' )