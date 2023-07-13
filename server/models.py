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
        '-order.item',
        '-order.order_detail',
        '-order.user',
        '-item.user',
        '-item.stock',
        '-item.order',
        '-item.order_detail',
        '-item.category',
        '-stock.user',
        '-stock.item'
        '-updated_at',
        )

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    username = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String(15), nullable=False)
    # pfp = db.Column(db.LargeBinary )
    email = db.Column(db.String, unique=True, nullable=False)
    budget = db.Column(db.Integer )

    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())
    
    #### relationships
    order = db.relationship( 'Order', back_populates = 'user', cascade = 'all, delete-orphan' )
    item = db.relationship( 'Item', back_populates = 'user', cascade = 'all, delete-orphan' )

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

# ~~~~~~~~~~~~~~~~~~~ Order Table ~~~~~~~~~~~~~~~~~~~

class Order( db.Model, SerializerMixin ):
    __tablename__ = 'orders'

    serialize_rules = (
        '-order_detail.order',
        '-order_details.item',
        '-order_detail.item.user',
        '-order_detail.item.stock',
        '-order_detail.item.order',
        '-order_detail.item.order_detail',
        '-order_detail.item.category',
        '-user.budget',
        '-user.order',
        '-user.item',
        '-user.stock',
        '-user._password_hash',
        '-user.updated_at',
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
        '-order.user',
        '-order.item'
        '-order.user.budget',
        '-order.user.order',
        '-order.user.item',
        '-order.user.stock',
        '-order.user._password_hash',
        '-order.user.updated_at',
        '-item.user',
        '-item.order',
        '-item.order_detail',
        '-item.category',
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
        '-user.budget',
        '-user.order',
        '-user.item',
        '-user.stock',
        '-user._password_hash',
        '-user.updated_at',

        '-stock.user',
        '-stock.item',

        '-order_detail.order',
        '-order_detail.order.order_detail',
        '-order_detail.order.user',
        '-order_detail.order.item',
        '-order_details.item',
        '-order_detail.item.user',
        '-order_detail.item.stock',
        '-order_detail.item.order',
        '-order_detail.item.order_detail',
        '-order_detail.item.category',      

        '-category.item'
        '-category.item.user',
        '-category.item.stock',
        '-category.item.order',
        '-category.item.order_detail',
        '-category.item.category',

        '-updated_at',
    )

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    price = db.Column(db.Integer, nullable=False)
    # image = db.Column(db.LargeBinary )
    par_level = db.Column(db.Integer, nullable=False)
    stock = db.Column(db.Integer)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)

    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, onupdate=db.func.now())

    #### relationships
    user = db.relationship( 'User', back_populates = 'item')
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
        '-item.user',
        '-item.stock',
        '-item.order',
        '-item.order_detail',
        '-item.category',
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