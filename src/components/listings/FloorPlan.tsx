import React from 'react';

interface FloorPlanProps {
  bhk?: string;
  occupancy?: string;
}

export const FloorPlan: React.FC<FloorPlanProps> = ({ bhk, occupancy }) => {
  const n = Math.min(4, parseInt(bhk || occupancy || '1', 10) || 1);
  const w = 180 / n;

  return (
    <svg
      viewBox="0 0 200 146"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      aria-hidden="true"
      style={{
        width: '100%',
        maxWidth: '340px',
        maxHeight: '220px',
        display: 'block',
        margin: '0 auto',
      }}
    >
      <rect x="10" y="10" width="180" height="120" />
      <line x1="10" y1="80" x2="190" y2="80" />
      {Array.from({ length: n }).map((_, i) => {
        const X = 10 + i * w;
        return (
          <React.Fragment key={i}>
            {i > 0 && <line x1={X} y1="10" x2={X} y2="80" />}
            <rect x={X + 8} y="24" width={w - 16} height="26" strokeWidth="1.4" />
            <path d={`M${X + w - 14} 80 a12 12 0 0 1 -12 -12`} strokeWidth="1.2" />
            <text x={X + 8} y="19" fontSize="7" fill="currentColor" stroke="none" fontWeight="700">
              {(bhk ? 'Bed ' : 'Room ') + (i + 1)}
            </text>
          </React.Fragment>
        );
      })}
      <rect x="148" y="92" width="32" height="28" strokeWidth="1.4" />
      <circle cx="52" cy="106" r="12" strokeWidth="1.4" />
      <text x="14" y="92" fontSize="7" fill="currentColor" stroke="none" fontWeight="700">
        Hall
      </text>
      <text x="150" y="89" fontSize="7" fill="currentColor" stroke="none" fontWeight="700">
        Kitchen
      </text>
      <path d="M10 138h180M10 135v6M190 135v6" strokeWidth="1" />
      <text x="86" y="146" fontSize="7" fill="currentColor" stroke="none" fontWeight="700">
        9.0 m
      </text>
    </svg>
  );
};
