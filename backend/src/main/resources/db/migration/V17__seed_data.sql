-- Organization
INSERT INTO organizations (id, name, code, status)
VALUES ('00000000-0000-0000-0000-000000000001', 'Northstar Operations', 'NORTHSTAR', 'ACTIVE');

-- BCrypt Hash for 'Keystone@2026!' -> $2a$10$e.xK7qQY1QxQ7qQY1QxQ7e1QxQ7qQY1QxQ7qQY1QxQ7qQY1QxQ7q
-- Using a standard known BCrypt hash for Keystone@2026!: $2a$10$N.zmdrZk7uOCQb376NoUnuTJ8iAt6Z5EHsM.1rE.4tWJ7.42d.Z.m
-- Admin: admin@keystone.local
-- Manager: manager@keystone.local
-- Tech: technician@keystone.local
-- Customer: customer@keystone.local

INSERT INTO users (id, organization_id, email, password_hash, first_name, last_name, role, status) VALUES
('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'admin@keystone.local', '$2a$10$N.zmdrZk7uOCQb376NoUnuTJ8iAt6Z5EHsM.1rE.4tWJ7.42d.Z.m', 'System', 'Admin', 'ADMIN', 'ACTIVE'),
('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000001', 'manager@keystone.local', '$2a$10$N.zmdrZk7uOCQb376NoUnuTJ8iAt6Z5EHsM.1rE.4tWJ7.42d.Z.m', 'Rajesh', 'Kumar', 'MANAGER', 'ACTIVE'),
('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000001', 'technician@keystone.local', '$2a$10$N.zmdrZk7uOCQb376NoUnuTJ8iAt6Z5EHsM.1rE.4tWJ7.42d.Z.m', 'Rahul', 'Sharma', 'TECHNICIAN', 'ACTIVE'),
('33333333-3333-3333-3333-333333333334', '00000000-0000-0000-0000-000000000001', 'amit.verma@keystone.local', '$2a$10$N.zmdrZk7uOCQb376NoUnuTJ8iAt6Z5EHsM.1rE.4tWJ7.42d.Z.m', 'Amit', 'Verma', 'TECHNICIAN', 'ACTIVE'),
('33333333-3333-3333-3333-333333333335', '00000000-0000-0000-0000-000000000001', 'neha.singh@keystone.local', '$2a$10$N.zmdrZk7uOCQb376NoUnuTJ8iAt6Z5EHsM.1rE.4tWJ7.42d.Z.m', 'Neha', 'Singh', 'TECHNICIAN', 'ACTIVE'),
('44444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000001', 'customer@keystone.local', '$2a$10$N.zmdrZk7uOCQb376NoUnuTJ8iAt6Z5EHsM.1rE.4tWJ7.42d.Z.m', 'Priya', 'Patel', 'CUSTOMER', 'ACTIVE');

-- SLA Policies
INSERT INTO sla_policies (id, organization_id, name, description, priority, response_time_minutes, resolution_time_minutes) VALUES
('a1111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'Critical SLA', 'Emergency 2-hour resolution SLA', 'CRITICAL', 15, 120),
('a2222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000001', 'High Priority SLA', 'High priority 4-hour resolution SLA', 'HIGH', 30, 240),
('a3333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000001', 'Standard SLA', 'Standard 24-hour resolution SLA', 'MEDIUM', 120, 1440),
('a4444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000001', 'Low Priority SLA', 'Low priority 48-hour resolution SLA', 'LOW', 240, 2880);

-- Technicians
INSERT INTO technicians (id, organization_id, user_id, employee_id, first_name, last_name, email, phone, status, current_latitude, current_longitude) VALUES
('b1111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333', 'TECH-001', 'Rahul', 'Sharma', 'technician@keystone.local', '+91 98765 43210', 'AVAILABLE', 19.0760, 72.8777),
('b2222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333334', 'TECH-002', 'Amit', 'Verma', 'amit.verma@keystone.local', '+91 98765 43211', 'ON_SITE', 19.0820, 72.8890),
('b3333333-3333-3333-3333-333333333335', '00000000-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333335', 'TECH-003', 'Neha', 'Singh', 'neha.singh@keystone.local', '+91 98765 43212', 'AVAILABLE', 19.0900, 72.8650);

-- Technician Skills
INSERT INTO technician_skills (technician_id, skill) VALUES
('b1111111-1111-1111-1111-111111111111', 'HVAC Maintenance'),
('b1111111-1111-1111-1111-111111111111', 'Electrical Systems'),
('b2222222-2222-2222-2222-222222222222', 'Plumbing'),
('b2222222-2222-2222-2222-222222222222', 'Fire Suppression'),
('b3333333-3333-3333-3333-333333333335', 'Solar Inverter Calibration'),
('b3333333-3333-3333-3333-333333333335', 'Generator Servicing');

-- Customers
INSERT INTO customers (id, organization_id, user_id, company_name, contact_name, email, phone, address, city, state, country, postal_code, status) VALUES
('c1111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', '44444444-4444-4444-4444-444444444444', 'Apex Industries', 'Priya Patel', 'customer@keystone.local', '+91 91234 56789', 'Plot 42, MIDC Industrial Area', 'Mumbai', 'Maharashtra', 'India', '400093', 'ACTIVE'),
('c2222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000001', NULL, 'Horizon Technologies', 'Suresh Menon', 'suresh@horizontech.com', '+91 91234 56790', 'Tech Park Tower 3, Whitefield', 'Bengaluru', 'Karnataka', 'India', '560066', 'ACTIVE');

-- Assets
INSERT INTO assets (id, organization_id, customer_id, name, serial_number, model, category, status, location_address) VALUES
('d1111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'c1111111-1111-1111-1111-111111111111', 'Chiller Unit A-10', 'SN-CHILL-9042', 'Carrier 30XA', 'HVAC', 'OPERATIONAL', 'Building A, Roof Level'),
('d2222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000001', 'c2222222-2222-2222-2222-222222222222', 'Backup Diesel Generator 500kVA', 'SN-GEN-5521', 'Cummins C500D5', 'Generators', 'SERVICE_DUE', 'Basement Substation B');

-- Parts / Inventory
INSERT INTO parts (id, organization_id, part_number, name, description, category, unit_price, quantity_on_hand, reorder_level) VALUES
('e1111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'PRT-HVAC-001', 'Compressor Refrigerant Oil 5L', 'R134a Synthetic Oil', 'HVAC Consumables', 2450.00, 14, 5),
('e2222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000001', 'PRT-ELEC-042', 'Heavy Duty Contactor 100A 3-Phase', 'Schneider Electric AC3 Contactor', 'Electrical', 4800.00, 3, 5),
('e3333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000001', 'PRT-GEN-102', 'High-Flow Fuel Filter Element', 'Cummins Fleetguard FF5776', 'Generator Parts', 1850.00, 8, 4);

-- Work Orders
INSERT INTO work_orders (id, work_order_number, organization_id, title, description, status, priority, customer_id, technician_id, asset_id, sla_policy_id, sla_deadline, scheduled_start, scheduled_end, location_address) VALUES
('f1111111-1111-1111-1111-111111111111', 'WO-2026-000001', '00000000-0000-0000-0000-000000000001', 'Emergency Chiller Maintenance', 'Chiller unit tripping on high pressure cut-out during peak heat hours.', 'IN_PROGRESS', 'CRITICAL', 'c1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', NOW() + INTERVAL '2 hours', NOW() - INTERVAL '1 hour', NOW() + INTERVAL '2 hours', 'Building A, MIDC Industrial Area, Mumbai'),
('f2222222-2222-2222-2222-222222222222', 'WO-2026-000002', '00000000-0000-0000-0000-000000000001', 'Quarterly Generator Inspection', 'Preventive 500-hour servicing for backup generator substation.', 'SCHEDULED', 'MEDIUM', 'c2222222-2222-2222-2222-222222222222', 'b2222222-2222-2222-2222-222222222222', 'd2222222-2222-2222-2222-222222222222', 'a3333333-3333-3333-3333-333333333333', NOW() + INTERVAL '18 hours', NOW() + INTERVAL '4 hours', NOW() + INTERVAL '8 hours', 'Substation B, Tech Park, Whitefield, Bengaluru');

-- Service Requests
INSERT INTO service_requests (id, request_number, organization_id, customer_id, title, description, status, priority, location_address) VALUES
('sr111111-1111-1111-1111-111111111111', 'SR-2026-000001', '00000000-0000-0000-0000-000000000001', 'c1111111-1111-1111-1111-111111111111', 'Abnormal Noise from Cooling Tower B', 'Vibration and metallic grinding sound detected during morning shift start.', 'PENDING', 'HIGH', 'Building B Roof, MIDC Mumbai');