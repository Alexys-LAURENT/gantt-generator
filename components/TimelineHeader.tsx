type TimelineHeaderProps = {
  years: Array<{ year: number; monthCount: number }>;
  quarters: Array<{ year: number; quarter: number; monthCount: number }>;
  months: Date[];
  monthNames: readonly string[];
  totalMonths: number;
};

const YEAR_COLORS = [
  "bg-red-300",
  "bg-indigo-400",
  "bg-purple-400",
  "bg-pink-300",
];
const QUARTER_COLORS = [
  "bg-red-200",
  "bg-indigo-300",
  "bg-purple-300",
  "bg-pink-200",
];
const MONTH_COLORS = ["bg-gray-400", "bg-gray-500"];

export default function TimelineHeader({
  years,
  quarters,
  months,
  monthNames,
  totalMonths,
}: TimelineHeaderProps) {
  return (
    <div className="mb-4 relative" style={{ zIndex: 2 }}>
      {/* Ligne des années */}
      <div className="flex border-b-2 border-gray-300">
        <div className="w-48 shrink-0"></div>
        <div className="flex-1 flex">
          {years.map((yearInfo, index) => (
            <div
              key={`year-${yearInfo.year}`}
              className={`${YEAR_COLORS[index % YEAR_COLORS.length]} text-center py-3 px-2 font-bold text-gray-700 border-r border-white`}
              style={{ width: `${(yearInfo.monthCount / totalMonths) * 100}%` }}
            >
              {yearInfo.year}
            </div>
          ))}
        </div>
      </div>

      {/* Ligne des trimestres */}
      <div className="flex border-b-2 border-gray-300">
        <div className="w-48 shrink-0"></div>
        <div className="flex-1 flex">
          {quarters.map((quarterInfo, index) => (
            <div
              key={`quarter-${quarterInfo.year}-${quarterInfo.quarter}`}
              className={`${QUARTER_COLORS[index % QUARTER_COLORS.length]} text-center py-2 px-2 font-semibold text-gray-700 border-r border-white`}
              style={{
                width: `${(quarterInfo.monthCount / totalMonths) * 100}%`,
              }}
            >
              Q{quarterInfo.quarter}
            </div>
          ))}
        </div>
      </div>

      {/* Ligne des mois */}
      <div className="flex border-b-2 border-gray-300">
        <div className="w-48 shrink-0"></div>
        <div className="flex-1 flex">
          {months.map((month, index) => (
            <div
              key={`month-${index}`}
              className={`${MONTH_COLORS[index % MONTH_COLORS.length]} text-center py-2 px-1 text-sm font-medium text-white border-r border-white`}
              style={{ width: `${100 / totalMonths}%` }}
            >
              {monthNames[month.getMonth()]}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
