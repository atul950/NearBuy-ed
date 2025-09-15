-- Insert sample data for testing
USE NearBuy;
GO

-- Insert sample categories
INSERT INTO Product_Categories (category_name, category_description) VALUES
('Electronics', 'Electronic devices and gadgets'),
('Jewelry', 'Gold, silver and precious stone jewelry'),
('Clothing', 'Apparel and fashion items'),
('Home & Kitchen', 'Home appliances and kitchen items'),
('Books', 'Books and educational materials');

-- Insert sample shop owners
INSERT INTO Shop_Owners (owner_name, phone, email) VALUES
('Rajesh Kumar', '9876543210', 'rajesh@electronics.com'),
('Priya Sharma', '9876543211', 'priya@jewelry.com'),
('Amit Singh', '9876543212', 'amit@fashion.com');

-- Insert sample shops
INSERT INTO Shops (shop_name, owner_id, shop_image) VALUES
('Tech World Electronics', 1, '/images/tech-world.jpg'),
('Golden Jewelry Store', 2, '/images/golden-jewelry.jpg'),
('Fashion Hub', 3, '/images/fashion-hub.jpg');

-- Insert sample addresses
INSERT INTO Shop_Address (shop_id, city, country, pincode, landmark, area, latitude, longitude) VALUES
(1, 'Mumbai', 'India', '400001', 'Near Railway Station', 'Andheri West', 19.1136, 72.8697),
(2, 'Delhi', 'India', '110001', 'Connaught Place', 'Central Delhi', 28.6315, 77.2167),
(3, 'Bangalore', 'India', '560001', 'MG Road', 'Brigade Road', 12.9716, 77.5946);

-- Insert sample timings
INSERT INTO Shop_Timings (shop_id, day, open_time, close_time) VALUES
(1, 'Monday', '10:00', '20:00'),
(1, 'Tuesday', '10:00', '20:00'),
(1, 'Wednesday', '10:00', '20:00'),
(1, 'Thursday', '10:00', '20:00'),
(1, 'Friday', '10:00', '20:00'),
(1, 'Saturday', '10:00', '21:00'),
(1, 'Sunday', '11:00', '19:00');

-- Insert sample products
INSERT INTO Products (product_name, category_id, brand, description, color) VALUES
('iPhone 15 Pro', 1, 'Apple', 'Latest iPhone with advanced camera system', 'Space Black'),
('Samsung Galaxy S24', 1, 'Samsung', 'Flagship Android smartphone', 'Phantom Black'),
('Gold Chain 22K', 2, 'Tanishq', 'Traditional gold chain for women', 'Gold'),
('Diamond Ring', 2, 'Kalyan Jewellers', 'Elegant diamond engagement ring', 'White Gold');

-- Insert sample shop products with prices and stock
INSERT INTO Shop_Product (shop_id, product_id, price, stock) VALUES
(1, 1, 134900.00, 5),
(1, 2, 79999.00, 8),
(2, 3, 45000.00, 3),
(2, 4, 125000.00, 2);

-- Insert sample users
INSERT INTO Users (name, email, password, phone) VALUES
('John Doe', 'john@example.com', 'hashed_password_here', '9876543213'),
('Jane Smith', 'jane@example.com', 'hashed_password_here', '9876543214');
