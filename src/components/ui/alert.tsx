const tones = {
  error: 'border-accent/30 bg-accent-soft text-accent',
  success: 'border-brand-soft bg-brand-light text-brand-mid',
  info: 'border-line bg-canvas text-inkMuted',
};

export function Alert({
  tone = 'error',
  children,
}: {
  tone?: keyof typeof tones;
  children: React.ReactNode;
}) {
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={`border px-4 py-3 text-sm ${tones[tone]}`}>
      {children}
    </div>
  );
}
