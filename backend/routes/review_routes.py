from flask import Blueprint, request, jsonify
from models import db, ProductReview
from middleware.auth_middleware import token_required

review_bp = Blueprint('reviews', __name__)

@review_bp.route('', methods=['POST'])
@token_required
def add_review():
    data = request.get_json()
    
    if not data or not data.get('product_id') or not data.get('rating'):
        return jsonify({'error': 'Product ID and rating are required'}), 400
    
    try:
        new_review = ProductReview(
            user_id=request.current_user_id,
            product_id=data['product_id'],
            rating=data['rating'],
            review_text=data.get('review_text', '')
        )
        
        db.session.add(new_review)
        db.session.commit()
        
        return jsonify({'message': 'Review added successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to add review'}), 500
