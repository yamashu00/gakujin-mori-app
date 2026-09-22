export default function TriangleDiagram({ distance, angle, height }) {
  const W = 280;
  const H = 200;
  const pad = 36;
  const baseY = H - pad;
  const leftX = pad;
  const rightX = W - pad;

  return (
    <svg className="triangle-svg" viewBox={`0 0 ${W} ${H}`}>
      {/* 地面 */}
      <line x1={leftX} y1={baseY} x2={rightX} y2={baseY} stroke="#1f3d2e" strokeWidth="2" />
      {/* 高さの辺（対象物） */}
      <line x1={leftX} y1={pad - 6} x2={leftX} y2={baseY} stroke="#1f3d2e" strokeWidth="2" />
      {/* 斜辺（視線） */}
      <line x1={leftX} y1={pad - 6} x2={rightX} y2={baseY} stroke="#e8912d" strokeWidth="2.5" />

      {/* 対象物の点 */}
      <circle cx={leftX} cy={pad - 6} r="4" fill="#1f3d2e" />
      {/* 自分の点 */}
      <circle cx={rightX} cy={baseY} r="4" fill="#1f3d2e" />

      {/* 角度の弧（自分の位置） */}
      <path
        d={`M ${rightX - 26} ${baseY} A 26 26 0 0 0 ${rightX} ${baseY - 22}`}
        fill="none"
        stroke="#c76f1a"
        strokeWidth="1.5"
      />

      <text x={leftX - 6} y={pad - 12} fontSize="11" fill="#1f3d2e" textAnchor="end">
        対象物の頂点
      </text>
      <text x={leftX + 6} y={(pad + baseY) / 2} fontSize="11" fill="#1f3d2e">
        高さ {height != null ? `${height.toFixed(1)}m` : '？'}
      </text>
      <text x={(leftX + rightX) / 2} y={baseY + 18} fontSize="11" fill="#1f3d2e" textAnchor="middle">
        距離 {distance}m
      </text>
      <text x={rightX - 32} y={baseY - 8} fontSize="11" fill="#c76f1a" textAnchor="end">
        θ={angle}°
      </text>
      <text x={rightX + 4} y={baseY + 14} fontSize="11" fill="#1f3d2e">
        自分
      </text>
    </svg>
  );
}
