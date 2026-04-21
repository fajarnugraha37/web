export const SEED_SQL = `
-- Create system control table for atomic seeding
CREATE TABLE IF NOT EXISTS system_control (
  id SERIAL PRIMARY KEY,
  initialized_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  system_version TEXT DEFAULT '1.0.0'
);

-- Seed metadata
INSERT INTO system_control (system_version) VALUES ('1.0.0');

-- Network Nodes Table
CREATE TABLE IF NOT EXISTS net_nodes (
  id TEXT PRIMARY KEY,
  hostname TEXT NOT NULL,
  ip_address INET,
  status TEXT CHECK (status IN ('ONLINE', 'OFFLINE', 'MAINTENANCE', 'DEGRADED')),
  last_ping TIMESTAMP WITH TIME ZONE,
  location TEXT,
  cores INTEGER,
  memory_gb INTEGER
);

INSERT INTO net_nodes (id, hostname, ip_address, status, last_ping, location, cores, memory_gb) VALUES
('NODE-01', 'core-alpha', '10.0.0.1', 'ONLINE', NOW() - INTERVAL '5 minutes', 'Orbit-Ring-A', 64, 128),
('NODE-02', 'core-beta', '10.0.0.2', 'ONLINE', NOW() - INTERVAL '2 minutes', 'Orbit-Ring-A', 64, 128),
('NODE-03', 'edge-01', '192.168.1.10', 'DEGRADED', NOW() - INTERVAL '15 minutes', 'Neo-Tokyo-Hub', 16, 32),
('NODE-04', 'edge-02', '192.168.1.11', 'OFFLINE', NOW() - INTERVAL '2 days', 'Neo-Tokyo-Hub', 16, 32),
('NODE-05', 'proxy-gate', '172.16.0.5', 'ONLINE', NOW() - INTERVAL '1 minute', 'Deep-Net-Gate', 32, 64);

-- Access Logs Table
CREATE TABLE IF NOT EXISTS access_logs (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  node_id TEXT REFERENCES net_nodes(id),
  user_id TEXT,
  action TEXT,
  security_clearance TEXT,
  details JSONB
);

INSERT INTO access_logs (node_id, user_id, action, security_clearance, details) VALUES
('NODE-01', 'admin_root', 'SYSTEM_BOOT', 'LEVEL-5', '{"reason": "scheduled_maintenance", "duration": "45ms"}'),
('NODE-05', 'anonymous_guest', 'LOGIN_ATTEMPT', 'NONE', '{"ip": "95.12.3.44", "port": 443, "result": "REJECTED"}'),
('NODE-03', 'operator_09', 'HEARTBEAT_CHECK', 'LEVEL-2', '{"latency": "120ms", "jitter": "12ms"}'),
('NODE-01', 'admin_root', 'DATABASE_REPLICATION', 'LEVEL-5', '{"source": "alpha", "target": "beta", "rows": 450231}'),
('NODE-02', 'operator_09', 'SCHEMA_UPDATE', 'LEVEL-3', '{"table": "access_logs", "fields_added": ["details"]}');

-- System Configuration
CREATE TABLE IF NOT EXISTS sys_config (
  key TEXT PRIMARY KEY,
  value TEXT,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO sys_config (key, value, description) VALUES
('ENCRYPTION_LEVEL', 'AES-256-GCM', 'Global system encryption standard'),
('LOG_RETENTION_DAYS', '90', 'Days to keep access logs before purging'),
('MAX_CONCURRENT_USERS', '1024', 'Soft limit for concurrent active sessions'),
('DEBUG_MODE', 'false', 'Enable verbose logging for system diagnostics');
`;
