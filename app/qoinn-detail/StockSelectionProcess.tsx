'use client'
import { useTheme } from '@/context/ThemeContext';

const StockSelectionProcess = () => {
  const { theme } = useTheme();
  // SVG paths for trend lines
  const upTrendPath = "M10,50 Q30,20 50,30 T90,10";
  const downTrendPath = "M10,10 Q30,50 50,30 T90,50";

  // Stock data for all three rows
  const topRowStocks = [
    { id: 1, name: "stock1", value: 1.6, trend: "up", selected: true },
    { id: 2, name: "stock2", value: 1.2, trend: "down", selected: false },
    { id: 3, name: "stock3", value: 0.8, trend: "up", selected: true },
    { id: 4, name: "stock4", value: 0.7, trend: "up", selected: true },
    { id: 5, name: "stock5", value: 0.3, trend: "down", selected: false },
    { id: 6, name: "stockN", value: 0.02, trend: "up", selected: true },
  ];

  const middleRowStocks = [
    { id: 1, name: "stock1", value: 1.6, trend: "up", selected: false },
    { id: 2, name: "stock3", value: 0.8, trend: "up", selected: false },
    { id: 3, name: "stock4", value: 0.7, trend: "up", selected: false },
    { id: 4, name: "stock8", value: 0.2, trend: "up", selected: false },
    { id: 5, name: "stock11", value: 0.19, trend: "up", selected: false },
    { id: 6, name: "stockM", value: 0.04, trend: "up", selected: false },
  ];

  const bottomRowStocks = [
    { id: 1, name: "stock1", value: 1.6, trend: "up", selected: false },
    { id: 2, name: "stock3", value: 0.8, trend: "up", selected: false },
    { id: 3, name: "stock8", value: 0.2, trend: "up", selected: false },
    { id: 4, name: "stock11", value: 0.19, trend: "up", selected: false },
    { id: 5, name: "stockM", value: 0.04, trend: "up", selected: false },
  ];

  // Component for rendering individual stock charts
  const StockGraph = ({ trend = "", selected = false }) => {
    return (
      <div className="w-32 h-32 relative">
        {/* Selection border for selected stocks */}
        {selected && (
          <div className="absolute inset-0 border-4 border-red-400 -m-3"></div>
        )}

        {/* Axes */}
        <div className="absolute top-0 left-0 w-1 h-full bg-blue-700"></div>
        <div className="absolute left-0 bottom-0 w-full h-1 bg-blue-700"></div>

        {/* Arrow tops */}
        <div className="absolute -left-[6px] top-0 w-4 h-4 border-t-[3px] border-l-4 border-blue-700 transform rotate-45"></div>
        <div className="absolute right-0 -bottom-[6px] w-4 h-4 border-b-[3px] border-r-4 border-blue-700 transform -rotate-45"></div>

        {/* Graph line */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 60">
          <path
            d={trend === "up" ? upTrendPath : downTrendPath}
            stroke={trend === "up" ? "#22c55e" : "#dc2626"}
            strokeWidth="3"
            fill="none"
          />
        </svg>
      </div>
    );
  };

  const ReplacementSection = () => {
    return (
      <div className="relative h-64 w-full">
        {/* Diagonal arrow pointing up-right to stock6 */}
        <svg
          className="absolute left-[30%] -top-10 w-36 h-48"
          viewBox="0 0 100 120"
        >
          <defs>
            <marker
              id="arrowhead2"
              markerWidth="10"
              markerHeight="7"
              refX="7"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#1e3a8a" />
            </marker>
          </defs>
          <path
            d="M40,90 L60,20"
            stroke="#1e3a8a"
            strokeWidth="4"
            fill="none"
            markerEnd="url(#arrowhead2)"
          />
        </svg>

        {/* Diagonal arrow pointing down-right to stock4 */}
        <svg
          className="absolute left-[35%] -top-10 w-36 h-48"
          viewBox="0 0 100 120"
        >
          <defs>
            <marker
              id="arrowhead3"
              markerWidth="10"
              markerHeight="7"
              refX="7"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#1e3a8a" />
            </marker>
          </defs>
          <path
            d="M40,20 L60,90"
            stroke="#1e3a8a"
            strokeWidth="4"
            fill="none"
            markerEnd="url(#arrowhead3)"
          />
        </svg>

        {/* Stock6 with tilted chart and label */}
        <div className="absolute left-[28%] bottom-0 flex flex-col items-center">
          <div className="w-32 h-32 relative transform -rotate-12">
            {/* Axes */}
            <div className="absolute top-0 left-0 w-0.5 h-full bg-blue-700"></div>
            <div className="absolute left-0 bottom-0 w-full h-0.5 bg-blue-700"></div>

            {/* Arrow tops */}
            <div className="absolute -left-[6px] top-0 w-3 h-3 border-t-[3px] border-l-[3px] border-blue-700 transform rotate-45"></div>
            <div className="absolute right-0 -bottom-[6px] w-3 h-3 border-b-[3px] border-r-[3px] border-blue-700 transform -rotate-45"></div>

            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 100 60"
            >
              <path
                d="M10,50 Q30,20 50,30 T90,10"
                stroke="#22c55e"
                strokeWidth="3"
                fill="none"
              />
            </svg>
          </div>
          <div className="text-blue-700 font-medium -rotate-12">stock6</div>
        </div>

        {/* Stock4 with tilted chart and label */}
        <div className="absolute left-[42%] bottom-0 flex flex-col items-center">
          <div className="w-32 h-32 relative transform rotate-12">
            {/* Axes */}
            <div className="absolute top-0 left-0 w-0.5 h-full bg-blue-700"></div>
            <div className="absolute left-0 bottom-0 w-full h-0.5 bg-blue-700"></div>

            {/* Arrow tops */}
            <div className="absolute -left-[6px] top-0 w-3 h-3 border-t-[3px] border-l-[3px] border-blue-700 transform rotate-45"></div>
            <div className="absolute right-0 -bottom-[6px] w-3 h-3 border-b-[3px] border-r-[3px] border-blue-700 transform -rotate-45"></div>

            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 100 60"
            >
              <path
                d="M10,10 Q30,50 50,30 T90,50"
                stroke="#dc2626"
                strokeWidth="3"
                fill="none"
              />
            </svg>
          </div>
          <div className="text-blue-700 font-medium rotate-12">stock4</div>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-blue-900 rounded-md flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold">{theme.strings.stockSelectionProcess}</h1>
      </div>
      <p className="text-gray-600 mb-6">
        {theme.strings.stockSeectionProcessDescription}
      </p>

      {/* First row of stocks with "Selected" labels */}
      <div className="mb-10">
        <div className="flex justify-between mb-1">
          {topRowStocks.map((stock, index) => (
            <div
              key={`top-${stock.id}`}
              className="flex flex-col items-center justify-center"
            >
              {stock.selected && (
                <div className="text-red-400 font-medium mb-2">Selected</div>
              )}
              {!stock.selected && <div className="mb-6"></div>}
              {index === 4 && index < topRowStocks.length - 1 && (
                <div className="text-blue-700 text-2xl mx-6">{` `}</div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          {topRowStocks.map((stock, index) => (
            <div className="flex">
              <div
                key={`top-graph-${stock.id}`}
                className="flex flex-col items-center"
              >
                <StockGraph trend={stock.trend} selected={stock.selected} />
                <div className="text-blue-700 font-medium mt-1">
                  {stock.name}
                </div>
                <div className="text-blue-700 font-medium">
                  Index: {stock.value}
                </div>
              </div>
              <div className="self-center pb-8">
                {index === 4 && index < topRowStocks.length - 1 && (
                  <div className="text-blue-700 text-2xl ml-[3.5rem]">...</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Middle row of stocks - all uptrend */}
      <div className="mb-8">
        <div className="flex justify-between">
          {middleRowStocks.map((stock, index) => (
            <div
              key={`middle-${stock.id}`}
              className="flex flex-col items-center"
            >
              <StockGraph trend={stock.trend} />
              <div className="text-blue-700 font-medium mt-1">{stock.name}</div>
              <div className="text-blue-700 font-medium">
                Index: {stock.value}
              </div>
              {index === 4 && index < middleRowStocks.length - 1 && (
                <div className="text-blue-700 text-2xl mx-6">...</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Explanation text in the middle */}
      <p className="text-blue-700 mb-8 text-lg">
        {theme.strings.stockSelectionProcess2}
      </p>

      {/* Bottom row with replacement arrows */}
      <div className="mb-16">
        <div className="flex justify-between">
          {bottomRowStocks.map((stock, index) => (
            <div
              key={`bottom-${stock.id}`}
              className="flex flex-col items-center"
            >
              <StockGraph trend={stock.trend} />
              <div className="text-blue-700 font-medium mt-1">{stock.name}</div>
              <div className="text-blue-700 font-medium">
                Index: {stock.value}
              </div>
              {index === 3 && index < bottomRowStocks.length - 1 && (
                <div className="text-blue-700 text-2xl mx-6">...</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Replacement arrows and additional stock charts */}
      <div className="relative -mt-40">
        <ReplacementSection />
      </div>
    </div>
  );
};

export default StockSelectionProcess;
