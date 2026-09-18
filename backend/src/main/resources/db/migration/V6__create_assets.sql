CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    serial_number VARCHAR(100) NOT NULL UNIQUE,
    model VARCHAR(100),
    category VARCHAR(100),
    status VARCHAR(20) NOT NULL DEFAULT 'OPERATIONAL',
    installation_date DATE,
    warranty_expiry_date DATE,
    last_service_date DATE,
    next_service_due_date DATE,
    location_address VARCHAR(500),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_assets_org ON assets(organization_id);
CREATE INDEX idx_assets_customer ON assets(customer_id);