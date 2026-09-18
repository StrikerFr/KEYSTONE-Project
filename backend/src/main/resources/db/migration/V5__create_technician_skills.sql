CREATE TABLE technician_skills (
    technician_id UUID NOT NULL REFERENCES technicians(id) ON DELETE CASCADE,
    skill VARCHAR(100) NOT NULL,
    PRIMARY KEY (technician_id, skill)
);