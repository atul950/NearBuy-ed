from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'Users'
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(150))
    email = db.Column(db.String(200), unique=True)
    password = db.Column(db.String(255))
    phone = db.Column(db.String(15), unique=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class ShopOwner(db.Model):
    __tablename__ = 'Shop_Owners'
    owner_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    owner_name = db.Column(db.String(150))
    phone = db.Column(db.String(15), unique=True)
    email = db.Column(db.String(200), unique=True)

class Shop(db.Model):
    __tablename__ = 'Shops'
    shop_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    shop_name = db.Column(db.String(200))
    owner_id = db.Column(db.Integer, db.ForeignKey('Shop_Owners.owner_id'))
    shop_image = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class ShopAddress(db.Model):
    __tablename__ = 'Shop_Address'
    address_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    shop_id = db.Column(db.Integer, db.ForeignKey('Shops.shop_id'))
    city = db.Column(db.String(100))
    country = db.Column(db.String(100))
    pincode = db.Column(db.String(10))
    landmark = db.Column(db.String(200))
    area = db.Column(db.String(200))
    latitude = db.Column(db.Numeric(10, 6))
    longitude = db.Column(db.Numeric(10, 6))

class ShopTiming(db.Model):
    __tablename__ = 'Shop_Timings'
    timing_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    shop_id = db.Column(db.Integer, db.ForeignKey('Shops.shop_id'))
    day = db.Column(db.String(20))
    open_time = db.Column(db.Time)
    close_time = db.Column(db.Time)

class ProductCategory(db.Model):
    __tablename__ = 'Product_Categories'
    category_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    category_name = db.Column(db.String(100), unique=True)
    category_description = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Product(db.Model):
    __tablename__ = 'Products'
    product_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    product_name = db.Column(db.String(200))
    category_id = db.Column(db.Integer, db.ForeignKey('Product_Categories.category_id'))
    brand = db.Column(db.String(100))
    description = db.Column(db.String(1000))
    color = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class ShopProduct(db.Model):
    __tablename__ = 'Shop_Product'
    shop_product_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    shop_id = db.Column(db.Integer, db.ForeignKey('Shops.shop_id'))
    product_id = db.Column(db.Integer, db.ForeignKey('Products.product_id'))
    price = db.Column(db.Numeric(10, 2))
    stock = db.Column(db.Integer)

class ProductReview(db.Model):
    __tablename__ = 'Product_Reviews'
    review_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('Users.user_id'))
    product_id = db.Column(db.Integer, db.ForeignKey('Products.product_id'))
    rating = db.Column(db.Numeric(2, 1))
    review_text = db.Column(db.String(1000))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class ProductImage(db.Model):
    __tablename__ = 'Product_Images'
    image_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    product_id = db.Column(db.Integer, db.ForeignKey('Products.product_id'))
    image_url = db.Column(db.String(500))

class SearchHistory(db.Model):
    __tablename__ = 'Search_History'
    history_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('Users.user_id'))
    search_item = db.Column(db.String(255))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
