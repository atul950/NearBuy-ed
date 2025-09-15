import os
import urllib.parse

class Config:
    # Database configuration - you can change these connection details later
    SERVER = 'localhost'  # Change to your SQL Server instance
    DATABASE = 'NearBuy'
    USERNAME = 'your_username'  # Change to your SQL Server username
    PASSWORD = 'your_password'  # Change to your SQL Server password
    
    # URL encode the password to handle special characters
    ENCODED_PASSWORD = urllib.parse.quote_plus(PASSWORD)
    
    SQLALCHEMY_DATABASE_URI = f'mssql+pyodbc://{USERNAME}:{ENCODED_PASSWORD}@{SERVER}/{DATABASE}?driver=ODBC+Driver+17+for+SQL+Server'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'your-secret-key-change-this'  # Change this to a secure secret key
