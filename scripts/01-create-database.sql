-- Create database
CREATE DATABASE NearBuy;
GO

USE NearBuy;
GO

-- Users Table
CREATE TABLE Users (
    user_id INT PRIMARY KEY IDENTITY,
    name NVARCHAR(150),
    email NVARCHAR(200) UNIQUE,
    password NVARCHAR(255),
    phone NVARCHAR(15) UNIQUE,
    created_at DATETIME DEFAULT GETDATE()
);

-- Shop_Owners Table
CREATE TABLE Shop_Owners (
    owner_id INT PRIMARY KEY IDENTITY,
    owner_name NVARCHAR(150),
    phone NVARCHAR(15) UNIQUE,
    email NVARCHAR(200) UNIQUE
);

-- Shops Table 
CREATE TABLE Shops (
    shop_id INT PRIMARY KEY IDENTITY,
    shop_name NVARCHAR(200),
    owner_id INT,
    shop_image NVARCHAR(500),
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (owner_id) REFERENCES Shop_Owners(owner_id) ON DELETE CASCADE
);

-- Shop_Address Table 
CREATE TABLE Shop_Address (
    address_id INT PRIMARY KEY IDENTITY,
    shop_id INT,
    city NVARCHAR(100),
    country NVARCHAR(100),
    pincode NVARCHAR(10),
    landmark NVARCHAR(200),
    area NVARCHAR(200),
    latitude DECIMAL(10,6),
    longitude DECIMAL(10,6),
    FOREIGN KEY (shop_id) REFERENCES Shops(shop_id) ON DELETE CASCADE
);

-- Shop_Timings Table 
CREATE TABLE Shop_Timings (
    timing_id INT PRIMARY KEY IDENTITY,
    shop_id INT,
    day NVARCHAR(20),
    open_time TIME,
    close_time TIME,
    FOREIGN KEY (shop_id) REFERENCES Shops(shop_id) ON DELETE CASCADE
);

-- Product_Categories Table 
CREATE TABLE Product_Categories (
    category_id INT PRIMARY KEY IDENTITY,
    category_name NVARCHAR(100) UNIQUE,
    category_description NVARCHAR(500),
    created_at DATETIME DEFAULT GETDATE()
);

-- Products Table 
CREATE TABLE Products (
    product_id INT PRIMARY KEY IDENTITY,
    product_name NVARCHAR(200),
    category_id INT,
    brand NVARCHAR(100),
    description NVARCHAR(1000),
    color NVARCHAR(50),
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (category_id) REFERENCES Product_Categories(category_id) ON DELETE CASCADE
);

-- Shop_Product Table
CREATE TABLE Shop_Product (
    shop_product_id INT PRIMARY KEY IDENTITY,
    shop_id INT,
    product_id INT,
    price DECIMAL(10,2),
    stock INT,
    FOREIGN KEY (shop_id) REFERENCES Shops(shop_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE
);

-- Product_Reviews Table 
CREATE TABLE Product_Reviews (
    review_id INT PRIMARY KEY IDENTITY,
    user_id INT,
    product_id INT,
    rating DECIMAL(2,1) CHECK (rating BETWEEN 1.0 AND 5.0),
    review_text NVARCHAR(1000),
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE
);

-- Product_Images Table 
CREATE TABLE Product_Images (
    image_id INT PRIMARY KEY IDENTITY,
    product_id INT,
    image_url NVARCHAR(500),
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE
);

-- Search_History Table 
CREATE TABLE Search_History (
    history_id INT PRIMARY KEY IDENTITY,
    user_id INT,
    search_item NVARCHAR(255),
    timestamp DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);
