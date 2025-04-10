import CyberpunkExpensesPage from '@renderer/components/Themes/Cyberpunk/Expenses';
import { DefaultExpenses } from '@renderer/components/Themes/Default/expenses';
import { ThemeOptions, useThemeStore } from '@renderer/stores/themeStore'
import { createLazyFileRoute } from '@tanstack/react-router'

function Expenses() {
  const { activeTheme } = useThemeStore();
  return (
    <>
      {activeTheme === ThemeOptions.Default && (
        <DefaultExpenses />
      )}

      {activeTheme === ThemeOptions.CyberPunk && (
        <CyberpunkExpensesPage />
      )}
    </>
  )
}

export const Route = createLazyFileRoute('/expenses')({
  component: Expenses
})