import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ExpenseGraphs = () => {
  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem('expenses');
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });
  
  const [graphType, setGraphType] = useState('bar');
  const [totalSpent, setTotalSpent] = useState(0);
  const [topCategory, setTopCategory] = useState({ name: '', amount: 0 });

  // Theme colors using CSS variables
  const lightThemeColors = ['#40E0D0', '#3CCCBD', '#38B8AB', '#34A499', '#309088'];
  const darkThemeColors = ['#ff6b6b', '#ff5252', '#ff3838', '#ff1f1f', '#ff0505'];

  useEffect(() => {
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    setTotalSpent(total);

    const categoryTotals = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {});

    const topCat = Object.entries(categoryTotals).reduce((a, b) => 
      b[1] > a[1] ? [b[0], b[1]] : a, 
      ['', 0]
    );
    
    setTopCategory({ name: topCat[0], amount: topCat[1] });
  }, [expenses]);

  const aggregatedData = expenses.reduce((acc, expense) => {
    const existingCategory = acc.find(item => item.category === expense.category);
    if (existingCategory) {
      existingCategory.amount += expense.amount;
    } else {
      acc.push({
        category: expense.category,
        amount: expense.amount
      });
    }
    return acc;
  }, []);

  const renderGraph = () => {
    switch (graphType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={aggregatedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis 
                dataKey="category" 
                tick={{ fill: 'var(--text-primary)' }}
              />
              <YAxis 
                tick={{ fill: 'var(--text-primary)' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card-background)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)'
                }}
                formatter={(value) => [`$${value}`, 'Amount']}
              />
              <Bar 
                dataKey="amount" 
                fill="var(--primary)"
              />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={aggregatedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis 
                dataKey="category" 
                tick={{ fill: 'var(--text-primary)' }}
              />
              <YAxis 
                tick={{ fill: 'var(--text-primary)' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card-background)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)'
                }}
                formatter={(value) => [`$${value}`, 'Amount']}
              />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="var(--primary)"
                strokeWidth={2} 
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={aggregatedData}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={150}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {aggregatedData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={`var(--primary)`}
                    opacity={1 - (index * 0.15)}
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => `$${value}`}
                contentStyle={{ 
                  backgroundColor: 'var(--card-background)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              />
              <Legend 
                formatter={(value) => (
                  <span style={{ color: 'var(--text-primary)' }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="p-6 space-y-6" style={{
      background: `var(--gradient-end))`,
      minHeight: '100vh'
    }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Total Spent Card */}
        <div style={{ backgroundColor: 'var(--card-background)' }} className="p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <h3 style={{ color: 'var(--text-primary)' }} className="text-sm font-medium">
              Total Spent
            </h3>
            <span style={{ color: 'var(--text-secondary)' }}>$</span>
          </div>
          <div className="mt-2">
            <p style={{ color: 'var(--text-primary)' }} className="text-2xl font-bold">
              ${totalSpent.toFixed(2)}
            </p>
            <p style={{ color: 'var(--text-secondary)' }} className="text-xs">
              +20.1% from last month
            </p>
          </div>
        </div>

        {/* Top Category Card */}
        <div style={{ backgroundColor: 'var(--card-background)' }} className="p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <h3 style={{ color: 'var(--text-primary)' }} className="text-sm font-medium">
              Top Category
            </h3>
          </div>
          <div className="mt-2">
            <p style={{ color: 'var(--text-primary)' }} className="text-2xl font-bold">
              {topCategory.name}
            </p>
            <p style={{ color: 'var(--text-secondary)' }} className="text-xs">
              ${topCategory.amount.toFixed(2)}
            </p>
          </div>
        </div>
      </div>


      {/* Main Chart Section */}
      <div style={{ backgroundColor: 'var(--card-background)' }} className="p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 style={{ color: 'var(--text-primary)' }} className="text-lg font-semibold">
            Expense Analysis
          </h2>
          <select 
            value={graphType}
            onChange={(e) => setGraphType(e.target.value)}
            style={{
              backgroundColor: 'var(--card-background)',
              color: 'var(--text-primary)',
              borderColor: 'var(--border-color)'
            }}
            className="px-4 py-2 rounded-md focus:outline-none focus:ring-2"
          >
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
            <option value="pie">Pie Chart</option>
          </select>
        </div>
        
        {expenses.length === 0 ? (
          <div style={{ color: 'var(--text-secondary)' }} className="flex h-96 items-center justify-center">
            No expenses to display
          </div>
        ) : (
          renderGraph()
        )}
      </div>
    </div>
  );
};

export default ExpenseGraphs;