import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { StepIndicator } from '../components/StepIndicator';
import { ImageEditorPanel } from '../components/ImageEditorPanel';
import { Button, LinkButton } from '../components/Button';
import { GlassCard } from '../components/GlassCard';
import type { useIdentity } from '../hooks/useIdentity';

interface EditorPageProps {
  identity: ReturnType<typeof useIdentity>;
}

export default function EditorPage({ identity }: EditorPageProps) {
  const navigate = useNavigate();

  if (!identity.draft.image) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6">
        <GlassCard className="p-8">
          <p className="font-display text-sm tracking-widest text-primary">FILE NOT FOUND</p>
          <h1 className="mt-3 font-display text-2xl text-paper">
            Your identity file has not been initialized.
          </h1>
          <p className="mt-3 text-sm text-muted">
            Pick a photo or a city profile before you can edit anything.
          </p>
          <div className="mt-6">
            <LinkButton to="/create">START AGAIN</LinkButton>
          </div>
        </GlassCard>
      </div>
    );
  }

  const canContinue = Boolean(identity.editedImage);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <StepIndicator current={2} reachable={2} />

      <div className="mt-8">
        <p className="font-display text-xs tracking-widest text-primary">IDENTITY TERMINAL</p>
        <h1 className="mt-2 font-display text-3xl text-paper sm:text-4xl">Build your legend.</h1>
        <p className="mt-2 text-sm text-muted">
          Make the city remember the right version of you.
        </p>
      </div>

      {identity.storageWarning && (
        <div className="mt-6 flex items-start gap-3 rounded-lg border border-primary/40 bg-primary/5 px-4 py-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <p className="text-sm text-paper/90">{identity.storageWarning}</p>
        </div>
      )}

      <div className="mt-8">
        <ImageEditorPanel image={identity.draft.image} onSave={identity.setEditedImage} />
      </div>

      <div className="mt-8 flex flex-col-reverse items-center gap-3 sm:flex-row sm:items-start sm:justify-between">
        <Button variant="ghost" onClick={() => navigate('/create')}>
          Back to profile
        </Button>
        <div className="flex flex-col items-center gap-2 sm:items-end">
          <Button size="lg" onClick={() => navigate('/file')} disabled={!canContinue}>
            Continue to file
          </Button>
          {!canContinue && (
            <p className="text-xs text-muted">Save your edited image to continue.</p>
          )}
        </div>
      </div>
    </div>
  );
}

