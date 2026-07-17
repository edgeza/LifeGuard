-- LifeGuard — Postgres schema
-- Compatible with Supabase (auth schema swapped for build-time password when on local Postgres).
-- All tables include `tenant_id` so the same schema can host multiple resellers (multi-tenant).
-- TimescaleDB extension recommended for vitals history.

-- =========================================================================
-- Extensions
-- =========================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "timescaledb" WITH SCHEMA extensions;

-- =========================================================================
-- 1. Tenants (resellers)
-- =========================================================================
CREATE TABLE public.tenants (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug text NOT NULL UNIQUE,
    name text NOT NULL,
    logo_url text,
    brand_primary_color text DEFAULT '#1d4ed8',
    brand_accent_color text DEFAULT '#06b6a4',
    subdomain text UNIQUE,
    custom_domain text UNIQUE,
    wholesale_price_per_device_cents integer,
    retail_price_per_device_cents integer,
    plan text NOT NULL DEFAULT 'solo_pro' CHECK (plan IN ('solo_pro', 'operator', 'enterprise')),
    country_code text NOT NULL DEFAULT 'US',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_tenants_slug ON public.tenants(slug);
CREATE INDEX idx_tenants_subdomain ON public.tenants(subdomain);

-- =========================================================================
-- 2. Users (operators, family caregivers, owners, admins)
-- =========================================================================
CREATE TYPE user_role AS ENUM ('super_admin', 'tenant_admin', 'operator', 'caregiver', 'subscriber');
CREATE TABLE public.users (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id uuid REFERENCES public.tenants(id) ON DELETE CASCADE,
    email text NOT NULL,
    password_hash text,                       -- Supabase: comes from auth.users
    full_name text,
    role user_role NOT NULL DEFAULT 'caregiver',
    phone text,
    avatar_url text,
    two_factor_enabled boolean DEFAULT false,
    last_login_at timestamptz,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (tenant_id, email)
);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_tenant ON public.users(tenant_id);

-- =========================================================================
-- 3. Subscribers (the people whose lives we protect)
-- =========================================================================
CREATE TYPE subscriber_status AS ENUM ('active', 'paused', 'cancelled', 'churned', 'trial');
CREATE TABLE public.subscribers (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    primary_user_id uuid REFERENCES public.users(id),
    full_name text NOT NULL,
    date_of_birth date,
    gender text,
    home_address text,
    home_lat double precision,
    home_lng double precision,
    medical_conditions text[],
    allergies text[],
    medications text[],
    blood_type text,
    primary_language text DEFAULT 'en',
    status subscriber_status NOT NULL DEFAULT 'active',
    plan text NOT NULL DEFAULT 'consumer' CHECK (plan IN ('consumer', 'solo_pro', 'operator', 'network')),
    started_at timestamptz NOT NULL DEFAULT now(),
    paused_at timestamptz,
    cancelled_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_subscribers_tenant ON public.subscribers(tenant_id);
CREATE INDEX idx_subscribers_status ON public.subscribers(tenant_id, status);
CREATE INDEX idx_subscribers_geo ON public.subscribers(home_lat, home_lng) WHERE status = 'active';

-- =========================================================================
-- 4. Devices (the hardware)
-- =========================================================================
CREATE TYPE device_form_factor AS ENUM ('wristband', 'pendant', 'card', 'clip', 'watch_addon');
CREATE TYPE device_status AS ENUM ('online', 'offline', 'low_battery', 'degraded', 'lost', 'replaced');
CREATE TABLE public.devices (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    subscriber_id uuid NOT NULL REFERENCES public.subscribers(id) ON DELETE CASCADE,
    serial_number text NOT NULL UNIQUE,
    iccid text UNIQUE,                        -- SIM identifier
    imei text UNIQUE,
    form_factor device_form_factor NOT NULL,
    sku text NOT NULL,                        -- 'lifeband_g2', 'lifependant_p2', 'lifecard_c2', 'lifeclip_cg2'
    firmware_version text,
    last_seen_at timestamptz,
    last_lat double precision,
    last_lng double precision,
    battery_percent integer CHECK (battery_percent BETWEEN 0 AND 100),
    signal_dbm integer,                       -- cellular RSSI
    status device_status NOT NULL DEFAULT 'online',
    shipping_address text,
    activation_date timestamptz,
    warranty_expires_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_devices_tenant ON public.devices(tenant_id);
CREATE INDEX idx_devices_subscriber ON public.devices(subscriber_id);
CREATE INDEX idx_devices_status ON public.devices(tenant_id, status);

-- =========================================================================
-- 5. Emergency contacts (fanout targets)
-- =========================================================================
CREATE TYPE contact_priority AS ENUM ('primary', 'secondary', 'tertiary');
CREATE TABLE public.emergency_contacts (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscriber_id uuid NOT NULL REFERENCES public.subscribers(id) ON DELETE CASCADE,
    name text NOT NULL,
    relationship text,
    phone text NOT NULL,
    email text,
    priority contact_priority NOT NULL DEFAULT 'secondary',
    receive_sms boolean DEFAULT true,
    receive_call boolean DEFAULT true,
    receive_push boolean DEFAULT true,
    max_distance_km double precision,         -- only alert if they're within this distance
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_contacts_subscriber ON public.emergency_contacts(subscriber_id);

-- =========================================================================
-- 6. Incidents (the actual emergencies)
-- =========================================================================
CREATE TYPE incident_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE incident_state AS ENUM ('open', 'acknowledged', 'dispatched', 'resolved', 'cancelled', 'false_alarm');
CREATE TYPE incident_trigger AS ENUM ('button_press', 'fall_detected', 'hr_anomaly', 'spo2_drop', 'panic_keyword', 'geofence_violation', 'manual', 'system_test');
CREATE TABLE public.incidents (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    subscriber_id uuid NOT NULL REFERENCES public.subscribers(id) ON DELETE CASCADE,
    device_id uuid REFERENCES public.devices(id),
    trigger incident_trigger NOT NULL,
    severity incident_severity NOT NULL DEFAULT 'medium',
    state incident_state NOT NULL DEFAULT 'open',
    ai_score double precision NOT NULL,        -- 0-1 from the triage classifier
    latitude double precision,
    longitude double precision,
    location_accuracy_m double precision,
    triggered_at timestamptz NOT NULL DEFAULT now(),
    acknowledged_at timestamptz,
    acknowledged_by_user_id uuid REFERENCES public.users(id),
    dispatched_at timestamptz,
    resolved_at timestamptz,
    notes text,
    audio_url text,
    transcript text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_incidents_tenant_open ON public.incidents(tenant_id, state) WHERE state IN ('open', 'acknowledged', 'dispatched');
CREATE INDEX idx_incidents_subscriber ON public.incidents(subscriber_id);
CREATE INDEX idx_incidents_triggered ON public.incidents(tenant_id, triggered_at DESC);

-- =========================================================================
-- 7. Incident timeline (every action on an incident)
-- =========================================================================
CREATE TABLE public.incident_events (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id uuid NOT NULL REFERENCES public.incidents(id) ON DELETE CASCADE,
    actor_user_id uuid REFERENCES public.users(id),
    event_type text NOT NULL,                  -- 'acknowledged', 'dispatched', 'voice_open', 'note', 'status_change', etc.
    payload jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_incident_events_incident ON public.incident_events(incident_id, created_at DESC);

-- =========================================================================
-- 8. Live location (continuous stream during active incidents)
-- =========================================================================
CREATE TABLE public.location_pings (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id uuid NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
    incident_id uuid REFERENCES public.incidents(id) ON DELETE CASCADE,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    accuracy_m double precision,
    source text,                              -- 'gps', 'wifi', 'cell', 'ble'
    battery_percent integer,
    captured_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_location_pings_device_time ON public.location_pings(device_id, captured_at DESC);
CREATE INDEX idx_location_pings_incident ON public.location_pings(incident_id, captured_at DESC);

-- Turn into a hypertable when extension is available (TimescaleDB)
SELECT create_hypertable('public.location_pings', 'captured_at', if_not_exists => TRUE);

-- =========================================================================
-- 9. Vitals (continuous health signals)
-- =========================================================================
CREATE TYPE vital_kind AS ENUM ('heart_rate', 'hrv', 'spo2', 'skin_temp', 'steps', 'sleep_minutes', 'battery', 'imu_magnitude');
CREATE TABLE public.vitals_history (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id uuid NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
    subscriber_id uuid NOT NULL REFERENCES public.subscribers(id) ON DELETE CASCADE,
    kind vital_kind NOT NULL,
    value double precision NOT NULL,
    unit text,
    captured_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_vitals_device_kind_time ON public.vitals_history(device_id, kind, captured_at DESC);
CREATE INDEX idx_vitals_subscriber_kind_time ON public.vitals_history(subscriber_id, kind, captured_at DESC);

SELECT create_hypertable('public.vitals_history', 'captured_at', if_not_exists => TRUE);

-- =========================================================================
-- 10. Responder fleet (security dispatcher vehicles, ambulance, etc.)
-- =========================================================================
CREATE TYPE responder_kind AS ENUM ('armed_response', 'ambulance', 'fire', 'police', 'patrol', 'estate_guard', 'private');
CREATE TYPE responder_state AS ENUM ('available', 'en_route', 'on_scene', 'returning', 'off_duty', 'maintenance');
CREATE TABLE public.responders (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    callsign text NOT NULL,                    -- "Alpha 1"
    kind responder_kind NOT NULL,
    state responder_state NOT NULL DEFAULT 'available',
    driver_user_id uuid REFERENCES public.users(id),
    vehicle_plate text,
    home_base_lat double precision,
    home_base_lng double precision,
    current_lat double precision,
    current_lng double precision,
    last_position_at timestamptz,
    contact_phone text,
    contact_radio_freq text,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_responders_tenant_active ON public.responders(tenant_id, is_active, state);

-- =========================================================================
-- 11. Subscriber-responder assignments (a responder can be assigned to a subscriber for life)
-- =========================================================================
CREATE TABLE public.subscriber_responder_assignments (
    subscriber_id uuid NOT NULL REFERENCES public.subscribers(id) ON DELETE CASCADE,
    responder_id uuid NOT NULL REFERENCES public.responders(id) ON DELETE CASCADE,
    priority smallint NOT NULL DEFAULT 1,     -- 1 = first call
    assigned_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (subscriber_id, responder_id)
);

-- =========================================================================
-- 12. Broadcasts
-- =========================================================================
CREATE TYPE broadcast_state AS ENUM ('draft', 'scheduled', 'sending', 'sent', 'failed');
CREATE TABLE public.broadcasts (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    author_user_id uuid REFERENCES public.users(id),
    name text NOT NULL,
    audience_filter jsonb NOT NULL,           -- {geofence, country, plan, ...}
    body text NOT NULL,
    channel text NOT NULL DEFAULT 'sms' CHECK (channel IN ('sms', 'push', 'voice', 'email', 'multi')),
    state broadcast_state NOT NULL DEFAULT 'draft',
    target_count integer,
    delivered_count integer DEFAULT 0,
    read_count integer DEFAULT 0,
    scheduled_for timestamptz,
    sent_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_broadcasts_tenant ON public.broadcasts(tenant_id, created_at DESC);

-- =========================================================================
-- 13. Audit log (immutable)
-- =========================================================================
CREATE TABLE public.audit_log (
    id bigserial PRIMARY KEY,
    tenant_id uuid REFERENCES public.tenants(id) ON DELETE SET NULL,
    actor_user_id uuid REFERENCES public.users(id),
    action text NOT NULL,                     -- 'incident.acknowledged', 'device.firmware.flashed', etc.
    object_type text NOT NULL,                -- 'incident', 'device', 'subscriber', etc.
    object_id text,
    payload jsonb,
    ip_address inet,
    user_agent text,
    occurred_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_audit_tenant_time ON public.audit_log(tenant_id, occurred_at DESC);

-- =========================================================================
-- 14. Billing (Stripe Connect-aligned for resellers; subs for consumers)
-- =========================================================================
CREATE TABLE public.subscriptions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id uuid REFERENCES public.tenants(id) ON DELETE CASCADE,
    subscriber_id uuid REFERENCES public.subscribers(id) ON DELETE CASCADE,
    stripe_subscription_id text UNIQUE,
    plan text NOT NULL,
    status text NOT NULL,
    current_period_end timestamptz,
    amount_cents integer,
    currency text NOT NULL DEFAULT 'USD',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_subs_tenant ON public.subscriptions(tenant_id);
CREATE INDEX idx_subs_subscriber ON public.subscriptions(subscriber_id);

-- =========================================================================
-- 15. Webhooks (outbound — partner systems)
-- =========================================================================
CREATE TABLE public.webhooks (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    url text NOT NULL,
    signing_secret text NOT NULL,
    events text[] NOT NULL,                   -- ['incident.opened', 'incident.resolved', ...]
    is_active boolean NOT NULL DEFAULT true,
    last_delivery_at timestamptz,
    failure_count integer DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_webhooks_tenant ON public.webhooks(tenant_id) WHERE is_active = true;

CREATE TABLE public.webhook_deliveries (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    webhook_id uuid NOT NULL REFERENCES public.webhooks(id) ON DELETE CASCADE,
    event_type text NOT NULL,
    payload jsonb,
    response_status integer,
    response_body text,
    attempted_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_webhook_deliveries_webhook ON public.webhook_deliveries(webhook_id, attempted_at DESC);

-- =========================================================================
-- 16. API consumers (OAuth client apps)
-- =========================================================================
CREATE TABLE public.api_clients (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id uuid REFERENCES public.tenants(id) ON DELETE CASCADE,
    name text NOT NULL,
    client_id text NOT NULL UNIQUE,
    client_secret_hash text NOT NULL,
    scopes text[] NOT NULL DEFAULT ARRAY[]::text[],
    is_active boolean NOT NULL DEFAULT true,
    rate_limit_per_minute integer DEFAULT 60,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- =========================================================================
-- 17. Predictive risk signals (computed)
-- =========================================================================
CREATE TABLE public.risk_signals (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscriber_id uuid NOT NULL REFERENCES public.subscribers(id) ON DELETE CASCADE,
    risk_kind text NOT NULL,                  -- 'fall_risk_7d', 'cardiac_event_30d', 'medication_adherence', ...
    score double precision NOT NULL,          -- 0-1
    confidence double precision,
    explanation text,
    computed_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_risk_subscriber_time ON public.risk_signals(subscriber_id, computed_at DESC);

-- =========================================================================
-- Helper: keep updated_at fresh
-- =========================================================================
CREATE OR REPLACE FUNCTION touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_tenants_touch BEFORE UPDATE ON public.tenants
    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER trg_users_touch BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER trg_subscribers_touch BEFORE UPDATE ON public.subscribers
    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER trg_devices_touch BEFORE UPDATE ON public.devices
    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER trg_incidents_touch BEFORE UPDATE ON public.incidents
    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER trg_responders_touch BEFORE UPDATE ON public.responders
    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER trg_subs_touch BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

-- =========================================================================
-- Row-level security (multi-tenant safety)
-- =========================================================================
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.responders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broadcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- (Policy creation deferred to application code where auth.jwt() is set.)

COMMENT ON SCHEMA public IS 'LifeGuard — panic button, lone-worker, and family-safety platform. v1.0 2026-07-17.';
