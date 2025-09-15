from flask import Blueprint, request, jsonify
from bcrypt import hashpw, checkpw, gensalt
from models import db, User
from middleware.auth_middleware import generate_token

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password are required'}), 400
    
    # Check if user already exists
    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({'error': 'User already exists'}), 400
    
    # Create new user with bcrypt hashing
    password_bytes = data['password'].encode('utf-8')
    hashed_password = hashpw(password_bytes, gensalt()).decode('utf-8')
    
    new_user = User(
        name=data.get('name', ''),
        email=data['email'],
        password=hashed_password,
        phone=data.get('phone', '')
    )
    
    try:
        db.session.add(new_user)
        db.session.commit()
        
        token = generate_token(new_user.user_id)
        return jsonify({
            'message': 'User registered successfully',
            'token': token,
            'user': {
                'user_id': new_user.user_id,
                'name': new_user.name,
                'email': new_user.email
            }
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Registration failed'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password are required'}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user:
        return jsonify({'error': 'Invalid credentials'}), 401
    
    # Verify password with bcrypt
    password_bytes = data['password'].encode('utf-8')
    stored_password = user.password.encode('utf-8')
    
    if not checkpw(password_bytes, stored_password):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    token = generate_token(user.user_id)
    return jsonify({
        'message': 'Login successful',
        'token': token,
        'user': {
            'user_id': user.user_id,
            'name': user.name,
            'email': user.email
        }
    })
