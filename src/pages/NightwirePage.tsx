import { StepIndicator } from '../components/StepIndicator';
import { NightwireUserPost, SamplePostGrid } from '../components/NightwireFeed';
import { ToastStack, useToasts } from '../components/Toast';
import { useCityReactions } from '../components/CityReaction';
import { LinkButton } from '../components/Button';
import type { useIdentity } from '../hooks/useIdentity';

interface NightwirePageProps {
  identity: ReturnType<typeof useIdentity>;
}

export default function NightwirePage({ identity }: NightwirePageProps) {
  const { toasts, pushToast, dismissToast } = useToasts();
  const isPublished = identity.profile?.status === 'CONFIRMED';
  useCityReactions(pushToast, isPublished);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {identity.activeImage && <StepIndicator current={4} reachable={4} />}

      <div className="mt-8 text-center">
        <p className="font-display text-xs tracking-widest text-primary">NIGHTWIRE</p>
        <h1 className="mt-2 font-display text-3xl text-paper sm:text-4xl">The city is watching.</h1>
      </div>

      {isPublished && identity.profile ? (
        <div className="mt-10">
          <NightwireUserPost profile={identity.profile} comments={identity.comments} />
          <div className="mt-6 flex justify-center">
            <LinkButton to="/profile" variant="secondary">
              View my file
            </LinkButton>
          </div>
        </div>
      ) : identity.profile ? (
        <div className="mx-auto mt-10 max-w-md rounded-xl border border-white/10 bg-white/5 p-6 text-center">
          <p className="text-sm text-muted">
            Your file exists, but you haven&rsquo;t released it to the city yet.
          </p>
          <div className="mt-4">
            <LinkButton to="/file">Go to my file</LinkButton>
          </div>
        </div>
      ) : (
        <p className="mx-auto mt-6 max-w-md text-center text-sm text-muted">
          Here&rsquo;s who else has already filed in. Build your own to join the feed.
        </p>
      )}

      <div className="mt-14">
        <h2 className="mb-5 font-display text-sm tracking-widest text-accent">FROM AROUND LEONORA</h2>
        <SamplePostGrid />
      </div>

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
