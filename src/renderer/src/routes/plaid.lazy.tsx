// src/renderer/src/routes/plaid.lazy.tsx
import { createLazyFileRoute } from '@tanstack/react-router';
import { useDarkModeStore } from './__root';
import PlaidAccountsPage from '@renderer/components/PlaidAccountsPage';

const PlaidPage = () => {
  const { isDarkMode } = useDarkModeStore();

  return (
    <div className={`app-container ${isDarkMode ? 'dark-mode' : ''}`} id="darky">
      <header className="header">
        <div className="header-top">
          <h1>Bank Accounts</h1>
        </div>
      </header>

      <div className="container">
        <PlaidAccountsPage />
      </div>
    </div>
  );
};

export const Route = createLazyFileRoute('/plaid')({
  component: PlaidPage
});