'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Personality = 'pragmatic' | 'friendly' | 'quiet';

const COMMON_CONDITIONS = [
  'hypertension',
  'type 2 diabetes',
  'early dementia',
  'osteoporosis',
  'osteoarthritis',
  'heart disease',
  'COPD',
  "Parkinson's",
];

const COMMON_INTERESTS = [
  'gardening',
  'the cats',
  'her grandchildren',
  'cooking',
  'cricket',
  'music',
  'reading',
  'walking',
];

type Step = 1 | 2 | 3 | 4;

type FormState = {
  agentName: string;
  careReceiverName: string;
  conditions: string[];
  customCondition: string;
  interests: string[];
  customInterest: string;
  timezone: string;
  personality: Personality;
};

const DEFAULT_FORM: FormState = {
  agentName: 'Esther',
  careReceiverName: '',
  conditions: [],
  customCondition: '',
  // Pre-select a few universal defaults so step 4 doesn't show "none".
  // Caregivers can deselect or add more in step 2.
  interests: ['gardening', 'music', 'walking'],
  customInterest: '',
  timezone: 'Africa/Johannesburg',
  personality: 'pragmatic',
};

export function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleIn(listKey: 'conditions' | 'interests', value: string) {
    setForm((f) => {
      const current = f[listKey];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...f, [listKey]: next };
    });
  }

  function addCustom(listKey: 'conditions' | 'interests') {
    const draftKey = listKey === 'conditions' ? 'customCondition' : 'customInterest';
    const draft = form[draftKey].trim();
    if (!draft) return;
    setForm((f) =>
      f[listKey].includes(draft)
        ? { ...f, [draftKey]: '' }
        : { ...f, [listKey]: [...f[listKey], draft], [draftKey]: '' },
    );
  }

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/care/onboarding/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentName: form.agentName.trim(),
          careReceiver: {
            name: form.careReceiverName.trim(),
            conditions: form.conditions,
            interests: form.interests,
            timezone: form.timezone,
          },
          personality: form.personality,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create agent');
      }
      router.replace('/care/dashboard');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
      setSubmitting(false);
    }
  }

  const canNext =
    (step === 1 && form.agentName.trim().length > 0) ||
    (step === 2 && form.careReceiverName.trim().length > 0) ||
    step === 3 ||
    step === 4;

  return (
    <div>
      {/* STEP PIPS */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="flex items-center gap-2 flex-1">
            <div
              className="rounded-full grid place-items-center text-[12px] mono"
              style={{
                width: 28,
                height: 28,
                background: step >= n ? 'var(--color-red)' : 'var(--color-bg)',
                color: step >= n ? '#fff' : 'var(--color-muted)',
                border: '1px solid var(--color-line)',
                fontWeight: 700,
              }}
            >
              {n}
            </div>
            <div
              className="text-[12px] mono flex-1 h-px"
              style={{
                background: step >= n + 1 ? 'var(--color-red)' : 'var(--color-line)',
              }}
            />
          </div>
        ))}
      </div>

      {/* STEP CONTENT */}
      <article
        className="rounded-2xl border p-6 md:p-8"
        style={{ borderColor: 'var(--color-line)', background: 'var(--color-bg)' }}
      >
        {step === 1 && (
          <Step1
            agentName={form.agentName}
            onChange={(v) => update('agentName', v)}
          />
        )}
        {step === 2 && (
          <Step2
            name={form.careReceiverName}
            onNameChange={(v) => update('careReceiverName', v)}
            conditions={form.conditions}
            onToggleCondition={(v) => toggleIn('conditions', v)}
            customCondition={form.customCondition}
            onCustomConditionChange={(v) => update('customCondition', v)}
            onAddCustomCondition={() => addCustom('conditions')}
            interests={form.interests}
            onToggleInterest={(v) => toggleIn('interests', v)}
            customInterest={form.customInterest}
            onCustomInterestChange={(v) => update('customInterest', v)}
            onAddCustomInterest={() => addCustom('interests')}
            timezone={form.timezone}
            onTimezoneChange={(v) => update('timezone', v)}
          />
        )}
        {step === 3 && (
          <Step3
            value={form.personality}
            onChange={(v) => update('personality', v)}
          />
        )}
        {step === 4 && (
          <Step4
            form={form}
            onEdit={(s) => setStep(s)}
          />
        )}
      </article>

      {/* NAV ROW */}
      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          onClick={() => setStep((s) => (s > 1 ? ((s - 1) as Step) : s))}
          disabled={step === 1 || submitting}
          className="btn btn-ghost btn-sm"
          style={{ opacity: step === 1 ? 0.4 : 1 }}
        >
          ← Back
        </button>

        {step < 4 ? (
          <button
            onClick={() => setStep((s) => ((s + 1) as Step))}
            disabled={!canNext}
            className="btn btn-red"
            style={{ opacity: canNext ? 1 : 0.5 }}
          >
            Continue →
          </button>
        ) : (
          <button
            onClick={submit}
            disabled={submitting}
            className="btn btn-red"
            style={{ opacity: submitting ? 0.6 : 1 }}
          >
            {submitting ? 'Provisioning…' : 'Activate agent'}
          </button>
        )}
      </div>

      {error && (
        <p
          className="mt-4 text-[13px] p-3 rounded-md"
          style={{
            color: 'var(--color-red)',
            background: 'rgba(225,29,46,0.08)',
            border: '1px solid rgba(225,29,46,0.2)',
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

/* ------------------------- STEPS ------------------------- */

function Step1({
  agentName,
  onChange,
}: {
  agentName: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.18em] mb-2" style={{ color: 'var(--color-red)', fontWeight: 700 }}>
        Step 01
      </div>
      <h2 className="text-[24px] md:text-[28px]" style={{ fontWeight: 600 }}>
        Name your agent.
      </h2>
      <p className="mt-3 text-[14px] leading-relaxed max-w-[560px]" style={{ color: 'var(--color-body)' }}>
        Pick a name for the bot. Some families call it "Esther" after an old friend. Some call it
        "Marlene's helper". The name shows up on outbound SMS and on the elder's voice button.
      </p>

      <label className="block mt-6 max-w-[420px]">
        <span className="block text-[12px] mono mb-1" style={{ color: 'var(--color-muted)' }}>
          Agent name
        </span>
        <input
          type="text"
          value={agentName}
          onChange={(e) => onChange(e.target.value)}
          maxLength={40}
          placeholder="Esther"
          className="w-full px-3 py-2 rounded-md text-[15px]"
          style={{
            background: 'var(--color-bg-soft)',
            border: '1px solid var(--color-line)',
            color: 'var(--color-ink)',
            outline: 'none',
          }}
        />
      </label>
    </div>
  );
}

function Step2(props: {
  name: string;
  onNameChange: (v: string) => void;
  conditions: string[];
  onToggleCondition: (v: string) => void;
  customCondition: string;
  onCustomConditionChange: (v: string) => void;
  onAddCustomCondition: () => void;
  interests: string[];
  onToggleInterest: (v: string) => void;
  customInterest: string;
  onCustomInterestChange: (v: string) => void;
  onAddCustomInterest: () => void;
  timezone: string;
  onTimezoneChange: (v: string) => void;
}) {
  const {
    name,
    onNameChange,
    conditions,
    onToggleCondition,
    customCondition,
    onCustomConditionChange,
    onAddCustomCondition,
    interests,
    onToggleInterest,
    customInterest,
    onCustomInterestChange,
    onAddCustomInterest,
    timezone,
    onTimezoneChange,
  } = props;

  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.18em] mb-2" style={{ color: 'var(--color-red)', fontWeight: 700 }}>
        Step 02
      </div>
      <h2 className="text-[24px] md:text-[28px]" style={{ fontWeight: 600 }}>
        Onboard the care receiver.
      </h2>
      <p className="mt-3 text-[14px] leading-relaxed max-w-[640px]" style={{ color: 'var(--color-body)' }}>
        Names, conditions, interests, timezone. The more context you give, the better the bot fits into their
        day. Nothing here is sent to a model training pipeline.
      </p>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        {/* LEFT — NAME + TIMEZONE */}
        <div className="space-y-4">
          <label className="block">
            <span className="block text-[12px] mono mb-1" style={{ color: 'var(--color-muted)' }}>
              Care receiver name
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Marlene van Wyk"
              className="w-full px-3 py-2 rounded-md text-[14px]"
              style={{
                background: 'var(--color-bg-soft)',
                border: '1px solid var(--color-line)',
                color: 'var(--color-ink)',
                outline: 'none',
              }}
            />
          </label>

          <label className="block">
            <span className="block text-[12px] mono mb-1" style={{ color: 'var(--color-muted)' }}>
              Timezone
            </span>
            <select
              value={timezone}
              onChange={(e) => onTimezoneChange(e.target.value)}
              className="w-full px-3 py-2 rounded-md text-[14px]"
              style={{
                background: 'var(--color-bg-soft)',
                border: '1px solid var(--color-line)',
                color: 'var(--color-ink)',
                outline: 'none',
              }}
            >
              <option>Africa/Johannesburg</option>
              <option>Africa/Lagos</option>
              <option>Europe/London</option>
              <option>America/New_York</option>
              <option>America/Los_Angeles</option>
              <option>Asia/Kolkata</option>
            </select>
          </label>

          <div>
            <span className="block text-[12px] mono mb-2" style={{ color: 'var(--color-muted)' }}>
              Add a custom condition
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                value={customCondition}
                onChange={(e) => onCustomConditionChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), onAddCustomCondition())}
                placeholder="e.g. glaucoma"
                className="flex-1 px-3 py-2 rounded-md text-[13px]"
                style={{
                  background: 'var(--color-bg-soft)',
                  border: '1px solid var(--color-line)',
                  color: 'var(--color-ink)',
                  outline: 'none',
                }}
              />
              <button
                type="button"
                onClick={onAddCustomCondition}
                className="btn btn-ghost btn-sm"
                disabled={!customCondition.trim()}
              >
                Add
              </button>
            </div>
          </div>

          <div>
            <span className="block text-[12px] mono mb-2" style={{ color: 'var(--color-muted)' }}>
              Add a custom interest
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                value={customInterest}
                onChange={(e) => onCustomInterestChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), onAddCustomInterest())}
                placeholder="e.g. birdwatching"
                className="flex-1 px-3 py-2 rounded-md text-[13px]"
                style={{
                  background: 'var(--color-bg-soft)',
                  border: '1px solid var(--color-line)',
                  color: 'var(--color-ink)',
                  outline: 'none',
                }}
              />
              <button
                type="button"
                onClick={onAddCustomInterest}
                className="btn btn-ghost btn-sm"
                disabled={!customInterest.trim()}
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT — CHIP SELECTIONS */}
        <div className="space-y-5">
          <ChipGroup label="Conditions" options={COMMON_CONDITIONS} selected={conditions} onToggle={onToggleCondition} />
          <ChipGroup label="Interests" options={COMMON_INTERESTS} selected={interests} onToggle={onToggleInterest} />
        </div>
      </div>
    </div>
  );
}

function Step3({
  value,
  onChange,
}: {
  value: Personality;
  onChange: (v: Personality) => void;
}) {
  const options: { id: Personality; title: string; body: string }[] = [
    {
      id: 'pragmatic',
      title: 'Pragmatic',
      body: 'Reminders are short and direct. Escalates quickly when something needs the family.',
    },
    {
      id: 'friendly',
      title: 'Friendly',
      body: 'Softly worded, warm tone. Best for care receivers who respond well to encouragement.',
    },
    {
      id: 'quiet',
      title: 'Quiet',
      body: 'Only initiates at scheduled times. Never pushes chat. Escalates only on actionable events.',
    },
  ];

  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.18em] mb-2" style={{ color: 'var(--color-red)', fontWeight: 700 }}>
        Step 03
      </div>
      <h2 className="text-[24px] md:text-[28px]" style={{ fontWeight: 600 }}>
        Pick a personality.
      </h2>
      <p className="mt-3 text-[14px] leading-relaxed max-w-[640px]" style={{ color: 'var(--color-body)' }}>
        This shapes the agent's tone on outbound reminders and chat replies. You can change it later
        from the dashboard.
      </p>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        {options.map((opt) => {
          const selected = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className="text-left rounded-xl p-4"
              style={{
                background: selected ? 'rgba(225,29,46,0.06)' : 'var(--color-bg-soft)',
                border: `1.5px solid ${selected ? 'var(--color-red)' : 'var(--color-line)'}`,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[14px]" style={{ fontWeight: 600 }}>
                  {opt.title}
                </span>
                <span
                  className="grid place-items-center rounded-full"
                  style={{
                    width: 18,
                    height: 18,
                    background: selected ? 'var(--color-red)' : 'transparent',
                    border: `1.5px solid ${selected ? 'var(--color-red)' : 'var(--color-line)'}`,
                  }}
                >
                  {selected && (
                    <span
                      style={{
                        width: 8,
                        height: 4,
                        borderLeft: '2px solid #fff',
                        borderBottom: '2px solid #fff',
                        transform: 'rotate(-45deg) translate(1px,-1px)',
                      }}
                    />
                  )}
                </span>
              </div>
              <p className="text-[12.5px] leading-relaxed" style={{ color: 'var(--color-muted)' }}>
                {opt.body}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Step4({ form, onEdit }: { form: FormState; onEdit: (s: Step) => void }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.18em] mb-2" style={{ color: 'var(--color-red)', fontWeight: 700 }}>
        Step 04
      </div>
      <h2 className="text-[24px] md:text-[28px]" style={{ fontWeight: 600 }}>
        Review and activate.
      </h2>
      <p className="mt-3 text-[14px] leading-relaxed max-w-[640px]" style={{ color: 'var(--color-body)' }}>
        We provision the runtime, generate the agent email, and spin up calendar, medication,
        reminder, escalation, digest, and cognitive-watch skills. After activation the dashboard
        goes live.
      </p>

      <dl className="mt-6 space-y-3 text-[13.5px]">
        <Row label="Agent name" onEdit={() => onEdit(1)}>
          {form.agentName || <em style={{ color: 'var(--color-muted)' }}>unset</em>}
        </Row>
        <Row label="Care receiver" onEdit={() => onEdit(2)}>
          {form.careReceiverName || <em style={{ color: 'var(--color-muted)' }}>unset</em>}
          <span style={{ color: 'var(--color-muted)' }}> · {form.timezone}</span>
        </Row>
        <Row label="Conditions" onEdit={() => onEdit(2)}>
          {form.conditions.length === 0 ? (
            <em style={{ color: 'var(--color-muted)' }}>none</em>
          ) : (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {form.conditions.map((c) => (
                <span key={c} className="text-[11px] mono px-2 py-1 rounded-full"
                  style={{ background: 'var(--color-bg-soft)', border: '1px solid var(--color-line)' }}>
                  {c}
                </span>
              ))}
            </div>
          )}
        </Row>
        <Row label="Interests" onEdit={() => onEdit(2)}>
          {form.interests.length === 0 ? (
            <em style={{ color: 'var(--color-muted)' }}>none</em>
          ) : (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {form.interests.map((i) => (
                <span key={i} className="text-[11px] mono px-2 py-1 rounded-full"
                  style={{ background: 'var(--color-bg-soft)', border: '1px solid var(--color-line)' }}>
                  {i}
                </span>
              ))}
            </div>
          )}
        </Row>
        <Row label="Personality" onEdit={() => onEdit(3)}>
          <span style={{ textTransform: 'capitalize' }}>{form.personality}</span>
        </Row>
      </dl>
    </div>
  );
}

function Row({ label, onEdit, children }: { label: string; onEdit: () => void; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-12 gap-3 items-start" style={{ borderTop: '1px solid var(--color-line)', paddingTop: 12 }}>
      <dt className="col-span-4 text-[11px] uppercase tracking-[0.16em]" style={{ color: 'var(--color-muted)', fontWeight: 600 }}>
        {label}
      </dt>
      <dd className="col-span-6">{children}</dd>
      <dd className="col-span-2 text-right">
        <button onClick={onEdit} className="text-[12px] mono" style={{ color: 'var(--color-red)', fontWeight: 600 }}>
          edit
        </button>
      </dd>
    </div>
  );
}

function ChipGroup({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div>
      <span className="block text-[12px] mono mb-2" style={{ color: 'var(--color-muted)' }}>
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const on = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onToggle(opt)}
              className="text-[12px] mono px-2.5 py-1 rounded-full"
              style={{
                background: on ? 'var(--color-red)' : 'var(--color-bg-soft)',
                color: on ? '#fff' : 'var(--color-ink)',
                border: `1px solid ${on ? 'var(--color-red)' : 'var(--color-line)'}`,
              }}
            >
              {opt}
            </button>
          );
        })}
        {selected
          .filter((s) => !options.includes(s))
          .map((custom) => (
            <button
              key={custom}
              type="button"
              onClick={() => onToggle(custom)}
              className="text-[12px] mono px-2.5 py-1 rounded-full"
              style={{
                background: 'var(--color-red)',
                color: '#fff',
                border: '1px solid var(--color-red)',
              }}
            >
              {custom} ×
            </button>
          ))}
      </div>
    </div>
  );
}
