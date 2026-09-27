import { useNavigate } from 'react-router-dom';
import { Eye, Heart, MessageCircle, TrendingUp } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { StatusBadge } from '../components/StatusBadge';
import { StatCard } from '../components/StatCard';
import { Button, LinkButton } from '../components/Button';
import type { useIdentity } from '../hooks/useIdentity';

interface ProfilePageProps {
  identity: ReturnType<typeof useIdentity>;
}

export default function ProfilePage({ identity }: ProfilePageProps) {
  const navigate = useNavigate();
  const { profile } = identity;

  if (!profile) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6">
        <GlassCard className="p-8">
          <p className="font-display text-sm tracking-widest text-primary">NO FILE ON RECORD</p>
          <h1 className="mt-3 font-display text-2xl text-paper">You haven&rsquo;t built an identity yet.</h1>
          <p className="mt-3 text-sm text-muted">Start the terminal to create your first file.</p>
          <div className="mt-6">
            <LinkButton to="/create">CREATE YOUR IDENTITY</LinkButton>
          </div>
        </GlassCard>
      </div>
    );
  }

  const handleReset = () => {
    const confirmed = window.confirm(
      'This clears your identity file from this device. Continue?',
    );
    if (confirmed) {
      identity.resetIdentity();
      navigate('/create');
    }
  };

  const handlePublishAgain = () => {
    identity.publish();
    navigate('/nightwire');
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <p className="font-display text-xs tracking-widest text-primary">MY FILE</p>
      <h1 className="mt-2 font-display text-3xl text-paper sm:text-4xl">{profile.alias}</h1>

      <div className="mt-8 grid gap-6 sm:grid-cols-[220px_1fr]">
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <img
            src={profile.image}
            alt={`${profile.alias}'s identity photo`}
            className="aspect-square w-full object-cover"
          />
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status={profile.status} />
            <span className="text-sm text-muted">
              {profile.role} · {profile.district}
            </span>
          </div>
          <p className="text-sm text-primary" aria-label={`Wanted level ${profile.wantedLevel} of 5`}>
            {'★'.repeat(profile.wantedLevel)}
            <span className="text-white/15">{'★'.repeat(5 - profile.wantedLevel)}</span>
          </p>
          {profile.quote && (
            <p className="border-l-2 border-accent/40 pl-3 text-sm italic text-paper/90">
              &ldquo;{profile.quote}&rdquo;
            </p>
          )}
          <p className="text-xs text-muted">
            Filed {new Date(profile.createdAt).toLocaleDateString()} · Record{' '}
            {identity.recordNumber}
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={Heart} label="Likes" value={profile.likes} />
        <StatCard icon={MessageCircle} label="Comments" value={profile.comments} />
        <StatCard icon={Eye} label="Views" value={profile.views.toLocaleString()} />
        <StatCard icon={TrendingUp} label="Reputation" value={profile.reputation} />
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <LinkButton to="/file" variant="secondary">
          Edit identity
        </LinkButton>
        <LinkButton to="/nightwire" variant="secondary">
          View public profile
        </LinkButton>
        <Button onClick={handlePublishAgain}>Publish again</Button>
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </div>
  );
}
