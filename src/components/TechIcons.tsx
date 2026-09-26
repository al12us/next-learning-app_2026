import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
}

// ── Next.js Logo SVG ──
export function NextjsIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 180 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <mask height="180" id="mask0_next" maskUnits="userSpaceOnUse" width="180" x="0" y="0" style={{ maskType: 'alpha' }}>
        <circle cx="90" cy="90" fill="black" r="90" />
      </mask>
      <g mask="url(#mask0_next)">
        <circle cx="90" cy="90" fill="black" r="90" />
        <path
          d="M149.508 157.438L69.1478 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.137 149.508 157.438Z"
          fill="url(#paint0_linear_next)"
        />
        <rect fill="url(#paint1_linear_next)" height="72" width="12" x="115" y="54" />
      </g>
      <defs>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="paint0_linear_next"
          x1="109"
          x2="144.5"
          y1="116.5"
          y2="160.5"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="paint1_linear_next"
          x1="121"
          x2="120.799"
          y1="54"
          y2="106.875"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ── React Logo SVG ──
export function ReactIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="-11.5 -10.23174 23 20.46348"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="0" cy="0" r="2.05" fill="#58C4DC" />
      <g stroke="#58C4DC" strokeWidth="1" fill="none">
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  );
}

// ── TypeScript Logo SVG ──
export function TypescriptIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="24" height="24" rx="4" fill="#3178C6" />
      <path
        fill="#FFFFFF"
        d="M10.02 7.43v11.79H7.66V7.43H3.64V5.16h10.4v2.27H10.02zm3.23 7.92c.63.84 1.47 1.47 2.52 1.89 1.05.42 2.19.63 3.42.63 1.68 0 2.98-.39 3.9-1.18.92-.79 1.38-1.8 1.38-3.03 0-.99-.29-1.8-.86-2.43-.57-.63-1.44-1.14-2.61-1.53l-1.62-.54c-.72-.22-1.26-.49-1.62-.81-.36-.32-.54-.75-.54-1.29 0-.72.3-1.29.89-1.71.59-.42 1.41-.63 2.46-.63.7 0 1.36.09 1.98.27.62.18 1.14.47 1.56.87l1.53-1.83c-.54-.56-1.24-.99-2.1-1.29-.86-.3-1.78-.45-2.76-.45-1.56 0-2.78.37-3.66 1.12-.88.75-1.32 1.7-1.32 2.85 0 .93.27 1.69.81 2.28.54.59 1.36 1.07 2.46 1.44l1.63.54c.72.24 1.26.53 1.62.87.36.34.54.81.54 1.41 0 .86-.35 1.53-1.04 2.01-.69.48-1.66.72-2.91.72-.92 0-1.77-.11-2.55-.33-.78-.22-1.39-.54-1.83-.96l-1.53 1.86z"
      />
    </svg>
  );
}

// ── REST API / Route Handlers Icon SVG ──
export function RestApiIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="2" y="4" width="20" height="16" rx="4" stroke="#10B981" strokeWidth="2" fill="rgba(16, 185, 129, 0.1)" />
      <path d="M7 10L10 12L7 14" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 14H17" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ── Node.js Logo SVG ──
export function NodejsIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M16 2.5L3.5 9.7V22.3L16 29.5L28.5 22.3V9.7L16 2.5Z"
        fill="#5FA04E"
      />
      <path
        d="M16 4.5L5.5 10.5V21.5L16 27.5L26.5 21.5V10.5L16 4.5Z"
        fill="#333333"
      />
      <path
        d="M16 10L21 13V19L16 22L11 19V13L16 10Z"
        fill="#5FA04E"
      />
    </svg>
  );
}

// ── CSS3 / Styling Icon SVG ──
export function CssIcon({ size = 24, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M4 2L2 20L12 23L22 20L20 2H4Z" fill="#264DE4" />
      <path d="M12 3.8V21.1L19.7 18.8L21.3 3.8H12Z" fill="#2965F1" />
      <path d="M12 8.3H7.5L7.8 11.2H12H16.4L16 15.5L12 16.6L8 15.5L7.8 13.5H5.8L6.2 17.5L12 19.1L17.8 17.5L18.4 8.3H12Z" fill="#FFFFFF" />
    </svg>
  );
}
