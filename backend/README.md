# NEARBUY Backend API

A modular Flask-based REST API for the NEARBUY local product finder application.

## Project Structure

\`\`\`
backend/
├── app.py                          # Main Flask application entry point
├── config.py                       # Configuration settings
├── models.py                       # SQLAlchemy database models
├── requirements.txt                # Python dependencies
├── middleware/
│   └── auth_middleware.py          # JWT authentication middleware
├── routes/
│   ├── auth_routes.py              # Authentication endpoints (/api/auth/*)
│   ├── product_routes.py           # Product endpoints (/api/products/*)
│   ├── shop_routes.py              # Shop endpoints (/api/shops/*)
│   └── review_routes.py            # Review endpoints (/api/reviews/*)
└── utils/
    └── helpers.py                  # Utility functions
\`\`\`

## Setup Instructions

1. **Install Dependencies**
   \`\`\`bash
   pip install -r requirements.txt
   \`\`\`

2. **Configure Database**
   - Update database connection details in `config.py`
   - Run the SQL scripts to create and seed the database

3. **Run the Application**
   \`\`\`bash
   python app.py
   \`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Products
- `GET /api/products/search` - Search products with filters
- `GET /api/products/{id}` - Get product details
- `GET /api/products/categories` - Get all categories

### Shops
- `GET /api/shops/{id}` - Get shop details
- `GET /api/shops/nearby` - Get nearby shops

### Reviews
- `POST /api/reviews` - Add product review (requires authentication)

### Health Check
- `GET /api/health` - API health status

## Configuration

Update the following in `config.py`:
- Database connection details (server, database, username, password)
- Secret key for JWT tokens

## Authentication

The API uses JWT (JSON Web Tokens) for authentication:
- Tokens expire after 7 days
- Include token in Authorization header: `Bearer <token>`
- Protected routes require valid JWT token
