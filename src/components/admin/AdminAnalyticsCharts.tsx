import React, { useState } from 'react';

interface DauItem {
  day: string;
  dau: number;
  total: number;
}

interface ToolUsageItem {
  tool: string;
  usage: number;
  fill: string;
}

interface UserStatusItem {
  name: string;
  value: number;
  color: string;
}

export const DauAreaChart: React.FC<{ data: DauItem[] }> = ({ data }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const maxVal = Math.max(...data.map(d => d.dau), 10);
  const minVal = 0;
  const height = 200;
  const width = 500;
  const paddingX = 40;
  const paddingY = 25;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * chartWidth;
    const y = height - paddingY - ((d.dau - minVal) / (maxVal - minVal)) * chartHeight;
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = points[i - 1];
    const cp1x = prev.x + (p.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (p.x - prev.x) / 2;
    const cp2y = p.y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  return (
    <div className="relative w-full h-full flex flex-col justify-between select-none">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48 overflow-visible">
        <defs>
          <linearGradient id="dauGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {[0, 0.33, 0.66, 1].map((ratio, idx) => {
          const y = paddingY + ratio * chartHeight;
          const val = Math.round(maxVal - ratio * (maxVal - minVal));
          return (
            <g key={idx}>
              <line
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="currentColor"
                className="text-gray-200 dark:text-gray-700/60"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={paddingX - 8}
                y={y + 3}
                textAnchor="end"
                className="text-[10px] fill-gray-400 font-medium"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaD} fill="url(#dauGradient)" />

        {/* Stroke path */}
        <path
          d={pathD}
          fill="none"
          stroke="#10B981"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Interactive Points */}
        {points.map((p, idx) => (
          <g key={idx} className="cursor-pointer" onMouseEnter={() => setHoveredIdx(idx)} onMouseLeave={() => setHoveredIdx(null)}>
            <circle
              cx={p.x}
              cy={p.y}
              r={hoveredIdx === idx ? 6 : 4}
              className="fill-emerald-500 stroke-white dark:stroke-gray-900 transition-all"
              strokeWidth="2.5"
            />
            <text
              x={p.x}
              y={height - 6}
              textAnchor="middle"
              className={`text-[11px] font-semibold transition-colors ${
                hoveredIdx === idx ? 'fill-emerald-500 font-bold' : 'fill-gray-400'
              }`}
            >
              {p.day}
            </text>
          </g>
        ))}
      </svg>

      {/* Dynamic Hover Tooltip */}
      {hoveredIdx !== null && (
        <div 
          className="absolute top-2 right-4 bg-gray-900 text-white dark:bg-gray-750 text-xs px-3 py-1.5 rounded-xl shadow-lg border border-gray-700 pointer-events-none flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span><strong>{data[hoveredIdx].day}</strong> : {data[hoveredIdx].dau} utilisateurs actifs</span>
        </div>
      )}
    </div>
  );
};

export const ToolUsageBarChart: React.FC<{ data: ToolUsageItem[] }> = ({ data }) => {
  const maxUsage = Math.max(...data.map(d => d.usage), 100);

  return (
    <div className="space-y-3 pt-2">
      {data.map((item, idx) => {
        const percentage = Math.round((item.usage / maxUsage) * 100);
        return (
          <div key={idx} className="group">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-md shrink-0" style={{ backgroundColor: item.fill }} />
                {item.tool}
              </span>
              <span className="font-bold text-gray-900 dark:text-white">{item.usage}%</span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-700/60 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${percentage}%`, backgroundColor: item.fill }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const UserDistributionDonut: React.FC<{ data: UserStatusItem[] }> = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const radius = 65;
  const strokeWidth = 22;
  const circumference = 2 * Math.PI * radius;

  let currentOffset = 0;
  const segments = data.map((item, idx) => {
    const fraction = item.value / total;
    const strokeDasharray = `${fraction * circumference} ${circumference}`;
    const strokeDashoffset = -currentOffset;
    currentOffset += fraction * circumference;
    return {
      ...item,
      fraction,
      strokeDasharray,
      strokeDashoffset,
      idx
    };
  });

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="relative w-44 h-44 flex items-center justify-center">
        <svg viewBox="0 0 180 180" className="w-full h-full transform -rotate-90">
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            className="text-gray-100 dark:text-gray-800"
            strokeWidth={strokeWidth}
          />
          {segments.map((seg) => (
            <circle
              key={seg.idx}
              cx="90"
              cy="90"
              r={radius}
              fill="transparent"
              stroke={seg.color}
              strokeWidth={hoveredIdx === seg.idx ? strokeWidth + 4 : strokeWidth}
              strokeDasharray={seg.strokeDasharray}
              strokeDashoffset={seg.strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-300 cursor-pointer"
              onMouseEnter={() => setHoveredIdx(seg.idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            />
          ))}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-black text-gray-900 dark:text-white">
            {hoveredIdx !== null ? data[hoveredIdx].value : total}
          </span>
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
            {hoveredIdx !== null ? data[hoveredIdx].name : 'Total'}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3 text-xs font-semibold pt-4 border-t border-gray-100 dark:border-gray-700/60 w-full mt-2">
        {data.map((item, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors cursor-pointer ${
              hoveredIdx === idx ? 'bg-gray-100 dark:bg-gray-750 font-bold' : ''
            }`}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <span className="text-gray-700 dark:text-gray-300">
              {item.name}: <strong>{item.value}</strong> ({Math.round((item.value / total) * 100)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
