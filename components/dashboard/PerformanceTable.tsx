import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { getPerformanceTableData, updatePerformanceData } from '@/utils/api';
import { useAdmin } from '@/context/AdminContext';

// TypeScript interfaces
interface PerformanceCell {
    qoinn_value: string;
    voo_value: string;
}

interface YearMetricData {
    [metric: string]: PerformanceCell;
}

interface PerformanceData {
    [year: number]: YearMetricData;
}

interface EditedCell {
    qoinn_value?: string;
    voo_value?: string;
}

interface EditedYearMetricData {
    [metric: string]: EditedCell;
}

interface EditedPerformanceData {
    [year: number]: EditedYearMetricData;
}

const metrics = [
  { key: 'yearly_return', label: 'Yearly Return' },
  { key: 'sharpe_ratio', label: 'Sharpe Ratio' },
  { key: 'sortino_ratio', label: 'Sortino Ratio' },
  { key: 'mdd', label: 'Maximum Drawdown' },
  { key: 'volatility', label: 'Volatility' },
  { key: 'var', label: 'Value at Risk' },
  { key: 'win_rate_monthly', label: 'Win Rate (Monthly)' },
  { key: 'win_rate_quarterly', label: 'Win Rate (Quarterly)' },
  { key: 'correlation', label: 'Correlation' },
];

export default function PerformanceTable() {
  const { isAdmin } = useAdmin();
  const { user } = useUser();
  
  const [data, setData] = useState<PerformanceData>({});
  const [editedData, setEditedData] = useState<EditedPerformanceData>({});
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2020 + 1 }, (_, i) => 2020 + i).reverse();

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const res = await getPerformanceTableData();
        const grouped: Record<number, Record<string, { qoinn_value: string; voo_value: string }>> = {};
        
        res.data.forEach((item: { year: number; metric: string; qoinn_value: string; voo_value: string }) => {
          const { year, metric, qoinn_value, voo_value } = item;
          if (!grouped[year]) grouped[year] = {};
          grouped[year][metric] = { qoinn_value, voo_value };
        });
        
        setData(grouped);
      } catch (error) {
        console.error('Error loading performance data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleChange = (
    year: number,
    metric: string,
    field: keyof PerformanceCell,
    value: string
  ) => {
    const updated: EditedPerformanceData = { ...editedData };
    if (!updated[year]) updated[year] = {};
    if (!updated[year][metric]) updated[year][metric] = {};
    updated[year][metric][field] = value;
    setEditedData(updated);
  };

  const saveChanges = async () => {
    try {
      setSaving(true);
      const updates: {
        year: number;
        metric: string;
        qoinn_value: string;
        voo_value: string;
      }[] = [];
      
      Object.entries(editedData).forEach(([year, metrics]) => {
        Object.entries(metrics as { [key: string]: EditedCell }).forEach(([metric, values]) => {
          const originalData = data[parseInt(year)]?.[metric];
          updates.push({
            year: parseInt(year),
            metric,
            qoinn_value: values.qoinn_value || originalData?.qoinn_value || '0',
            voo_value: values.voo_value || originalData?.voo_value || '0',
          });
        });
      });
      
      await updatePerformanceData(updates);
      
      // Update local data with edited values
      const updatedData = { ...data };
      Object.entries(editedData).forEach(([year, metrics]) => {
        const yearNum = parseInt(year);
        if (!updatedData[yearNum]) updatedData[yearNum] = {};
        Object.entries(metrics as { [key: string]: EditedCell }).forEach(([metric, values]) => {
          if (!updatedData[yearNum][metric]) {
            updatedData[yearNum][metric] = { qoinn_value: '0', voo_value: '0' };
          }
          if (values.qoinn_value !== undefined) {
            updatedData[yearNum][metric].qoinn_value = values.qoinn_value;
          }
          if (values.voo_value !== undefined) {
            updatedData[yearNum][metric].voo_value = values.voo_value;
          }
        });
      });
      
      setData(updatedData);
      setEditedData({});
      
    } catch (error) {
      console.error('Error saving performance data:', error);
      alert('Error saving changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen p-6">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Performance Analytics
          </h1>
          <p className="text-gray-600 text-lg">Comprehensive investment performance comparison</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <div className="mt-4 text-center text-gray-600">Loading performance data...</div>
            </div>
          </div>
        )}

        {/* Table Container */}
        {!loading && (
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="flex">
              {/* Fixed Y-Axis */}
              <div className="flex-none bg-gradient-to-b from-slate-50 to-slate-100 border-r border-gray-200">
                {/* Header Cell */}
                <div className="h-20 border-b border-gray-200 flex items-center justify-center px-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="text-center">
                    <div className="text-sm font-semibold text-gray-600 mb-1">Performance</div>
                    <div className="text-xs text-gray-500">Metrics</div>
                  </div>
                </div>
                
                {/* Year Rows */}
                {years.map((year, index) => (
                  <div key={year} className="border-b border-gray-200 last:border-b-0">
                    <div 
                      className="h-24 flex items-center justify-between px-6 transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 group"
                      style={{
                        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                      }}
                    >
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                          {year}
                        </div>
                      </div>
                      <div className="ml-6 space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg"></div>
                          <span className="text-xs font-semibold text-blue-600 tracking-wide">QOINN</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg"></div>
                          <span className="text-xs font-semibold text-emerald-600 tracking-wide">VOO</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-x-auto">
                <div className="min-w-max">
                  {/* Header Row */}
                  <div className="h-20 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 flex">
                    {metrics.map((metric, index) => (
                      <div 
                        key={metric.key} 
                        className="w-40 px-4 flex items-center justify-center border-r border-gray-200 last:border-r-0"
                        style={{
                          animation: `slideInDown 0.6s ease-out ${index * 0.05}s both`
                        }}
                      >
                        <div className="text-center">
                          <div className="text-sm font-semibold text-gray-700 mb-1 leading-tight">
                            {metric.label}
                          </div>
                          <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-emerald-500 mx-auto rounded-full"></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Data Rows */}
                  {years.map((year, yearIndex) => (
                    <div key={year} className="flex border-b border-gray-200 last:border-b-0 hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-emerald-50/30 transition-all duration-300">
                      {metrics.map((metric, metricIndex) => {
                        const cell = data[year]?.[metric.key] || { qoinn_value: '0', voo_value: '0' };
                        const editedCell = editedData[year]?.[metric.key] || {};
                        const qoinnVal = editedCell.qoinn_value ?? cell.qoinn_value ?? '0';
                        const vooVal = editedCell.voo_value ?? cell.voo_value ?? '0';
                        
                        return (
                          <div 
                            key={`${year}-${metric.key}`} 
                            className="w-40 border-r border-gray-200 last:border-r-0"
                            style={{
                              animation: `fadeIn 0.8s ease-out ${(yearIndex * 0.1) + (metricIndex * 0.02)}s both`
                            }}
                          >
                            {/* QOINN Cell */}
                            <div 
                              className="h-12 px-3 flex items-center justify-center border-b border-gray-100 bg-gradient-to-r from-blue-50/50 to-blue-100/50 backdrop-blur-sm transition-all duration-300 hover:from-blue-100/70 hover:to-blue-200/70 group cursor-pointer"
                              onMouseEnter={() => setHoveredCell(`${year}-${metric.key}-qoinn`)}
                              onMouseLeave={() => setHoveredCell(null)}
                            >
                              {isAdmin ? (
                                <input
                                  type="text"
                                  value={qoinnVal}
                                  onChange={(e) => handleChange(year, metric.key, 'qoinn_value', e.target.value)}
                                  className="w-full text-center text-sm font-semibold text-blue-700 bg-transparent border-0 outline-0 focus:bg-white/50 rounded px-2 py-1 transition-all duration-300"
                                  placeholder="0"
                                />
                              ) : (
                                <span className={`text-sm font-semibold text-blue-700 transition-all duration-300 ${
                                  hoveredCell === `${year}-${metric.key}-qoinn` ? 'scale-110 text-blue-800' : ''
                                }`}>
                                  {qoinnVal}
                                </span>
                              )}
                            </div>
                            
                            {/* VOO Cell */}
                            <div 
                              className="h-12 px-3 flex items-center justify-center bg-gradient-to-r from-emerald-50/50 to-emerald-100/50 backdrop-blur-sm transition-all duration-300 hover:from-emerald-100/70 hover:to-emerald-200/70 group cursor-pointer"
                              onMouseEnter={() => setHoveredCell(`${year}-${metric.key}-voo`)}
                              onMouseLeave={() => setHoveredCell(null)}
                            >
                              {isAdmin ? (
                                <input
                                  type="text"
                                  value={vooVal}
                                  onChange={(e) => handleChange(year, metric.key, 'voo_value', e.target.value)}
                                  className="w-full text-center text-sm font-semibold text-emerald-700 bg-transparent border-0 outline-0 focus:bg-white/50 rounded px-2 py-1 transition-all duration-300"
                                  placeholder="0"
                                />
                              ) : (
                                <span className={`text-sm font-semibold text-emerald-700 transition-all duration-300 ${
                                  hoveredCell === `${year}-${metric.key}-voo` ? 'scale-110 text-emerald-800' : ''
                                }`}>
                                  {vooVal}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Save Button */}
            {isAdmin && Object.keys(editedData).length > 0 && (
              <div 
                className="p-6 bg-gradient-to-r from-slate-50 to-slate-100 border-t border-gray-200 flex justify-center"
                style={{ animation: 'fadeInUp 1s ease-out 0.5s both' }}
              >
                <button
                  onClick={saveChanges}
                  disabled={saving}
                  className="group relative px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {saving ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Save Changes
                      </>
                    )}
                  </span>
                  {!saving && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Legend */}
        {!loading && (
          <div className="mt-6 flex justify-center">
            <div className="bg-white/70 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 px-6 py-3">
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 shadow-sm"></div>
                  <span className="font-semibold text-blue-600">QOINN Portfolio</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-sm"></div>
                  <span className="font-semibold text-emerald-600">VOO Benchmark</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}