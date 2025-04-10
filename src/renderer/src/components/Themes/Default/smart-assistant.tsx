import { createFileRoute } from '@tanstack/react-router'
import { useExpenseStore } from '../stores/expenseStore'
import SubscriptionManager from '../components/SubscriptionManager'
import { useDarkModeStore } from '@renderer/stores/themeStore'

const SmartAssistant = () => {
  const { isDarkMode } = useDarkModeStore()
  const { expenses, income } = useExpenseStore()

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  // Calculate total monthly subscription cost
  const calculateMonthlySubscriptionCost = () => {
    return 75.96 // This would come from the subscription manager component
  }

  // Get upcoming payment amount (next 7 days)
  const getUpcomingPaymentAmount = () => {
    return 9.99 // This would come from the subscription manager component
  }

  // Calculate annual subscription cost
  const calculateAnnualSubscriptionCost = () => {
    return 911.52 // This would come from the subscription manager component
  }

  return (
    <div
      className={`app-container ${isDarkMode ? 'dark-mode' : ''}`}
      id="darky"
    >
      <header className="header">
        <div className="header-top">
          <h1 className='p-5'>Subscription Manager</h1>
        </div>

        {/* Stats Cards Row */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Monthly Subscriptions</div>
            <div className="stat-value">
              {formatCurrency(calculateMonthlySubscriptionCost())}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Upcoming Payments (7 days)</div>
            <div className="stat-value">
              {formatCurrency(getUpcomingPaymentAmount())}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Annual Subscription Cost</div>
            <div className="stat-value">
              {formatCurrency(calculateAnnualSubscriptionCost())}
            </div>
          </div>
        </div>
      </header>

      <div className="container">
        <main>
          <div className="p-6">
            <SubscriptionManager
              expenses={expenses}
              isDarkMode={isDarkMode}
              income={income}
            />
          </div>
        </main>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/smart-assistant')({
  component: SmartAssistant,
})
