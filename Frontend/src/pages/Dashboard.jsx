import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { ArrowUpRight, ArrowDownRight, TrendingUp, DollarSign, Calendar, Tag, ShieldCheck, Info } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

/**
 * Dashboard Page displaying financial summary aggregates, category summaries, and recent activity using shadcn.
 */
const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/api/dashboard/summary');
        setData(response);
      } catch (err) {
        setError(err.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-850 border-t-indigo-500" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-500/20 bg-red-500/10 p-6 text-red-400">
        <div className="flex items-center gap-3">
          <Info className="h-6 w-6 shrink-0" />
          <div>
            <h4 className="font-bold text-lg">Error loading dashboard</h4>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      </Card>
    );
  }

  const { summary, categoryTotals: categoryTotalsRaw = {}, recentActivity = [] } = data || {};

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Convert categoryTotals object (e.g. {"Salary": 5000}) to array of objects
  const categoryTotals = Object.entries(categoryTotalsRaw).map(([category, total]) => ({
    category,
    total
  }));

  const maxCategoryTotal = categoryTotals.length > 0 
    ? Math.max(...categoryTotals.map(c => c.total)) 
    : 1;

  return (
    <div className="space-y-8 animate-fade-in text-slate-200">
      
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-black bg-gradient-to-r from-indigo-200 to-indigo-400 bg-clip-text text-transparent">
          Dashboard Overview
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Real-time updates of aggregates, transactions, and categories.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Income Card */}
        <Card className="relative border-slate-800 bg-slate-900/50 overflow-hidden hover:scale-[1.01] hover:border-slate-700 transition-all duration-200 shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-400">Total Income</span>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
                <ArrowUpRight className="h-5 w-5" />
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white mt-4">
              {formatCurrency(summary?.totalIncome || 0)}
            </h1>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
        </Card>

        {/* Expense Card */}
        <Card className="relative border-slate-800 bg-slate-900/50 overflow-hidden hover:scale-[1.01] hover:border-slate-700 transition-all duration-200 shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-400">Total Expenses</span>
              <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-[0_0_12px_rgba(244,63,94,0.15)]">
                <ArrowDownRight className="h-5 w-5" />
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white mt-4">
              {formatCurrency(summary?.totalExpense || 0)}
            </h1>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-pink-500" />
        </Card>

        {/* Net Balance Card */}
        <Card className="relative border-slate-800 bg-slate-900/50 overflow-hidden hover:scale-[1.01] hover:border-slate-700 transition-all duration-200 shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-400">Net Balance</span>
              <div className={`p-2.5 rounded-xl border shadow-md transition-all
                ${(summary?.netBalance >= 0) 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white mt-4">
              {formatCurrency(summary?.netBalance || 0)}
            </h1>
          </CardContent>
          <div className={`absolute bottom-0 left-0 right-0 h-1 
            ${(summary?.netBalance >= 0) 
              ? 'bg-gradient-to-r from-emerald-500 to-cyan-500' 
              : 'bg-gradient-to-r from-rose-500 to-amber-500'}`} 
          />
        </Card>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Left: Category Breakdown */}
        <Card className="lg:col-span-2 border-slate-800 bg-slate-900/40 p-6 space-y-6">
          <div>
            <CardTitle className="text-lg font-bold text-slate-100">Category Breakdown</CardTitle>
            <CardDescription className="text-slate-400 text-xs mt-1">
              Relative volume spent/earned per category.
            </CardDescription>
          </div>

          <div className="space-y-4.5">
            {categoryTotals.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-6">
                No category data available yet.
              </p>
            ) : (
              categoryTotals.map((cat) => {
                const percentage = Math.max(10, (cat.total / maxCategoryTotal) * 100);
                return (
                  <div key={cat.category} className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="flex items-center gap-2 text-slate-350">
                        <span className="h-2 w-2 rounded-full bg-indigo-500" />
                        {cat.category}
                      </span>
                      <span className="text-slate-200">
                        {formatCurrency(cat.total)}
                      </span>
                    </div>
                    {/* Progress Visual Bar */}
                    <div className="h-2 rounded-full bg-slate-850 overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        {/* Right: Recent Activity */}
        <Card className="lg:col-span-3 border-slate-800 bg-slate-900/40 p-6 space-y-6">
          <div>
            <CardTitle className="text-lg font-bold text-slate-100">Recent Activity</CardTitle>
            <CardDescription className="text-slate-400 text-xs mt-1">
              Latest transactions logged in the system.
            </CardDescription>
          </div>

          <div className="space-y-3">
            {recentActivity.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-6">
                No transactions recorded yet.
              </p>
            ) : (
              recentActivity.map((record) => (
                <div 
                  key={record._id} 
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-900/45 border border-slate-850 hover:bg-slate-800/20 hover:translate-x-1 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0
                      ${record.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                      {record.type === 'income' ? <ArrowUpRight className="h-4.5 w-4.5" /> : <ArrowDownRight className="h-4.5 w-4.5" />}
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-sm font-semibold text-slate-200 block max-w-[200px] sm:max-w-[320px] truncate">
                        {record.notes || `${record.category} Entry`}
                      </span>
                      
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(record.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {record.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="h-3 w-3" />
                          {record.createdBy?.name || 'Admin'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className={`text-base font-bold tracking-tight shrink-0
                    ${record.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {record.type === 'income' ? '+' : '-'}{formatCurrency(record.amount)}
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
