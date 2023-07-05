from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property

from config import db, bcrypt


# ~~~~~~~~~~~~~~~~~~~ Model Tables ~~~~~~~~~~~~~~~~~~~
# User, Budget, OrderDetail, Order, Item, CategoryTag, Category, Stock

# ~~~~~~~~~~~~~~~~~~~ User Table ~~~~~~~~~~~~~~~~~~~
class User( db.Model, SerializerMixin ):
    __tablename__ = 'users'

    serialize_rules = (
        '-budget.user',
        '-order_detail.user',
        '-item.user',
        '-stock.user',
        '-'
        '-updated_at',
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
    budget = db.relationship( 'Budget', back_populates = 'user' )
    order_detail = db.relationship( 'OrderDetail', back_populates = 'user', cascade = 'all, delete-orphan' )
    order = association_proxy( 'order_detail', 'order' )
    item = db.relationship( 'Item', back_populates = 'user' )
    stock = db.relationship( 'Stock', back_populates = 'user' )

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


# ~~~~~~~~~~~~~~~~~~~ OrderDetail Table ~~~~~~~~~~~~~~~~~~~

class OrderDetail( db.Model, SerializerMixin ):
    __tablename__ = 'order_details'

    serialize_rules = (
        '-order.order_detail',
        '-user.order_detail',
        '-created_at',
        '-updated_at',
    )

    id = db.Column(db.Integer, primary_key=True)
    total = db.Column(db.Integer)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    #### relationships
    order = db.relationship( 'Order', back_populates = 'order_detail', cascade = 'all, delete-orphan'  )
    user = db.relationship( 'User', back_populates = 'order_detail' )
    item = association_proxy( 'order', 'item' )

    @classmethod
    def find(cls, id):
        order_detail = OrderDetail.query.filter(OrderDetail.id == id).first()
        return order_detail

    def __repr__(self):
        return f"<OrderDetail: Total: {self.total}>"


# ~~~~~~~~~~~~~~~~~~~ Order Table ~~~~~~~~~~~~~~~~~~~

class Order( db.Model, SerializerMixin ):
    __tablename__ = 'orders'

    serialize_rules = (
        '-order_detail.order',
        '-item.order',
        '-created_at',
        '-updated_at',
    )

    id = db.Column(db.Integer, primary_key=True)
    quantity = db.Column(db.Integer, nullable=False)

    item_id = db.Column(db.Integer, db.ForeignKey('items.id'), nullable=False)
    order_id = db.Column(db.Integer, db.ForeignKey('order_details.id'), nullable=False)

    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    #### relationships
    order_detail = db.relationship( 'OrderDetail', back_populates = 'order' )
    # user = association_proxy( 'order_detail', 'user' )
    item = db.relationship( 'Item', back_populates = 'order' )

    @classmethod
    def find(cls, id):
        order = Order.query.filter(Order.id == id).first()
        return order

    def __repr__(self):
        return f"<Order quantity: {self.quantity}>"

# ~~~~~~~~~~~~~~~~~~~ Item Table ~~~~~~~~~~~~~~~~~~~

class Item( db.Model, SerializerMixin ):
    __tablename__ = 'items'

    serialize_rules = (
        '-user.item',
        '-category_tag.item',
        '-stock.item',
        '-created_at',
        '-updated_at',
    )

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    price = db.Column(db.Integer, nullable=False)
    # image = db.Column(db.LargeBinary )
    par_level = db.Column(db.Integer, nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    #### relationships
    user = db.relationship( 'User', back_populates = 'item')
    category_tag = db.relationship( 'CategoryTag', back_populates = 'item', cascade = 'all, delete-orphan' )
    # category = association_proxy( 'category_tag', 'category' )
    stock = db.relationship( 'Stock', back_populates = 'item' )
    order = db.relationship( 'Order', back_populates = 'item', cascade = 'all, delete-orphan' )
    order_detail = association_proxy( 'OrderDetail', 'order_detail' )

    @classmethod
    def find(cls, id):
        item = Item.query.filter(Item.id == id).first()
        return item

    def __repr__(self):
        return f"<Item: {self.name}>"

# ~~~~~~~~~~~~~~~~~~~ CategoryTag Table ~~~~~~~~~~~~~~~~~~~

class CategoryTag( db.Model, SerializerMixin ):
    __tablename__ = 'category_tags'

    serialize_rules = ( 
        '-item.category_tag', 
        '-category.category_tag', 
        '-created_at',
        '-updated_at',
        )

    id = db.Column(db.Integer, primary_key=True)

    item_id = db.Column(db.Integer, db.ForeignKey('items.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)

    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    #### relationships
    item = db.relationship( 'Item', back_populates = 'category_tag')
    category = db.relationship( 'Category', back_populates = 'category_tag' )

    @classmethod
    def find(cls, id):
        item = Item.query.filter(Item.id == id).first()
        return item

    def __repr__(self):
        return f"<Item {self.item_id} tagged with {self.category_id}>"

# ~~~~~~~~~~~~~~~~~~~ Category Table ~~~~~~~~~~~~~~~~~~~

class Category( db.Model, SerializerMixin ):
    __tablename__ = 'categories'

    serialize_rules = (
        '-category_tag.category',
        '-created_at',
        '-updated_at',
    )

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable = False )

    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    #### relationships
    category_tag = db.relationship( 'CategoryTag', back_populates = 'category', cascade = 'all, delete-orphan' )
    item = association_proxy( 'category_tag', 'item' )

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