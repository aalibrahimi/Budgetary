// src/renderer/src/components/themed/ThemedHeader.tsx
import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';

// Define default header
const DefaultHeader = styled.header`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  padding: 40px 0;
  color: white;
  margin-bottom: 40px;
  width: 100%;
`;

// Define cyberpunk variant with additional effects
const CyberpunkHeader = styled(DefaultHeader)`
  background: black;
  border-bottom: 2px solid ${props => props.theme.colors.primary};
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent, ${props => props.theme.colors.primary}, transparent);
    animation: glowPulse 2s infinite;
  }
  
  @keyframes glowPulse {
    0%, 100% {
      opacity: 0.5;
      box-shadow: 0 0 5px ${props => props.theme.colors.primary}, 0 0 10px ${props => props.theme.colors.primary};
    }
    50% {
      opacity: 1;
      box-shadow: 0 0 10px ${props => props.theme.colors.primary}, 0 0 20px ${props => props.theme.colors.primary};
    }
  }
`;

// Export a component that renders the appropriate header based on theme
export const ThemedHeader: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { themeType } = useTheme();
  
  if (themeType === 'cyberpunk') {
    return <CyberpunkHeader>{children}</CyberpunkHeader>;
  }
  
  return <DefaultHeader>{children}</DefaultHeader>;
};