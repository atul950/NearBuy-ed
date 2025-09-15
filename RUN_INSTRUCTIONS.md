# NEARBUY App - Running Instructions

## Prerequisites
- Python 3.8+ installed
- Node.js 16+ and npm installed
- MS SQL Server running (update connection string in backend/config.py)

## Backend Setup & Run

1. **Navigate to backend directory:**
   \`\`\`bash
   cd backend
   \`\`\`

2. **Create virtual environment:**
   \`\`\`bash
   python -m venv venv
   
   # On Windows:
   venv\Scripts\activate
   
   # On macOS/Linux:
   source venv/bin/activate
   \`\`\`

3. **Install dependencies:**
   \`\`\`bash
   pip install -r requirements.txt
   \`\`\`

4. **Update database configuration:**
   - Edit `backend/config.py`
   - Update the `SQLALCHEMY_DATABASE_URI` with your MS SQL Server connection details

5. **Run database scripts:**
   \`\`\`bash
   # Run the SQL scripts in your MS SQL Server:
   # - scripts/01-create-database.sql
   # - scripts/02-seed-sample-data.sql
   \`\`\`

6. **Start the Flask backend:**
   \`\`\`bash
   python app.py
   \`\`\`
   Backend will run on: http://localhost:5000

## Frontend Setup & Run

1. **Navigate to frontend directory:**
   \`\`\`bash
   cd frontend
   \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Start the React frontend:**
   \`\`\`bash
   npm start
   \`\`\`
   Frontend will run on: http://localhost:3000

## Testing the Application

1. **Backend Health Check:**
   - Visit: http://localhost:5000/api/health
   - Should return: `{"status": "healthy", "message": "NEARBUY API is running"}`

2. **Frontend:**
   - Visit: http://localhost:3000
   - You should see the NEARBUY homepage

3. **API Endpoints Available:**
   - `POST /api/auth/register` - User registration
   - `POST /api/auth/login` - User login
   - `GET /api/products/search` - Search products
   - `GET /api/shops` - Get shops
   - `GET /api/reviews` - Get reviews

## Common Issues & Solutions

1. **Database Connection Error:**
   - Ensure MS SQL Server is running
   - Check connection string in `backend/config.py`
   - Verify database exists and tables are created

2. **CORS Issues:**
   - Backend includes CORS configuration
   - Frontend proxy is set to backend URL

3. **Port Conflicts:**
   - Backend: Change port in `app.py` (default: 5000)
   - Frontend: Set PORT environment variable (default: 3000)

## Development Notes

- Backend uses Flask with modular structure (routes, middleware, models)
- Frontend uses React with functional components and hooks
- Authentication uses JWT tokens
- Database uses SQLAlchemy ORM with MS SQL Server
