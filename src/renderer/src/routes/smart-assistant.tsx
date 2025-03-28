import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useDarkModeStore } from './__root'
import { useExpenseStore } from '../stores/expenseStore'
import { RefreshCw, TrendingUp } from 'lucide-react'
import SubscriptionManager from '../components/SubscriptionManager'
import FinancialForecasting from '@renderer/components/FinancialForecast'


const SmartAssistant = () => {
  const { isDarkMode } = useDarkModeStore()
  const { expenses, income } = useExpenseStore()

  // State
  const [activeTab, setActiveTab] = useState<'subscriptions' | 'forecasting'>(
    'subscriptions',
  )

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <div
      className={`app-container ${isDarkMode ? 'dark-mode' : ''}`}
      id="darky"
    >
      <header className="header">
        <div className="header-top">
          <h1>Smart Financial Tools</h1>
        </div>

        {/* Stats Cards Row - Will be populated by the active component */}
        <div className="stats-grid">
          {activeTab === 'subscriptions' ? (
            <>
              <div className="stat-card">
                <div className="stat-label">Monthly Subscriptions</div>
                <div className="stat-value">{formatCurrency(75.96)}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Upcoming Payments (7 days)</div>
                <div className="stat-value">{formatCurrency(9.99)}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Annual Subscription Cost</div>
                <div className="stat-value">{formatCurrency(911.52)}</div>
              </div>
            </>
          ) : (
            <>
              <div className="stat-card">
                <div className="stat-label">Projected Savings (6 mo)</div>
                <div className="stat-value">{formatCurrency(4200)}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Current Savings Rate</div>
                <div className="stat-value">17.5%</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Projected Year-End</div>
                <div className="stat-value">{formatCurrency(8400)}</div>
              </div>
            </>
          )}
        </div>
      </header>

      <div className="container">
        {/* Tab Navigation */}
        <section className="surrounding-tabs">
          <nav className="tabs">
            <button
              className={`tab-button ${activeTab === 'subscriptions' ? 'active' : ''}`}
              onClick={() => setActiveTab('subscriptions')}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Subscription Manager
            </button>
            <button
              className={`tab-button ${activeTab === 'forecasting' ? 'active' : ''}`}
              onClick={() => setActiveTab('forecasting')}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Financial Forecasting
            </button>
          </nav>
        </section>

        <main>
          {/* Subscription Manager Tab */}
          {activeTab === 'subscriptions' && (
            <div className="p-6">
              <SubscriptionManager
                expenses={expenses}
                isDarkMode={isDarkMode}
                income={income}
              />
            </div>
          )}

          {/* Financial Forecasting Tab */}
          {activeTab === 'forecasting' && (
            <div className="p-6">
              <FinancialForecasting
                isDarkMode={isDarkMode}
                expenses={expenses}
                income={income}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/smart-assistant')({
  component: SmartAssistant,
})
