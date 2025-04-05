import { useThemeStore } from '@renderer/stores/themeStore'
import { useEffect } from 'react'

type Props = {
  label: string
  switchTo: string
}

const ThemeSwitch = (props: Props) => {
  const { setActiveTheme } = useThemeStore()
  useEffect(() => {
    function GetTheme() {
      const savedTheme = localStorage.getItem('activeTheme') || 'default'
      setActiveTheme(savedTheme)
    }
    GetTheme()
  }, [])

  const handleTheme = (theme: string) => {
    setActiveTheme(theme)
    localStorage.setItem('activeTheme', theme)
  }
  return (
    <span className="hover:cursor-pointer" onClick={() => handleTheme(props.switchTo)}>
      {props.label}
    </span>
  )
}

export default ThemeSwitch
