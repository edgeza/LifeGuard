import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { db_careReceivers } from '@/lib/db';
import { OnboardingWizard } from './OnboardingWizard';

export const metadata = {
  title: 'Care onboarding — set up the agent in four steps',
  description:
    'When a caregiver creates an account for their parent, we spin up a dedicated agent. Name it, onboard the elder, pick a personality, and activate. Takes about three minutes.',
};

// Server component: gate on auth, fetch existing state, hand the form to the client wizard.
export default async function OnboardingPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login?from=/care/onboarding');
  }

  // MVP: 1 care_receiver per user. If they already have one, jump to dashboard.
  const existing = db_careReceivers.listForUser(user.id);
  if (existing.length > 0) {
    redirect('/care/dashboard');
  }

  return (
    <main className="min-h-screen" style={{ background: 'var(--color-bg-soft)' }}>
      {/* TOP BAR — match dashboard chrome */}
      <header
        className="border-b"
        style={{ borderColor: 'var(--color-line)', background: 'var(--color-bg)' }}
      >
        <div className="max-w-[1100px] mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <div className="eyebrow mb-1" style={{ color: 'var(--color-red)' }}>
              Care · onboarding
            </div>
            <h1 className="text-[22px] md:text-[26px]" style={{ fontWeight: 600, letterSpacing: '-0.01em' }}>
              Set up your care agent
            </h1>
          </div>
          <div className="text-[12px] mono" style={{ color: 'var(--color-muted)' }}>
            {user.email}
          </div>
        </div>
      </header>

      <section className="max-w-[1100px] mx-auto px-6 py-8">
        <OnboardingWizard />
      </section>
    </main>
  );
}
