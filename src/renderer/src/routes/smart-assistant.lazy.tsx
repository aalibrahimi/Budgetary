import { CyberpunkSmartAssistant } from '@renderer/components/Themes/Cyberpunk/smart-assist';
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
        <CyberpunkSmartAssistant />
      )}
    </>
  )
}

export const Route = createLazyFileRoute('/smart-assistant')({
  component: SmartAssistant
})