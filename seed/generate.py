#!/usr/bin/env python3
"""LifeGuard seed generator.

Outputs three JSON files consumed by the three Next.js surfaces:

- console_data.json: tenants, subscribers, devices, incidents, responders
- family_data.json : wearer's caregiver dashboard content
- reseller_data.json: MRR + customer book + plan editor + branding

Data is intentionally realistic — real-looking Lat/Lng (centred around Cape Town),
real-looking medical conditions (not "Lorem Ipsum"), realistic HR/HRV/SpO2 ranges,
and an alert mix that mirrors what a real security desk sees.
"""

from __future__ import annotations

import json
import math
import random
from datetime import datetime, timedelta, timezone
from pathlib import Path

random.seed(42)  # deterministic runs

NOW = datetime.now(timezone.utc)

# Concentrate around Cape Town for the live map (Sea Point / Camps Bay / Claremont / Stellenbosch) —
# mimics a South African Security Company's actual footprint.
FOCUS_CENTRES = [
    ("City Bowl / Sea Point",   (-33.918,  18.385)),
    ("Camps Bay",               (-33.951,  18.378)),
    ("Claremont / Newlands",    (-33.987,  18.464)),
    ("Stellenbosch",            (-33.932,  18.864)),
    ("Somerset West",           (-34.085,  18.823)),
    ("Durbanville",             (-33.836,  18.633)),
    ("Hermanus",                (-34.421,  19.231)),
    ("Knysna",                  (-34.036,  23.046)),
]

MEDICAL_CONDITIONS = [
    "hypertension", "type_2_diabetes", "asthma", "epilepsy", "parkinsons",
    "early_dementia", "afib", "osteoporosis", "copd", "fall_history", "pacemaker",
]

RELATIONSHIPS = ["spouse", "daughter", "son", "neighbour", "caregiver", "nurse", "doctor"]
SUBSCRIBER_NAMES = [
    "Hendrik van der Merwe", "Patricia Botha", "Yusuf Patel", "Maria de Klerk",
    "Thandi Mokoena", "Joyce Adams", "Ebrahim Sallie", "Susan O'Connor",
    "Sipho Dlamini", "Linda Nkomo", "Andre Joubert", "Beatrice Williams",
    "Pieter Rossouw", "Margaret Naidoo", "Jan Hendrik Steyn", "Aisha Khan",
    "Frederik van Niekerk", "Nomsa Mthembu", "Robert McKenzie", "Helena Prinsloo",
    "Karel Schoeman", "Nomvula Shongwe", "Stuart Buchanan", "Cecelia Mthethwa",
    "Daniel de Villiers", "Lerato Khoza", "Willem Pienaar", "Esther van Wyk",
    "Bongani Zulu", "Hester Engelbrecht",
]
OPERATOR_NAMES = [
    ("Themba",  "Khumalo",   "Alpha-1"),
    ("Sarah",   "Williams",  "Alpha-2"),
    ("Marco",   "van Wyk",   "Bravo-1"),
    ("Anele",   "Mabaso",    "Bravo-2"),
    ("Pieter",  "Engelbrecht","Charlie-1"),
    ("Nomvula", "Dlamini",   "Charlie-2"),
    ("Andre",   "Botha",     "Delta-1"),
    ("Lindelwa","Ngidi",     "Delta-2"),
]
ALERT_TRIGGERS = [
    "button_press", "fall_detected", "hr_anomaly", "panic_keyword",
    "geofence_violation", "manual",
]
ALERT_NOTES = [
    "Caller reports feeling dizzy, BP dropping.",
    "Wearer's heart rate spiked to 165 during a walk.",
    "Device button pressed twice within 10 seconds.",
    "Faint call for help, voice not clear.",
    "Wearer hasn't moved from bathroom in 40 minutes.",
    "Hard fall detected — possible syncope.",
    "Geofence exit: home radius.",
    "Caller reports being followed home.",
    "Family called — they can't reach her.",
    "Wearer asked for help; voice strong, alert.",
    "Sudden loss of consciousness during staircase use.",
    "Wearable soaked, possible distress in garden.",
]

def jitter(c):
    lat, lng = c
    return lat + random.uniform(-0.022, 0.022), lng + random.uniform(-0.022, 0.022)

def fake_vitals_series(days=30, base_hr=72, base_hrv=58, base_spo2=96, base_steps=4200):
    """Realistic-looking vitals: HR varies around 60-90, HRV peaks during sleep, SpO2 dips at altitude."""
    out = []
    for d in range(days):
        day = NOW - timedelta(days=d)
        # one reading per 4 hours = 6/day
        for h in [0, 4, 8, 12, 16, 20]:
            ts = day.replace(hour=h, minute=0, second=0, microsecond=0)
            hr = max(50, min(110, base_hr + random.gauss(0, 8) - (4 if 0 <= h <= 6 else 0)))
            hrv = max(20, min(120, base_hrv + random.gauss(0, 14) + (8 if 0 <= h <= 7 else 0)))
            spo2 = max(90, min(100, base_spo2 + random.gauss(0, 1.0)))
            steps = random.randint(120, 540) if 6 <= h <= 22 else random.randint(0, 20)
            out.append({"t": ts.isoformat(), "hr": round(hr, 1), "hrv": round(hrv, 1), "spo2": round(spo2, 1), "steps": steps})
    return out

def gen_tenant():
    return {
        "id": "tnt_001",
        "slug": "crescent-security",
        "name": "Crescent Armed Response",
        "logo_url": "/brand/crescent.svg",
        "brand_primary_color": "#1d4ed8",
        "brand_accent_color": "#06b6a4",
        "subdomain": "control.crescent.co.za",
        "country_code": "ZA",
        "plan": "operator",
    }

def gen_responders():
    out = []
    for i, (first, last, call) in enumerate(OPERATOR_NAMES):
        centre = FOCUS_CENTRES[i % len(FOCUS_CENTRES)]
        lat, lng = jitter(centre[1])
        states = ["available", "en_route", "on_scene", "returning", "off_duty", "available"]
        out.append({
            "id": f"resp_{i+1:02d}",
            "callsign": call,
            "driver": f"{first} {last}",
            "kind": "armed_response",
            "state": states[i % len(states)],
            "current_lat": lat,
            "current_lng": lng,
            "vehicle_plate": f"CA{i:02d}-{random.choice(['GP','WP','EC'])}-GP",
            "contact_phone": f"+27 7{random.randint(1,9)} {random.randint(100,999)} {random.randint(1000,9999)}",
            "last_update": (NOW - timedelta(minutes=random.randint(1, 15))).isoformat(),
            "driver_rating": round(random.uniform(4.4, 5.0), 2),
            "incidents_today": random.randint(0, 4),
        })
    return out

def gen_subscribers_and_devices(n=80):
    out = []
    for i in range(n):
        centre = FOCUS_CENTRES[i % len(FOCUS_CENTRES)]
        lat, lng = jitter(centre[1])
        s_lat, s_lng = jitter(centre[1])
        age = random.randint(67, 96)
        conditions = random.sample(MEDICAL_CONDITIONS, k=random.randint(0, 3))
        statuses = ["online", "online", "online", "online", "low_battery", "offline", "degraded"]
        # 60% are elderly, 25% lone worker, 15% at-risk individual
        kind = "elderly" if i % 20 < 12 else "lone_worker" if i % 20 < 17 else "at_risk"
        name = random.choice(SUBSCRIBER_NAMES) + (f" (jnr {i})" if i > 25 else "")
        subs = {
            "id": f"sub_{i+1:03d}",
            "full_name": name,
            "kind": kind,
            "age": age,
            "status": "active",
            "home_address": f"{random.randint(1, 200)} {random.choice(['Sea','Oak','High','Park','Main','Beach'])} {random.choice(['Road','Avenue','Lane','Drive'])}, {centre[0]}",
            "home_lat": round(s_lat, 6),
            "home_lng": round(s_lng, 6),
            "live_lat": round(lat, 6),
            "live_lng": round(lng, 6),
            "battery_percent": random.randint(18, 100),
            "signal_dbm": random.randint(-110, -55),
            "plan": "consumer" if kind == "elderly" else "solo_pro" if kind == "lone_worker" else "operator",
            "joined": (NOW - timedelta(days=random.randint(40, 720))).isoformat(),
            "last_seen": (NOW - timedelta(minutes=random.randint(0, 1000))).isoformat(),
            "conditions": conditions,
            "blood_type": random.choice(["O+", "A+", "B+", "AB+", "O-", "A-"]),
            "vitals_summary": {
                "hr_avg": random.randint(58, 84),
                "hrv_avg": random.randint(35, 85),
                "spo2_avg": random.uniform(94.5, 98.5),
                "sleep_avg": random.uniform(5.5, 8.5),
                "steps_avg": random.randint(800, 6500),
                "fall_risk_7d": round(random.uniform(0.05, 0.42), 2),
            },
            "device": {
                "id": f"dev_{i+1:03d}",
                "serial": f"LFG2-{(i+1)*37:07d}",
                "form_factor": "wristband" if kind == "elderly" else "pendant" if kind == "at_risk" else "clip",
                "sku": "lifeband_g2" if kind == "elderly" else "lifependant_p2" if kind == "at_risk" else "lifeclip_cg2",
                "firmware": f"v2.4.{random.randint(0, 9)}",
                "status": random.choice(statuses),
            },
            "vitals_history": fake_vitals_series(days=30),
            "contacts": [
                {"name": random.choice(["Daughter", "Son", "Spouse", "Neighbour"]), "phone": "+27 7" + str(random.randint(1,9)) + " " + str(random.randint(100,999)) + " " + str(random.randint(1000,9999)), "priority": p}
                for p in ["primary", "secondary", "tertiary"]
            ][:random.randint(2,3)],
        }
        out.append(subs)
    return out

def gen_incidents(subs):
    """60-80 incidents over the past 24h with realistic distribution:
       - 5% critical, 10% high, 30% medium, 55% low
       - false alarm rate is ~30%
    """
    out = []
    for i in range(40):
        # pick a random subscriber weighted toward elderly
        sub = random.choice(subs)
        score = random.betavariate(2.0, 5.0)  # mostly low scores
        if i % 7 == 0:
            score = random.uniform(0.78, 0.99)  # bump up
        triggered_at = NOW - timedelta(minutes=random.randint(1, 1440))
        trigger = random.choice(ALERT_TRIGGERS)
        severity = (
            "critical" if score > 0.9 else
            "high" if score > 0.7 else
            "medium" if score > 0.4 else "low"
        )
        state = random.choices(
            ["open", "acknowledged", "dispatched", "resolved", "false_alarm"],
            weights=[3, 2, 2, 15, 5]
        )[0]
        responder = random.choice(OPERATOR_NAMES) if state in ("dispatched", "resolved", "acknowledged") else None
        out.append({
            "id": f"inc_{i+1:04d}",
            "subscriber_id": sub["id"],
            "subscriber_name": sub["full_name"],
            "device_id": sub["device"]["id"],
            "trigger": trigger,
            "severity": severity,
            "state": state,
            "ai_score": round(score, 3),
            "latitude": sub["live_lat"] + random.uniform(-0.003, 0.003),
            "longitude": sub["live_lng"] + random.uniform(-0.003, 0.003),
            "triggered_at": triggered_at.isoformat(),
            "acknowledged_at": (triggered_at + timedelta(seconds=random.randint(5, 240))).isoformat() if state != "open" else None,
            "dispatched_at": (triggered_at + timedelta(seconds=random.randint(120, 600))).isoformat() if state in ("dispatched", "resolved") else None,
            "responder": f"{responder[2]}" if responder else None,
            "responder_eta_s": random.randint(180, 720) if state in ("acknowledged", "dispatched") else None,
            "notes": random.choice(ALERT_NOTES),
            "audio_open": state in ("acknowledged", "dispatched"),
            "sms_fanout_total": random.randint(0, 5),
            "sms_fanout_delivered": 0 if state == "open" else random.randint(2, 5),
        })
    out.sort(key=lambda x: x["ai_score"], reverse=True)
    return out

def gen_broadcasts():
    return [
        {"id": "bc_001", "name": "Severe weather warning — Cape Town", "audience": "All subscribers in Western Cape", "channel": "multi", "state": "sent",
         "target_count": 4128, "delivered_count": 4002, "read_count": 3120, "sent_at": (NOW - timedelta(hours=3)).isoformat(), "author": "Operations"},
        {"id": "bc_002", "name": "Estate power outage — Claremont area", "audience": "Claremont geofence", "channel": "sms", "state": "sent",
         "target_count": 312, "delivered_count": 312, "read_count": 280, "sent_at": (NOW - timedelta(days=1, hours=5)).isoformat(), "author": "Site Manager"},
        {"id": "bc_003", "name": "Annual wellness-check reminder", "audience": "All elderly subscribers", "channel": "push", "state": "draft",
         "target_count": 0, "delivered_count": 0, "read_count": 0, "sent_at": None, "author": "Marketing"},
        {"id": "bc_004", "name": "Service window: SIM swap on Sunday 02:00-04:00 SAST", "audience": "All subscribers", "channel": "sms", "state": "scheduled",
         "target_count": 0, "delivered_count": 0, "read_count": 0, "scheduled_for": (NOW + timedelta(days=2)).isoformat(), "author": "Engineering"},
    ]

def gen_reseller_summary():
    # MRR build-up over the trailing 12 months
    today = NOW
    series = []
    val = 13_400
    for m in range(12):
        month = today - timedelta(days=30 * (11 - m))
        val = val + random.randint(800, 2400)
        series.append({
            "month": month.strftime("%Y-%m"),
            "mrr": val,
            "subscribers": int(val / 24.99 / 30),
            "devices": int(val / 24.99 / 25) * 2,
            "alerts": random.randint(50, 240),
            "new_signups": random.randint(2, 12),
            "churns": random.randint(0, 3),
        })
    return series

def main():
    out_dir = Path(__file__).parent
    tenant = gen_tenant()
    responders = gen_responders()
    subs = gen_subscribers_and_devices(80)
    incidents = gen_incidents(subs)

    console_data = {
        "tenant": tenant,
        "responders": responders,
        "subscribers": subs,
        "incidents": incidents,
        "broadcasts": gen_broadcasts(),
        "stats": {
            "live_subscribers": sum(1 for s in subs if s["device"]["status"] in ("online", "low_battery")),
            "online_responders": sum(1 for r in responders if r["state"] in ("available", "en_route", "on_scene")),
            "open_incidents": sum(1 for i in incidents if i["state"] in ("open", "acknowledged", "dispatched")),
            "today_total_alerts": len(incidents),
            "today_dispatched": sum(1 for i in incidents if i["dispatched_at"] is not None),
            "false_alarm_rate": round(sum(1 for i in incidents if i["state"] == "false_alarm") / max(1, len(incidents)), 3),
            "median_ack_seconds": random.randint(40, 220),
            "median_response_minutes": round(random.uniform(6.5, 14.2), 1),
        },
        "audit_events": [
            {"id": f"aud_{i:04d}", "actor": random.choice([r["driver"] for r in responders]),
             "action": random.choice(["incident.acknowledged", "incident.dispatched", "broadcast.sent", "subscriber.updated", "device.rebooted"]),
             "object": random.choice(["incident", "device", "subscriber", "broadcast"]),
             "object_id": f"obj_{random.randint(1000, 9999)}",
             "at": (NOW - timedelta(minutes=random.randint(1, 1440))).isoformat(),
             "ip": f"102.65.{random.randint(0,255)}.{random.randint(0,255)}"}
            for i in range(40)
        ],
    }

    (out_dir / "console_data.json").write_text(json.dumps(console_data, indent=2, ensure_ascii=False))

    family_data = {
        "viewer": {"name": "Marisa Botha", "role": "Daughter & primary caregiver", "avatar": "MB"},
        "protected": subs[:5],   # five devices on the family dashboard
        "weekly_summary": {
            "alerts": random.randint(0, 4),
            "vitals_avg_hr": random.randint(64, 84),
            "vitals_avg_spo2": round(random.uniform(95, 98), 1),
            "activity_score": round(random.uniform(72, 96), 0),
            "mood_label": random.choice(["Doing well", "Sleeping well", "Active this week", "Inactive mornings"]),
        },
    }
    (out_dir / "family_data.json").write_text(json.dumps(family_data, indent=2, ensure_ascii=False))

    reseller_data = {
        "tenant": tenant,
        "summary": {
            "mrr": 32_180,
            "mrr_growth_pct": round(random.uniform(4.8, 11.2), 1),
            "active_subscribers": sum(1 for s in subs if s["status"] == "active"),
            "devices_in_field": len(subs),
            "alerts_this_month": random.randint(800, 2400),
            "churn_pct": round(random.uniform(1.2, 3.1), 1),
            "trial_count": 12,
            "support_tickets_open": 3,
        },
        "mrr_series": gen_reseller_summary(),
        "top_customers": [
            {"id": f"sub_{i+1:03d}", "name": s["full_name"], "plan": s["plan"], "mrr": round(random.uniform(19, 49), 2), "joined": s["joined"]}
            for i, s in enumerate(subs[:8])
        ],
        "retail_plans": [
            {"id": "plan_basic", "name": "Basic", "wholesale_cents": 1900, "retail_cents": 2499, "active_customers": 184, "featured": False},
            {"id": "plan_pro", "name": "Pro", "wholesale_cents": 2900, "retail_cents": 3999, "active_customers": 92, "featured": True},
            {"id": "plan_family", "name": "Family", "wholesale_cents": 4900, "retail_cents": 5999, "active_customers": 36, "featured": False},
            {"id": "plan_estate", "name": "Estate", "wholesale_cents": 14900, "retail_cents": 18900, "active_customers": 8, "featured": False},
        ],
        "branding": {
            "subdomain": "control.crescent.co.za",
            "logo": "crescent.svg",
            "color_primary": "#1d4ed8",
            "color_accent": "#06b6a4",
            "email_from": "no-reply@crescent.co.za",
        },
    }
    (out_dir / "reseller_data.json").write_text(json.dumps(reseller_data, indent=2, ensure_ascii=False))

    print(f"console_data.json : {len(console_data['incidents'])} incidents, {len(console_data['subscribers'])} subscribers, {len(console_data['responders'])} responders")
    print(f"family_data.json  : {len(family_data['protected'])} protected people")
    print(f"reseller_data.json: {reseller_data['summary']['active_subscribers']} active subs")

if __name__ == "__main__":
    main()
