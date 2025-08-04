-- OracleCloud Expense Manager Database Seed Script
-- This script creates sample data for testing the application

-- Insert sample categories
INSERT INTO categories (name, description, created_at) VALUES
('Travel', 'Business travel expenses including flights, hotels, and transportation', NOW()),
('Meals & Entertainment', 'Business meals, client entertainment, and dining expenses', NOW()),
('Office Supplies', 'Office equipment, stationery, and workplace materials', NOW()),
('Software & Subscriptions', 'Software licenses, cloud services, and digital tools', NOW()),
('Transportation', 'Local transportation, parking, and commuting expenses', NOW()),
('Utilities', 'Office utilities, internet, and communication services', NOW()),
('Marketing & Advertising', 'Marketing campaigns, advertising, and promotional expenses', NOW()),
('Professional Services', 'Consulting, legal, and professional service fees', NOW()),
('Training & Education', 'Training courses, conferences, and educational materials', NOW()),
('Miscellaneous', 'Other business expenses not covered by specific categories', NOW());

-- Insert sample users (password is 'password123' hashed with bcrypt)
INSERT INTO users (email, username, hashed_password, full_name, role, is_active, created_at) VALUES
('john.doe@company.com', 'johndoe', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4tbQJ8qKqG', 'John Doe', 'employee', true, NOW()),
('jane.smith@company.com', 'janesmith', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4tbQJ8qKqG', 'Jane Smith', 'manager', true, NOW()),
('mike.wilson@company.com', 'mikewilson', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4tbQJ8qKqG', 'Mike Wilson', 'employee', true, NOW()),
('sarah.johnson@company.com', 'sarahjohnson', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4tbQJ8qKqG', 'Sarah Johnson', 'employee', true, NOW());

-- Insert sample expenses
INSERT INTO expenses (title, amount, description, date, status, user_id, category_id, created_at) VALUES
-- John Doe's expenses
('Business Lunch with Client', 85.50, 'Lunch meeting with potential client at downtown restaurant', '2024-01-15 12:30:00', 'approved', 1, 2, NOW()),
('Flight to Conference', 450.00, 'Round-trip flight to annual tech conference', '2024-01-20 08:00:00', 'approved', 1, 1, NOW()),
('Hotel for Conference', 320.00, '3-night hotel stay during conference', '2024-01-20 15:00:00', 'approved', 1, 1, NOW()),
('Office Supplies', 45.75, 'Printer paper, pens, and notebooks', '2024-01-25 10:00:00', 'pending', 1, 3, NOW()),
('Software License', 120.00, 'Annual subscription for design software', '2024-01-28 14:00:00', 'approved', 1, 4, NOW()),

-- Jane Smith's expenses (Manager)
('Team Dinner', 180.00, 'Team building dinner for 6 people', '2024-01-10 19:00:00', 'approved', 2, 2, NOW()),
('Marketing Campaign', 500.00, 'Digital advertising campaign for Q1', '2024-01-12 09:00:00', 'approved', 2, 7, NOW()),
('Conference Registration', 250.00, 'Leadership conference registration fee', '2024-01-18 11:00:00', 'approved', 2, 9, NOW()),
('Office Equipment', 150.00, 'New monitor for home office', '2024-01-22 16:00:00', 'pending', 2, 3, NOW()),

-- Mike Wilson's expenses
('Taxi to Meeting', 25.00, 'Taxi fare to client meeting', '2024-01-14 13:00:00', 'approved', 3, 5, NOW()),
('Coffee with Client', 12.50, 'Coffee meeting with potential partner', '2024-01-16 10:30:00', 'approved', 3, 2, NOW()),
('Training Course', 200.00, 'Online certification course', '2024-01-24 15:00:00', 'pending', 3, 9, NOW()),
('Internet Service', 89.99, 'Monthly internet service for home office', '2024-01-26 12:00:00', 'approved', 3, 6, NOW()),

-- Sarah Johnson's expenses
('Client Dinner', 95.00, 'Dinner with important client', '2024-01-11 20:00:00', 'approved', 4, 2, NOW()),
('Flight to Client Site', 380.00, 'Round-trip flight to visit client', '2024-01-17 07:00:00', 'approved', 4, 1, NOW()),
('Legal Consultation', 300.00, 'Legal advice for contract review', '2024-01-23 14:00:00', 'approved', 4, 8, NOW()),
('Marketing Materials', 75.00, 'Business cards and brochures', '2024-01-27 11:00:00', 'pending', 4, 7, NOW()),
('Parking Fees', 15.00, 'Parking fees for client meetings', '2024-01-29 09:00:00', 'approved', 4, 5, NOW());

-- Insert more recent expenses for AI analysis testing
INSERT INTO expenses (title, amount, description, date, status, user_id, category_id, created_at) VALUES
-- Recent expenses for John Doe (last 30 days)
('Team Lunch', 65.00, 'Team lunch at local restaurant', NOW() - INTERVAL '5 days', 'approved', 1, 2, NOW()),
('Software Subscription', 50.00, 'Monthly project management tool', NOW() - INTERVAL '3 days', 'approved', 1, 4, NOW()),
('Office Chair', 200.00, 'Ergonomic office chair for home office', NOW() - INTERVAL '1 day', 'pending', 1, 3, NOW()),

-- Recent expenses for Jane Smith
('Client Meeting Lunch', 120.00, 'Lunch with potential client', NOW() - INTERVAL '4 days', 'approved', 2, 2, NOW()),
('Conference Call Service', 25.00, 'Monthly video conferencing service', NOW() - INTERVAL '2 days', 'approved', 2, 4, NOW()),
('Business Cards', 45.00, 'New business cards for team', NOW() - INTERVAL '1 day', 'pending', 2, 7, NOW()),

-- Recent expenses for Mike Wilson
('Uber to Meeting', 18.50, 'Ride to client meeting', NOW() - INTERVAL '6 days', 'approved', 3, 5, NOW()),
('Coffee for Team', 35.00, 'Coffee and snacks for team meeting', NOW() - INTERVAL '4 days', 'approved', 3, 2, NOW()),
('Online Course', 150.00, 'Advanced programming course', NOW() - INTERVAL '2 days', 'pending', 3, 9, NOW()),

-- Recent expenses for Sarah Johnson
('Client Gift', 80.00, 'Gift for important client', NOW() - INTERVAL '5 days', 'approved', 4, 2, NOW()),
('Flight to Conference', 420.00, 'Flight to industry conference', NOW() - INTERVAL '3 days', 'approved', 4, 1, NOW()),
('Hotel Booking', 280.00, 'Hotel for conference stay', NOW() - INTERVAL '3 days', 'approved', 4, 1, NOW()),
('Conference Registration', 300.00, 'Conference registration fee', NOW() - INTERVAL '2 days', 'pending', 4, 9, NOW()); 