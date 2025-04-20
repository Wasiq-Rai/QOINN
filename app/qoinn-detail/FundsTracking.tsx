import { useState } from "react";
const IndexFundTracking = () => {
  // Data for the stocks
  const stocks = [
    { id: 1, name: "stock1", value: 1.6, trend: "up" },
    { id: 2, name: "stock2", value: 1.2, trend: "down" },
    { id: 3, name: "stock3", value: 0.8, trend: "up" },
    { id: 4, name: "stock4", value: 0.7, trend: "up" },
    { id: 5, name: "stock5", value: 0.3, trend: "down" },
    { id: 6, name: "stockN", value: 0.02, trend: "up" },
  ];

  const StockGraph = ({ trend }: { trend: string }) => {
    // SVG paths for up and down trends
    const upTrendPath = "M10,50 Q30,20 50,30 T90,10";
    const downTrendPath = "M10,10 Q30,50 50,30 T90,50";

    return (
      <div className="w-32 h-32 relative">
        {/* Axes */}
        <div className="absolute top-0 w-1 h-full bg-blue-700"></div>
        <div className="absolute left-0 bottom-0 w-full h-1 bg-blue-700"></div>
        {/* Arrow tops */}
        <div className="absolute -left-[6px] top-0 w-4 h-4 border-t-4 border-l-4 border-blue-700 transform rotate-45"></div>
        <div className="absolute right-0 -bottom-[6px] w-4 h-4 border-b-4 border-r-4 border-blue-700 transform -rotate-45"></div>

        {/* Graph line */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 60">
          <path
            d={trend === "up" ? upTrendPath : downTrendPath}
            stroke={trend === "up" ? "#22c55e" : "#dc2626"}
            strokeWidth="4"
            fill="none"
          />
        </svg>
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
        <h1 className="text-2xl font-bold">Index Fund Tracking</h1>
      </div>

      <p className="text-gray-600 mb-6">
        An index assigns weights to stocks based on factors like market
        capitalization, stock price, or equal weighting. Index funds then
        distribute investments proportionally to these weights, ensuring the
        fund's performance closely tracks the index. However, not all funds are
        in a good period with upward trends and momentum like the red ones down.
      </p>

      <div className="flex flex-wrap items-end justify-between gap-2">
        {stocks.map((stock, index) => (
          <div className="flex">
            <div key={stock.id} className="flex flex-col items-center">
              <StockGraph trend={stock.trend} />
              <div className="text-blue-700 font-medium mt-2">{stock.name}</div>
              <div className="text-blue-700 font-medium">
                Index: {stock.value}
              </div>
            </div>
            <div className="self-center pb-8">
              {/* Show ellipsis between stock5 and stockN */}
              {index === 4 && (
                <div className="text-blue-700 text-2xl font-bold ml-[3.5rem]">
                  ...
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IndexFundTracking;
