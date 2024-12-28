import { createLazyFileRoute } from '@tanstack/react-router'
import '../assets/about.css'

const About = () => {
  return (
    <>
    <div>
      <h3>Budgetary About Page</h3>
      
    </div>
    </>
  )
}

export const Route = createLazyFileRoute('/about')({
  component: About
})
