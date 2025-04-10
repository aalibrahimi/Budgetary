import { FinancialHackingSystem } from '@renderer/components/Themes/Cyberpunk/about'

import { FinancialWellness } from '@renderer/components/Themes/Default/about'

import { ThemeOptions, useThemeStore } from '@renderer/stores/themeStore'
import { createLazyFileRoute } from '@tanstack/react-router'

function Expenses() {
  const { activeTheme } = useThemeStore()
  return (
    <>
      {activeTheme === ThemeOptions.Default && <FinancialWellness />}

      {activeTheme === ThemeOptions.CyberPunk && <FinancialHackingSystem />}
    </>
  )
}

export const Route = createLazyFileRoute('/about')({
  component: Expenses,
})
