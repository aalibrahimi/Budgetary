import React, { useState, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'

interface CyberpunkTitleProps {
  text: string
  className?: string
}

const CyberpunkTitle: React.FC<CyberpunkTitleProps> = ({ text, className = '' }) => {
  const { theme } = useTheme()
  const [animate, setAnimate] = useState(true)

  // Disable animation after a delay
  useEffect(() => {
    if (theme !== 'cyberpunk') return

    const timer = setTimeout(() => {
      setAnimate(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [theme])

  if (theme !== 'cyberpunk') {
    return <h1 className={className}>{text}</h1>
  }

  return (
    <div className="relative">
      <h1
        className={`${className} text-4xl font-black text-red-500 tracking-tighter glitch-text ${animate ? 'animate-glitch' : ''}`}
        data-text={text}
      >
        {text}
        <span className="absolute top-0 left-0 w-full h-full text-red-500/20 animate-glitch-2">
          {text}
        </span>
        <span className="absolute top-0 left-0 w-full h-full text-red-500/20 animate-glitch-3">
          {text}
        </span>
      </h1>
      <div className="flex items-center space-x-2 mt-1">
        <div className="h-[1px] w-2 bg-red-500"></div>
        <div className="text-xs text-gray-500">
          {new Date().toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}
        </div>
      </div>
    </div>
  )
}

export default CyberpunkTitle
