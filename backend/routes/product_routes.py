from flask import Blueprint, request, jsonify
from models import db, Product, ProductCategory, ShopProduct, Shop, ShopAddress, ProductReview, User
from middleware.auth_middleware import token_required

product_bp = Blueprint('products', __name__)

@product_bp.route('/search', methods=['GET'])
def search_products():
    query = request.args.get('q', '')
    city = request.args.get('city', '')
    category = request.args.get('category', '')
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)
    
    try:
        # Build query with filters
        base_query = db.session.query(
            Product.product_id,
            Product.product_name,
            Product.brand,
            Product.description,
            Product.color,
            ProductCategory.category_name,
            ShopProduct.price,
            ShopProduct.stock,
            Shop.shop_name,
            Shop.shop_id,
            ShopAddress.city,
            ShopAddress.area,
            ShopAddress.latitude,
            ShopAddress.longitude
        ).join(
            ProductCategory, Product.category_id == ProductCategory.category_id
        ).join(
            ShopProduct, Product.product_id == ShopProduct.product_id
        ).join(
            Shop, ShopProduct.shop_id == Shop.shop_id
        ).join(
            ShopAddress, Shop.shop_id == ShopAddress.shop_id
        ).filter(ShopProduct.stock > 0)
        
        # Apply filters
        if query:
            base_query = base_query.filter(Product.product_name.contains(query))
        if city:
            base_query = base_query.filter(ShopAddress.city.contains(city))
        if category:
            base_query = base_query.filter(ProductCategory.category_name.contains(category))
        if min_price:
            base_query = base_query.filter(ShopProduct.price >= min_price)
        if max_price:
            base_query = base_query.filter(ShopProduct.price <= max_price)
        
        results = base_query.all()
        
        products = []
        for result in results:
            products.append({
                'product_id': result.product_id,
                'product_name': result.product_name,
                'brand': result.brand,
                'description': result.description,
                'color': result.color,
                'category': result.category_name,
                'price': float(result.price),
                'stock': result.stock,
                'shop_name': result.shop_name,
                'shop_id': result.shop_id,
                'city': result.city,
                'area': result.area,
                'latitude': float(result.latitude) if result.latitude else None,
                'longitude': float(result.longitude) if result.longitude else None
            })
        
        return jsonify({'products': products, 'count': len(products)})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@product_bp.route('/<int:product_id>', methods=['GET'])
def get_product_details(product_id):
    try:
        # Get product with all shop availability
        product_shops = db.session.query(
            Product.product_id,
            Product.product_name,
            Product.brand,
            Product.description,
            Product.color,
            ProductCategory.category_name,
            ShopProduct.price,
            ShopProduct.stock,
            Shop.shop_name,
            Shop.shop_id,
            Shop.shop_image,
            ShopAddress.city,
            ShopAddress.area,
            ShopAddress.landmark,
            ShopAddress.latitude,
            ShopAddress.longitude
        ).join(
            ProductCategory, Product.category_id == ProductCategory.category_id
        ).join(
            ShopProduct, Product.product_id == ShopProduct.product_id
        ).join(
            Shop, ShopProduct.shop_id == Shop.shop_id
        ).join(
            ShopAddress, Shop.shop_id == ShopAddress.shop_id
        ).filter(
            Product.product_id == product_id,
            ShopProduct.stock > 0
        ).all()
        
        if not product_shops:
            return jsonify({'error': 'Product not found or out of stock'}), 404
        
        # Get product reviews
        reviews = db.session.query(
            ProductReview.rating,
            ProductReview.review_text,
            ProductReview.created_at,
            User.name
        ).join(
            User, ProductReview.user_id == User.user_id
        ).filter(ProductReview.product_id == product_id).all()
        
        # Format response
        first_result = product_shops[0]
        product_data = {
            'product_id': first_result.product_id,
            'product_name': first_result.product_name,
            'brand': first_result.brand,
            'description': first_result.description,
            'color': first_result.color,
            'category': first_result.category_name,
            'shops': [],
            'reviews': []
        }
        
        # Add shop availability
        for shop in product_shops:
            product_data['shops'].append({
                'shop_id': shop.shop_id,
                'shop_name': shop.shop_name,
                'shop_image': shop.shop_image,
                'price': float(shop.price),
                'stock': shop.stock,
                'city': shop.city,
                'area': shop.area,
                'landmark': shop.landmark,
                'latitude': float(shop.latitude) if shop.latitude else None,
                'longitude': float(shop.longitude) if shop.longitude else None
            })
        
        # Add reviews
        for review in reviews:
            product_data['reviews'].append({
                'rating': float(review.rating),
                'review_text': review.review_text,
                'created_at': review.created_at.isoformat(),
                'user_name': review.name
            })
        
        return jsonify(product_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@product_bp.route('/categories', methods=['GET'])
def get_categories():
    try:
        categories = ProductCategory.query.all()
        return jsonify({
            'categories': [
                {
                    'category_id': cat.category_id,
                    'category_name': cat.category_name,
                    'description': cat.category_description
                } for cat in categories
            ]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
