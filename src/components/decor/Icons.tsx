export function IconHand(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="none" {...props}>
      <path
        d="M14 27V13a3 3 0 0 1 6 0v9M20 22v-6a3 3 0 0 1 6 0v6M26 22v-4a3 3 0 0 1 6 0v9M32 27v-3a3 3 0 0 1 6 0v10c0 6.6-5.4 12-12 12h-4c-5 0-7.6-2-10-6l-4.8-8.2a2.6 2.6 0 0 1 4.2-3l3.6 4.7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M15 12.5c1.5-1.8 3.6-1.8 5 0M21 15c1.4-1.7 3.6-1.7 5 0M27 15.5c1.4-1.7 3.6-1.7 5 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

export function IconFoot(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="none" {...props}>
      <path
        d="M20 8c-3 0-4.5 3-4 6.5.5 3.5 2 5 2 9 0 5-4.5 6-4.5 12.5 0 4 3.5 6 8 6 7 0 12-3.5 12-11 0-6-2-8-2-14 0-4-1-9-5-9-2.5 0-4 1.5-4 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16.5" cy="10.5" r="1.6" fill="currentColor" />
      <circle cx="14" cy="14.5" r="1.6" fill="currentColor" />
      <circle cx="13" cy="19" r="1.6" fill="currentColor" />
      <circle cx="13.5" cy="23.5" r="1.6" fill="currentColor" />
      <circle cx="15" cy="27.5" r="1.6" fill="currentColor" />
    </svg>
  );
}

export function IconSparkleGlyph(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="none" {...props}>
      <path
        d="M24 8c1 6.5 3 9.5 9.5 10.5C27 19.5 25 22.5 24 29c-1-6.5-3-9.5-9.5-10.5C21 17.5 23 14.5 24 8Z"
        fill="currentColor"
      />
      <path
        d="M35 27c.6 3.6 1.7 5.2 5.3 5.8-3.6.6-4.7 2.2-5.3 5.8-.6-3.6-1.7-5.2-5.3-5.8 3.6-.6 4.7-2.2 5.3-5.8Z"
        fill="currentColor"
        opacity="0.7"
      />
      <path
        d="M11 26c.5 2.8 1.3 4 4.2 4.6-2.9.5-3.7 1.7-4.2 4.6-.5-2.9-1.3-4-4.2-4.6 2.9-.5 3.7-1.8 4.2-4.6Z"
        fill="currentColor"
        opacity="0.5"
      />
    </svg>
  );
}

export function IconCombo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="none" {...props}>
      <circle cx="18" cy="18" r="10" stroke="currentColor" strokeWidth="2" />
      <circle cx="28" cy="28" r="10" stroke="currentColor" strokeWidth="2" opacity="0.6" />
    </svg>
  );
}

export function IconExtra(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="none" {...props}>
      <path d="M24 6v10M24 32v10M6 24h10M32 24h10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="24" cy="24" r="6" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function FlowerDecor(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" fill="none" {...props}>
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <ellipse
          key={deg}
          cx="50"
          cy="32"
          rx="10"
          ry="18"
          fill="currentColor"
          opacity="0.85"
          transform={`rotate(${deg} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="8" fill="currentColor" opacity="0.95" />
    </svg>
  );
}

export function PolishBottleDecor(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 60 100" fill="none" {...props}>
      <rect x="20" y="8" width="20" height="16" rx="3" fill="currentColor" opacity="0.9" />
      <rect x="24" y="2" width="12" height="8" rx="2" fill="currentColor" />
      <path
        d="M18 24h24l4 12c2 6 3 10 3 18 0 20-11 34-24 34S1 80 1 60c0-8 1-12 3-18l4-12z"
        fill="currentColor"
        opacity="0.55"
      />
      <path d="M10 56c4-4 10-6 20-6s16 2 20 6" stroke="white" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
    </svg>
  );
}

export function WaveDivider(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none" {...props}>
      <path
        d="M0 32c120 24 240 24 360 8s240-32 360-24 240 40 360 32 240-32 360-16v48H0Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function IconInstagram(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function Monogram(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 40 40" {...props}>
      <circle cx="20" cy="20" r="19" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
      <text
        x="20"
        y="26"
        textAnchor="middle"
        fontFamily="Playfair Display, serif"
        fontSize="16"
        fill="currentColor"
      >
        RL
      </text>
    </svg>
  );
}
