export default function LegendLine({ dashed, color }: { dashed?: boolean; color: string }) {
  return (
    <svg width="24" height="12" style={{ flexShrink: 0 }}>
      <line
        x1="0" y1="6" x2="24" y2="6"
        stroke={color}
        strokeWidth={dashed ? 1.8 : 2.2}
        strokeDasharray={dashed ? "5 3" : undefined}
        strokeLinecap="round"
      />
    </svg>
  );
}