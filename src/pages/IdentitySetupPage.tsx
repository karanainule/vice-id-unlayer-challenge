import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StepIndicator } from '../components/StepIndicator';
import { ProfileSelector } from '../components/ProfileSelector';
import { AnimatedBackground } from '../components/AnimatedBackground';
import type { PresetProfile } from '../types/identity';
import type { useIdentity } from '../hooks/useIdentity';

interface IdentitySetupPageProps {
  identity: ReturnType<typeof useIdentity>;
}

export default function IdentitySetupPage({ identity }: IdentitySetupPageProps) {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handlePreset = (preset: PresetProfile) => {
    identity.setDraftImage(preset.image, 'preset', preset.id);
    navigate('/edit');
  };

  const handleUpload = (image: string) => {
    setError(null);
    identity.setDraftImage(image, 'upload');
    navigate('/edit');
  };

  return (
    <div className="relative">
      <div className="relative overflow-hidden">
        <AnimatedBackground variant="quiet" className="opacity-60" />
        <div className="relative mx-auto max-w-3xl px-4 py-10 sm:px-6">
          <StepIndicator
            current={1}
            reachable={identity.editedImage ? 3 : identity.draft.image ? 2 : 1}
          />
          <div className="mt-8">
            <p className="font-display text-xs tracking-widest text-primary">IDENTITY TERMINAL</p>
            <h1 className="mt-2 font-display text-3xl text-paper sm:text-4xl">
              How should the city remember you?
            </h1>
          </div>

          <div className="mt-8">
            <ProfileSelector
              onSelectUpload={handleUpload}
              onSelectPreset={handlePreset}
              selectedPresetId={identity.draft.source === 'preset' ? identity.draft.presetId : null}
              error={error}
              onError={setError}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
