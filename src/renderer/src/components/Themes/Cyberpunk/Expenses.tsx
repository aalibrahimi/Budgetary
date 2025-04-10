import React, { useState, useEffect, useMemo } from 'react';
import { 
  Filter, Search, Trash2, Edit3, Download, ArrowUp, ArrowDown, Plus, 
  Calendar, AlertTriangle, FileText, BarChart3, Zap, X, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useExpenseStore } from '@renderer/stores/expenseStore';
import DatePicker from '@renderer/components/DatePicker';

const CyberpunkExpensesPage: React.FC = () => {
  const { expenses, deleteExpense, addExpense, updateExpense } = useExpenseStore();
  
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any>(null);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [scanMode, setScanMode] = useState(false);
  
  // New expense form state
  const [newExpense, setNewExpense] = useState({
    date: new Date().toISOString().split('T')[0],
    category: '',
    amount: '',
    description: ''
  });
  
  // Get unique categories from expenses
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(expenses.map(expense => expense.category))];
    return uniqueCategories.sort();
  }, [expenses]);
  
  // Calculate total expenses
  const totalExpenses = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);
  
  // Highest expense
  const highestExpense = useMemo(() => {
    if (expenses.length === 0) return null;
    return expenses.reduce((max, expense) => 
      expense.amount > max.amount ? expense : max, expenses[0]);
  }, [expenses]);
  
  // Filter and sort expenses
  const filteredExpenses = useMemo(() => {
    // First filter
    let result = expenses.filter(expense => {
      // Search term filter
      const matchesSearch = searchTerm === '' || 
        expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (expense.description && expense.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Category filter
      const matchesCategory = filterCategory === '' || expense.category === filterCategory;
      
      return matchesSearch && matchesCategory;
    });
    
    // Then sort
    result = [...result].sort((a, b) => {
      if (sortField === 'date') {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (sortField === 'amount') {
        return sortDirection === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      } else {
        // Category sort
        const categoryA = a.category.toLowerCase();
        const categoryB = b.category.toLowerCase();
        return sortDirection === 'asc' 
          ? categoryA.localeCompare(categoryB) 
          : categoryB.localeCompare(categoryA);
      }
    });
    
    return result;
  }, [expenses, searchTerm, filterCategory, sortField, sortDirection]);
  
  // Pagination
  const pageCount = Math.ceil(filteredExpenses.length / itemsPerPage);
  const paginatedExpenses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredExpenses.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredExpenses, currentPage, itemsPerPage]);
  
  // Next/Previous Page
  const goToNextPage = () => {
    if (currentPage < pageCount) {
      setCurrentPage(currentPage + 1);
      setSelectedRowId(null);
    }
  };
  
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setSelectedRowId(null);
    }
  };
  
  // Handle sorting
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  // Handle add expense
  const handleAddExpense = () => {
    if (!newExpense.category || !newExpense.amount || parseFloat(newExpense.amount) <= 0) {
      return; // Form validation
    }
    
    const expenseToAdd = {
      id: Date.now().toString(),
      date: newExpense.date,
      category: newExpense.category,
      amount: parseFloat(newExpense.amount),
      description: newExpense.description
    };
    
    if (editingExpense) {
      updateExpense(editingExpense.id, expenseToAdd);
    } else {
      addExpense(expenseToAdd);
    }
    
    // Reset form
    setNewExpense({
      date: new Date().toISOString().split('T')[0],
      category: '',
      amount: '',
      description: ''
    });
    
    setShowAddModal(false);
    setEditingExpense(null);
  };
  
  // Start editing an expense
  const startEditExpense = (expense: any) => {
    setEditingExpense(expense);
    setNewExpense({
      date: expense.date,
      category: expense.category,
      amount: expense.amount.toString(),
      description: expense.description || ''
    });
    setShowAddModal(true);
  };
  
  // Handle delete expense
  const handleDeleteExpense = (id: string) => {
    deleteExpense(id);
    if (selectedRowId === id) {
      setSelectedRowId(null);
    }
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: '2-digit', 
      day: '2-digit', 
      year: 'numeric' 
    });
  };
  
  // Calculate category statistics
  const categoryStats = useMemo(() => {
    const stats: { [key: string]: { amount: number, count: number } } = {};
    
    expenses.forEach(expense => {
      if (!stats[expense.category]) {
        stats[expense.category] = { amount: 0, count: 0 };
      }
      stats[expense.category].amount += expense.amount;
      stats[expense.category].count += 1;
    });
    
    // Convert to array and sort by amount
    return Object.entries(stats)
      .map(([category, data]) => ({
        category,
        amount: data.amount,
        count: data.count,
        percentage: (data.amount / totalExpenses) * 100
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses, totalExpenses]);
  
  // Effects
  
  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCategory]);
  
  // Trigger scan animation periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setScanMode(true);
      setTimeout(() => setScanMode(false), 2000);
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Export expenses to CSV
  const exportToCSV = () => {
    const headers = ['Date', 'Category', 'Amount', 'Description'];
    
    const csvContent = [
      headers.join(','),
      ...filteredExpenses.map(expense => [
        formatDate(expense.date),
        `"${expense.category}"`,
        expense.amount.toString(),
        `"${expense.description || ''}"`
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `expenses_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="min-h-screen bg-black text-white font-mono overflow-x-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 -right-32 w-96 h-96 rounded-full bg-red-600/20 mix-blend-screen blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 -left-32 w-96 h-96 rounded-full bg-red-800/10 mix-blend-screen blur-[100px] animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-gradient-to-br from-black via-red-950/10 to-black rounded-full mix-blend-screen filter blur-[80px]"></div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDAsIDAsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
      </div>
      
      <div className="relative z-10 container mx-auto p-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 border-b border-red-900/30 pb-4">
            <div>
              <h1 className="text-3xl font-bold text-red-500 tracking-tight">EXPENSES_DATABASE//<span className="animate-pulse">█</span></h1>
              <div className="flex items-center space-x-2 mt-1">
                <div className="h-[1px] w-2 bg-red-500"></div>
                <div className="text-xs text-gray-500">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}</div>
                <div className="h-[1px] w-12 bg-red-900/50"></div>
                <div className="text-xs text-gray-500">RECORDS: {expenses.length}</div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setEditingExpense(null);
                  setShowAddModal(true);
                }}
                className="bg-transparent border border-red-500 text-red-500 hover:bg-red-500 hover:text-black px-4 py-1.5 text-sm transition-colors flex items-center space-x-1 group"
              >
                <Plus size={16} className="group-hover:animate-pulse" />
                <span>ADD EXPENSE</span>
              </button>
              <button
                onClick={exportToCSV}
                className="bg-black/30 backdrop-blur-sm text-white border border-white/10 hover:border-white/30 px-4 py-1.5 text-sm transition-colors flex items-center space-x-1"
              >
                <Download size={16} />
                <span>EXPORT</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-black/30 backdrop-blur-sm border border-red-500/30 rounded-lg shadow overflow-hidden group hover:border-red-500/60 transition-colors">
            <div className="p-4 border-b border-red-900/20">
              <div className="flex justify-between items-center">
                <h2 className="text-xs text-red-500 tracking-widest">TOTAL EXPENSES</h2>
                <BarChart3 className="h-4 w-4 text-red-500 opacity-70" />
              </div>
            </div>
            <div className="p-4">
              <div className="text-2xl font-bold mb-1 group-hover:text-red-500 transition-colors">
                {formatCurrency(totalExpenses)}
              </div>
              <div className="text-xs text-gray-500">
                ACROSS {expenses.length} TRANSACTIONS
              </div>
            </div>
          </div>
          
          <div className="bg-black/30 backdrop-blur-sm border border-red-500/30 rounded-lg shadow overflow-hidden group hover:border-red-500/60 transition-colors">
            <div className="p-4 border-b border-red-900/20">
              <div className="flex justify-between items-center">
                <h2 className="text-xs text-red-500 tracking-widest">TOP CATEGORY</h2>
                <AlertTriangle className="h-4 w-4 text-red-500 opacity-70" />
              </div>
            </div>
            <div className="p-4">
              {categoryStats.length > 0 ? (
                <>
                  <div className="text-xl font-bold mb-1 group-hover:text-red-500 transition-colors">
                    {categoryStats[0].category}
                  </div>
                  <div className="text-sm">
                    {formatCurrency(categoryStats[0].amount)}
                    <span className="text-xs text-gray-500 ml-2">
                      ({categoryStats[0].percentage.toFixed(1)}%)
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-sm text-gray-500">NO DATA AVAILABLE</div>
              )}
            </div>
          </div>
          
          <div className="bg-black/30 backdrop-blur-sm border border-red-500/30 rounded-lg shadow overflow-hidden group hover:border-red-500/60 transition-colors">
            <div className="p-4 border-b border-red-900/20">
              <div className="flex justify-between items-center">
                <h2 className="text-xs text-red-500 tracking-widest">HIGHEST EXPENSE</h2>
                <Zap className="h-4 w-4 text-red-500 opacity-70" />
              </div>
            </div>
            <div className="p-4">
              {highestExpense ? (
                <>
                  <div className="text-xl font-bold mb-1 group-hover:text-red-500 transition-colors">
                    {formatCurrency(highestExpense.amount)}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center">
                    <span className="mr-2">{highestExpense.category}</span>
                    <span className="h-1 w-1 bg-red-500 rounded-full"></span>
                    <span className="ml-2">{formatDate(highestExpense.date)}</span>
                  </div>
                </>
              ) : (
                <div className="text-sm text-gray-500">NO DATA AVAILABLE</div>
              )}
            </div>
          </div>
        </div>
        
        {/* Search and filters */}
        <div className="bg-black/30 backdrop-blur-sm border border-red-500/30 rounded-lg shadow mb-6">
          <div className="p-4 border-b border-red-900/20">
            <div className="flex justify-between items-center">
              <h2 className="text-xs text-red-500 tracking-widest">SEARCH & FILTERS</h2>
              <Filter size={16} className="text-red-500" />
            </div>
          </div>
          
          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-red-500" />
              </div>
              <input
                type="text"
                placeholder="SEARCH EXPENSES..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/50 border border-red-500/30 rounded py-2 pl-10 pr-3 text-white focus:border-red-500/70 focus:outline-none placeholder-gray-500"
              />
            </div>
            
            {/* Category filter */}
            <div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full bg-black/50 border border-red-500/30 rounded py-2 px-3 text-white focus:border-red-500/70 focus:outline-none"
              >
                <option value="">ALL CATEGORIES</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category.toUpperCase()}</option>
                ))}
              </select>
            </div>
            
            {/* Items per page */}
            <div>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="w-full bg-black/50 border border-red-500/30 rounded py-2 px-3 text-white focus:border-red-500/70 focus:outline-none"
              >
                <option value={5}>5 PER PAGE</option>
                <option value={10}>10 PER PAGE</option>
                <option value={20}>20 PER PAGE</option>
                <option value={50}>50 PER PAGE</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Main table */}
        <div className="bg-black/30 backdrop-blur-sm border border-red-500/30 rounded-lg shadow mb-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-red-900/30">
                  <th 
                    className="py-3 px-4 text-left text-xs font-medium text-red-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center">
                      <span>Date</span>
                      {sortField === 'date' && (
                        sortDirection === 'asc' 
                          ? <ArrowUp size={12} className="ml-1" /> 
                          : <ArrowDown size={12} className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="py-3 px-4 text-left text-xs font-medium text-red-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('category')}
                  >
                    <div className="flex items-center">
                      <span>Category</span>
                      {sortField === 'category' && (
                        sortDirection === 'asc' 
                          ? <ArrowUp size={12} className="ml-1" /> 
                          : <ArrowDown size={12} className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="py-3 px-4 text-left text-xs font-medium text-red-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('amount')}
                  >
                    <div className="flex items-center">
                      <span>Amount</span>
                      {sortField === 'amount' && (
                        sortDirection === 'asc' 
                          ? <ArrowUp size={12} className="ml-1" /> 
                          : <ArrowDown size={12} className="ml-1" />
                      )}
                    </div>
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="py-3 px-4 text-right text-xs font-medium text-red-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={scanMode ? 'animate-scanEffect' : ''}>
                {paginatedExpenses.length > 0 ? (
                  paginatedExpenses.map((expense) => (
                    <tr 
                      key={expense.id} 
                      className={`border-b border-red-900/10 hover:bg-red-900/10 transition-colors ${
                        selectedRowId === expense.id ? 'bg-red-900/10' : ''
                      }`}
                      onClick={() => setSelectedRowId(expense.id)}
                    >
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-2 text-gray-400" />
                          <span>{formatDate(expense.date)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 text-sm border border-red-500/30 rounded">
                          {expense.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap font-mono text-red-500 font-bold">
                        {formatCurrency(expense.amount)}
                      </td>
                      <td className="py-3 px-4 truncate max-w-xs text-gray-300">
                        {expense.description || '-'}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditExpense(expense);
                          }}
                          className="text-blue-400 hover:text-blue-300 mr-3 p-1"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteExpense(expense.id);
                          }}
                          className="text-red-500 hover:text-red-400 p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-6 px-4 text-center text-gray-500">
                      NO EXPENSES FOUND
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {filteredExpenses.length > 0 && (
            <div className="px-4 py-3 flex items-center justify-between border-t border-red-900/30">
              <div className="text-sm text-gray-500">
                SHOWING {paginatedExpenses.length} OF {filteredExpenses.length} EXPENSES
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 border ${
                    currentPage === 1 
                      ? 'border-gray-800 text-gray-700 cursor-not-allowed' 
                      : 'border-red-500/30 text-gray-300 hover:bg-red-900/10'
                  }`}
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="px-3 py-1 border border-red-500/30 bg-black/50">
                  {currentPage} / {pageCount || 1}
                </div>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === pageCount || pageCount === 0}
                  className={`px-3 py-1 border ${
                    currentPage === pageCount || pageCount === 0
                      ? 'border-gray-800 text-gray-700 cursor-not-allowed' 
                      : 'border-red-500/30 text-gray-300 hover:bg-red-900/10'
                  }`}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Category breakdown */}
        <div className="bg-black/30 backdrop-blur-sm border border-red-500/30 rounded-lg shadow mb-6">
          <div className="p-4 border-b border-red-900/20">
            <div className="flex justify-between items-center">
              <h2 className="text-xs text-red-500 tracking-widest">CATEGORY BREAKDOWN</h2>
              <FileText size={16} className="text-red-500" />
            </div>
          </div>
          
          <div className="p-4">
            {categoryStats.length > 0 ? (
              <div className="space-y-4">
                {categoryStats.slice(0, 5).map((stat) => (
                  <div key={stat.category}>
                    <div className="flex justify-between mb-1">
                      <div className="flex items-center">
                        <div className="h-3 w-3 bg-red-500 mr-2"></div>
                        <span className="text-sm">{stat.category}</span>
                      </div>
                      <div className="text-sm font-mono">
                        {formatCurrency(stat.amount)}
                        <span className="text-xs text-gray-500 ml-2">
                          ({stat.count} ITEM{stat.count !== 1 ? 'S' : ''})
                        </span>
                      </div>
                    </div>
                    <div className="h-1 w-full bg-black rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-red-900/70 to-red-500/70"
                        style={{ width: `${stat.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
                
                {categoryStats.length > 5 && (
                  <div className="text-center text-xs text-gray-500 pt-2">
                    {categoryStats.length - 5} MORE CATEGORIES NOT SHOWN
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                NO CATEGORY DATA AVAILABLE
              </div>
            )}
          </div>
        </div>
        
        {/* Scanner effect line */}
        <div className="relative h-0.5 w-full bg-black overflow-hidden mb-8">
          <div className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-transparent via-red-500/70 to-transparent animate-scanner"></div>
        </div>
        
        {/* Footer */}
        <div className="flex justify-between items-center text-xs text-gray-600 mb-8">
          <div>EXPENSE_TRACKER v2.0.4</div>
          <div>SYSTEM STATUS: <span className="text-green-500">OPERATIONAL</span></div>
        </div>
      </div>
      
      {/* Add/Edit Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
          <div className="relative z-10 bg-black/90 border border-red-500/80 rounded-lg w-full max-w-md overflow-hidden">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent"></div>
              <div className="relative p-4 flex justify-between items-center border-b border-red-900/30">
                <h2 className="text-sm text-red-500 tracking-widest">
                  {editingExpense ? 'EDIT EXPENSE' : 'ADD NEW EXPENSE'}
                </h2>
                <button 
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingExpense(null);
                  }}
                  className="text-red-500 hover:text-red-400 focus:outline-none"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-xs text-red-500 mb-1">DATE</label>
                <input
                  type="date"
                  className="w-full bg-black/50 border border-red-500/30 rounded px-3 py-2 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-colors"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-xs text-red-500 mb-1">CATEGORY</label>
                <select
                  className="w-full bg-black/50 border border-red-500/30 rounded px-3 py-2 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-colors"
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                >
                  <option value="">SELECT CATEGORY</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category.toUpperCase()}</option>
                  ))}
                  <option value="Other">OTHER</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs text-red-500 mb-1">AMOUNT</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-full bg-black/50 border border-red-500/30 rounded pl-8 pr-3 py-2 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-colors"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs text-red-500 mb-1">DESCRIPTION (OPTIONAL)</label>
                <textarea
                  className="w-full bg-black/50 border border-red-500/30 rounded px-3 py-2 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-colors"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                  placeholder="Enter description"
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  type="button" 
                  className="px-4 py-2 border border-red-900/30 text-gray-300 hover:bg-red-900/20 transition-colors text-xs"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingExpense(null);
                  }}
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white text-xs relative overflow-hidden group"
                  onClick={handleAddExpense}
                >
                  <span className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-red-500/20 to-transparent transform -skew-x-12 group-hover:animate-shimmer"></span>
                  {editingExpense ? 'UPDATE' : 'SAVE'} EXPENSE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Custom Styles */}
      <style >{`
        @keyframes scanner {
          0% {
            left: -20%;
          }
          100% {
            left: 120%;
          }
        }
        
        .animate-scanner {
          animation: scanner 3s ease-in-out infinite;
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        @keyframes scanEffect {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
          100% {
            opacity: 1;
          }
        }
        
        .animate-scanEffect {
          animation: scanEffect 2s linear;
        }
      `}</style>
    </div>
  );
};

export default CyberpunkExpensesPage;