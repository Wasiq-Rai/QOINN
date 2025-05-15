// components/EquityDonutChart.tsx
'use client'
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { getEquityStocks } from '@/utils/api';

// Dynamic import for better performance
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface Stock {
  name: string;
  symbol: string;
  equity: number;
}

interface EquityStocks {
  statement_id: number;
  equity_percentage: string;
  stocks: Stock[];
}

const EquityDonutChart = () => {
  const [chartData, setChartData] = useState<{
    series: number[];
    labels: string[];
    stocks: Stock[];
  } | null>(null);

  // Get colors from Tailwind palette
  const colors = [
    '#3B82F6', // blue-500
    '#10B981', // emerald-500
    '#F59E0B', // amber-500
    '#EF4444', // red-500
    '#8B5CF6', // purple-500
    '#06B6D4', // cyan-500
    '#F97316', // orange-500
    '#EC4899', // pink-500
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getEquityStocks();
        const data: EquityStocks =  response.data;
        
        const totalEquity = data.stocks.reduce((sum, stock) => sum + stock.equity, 0);
        const series = data.stocks.map(stock => (stock.equity / totalEquity) * 100);
        const labels = data.stocks.map(stock => stock.symbol);

        setChartData({
          series,
          labels,
          stocks: data.stocks
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (!chartData) return <div className="text-center py-8">Loading chart...</div>;

  const chartOptions: ApexOptions = {
    chart: {
      type: 'donut',
      toolbar: { show: true },
      animations: { enabled: true },
    },
    series: chartData.series,
    labels: chartData.labels,
    colors: colors,
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(1)}%`,
      style: {
        fontSize: '14px',
        colors: ['#1E293B'], // slate-800
      },
      dropShadow: {
        enabled: false // This disables the shadow effect
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '60%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Equity',
              formatter: () => `${chartData.series.reduce((a, b) => a + b, 0).toFixed(1)}%`
            }
          }
        }
      }
    },
    tooltip: {
      y: {
        formatter: (value: number, { seriesIndex }) => {
          const stock = chartData.stocks[seriesIndex];
          return `${stock.name}\n$${stock.equity.toLocaleString()}\n${value.toFixed(2)}%`;
        }
      }
    },
    responsive: [{
      breakpoint: 640,
      options: {
        chart: { width: '100%' },
        legend: { position: 'bottom' }
      }
    }]
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Equity Distribution
        </h2>
      </div>
      
      <Chart
        options={chartOptions}
        series={chartData.series}
        type="donut"
        width="100%"
        height="400px"
      />

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {chartData.stocks.map((stock, index) => (
          <div 
            key={stock.symbol}
            className="flex items-center p-2 bg-gray-50 rounded-lg"
          >
            <div 
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <div>
              <p className="text-sm font-medium">{stock.symbol}</p>
              <p className="text-xs text-gray-500">{stock.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EquityDonutChart;