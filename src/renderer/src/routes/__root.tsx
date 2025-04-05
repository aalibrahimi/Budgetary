import { createRootRoute } from '@tanstack/react-router';
import { useThemeStore } from '@renderer/stores/themeStore';
import { DefaultNav } from '@renderer/components/Themes/Default/navbar';
import { CyberpunkNav } from '@renderer/components/Themes/Cyberpunk/navbar';

// Root Route Component
export const Route = createRootRoute({
  component: () => {
    const { activeTheme } = useThemeStore();

    return (
      <>
        {activeTheme === 'default' && (
          <DefaultNav />
        )}

        {activeTheme === 'cyberpunk' && (
          <CyberpunkNav />
        )}
      </>
    );
  },
});
