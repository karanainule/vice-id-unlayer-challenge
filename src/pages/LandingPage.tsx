import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { Button, LinkButton } from '../components/Button';
import { GlassCard } from '../components/GlassCard';
import { SamplePostGrid } from '../components/NightwireFeed';

export default function LandingPage() {
  const exploreRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const heroTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <div>
      <section className="relative flex min-h-[92vh] flex-col items-center justify-center overflow-hidden px-4 py-24 text-center sm:px-6">
        <AnimatedBackground />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={heroTransition}
          className="relative z-10 max-w-2xl"
        >
          <p className="mb-4 font-display text-xs tracking-[0.3em] text-accent">
            LEONORA IDENTITY TERMINAL
          </p>
          <h1 className="font-display text-6xl font-bold leading-[0.95] text-paper sm:text-7xl">
            VICE <span className="text-primary">ID</span>
          </h1>
          <p className="mt-6 text-lg text-paper/90 sm:text-xl">
            Everyone arrives with a story.
            <br />
            Build yours.
          </p>
          <p className="mt-2 text-sm text-muted">Your face. Your legend. Your file.</p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <LinkButton to="/create" size="lg">
              CREATE YOUR IDENTITY
            </LinkButton>
            <Button
              variant="outline"
              size="lg"
              onClick={() =>
                exploreRef.current?.scrollIntoView({
                  behavior: prefersReducedMotion ? 'auto' : 'smooth',
                })
              }
            >
              EXPLORE THE CITY
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </motion.div>

        <p className="relative z-10 mt-16 font-display text-xs tracking-widest text-muted">
          LEONORA // 04:17 AM // CONNECTION SECURE
        </p>
      </section>

      <section className="relative mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2">
          <GlassCard className="p-6">
            <p className="font-display text-xs tracking-widest text-accent">THE CITY</p>
            <h2 className="mt-2 font-display text-2xl text-paper">Leonora doesn&rsquo;t ask who you are.</h2>
            <p className="mt-3 text-sm text-muted">
              It&rsquo;s a coastal sprawl of neon signage, quiet harbors, and districts that keep
              their own rules. Nobody checks your papers here — they check your file.
            </p>
          </GlassCard>
          <GlassCard className="p-6">
            <p className="font-display text-xs tracking-widest text-accent">THE MECHANIC</p>
            <h2 className="mt-2 font-display text-2xl text-paper">Your identity is not chosen.</h2>
            <p className="mt-3 text-sm text-muted">
              It&rsquo;s edited. Crop it, light it, mark it up — every change becomes part of the
              record the city keeps on you.
            </p>
          </GlassCard>
        </div>
      </section>

      <section ref={exploreRef} className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="font-display text-xs tracking-widest text-primary">NIGHTWIRE</p>
            <h2 className="mt-1 font-display text-3xl text-paper">The city is watching.</h2>
          </div>
          <Link to="/nightwire" className="hidden text-sm text-accent hover:underline sm:block">
            View full feed
          </Link>
        </div>
        <SamplePostGrid />
        <div className="mt-8 text-center sm:hidden">
          <Link to="/nightwire" className="text-sm text-accent hover:underline">
            View full feed
          </Link>
        </div>
      </section>

      <section className="relative px-4 py-20 text-center sm:px-6">
        <h2 className="font-display text-2xl text-paper sm:text-3xl">Ready to be someone in Leonora?</h2>
        <div className="mt-6">
          <LinkButton to="/create" size="lg">
            CREATE YOUR IDENTITY
          </LinkButton>
        </div>
      </section>
    </div>
  );
}
