export function KeystoneMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <span className={`relative grid place-items-center rounded-[7px] border border-primary/25 bg-[linear-gradient(145deg,color-mix(in_oklab,var(--primary)_18%,transparent),transparent)] ${className}`}>
      <svg viewBox="0 0 24 24" fill="none" className="h-[58%] w-[58%]" aria-hidden>
        <path d="M6 20V4l6 4 6-4v16" stroke="currentColor" className="text-primary" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M12 8v12" stroke="currentColor" className="text-primary/45" strokeWidth="1.6" />
      </svg>
    </span>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`text-[13px] font-semibold tracking-[0.22em] ${className}`}>
      KEY<span className="text-muted-foreground">STONE</span>
    </span>
  );
}
