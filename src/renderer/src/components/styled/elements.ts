// src/renderer/src/components/styled/elements.ts
import styled from 'styled-components';
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      background: Interpolation<FastOmit<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>, never>>;
      secondary: Interpolation<FastOmit<DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>, never>>;
      card: string;
      primary: string;
      text: {
        primary: string;
      };
    };
    borderRadius: string;
    boxShadow: string;
    fontFamily: string;
  }
}

// Example styled components that adapt to the theme
export const Card = styled.div`
  background-color: ${props => props.theme.colors.card};
  color: ${props => props.theme.colors.text.primary};
  border-radius: ${props => props.theme.borderRadius};
  box-shadow: ${props => props.theme.boxShadow};
  padding: 1rem;
  margin-bottom: 1rem;
`;

export const Button = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius};
  padding: 0.5rem 1rem;
  font-family: ${props => props.theme.fontFamily};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 0.9;
  }
`;

// Add more styled components as needed