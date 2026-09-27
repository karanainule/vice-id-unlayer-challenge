export function LoadingScreen({ message = 'Connecting to Leonora…' }: { message?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[50vh] w-full flex-col items-center justify-center gap-4 text-muted"
    >
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-accent" />
      <p className="font-display text-sm tracking-widest">{message}</p>
    </div>
  );
}
