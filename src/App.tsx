import { Route, Routes } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { LinkButton } from './components/Button';
import { GlassCard } from './components/GlassCard';
import { useIdentity } from './hooks/useIdentity';
import LandingPage from './pages/LandingPage';
import IdentitySetupPage from './pages/IdentitySetupPage';
import EditorPage from './pages/EditorPage';
import IdentityFilePage from './pages/IdentityFilePage';
import NightwirePage from './pages/NightwirePage';
import ProfilePage from './pages/ProfilePage';

function NotFoundPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6">
      <GlassCard className="p-8">
        <p className="font-display text-sm tracking-widest text-primary">SIGNAL LOST</p>
        <h1 className="mt-3 font-display text-2xl text-paper">
          There&rsquo;s no record at this address.
        </h1>
        <p className="mt-3 text-sm text-muted">
          Even Leonora has streets that lead nowhere.
        </p>
        <div className="mt-6">
          <LinkButton to="/">Back to the city</LinkButton>
        </div>
      </GlassCard>
    </div>
  );
}

export default function App() {
  const identity = useIdentity();

  return (
    <AppShell profile={identity.profile}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create" element={<IdentitySetupPage identity={identity} />} />
        <Route path="/edit" element={<EditorPage identity={identity} />} />
        <Route path="/file" element={<IdentityFilePage identity={identity} />} />
        <Route path="/nightwire" element={<NightwirePage identity={identity} />} />
        <Route path="/profile" element={<ProfilePage identity={identity} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppShell>
  );
}
