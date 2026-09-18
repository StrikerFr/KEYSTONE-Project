CREATE TABLE work_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_order_number VARCHAR(50) NOT NULL UNIQUE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'NEW',
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    customer_id UUID NOT NULL REFERENCES customers(id),
    technician_id UUID REFERENCES technicians(id),
    asset_id UUID REFERENCES assets(id),
    sla_policy_id UUID REFERENCES sla_policies(id),
    sla_deadline TIMESTAMP WITHOUT TIME ZONE,
    scheduled_start TIMESTAMP WITHOUT TIME ZONE,
    scheduled_end TIMESTAMP WITHOUT TIME ZONE,
    actual_start TIMESTAMP WITHOUT TIME ZONE,
    actual_end TIMESTAMP WITHOUT TIME ZONE,
    completed_at TIMESTAMP WITHOUT TIME ZONE,
    location_address VARCHAR(500),
    location_latitude DOUBLE PRECISION,
    location_longitude DOUBLE PRECISION,
    resolution_notes TEXT,
    customer_signature TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_work_orders_org ON work_orders(organization_id);
CREATE INDEX idx_work_orders_status ON work_orders(status);
CREATE INDEX idx_work_orders_technician ON work_orders(technician_id);
CREATE INDEX idx_work_orders_customer ON work_orders(customer_id);