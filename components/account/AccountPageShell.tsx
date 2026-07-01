export default function AccountPageShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-x-hidden scrollbar-hide">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(122,12,12,0.07)_0%,_transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,_#faf8f9_0%,_#ffffff_45%,_#fafafa_100%)]" />
      <div className="relative mx-auto w-full max-w-xl px-4 py-8 sm:max-w-2xl sm:px-6 sm:py-12 lg:max-w-5xl lg:py-14">
        {children}
      </div>
    </div>
  );
}
