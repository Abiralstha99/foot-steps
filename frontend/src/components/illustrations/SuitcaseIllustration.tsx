export function SuitcaseIllustration({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Small plane above suitcase */}
      <g transform="translate(44, 8) rotate(-30)">
        <path
          d="M0 4 L12 0 L10 4 L12 8 Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M4 4 L8 1 L8 7 Z"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
        />
      </g>

      {/* Suitcase body */}
      <rect
        x="14"
        y="30"
        width="52"
        height="38"
        rx="5"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />

      {/* Suitcase handle */}
      <path
        d="M30 30 L30 22 Q30 18 34 18 L46 18 Q50 18 50 22 L50 30"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Center divider line */}
      <line
        x1="40"
        y1="30"
        x2="40"
        y2="68"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="3 3"
      />

      {/* Wheels */}
      <circle cx="24" cy="70" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="56" cy="70" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />

      {/* Strap buckle */}
      <rect
        x="35"
        y="45"
        width="10"
        height="6"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  )
}
