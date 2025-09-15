from flask import Blueprint, request, jsonify
from models import db, Shop, ShopOwner, ShopAddress, ShopTiming, Product, ProductCategory, ShopProduct

shop_bp = Blueprint('shops', __name__)

@shop_bp.route('/<int:shop_id>', methods=['GET'])
def get_shop_details(shop_id):
    try:
        shop_data = db.session.query(
            Shop.shop_id,
            Shop.shop_name,
            Shop.shop_image,
            ShopOwner.owner_name,
            ShopOwner.phone,
            ShopAddress.city,
            ShopAddress.area,
            ShopAddress.landmark,
            ShopAddress.pincode,
            ShopAddress.latitude,
            ShopAddress.longitude
        ).join(
            ShopOwner, Shop.owner_id == ShopOwner.owner_id
        ).join(
            ShopAddress, Shop.shop_id == ShopAddress.shop_id
        ).filter(Shop.shop_id == shop_id).first()
        
        if not shop_data:
            return jsonify({'error': 'Shop not found'}), 404
        
        # Get shop timings
        timings = ShopTiming.query.filter_by(shop_id=shop_id).all()
        
        # Get shop products
        products = db.session.query(
            Product.product_id,
            Product.product_name,
            Product.brand,
            ProductCategory.category_name,
            ShopProduct.price,
            ShopProduct.stock
        ).join(
            ShopProduct, Product.product_id == ShopProduct.product_id
        ).join(
            ProductCategory, Product.category_id == ProductCategory.category_id
        ).filter(
            ShopProduct.shop_id == shop_id,
            ShopProduct.stock > 0
        ).all()
        
        shop_info = {
            'shop_id': shop_data.shop_id,
            'shop_name': shop_data.shop_name,
            'shop_image': shop_data.shop_image,
            'owner_name': shop_data.owner_name,
            'phone': shop_data.phone,
            'address': {
                'city': shop_data.city,
                'area': shop_data.area,
                'landmark': shop_data.landmark,
                'pincode': shop_data.pincode,
                'latitude': float(shop_data.latitude) if shop_data.latitude else None,
                'longitude': float(shop_data.longitude) if shop_data.longitude else None
            },
            'timings': [
                {
                    'day': timing.day,
                    'open_time': timing.open_time.strftime('%H:%M') if timing.open_time else None,
                    'close_time': timing.close_time.strftime('%H:%M') if timing.close_time else None
                } for timing in timings
            ],
            'products': [
                {
                    'product_id': product.product_id,
                    'product_name': product.product_name,
                    'brand': product.brand,
                    'category': product.category_name,
                    'price': float(product.price),
                    'stock': product.stock
                } for product in products
            ]
        }
        
        return jsonify(shop_info)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@shop_bp.route('/nearby', methods=['GET'])
def get_nearby_shops():
    lat = request.args.get('lat', type=float)
    lng = request.args.get('lng', type=float)
    radius = request.args.get('radius', 10, type=int)  # Default 10km radius
    
    try:
        shops = db.session.query(
            Shop.shop_id,
            Shop.shop_name,
            Shop.shop_image,
            ShopAddress.city,
            ShopAddress.area,
            ShopAddress.landmark,
            ShopAddress.latitude,
            ShopAddress.longitude
        ).join(
            ShopAddress, Shop.shop_id == ShopAddress.shop_id
        ).all()
        
        nearby_shops = []
        for shop in shops:
            shop_data = {
                'shop_id': shop.shop_id,
                'shop_name': shop.shop_name,
                'shop_image': shop.shop_image,
                'city': shop.city,
                'area': shop.area,
                'landmark': shop.landmark,
                'latitude': float(shop.latitude) if shop.latitude else None,
                'longitude': float(shop.longitude) if shop.longitude else None
            }
            
            # Simple distance calculation - in production, use proper geospatial queries
            if lat and lng and shop.latitude and shop.longitude:
                lat_diff = abs(float(shop.latitude) - lat)
                lng_diff = abs(float(shop.longitude) - lng)
                # Rough distance check - replace with proper geospatial calculation
                if lat_diff < 0.1 and lng_diff < 0.1:  # Approximately within radius
                    nearby_shops.append(shop_data)
            else:
                nearby_shops.append(shop_data)
        
        return jsonify({'shops': nearby_shops})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
