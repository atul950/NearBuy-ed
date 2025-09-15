from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from models import db

# Import route blueprints
from routes.auth_routes import auth_bp
from routes.product_routes import product_bp
from routes.shop_routes import shop_bp
from routes.review_routes import review_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions
    CORS(app)
    db.init_app(app)
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(product_bp, url_prefix='/api/products')
    app.register_blueprint(shop_bp, url_prefix='/api/shops')
    app.register_blueprint(review_bp, url_prefix='/api/reviews')
    
    # Health check endpoint
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({'status': 'healthy', 'message': 'NEARBUY API is running'})
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)
