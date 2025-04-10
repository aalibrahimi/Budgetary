import { ThemeOptions, useThemeStore } from '@renderer/stores/themeStore'
import { createLazyFileRoute } from '@tanstack/react-router'

const Settings = () => {
  const { activeTheme } = useThemeStore()
  return (
    <>
      {activeTheme === ThemeOptions.Default && (
        <>
          <h3 className="italic text-gray-400 text-lg">Coming Soon...</h3>
        </>
      )}

      {activeTheme === ThemeOptions.CyberPunk && (
        <>
          <h3 className="italic text-gray-400 text-lg">Coming Soon...</h3>
        </>
      )}
    </>
  )
}

export const Route = createLazyFileRoute('/settings')({
  component: Settings
})
