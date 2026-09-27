import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Radio } from 'lucide-react';
import { StepIndicator } from '../components/StepIndicator';
import { IdentityForm } from '../components/IdentityForm';
import { IdentityCard } from '../components/IdentityCard';
import { Button, LinkButton } from '../components/Button';
import { GlassCard } from '../components/GlassCard';
import type { IdentityFormValues, useIdentity } from '../hooks/useIdentity';

interface IdentityFilePageProps {
  identity: ReturnType<typeof useIdentity>;
}

const DEFAULT_VALUES: IdentityFormValues = {
  alias: '',
  role: 'Unknown',
  district: 'Downtown',
  wantedLevel: 1,
  quote: '',
};

export default function IdentityFilePage({ identity }: IdentityFilePageProps) {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(!identity.profile);

  if (!identity.editedImage) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6">
        <GlassCard className="p-8">
          <p className="font-display text-sm tracking-widest text-primary">FILE NOT FOUND</p>
          <h1 className="mt-3 font-display text-2xl text-paper">
            Your identity file has not been initialized.
          </h1>
          <p className="mt-3 text-sm text-muted">
            You need an edited visual before the city can file you.
          </p>
          <div className="mt-6">
            <LinkButton to="/create">START AGAIN</LinkButton>
          </div>
        </GlassCard>
      </div>
    );
  }

  const handleSubmit = (values: IdentityFormValues) => {
    identity.saveProfile(values);
    setEditing(false);
  };

  const handleRelease = () => {
    identity.publish();
    navigate('/nightwire');
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <StepIndicator current={3} reachable={3} />

      <div className="mt-8">
        <p className="font-display text-xs tracking-widest text-primary">IDENTITY TERMINAL</p>
        <h1 className="mt-2 font-display text-3xl text-paper sm:text-4xl">
          {editing ? 'File your identity.' : 'Your file is ready.'}
        </h1>
      </div>

      {identity.storageWarning && (
        <div className="mt-6 flex items-start gap-3 rounded-lg border border-primary/40 bg-primary/5 px-4 py-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <p className="text-sm text-paper/90">{identity.storageWarning}</p>
        </div>
      )}

      <div className="mt-8">
        {editing ? (
          <GlassCard className="p-6 sm:p-8">
            <IdentityForm
              initialValues={
                identity.profile
                  ? {
                      alias: identity.profile.alias,
                      role: identity.profile.role,
                      district: identity.profile.district,
                      wantedLevel: identity.profile.wantedLevel,
                      quote: identity.profile.quote,
                    }
                  : DEFAULT_VALUES
              }
              onSubmit={handleSubmit}
            />
          </GlassCard>
        ) : identity.profile ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <IdentityCard profile={identity.profile} recordNumber={identity.recordNumber ?? 'V-ID-000000'} />
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button variant="secondary" onClick={() => setEditing(true)}>
                Edit identity
              </Button>
              <Button size="lg" onClick={handleRelease}>
                <Radio className="h-4 w-4" aria-hidden="true" />
                RELEASE TO THE CITY
              </Button>
            </div>
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}
