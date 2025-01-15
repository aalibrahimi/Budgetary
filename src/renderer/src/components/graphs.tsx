import { ArrowUpDown, ChevronDown } from 'lucide-react';
import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';



// Define interfaces for type safety
interface Expense {
  category: string;
  amount: number;
}

interface CategoryTotal {
  [key: string]: number;
}

interface TopCategory {
  name: string;
  amount: number;
}


const ExpenseGraphs = () => {
  // Initialize expenses state from localStorage with proper typing
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const savedExpenses = localStorage.getItem('expenses');
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });
  
  // filter features HERE
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const categories = useMemo(() => 
    [...new Set(expenses.map(exp => exp.category))], 
    [expenses]
  );

  // ADD THIS HERE - right after your state declarations
const handleCategorySelect = (category: string) => {
  setSelectedCategories(prev => 
    prev.includes(category)
      ? prev.filter(c => c !== category)
      : [...prev, category]
  );
};

  // Setting up the Graph type here, along with two category at the top for Total Spent and Top Category
  const [graphType, setGraphType] = useState<'bar' | 'line' | 'pie'>('bar');
  const [totalSpent, setTotalSpent] = useState(0);
  const [topCategory, setTopCategory] = useState<TopCategory>({ name: '', amount: 0 });

// ADD THIS after your state declarations
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (showCategorySelector && !(event.target as Element).closest('.category-selector')) {
      setShowCategorySelector(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, [showCategorySelector]);


  // Updating useEffect to consider selected categories
  useEffect(() => {



    // Calculate total spent from filtered data
    const total = expenses
    .filter(exp => selectedCategories.length === 0 || selectedCategories.includes(exp.category))
    .reduce((sum, exp) => sum + exp.amount, 0);
    setTotalSpent(total);

   // Calculate category totals with filtering
   const categoryTotals = expenses
   .filter(exp => selectedCategories.length === 0 || selectedCategories.includes(exp.category))
   .reduce<CategoryTotal>((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

    // Find top category
    const topCategoryEntry = Object.entries(categoryTotals)
      .reduce<[string, number]>((max, current) => {
        return current[1] > max[1] ? current : max;
      }, ['', 0]);

    setTopCategory({
      name: topCategoryEntry[0],
      amount: topCategoryEntry[1]
    });
  }, [expenses, selectedCategories]); // Add selectedCategories as dependency

  // Aggregate data for charts
  const aggregatedData = useMemo(() => expenses.reduce<Expense[]>((acc, expense) => {

    // applying category filter 
    if (selectedCategories.length > 0 && !selectedCategories.includes(expense.category)) {
      return acc;
    }


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
  }, []), [expenses, selectedCategories]);

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
          // Define color scheme that complements the dark/red theme
          const pieColors = [
            '#ff6b6b',  // Main red
            '#845EC2',  // Purple
            '#FF9671',  // Coral
            '#FFC75F',  // Gold
            '#F9F871',  // Yellow
            '#00C9A7',  // Teal
            '#C34A36',  // Dark red
            '#4B4453'   // Dark gray
          ];
  
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
                      fill={pieColors[index % pieColors.length]}
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
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          );
    }
  };



  return (
    <div className="p-6 space-y-6" style={{
      background: 'var(--background)',
      minHeight: '100vh'
    }}>
      {/* Filter Controls Section */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="relative">
          <button
            onClick={() => setShowCategorySelector(!showCategorySelector)}
            className="flex items-center gap-2 px-4 py-2 rounded-md"
            style={{
              backgroundColor: 'var(--card-background)',
              color: 'var(--text-primary)',
              borderColor: 'var(--border-color)'
            }}
          >
            <ArrowUpDown size={16} />
            Filter Categories
            {selectedCategories.length > 0 && (
              <span className="ml-1 text-sm">({selectedCategories.length})</span>
            )}
            <ChevronDown size={16} />
          </button>
  
          {showCategorySelector && (
            <div
              className="absolute top-full mt-2 p-2 rounded-md shadow-lg z-10 category-selector"
              style={{
                backgroundColor: 'var(--card-background)',
                border: '1px solid var(--border-color)'
              }}
            >
              {categories.map(category => (
                <div
                  key={category}
                  className="flex items-center gap-2 p-2 hover:opacity-80 cursor-pointer"
                  onClick={() => handleCategorySelect(category)}
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => {}}
                    className="rounded"
                  />
                  <span style={{ color: 'var(--text-primary)' }}>{category}</span>
                </div>
              ))}
            </div>
          )}
        </div>
  
        {/* Graph Type Selector */}
        <select 
          value={graphType}
          onChange={(e) => setGraphType(e.target.value as 'bar' | 'line' | 'pie')}
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
  
      {/* Metric Cards */}
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
}
export default ExpenseGraphs;