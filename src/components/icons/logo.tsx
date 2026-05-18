export function Logo({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="28" height="28" rx="7" fill="url(#gr-shield)" />
      <rect x="3" y="3" width="26" height="26" rx="6" stroke="white" strokeOpacity="0.1" strokeWidth="0.75" />

      <circle cx="10.5" cy="10" r="3" fill="url(#gr-node)" />
      <circle cx="21.5" cy="10" r="3" fill="url(#gr-node)" />
      <circle cx="16" cy="23" r="3.25" fill="#34d399" />

      <path
        d="M10.5 13v1.5a5 5 0 005 5h1a5 5 0 005-5V13"
        stroke="white"
        strokeOpacity="0.75"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line x1="16" y1="19.5" x2="16" y2="23" stroke="white" strokeOpacity="0.75" strokeWidth="2.5" strokeLinecap="round" />

      <circle cx="16" cy="23" r="1" fill="#065f46" />

      <defs>
        <linearGradient id="gr-shield" x1="16" y1="2" x2="16" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1c1c1c" />
          <stop offset="1" stopColor="#0a0a0a" />
        </linearGradient>
        <radialGradient id="gr-node" cx="0.4" cy="0.35" r="0.7">
          <stop stopColor="#6ee7b7" />
          <stop offset="1" stopColor="#34d399" />
        </radialGradient>
      </defs>
    </svg>
  )
}
