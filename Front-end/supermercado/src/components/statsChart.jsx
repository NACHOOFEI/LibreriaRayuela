import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LabelList,
} from "recharts";

/**
 * StatsChart
 * props:
 *  - data: Array<{ label: string, value: number }>
 *  - type?: 'bar' | 'pie' (default: 'bar')
 *  - height?: number (default: 280)
 */
export default function StatsChart({ data = [], type = "bar", height = 280 }) {
  const palette = useMemo(
    () => [
      "#6366F1", // indigo-500
      "#8B5CF6", // violet-500
      "#06B6D4", // cyan-500
      "#10B981", // emerald-500
      "#F59E0B", // amber-500
      "#EF4444", // red-500
      "#14B8A6", // teal-500
      "#3B82F6", // blue-500
    ],
    []
  );

  if (!Array.isArray(data) || data.length === 0) return null;

  const formatted = data.map((d, i) => ({
    name: d.label,
    value: Number(d.value) || 0,
    color: palette[i % palette.length],
  }));

  return (
    <div className="w-full bg-white rounded-2xl shadow p-4 md:p-6">
      <div style={{ height }} className="h-[220px] md:h-full">
        <ResponsiveContainer width="100%" height="100%">
          {type === "pie" ? (
            <PieChart>
              <Tooltip formatter={(v) => [v, "Cantidad"]} />
              <Legend verticalAlign="bottom" height={24} />
              <Pie
                data={formatted}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={88}
                paddingAngle={4}
                cornerRadius={6}
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${Math.round(percent * 100)}%`
                }
              >
                {formatted.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          ) : (
            <BarChart
              data={formatted}
              margin={{ top: 10, right: 16, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-10}
                height={45}
                dy={10}
              />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip formatter={(v) => [v, "Cantidad"]} />
              <Legend />
              <Bar dataKey="value" name="Cantidad" radius={[8, 8, 0, 0]}>
                {formatted.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={entry.color} />
                ))}
                <LabelList
                  dataKey="value"
                  position="top"
                  className="fill-gray-700 text-[11px]"
                />
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
