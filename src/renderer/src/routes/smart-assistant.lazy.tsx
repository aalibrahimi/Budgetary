import { DefaultSmartAssistant } from '@renderer/components/Themes/Default/smart-assistant';
import { ThemeOptions, useThemeStore } from '@renderer/stores/themeStore'
import { createLazyFileRoute } from '@tanstack/react-router'

function SmartAssistant() {
  const { activeTheme } = useThemeStore();
  return (
    <>
      {activeTheme === ThemeOptions.Default && (
        <DefaultSmartAssistant />
      )}

      {activeTheme === ThemeOptions.CyberPunk && (
        <>
          <h3 className='italic text-gray-400 text-lg'>Not Found...</h3>
        </>
      )}
    </>
  )
}

export const Route = createLazyFileRoute('/smart-assistant')({
  component: SmartAssistant
})