import React from 'react';

interface BriefcaseIconProps {
  size?: number;
  className?: string;
}

export const BriefcaseIcon: React.FC<BriefcaseIconProps> = ({ size = 24, className = "" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Handle */}
      <path
        d="M190 110V72C190 56.5 202.5 44 218 44H294C309.5 44 322 56.5 322 72V110"
        stroke="#E1E5E8"
        strokeWidth="28"
        strokeLinecap="round"
      />
      
      {/* Handle brackets */}
      <path d="M174 110C174 96 206 96 206 110Z" fill="#22303C" />
      <path d="M306 110C306 96 338 96 338 110Z" fill="#22303C" />

      {/* Main Body with rounded corners */}
      {/* Top Flap */}
      <path
        d="M36 240V142C36 124.3 50.3 110 68 110H444C461.7 110 476 124.3 476 142V240Z"
        fill="#3E5262"
      />
      
      {/* Bottom Body */}
      <path
        d="M36 240H476V438C476 455.7 461.7 470 444 470H68C50.3 470 36 455.7 36 438V240Z"
        fill="#2D3D4A"
      />

      {/* Flap edge line shadow */}
      <line x1="36" y1="240" x2="476" y2="240" stroke="#22303C" strokeWidth="6" />

      {/* Left Strap Upper */}
      <path d="M102 110H138V300H102V110Z" fill="#D98246" />
      {/* Left Strap Holes */}
      <circle cx="120" cy="180" r="7" fill="#54280F" />
      <circle cx="120" cy="215" r="7" fill="#54280F" />
      <circle cx="120" cy="250" r="7" fill="#54280F" />

      {/* Left Strap Tip (Hanging) */}
      <path
        d="M102 300H138V360C138 372 120 388 120 388C120 388 102 372 102 360V300Z"
        fill="#D98246"
      />

      {/* Left Buckle */}
      <rect x="90" y="295" width="60" height="30" rx="10" fill="#E1E5E8" />
      <rect x="102" y="303" width="36" height="14" rx="4" fill="#D98246" />

      {/* Right Strap Upper */}
      <path d="M374 110H410V300H374V110Z" fill="#D98246" />
      {/* Right Strap Holes */}
      <circle cx="392" cy="180" r="7" fill="#54280F" />
      <circle cx="392" cy="215" r="7" fill="#54280F" />
      <circle cx="392" cy="250" r="7" fill="#54280F" />

      {/* Right Strap Tip (Hanging) */}
      <path
        d="M374 300H410V360C410 372 392 388 392 388C392 388 374 372 374 360V300Z"
        fill="#D98246"
      />

      {/* Right Buckle */}
      <rect x="362" y="295" width="60" height="30" rx="10" fill="#E1E5E8" />
      <rect x="374" y="303" width="36" height="14" rx="4" fill="#D98246" />
    </svg>
  );
};
