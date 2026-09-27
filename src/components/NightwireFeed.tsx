import { Eye, Heart, MessageCircle } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { aliasToHandle } from '../utils/id';
import { SAMPLE_NIGHTWIRE_POSTS } from '../data/reactions';
import type { IdentityProfile, NightwireComment } from '../types/identity';

interface UserPostProps {
  profile: IdentityProfile;
  comments: NightwireComment[];
}

export function NightwireUserPost({ profile, comments }: UserPostProps) {
  const handle = aliasToHandle(profile.alias);
  return (
    <GlassCard glow className="mx-auto max-w-md overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-4">
        <p className="font-display text-sm text-accent">{handle}</p>
        <p className="text-xs text-muted">JUST ENTERED LEONORA</p>
      </div>
      <img
        src={profile.image}
        alt={`${profile.alias}'s Nightwire post`}
        className="mt-3 aspect-square w-full object-cover"
      />
      <div className="space-y-3 px-5 py-4">
        <p className="text-sm text-paper/90">New face. Same city. Different rules.</p>
        <div className="flex items-center gap-5 text-sm text-muted">
          <span className="flex items-center gap-1.5">
            <Heart className="h-4 w-4 text-primary" aria-hidden="true" /> {profile.likes}
          </span>
          <span className="flex items-center gap-1.5">
            <MessageCircle className="h-4 w-4 text-accent" aria-hidden="true" /> {profile.comments}
          </span>
          <span className="flex items-center gap-1.5">
            <Eye className="h-4 w-4" aria-hidden="true" /> {profile.views.toLocaleString()}
          </span>
        </div>
        {comments.length > 0 && (
          <ul className="space-y-2 border-t border-white/10 pt-3">
            {comments.map((comment) => (
              <li key={comment.id} className="text-sm">
                <span className="text-accent">@{comment.author}</span>{' '}
                <span className="text-paper/80">{comment.text}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </GlassCard>
  );
}

export function SamplePostGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {SAMPLE_NIGHTWIRE_POSTS.map((post) => (
        <div
          key={post.id}
          className="group relative overflow-hidden rounded-xl border border-white/10 transition-colors hover:border-accent/50"
        >
          <img
            src={post.image}
            alt={`${post.alias}, a Nightwire post from ${post.district}`}
            className="aspect-[4/5] w-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/90 via-ink/10 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
            <p className="font-display text-xs text-accent">VIEW FILE</p>
          </div>
          <div className="absolute bottom-0 left-0 w-full p-3 opacity-100 transition-opacity group-hover:opacity-0">
            <p className="font-display text-xs text-paper">{post.handle}</p>
            <p className="text-[11px] text-muted">{post.caption}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
