import { CyberpunkIndex } from "@renderer/components/Themes/Cyberpunk";
import { DefaultIndex } from "@renderer/components/Themes/Default";
import { useThemeStore } from "@renderer/stores/themeStore";
import { createLazyFileRoute } from "@tanstack/react-router";

const DashboardIndex = () => {
  const { activeTheme } = useThemeStore();
  return (
    <>
      {activeTheme === 'default' && (
        <DefaultIndex />
      )}

      {activeTheme === 'cyberpunk' && (
        <CyberpunkIndex />
      )}
    </>
  );
};

export const Route = createLazyFileRoute('/')({
  component: DashboardIndex,
});